<?php
/**
 * 载物论坛 - 新闻接口（只读）
 * ==========================================================
 * 使用方法：
 *   1. 将本文件上传到 Discuz 网站根目录（与 index.php 同级）
 *   2. 在 React 项目的 .env.local 中添加：
 *      VITE_NEWS_API_URL=https://你的域名/zaiwu-api.php
 *   3. 重新 npm run dev 或重新部署
 *
 * 接口地址示例: https://zwwx.club/zaiwu-api.php
 * ==========================================================
 */

// ── CORS（允许 React 前端跨域读取） ────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300'); // 5 分钟缓存

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── 数据库配置（只读） ─────────────────────────────────────────────────────
$DB_HOST   = 'localhost';
$DB_NAME   = 'sql088261';
$DB_USER   = 'sql088261';
$DB_PASS   = 'LJjjNcrpR4';
$DB_PREFIX = 'pre_';

define('FID_ZAIWU', 59);  // "载物" 版块 ID
define('PAGE_SIZE', 50);  // 每次最多返回 50 篇

// ── BBCode → 纯文本 ───────────────────────────────────────────────────────
function strip_bbcode(string $text): string
{
    // 保留标签内文字
    $text = preg_replace(
        '/\[(b|i|u|s|color|size|font|align|indent|list|li)\b[^\]]*\](.*?)\[\/\1\]/is',
        '$2', $text
    );
    // [url=...] 只保留文字
    $text = preg_replace('/\[url(?:=[^\]]+)?\](.*?)\[\/url\]/is', '$1', $text);
    // 删除媒体/附件标签
    $text = preg_replace(
        '/\[(img|attach|attachimg|upload|audio|video|flash)\b[^\]]*\].*?\[\/\1\]/is',
        '', $text
    );
    // 删除引用块（防止内容过长）
    $text = preg_replace('/\[quote\b[^\]]*\].*?\[\/quote\]/is', '', $text);
    // 删除剩余所有 BBCode 标签
    $text = preg_replace('/\[[^\]]*\]/', '', $text);
    // HTML 实体 & 标签清理
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = strip_tags($text);
    // 空白规整
    $text = preg_replace('/[ \t]{2,}/', ' ', $text);
    $text = preg_replace('/\n{3,}/', "\n\n", $text);
    return trim($text);
}

// ── 提取正文中第一张图片 URL ──────────────────────────────────────────────
function extract_first_image(string $message): string
{
    // BBCode: [img]https://...[/img] 或 [img=WxH]https://...[/img]
    if (preg_match('/\[img(?:=[^\]]+)?\]\s*(https?:\/\/\S+?)\s*\[\/img\]/i', $message, $m)) {
        return $m[1];
    }
    // HTML: <img src="https://...">
    if (preg_match('/<img\b[^>]+\bsrc=["\']([^"\']+)["\'][^>]*>/i', $message, $m)) {
        return $m[1];
    }
    return '';
}

// ── 主逻辑 ────────────────────────────────────────────────────────────────
try {
    $pdo = new PDO(
        sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $DB_HOST, $DB_NAME),
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
        ]
    );

    // 只读 SELECT：拉取载物版块最新帖子及其正文（first=1 的楼层）
    $sql = "
        SELECT
            t.tid,
            t.subject,
            t.author,
            t.dateline,
            t.views,
            t.replies,
            p.message
        FROM {$DB_PREFIX}forum_thread AS t
        LEFT JOIN {$DB_PREFIX}forum_post AS p
               ON p.tid = t.tid AND p.`first` = 1
        WHERE t.fid           = :fid
          AND t.displayorder >= 0
          AND t.isgroup       = 0
        ORDER BY t.dateline DESC
        LIMIT :lim
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':fid', FID_ZAIWU, PDO::PARAM_INT);
    $stmt->bindValue(':lim', PAGE_SIZE,  PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll();

    $items = array_map(function (array $row): array {
        $raw     = (string)($row['message'] ?? '');
        $img     = extract_first_image($raw);
        $body    = strip_bbcode($raw);
        $len     = mb_strlen($body, 'UTF-8');
        $summary = mb_substr($body, 0, 180, 'UTF-8') . ($len > 180 ? '…' : '');

        return [
            'id'          => (string)$row['tid'],
            'date'        => date('Y-m-d', (int)$row['dateline']),
            'category_zh' => '载物',
            'category_en' => 'Ink & Heritage',
            'title_zh'    => (string)$row['subject'],
            'title_en'    => (string)$row['subject'],
            'summary_zh'  => $summary,
            'summary_en'  => $summary,
            'body_zh'     => $body,
            'body_en'     => $body,
            'image'       => $img,
            'tags'        => [],
            'author'      => (string)$row['author'],
        ];
    }, $rows);

    echo json_encode(
        ['data' => $items, 'total' => count($items), 'error' => null],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
    );

} catch (PDOException $e) {
    http_response_code(500);
    // 临时调试：暴露真实错误信息（找到原因后删掉 $e->getMessage()，改回 'Database error'）
    echo json_encode(
        ['data' => [], 'total' => 0, 'error' => $e->getMessage()],
        JSON_UNESCAPED_UNICODE
    );
}
