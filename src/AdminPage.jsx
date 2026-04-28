import { useState } from "react";
import { NEWS as DEFAULT_NEWS } from "./data/news";
import { STATS_CONFIG } from "./data/stats";
import {
  ArrowLeft, Save, Plus, Trash2, Edit3,
  Eye, EyeOff, Settings, FileText, RotateCcw,
  CheckCircle, AlertCircle,
} from "lucide-react";

// ── Storage keys ────────────────────────────────────────────────────────────
const STATS_KEY = "zaiwu_admin_stats";
const NEWS_KEY  = "zaiwu_admin_news";
const PASS_KEY  = "zaiwu_admin_authed";

// ── Admin password ──────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "zaiwu2025";

// ═══════════════════════════════════════════════════════════════════════════
// Storage helpers — imported by App.jsx and NewsPage.jsx
// ═══════════════════════════════════════════════════════════════════════════

export function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...STATS_CONFIG };
    const saved = JSON.parse(raw);
    return {
      ...STATS_CONFIG,
      ...saved,
      rates: { ...STATS_CONFIG.rates, ...(saved.rates || {}) },
    };
  } catch {
    return { ...STATS_CONFIG };
  }
}

export function loadNews() {
  try {
    const raw = localStorage.getItem(NEWS_KEY);
    if (!raw) return DEFAULT_NEWS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_NEWS;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Toast
// ═══════════════════════════════════════════════════════════════════════════
function Toast({ msg, type = "success" }) {
  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 9999,
      background: type === "success" ? "var(--accent)" : "#ef4444",
      color: "#fff", borderRadius: 12, padding: "10px 20px",
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      fontSize: 14, fontWeight: 500, pointerEvents: "none",
    }}>
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Shared field component
// ═══════════════════════════════════════════════════════════════════════════
const INPUT_STYLE = {
  width: "100%", boxSizing: "border-box", padding: "10px 13px",
  borderRadius: 10, border: "1px solid var(--border)",
  background: "var(--surface)", color: "var(--text)", fontSize: 14, outline: "none",
};
const LABEL_STYLE = {
  fontSize: 11, fontWeight: 700, color: "var(--text3)", display: "block",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em",
};

function Field({ label, sub, value, onChange, type = "text", step, placeholder }) {
  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      {sub && <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6, opacity: 0.7, margin: "0 0 6px" }}>{sub}</p>}
      <input
        type={type} value={value} step={step} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={INPUT_STYLE}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Login Screen
// ═══════════════════════════════════════════════════════════════════════════
function LoginScreen({ onExit, onSuccess }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const [show, setShow] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (val === ADMIN_PASSWORD) {
      sessionStorage.setItem(PASS_KEY, "1");
      onSuccess();
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 2000);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
    }}>
      <button
        onClick={onExit}
        style={{
          position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center",
          gap: 6, background: "none", border: "none", cursor: "pointer",
          color: "var(--text2)", fontSize: 14, opacity: 0.6,
        }}
        onMouseOver={e => { e.currentTarget.style.opacity = "1"; }}
        onMouseOut={e => { e.currentTarget.style.opacity = "0.6"; }}
      >
        <ArrowLeft size={15} /> 返回网站
      </button>

      <div className="glass-card rounded-3xl ancient-border" style={{ width: "100%", maxWidth: 360, padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="section-label" style={{ justifyContent: "center", marginBottom: 10 }}>Admin</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", margin: 0 }}>载物管理后台</h1>
          <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 8, marginBottom: 0 }}>请输入管理密码以继续</p>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              value={val}
              onChange={e => setVal(e.target.value)}
              placeholder="管理密码"
              autoFocus
              style={{
                ...INPUT_STYLE,
                paddingRight: 44,
                border: `1.5px solid ${err ? "#ef4444" : "var(--border)"}`,
              }}
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text3)", display: "flex", padding: 0,
              }}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {err && (
            <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>密码错误，请重试</p>
          )}

          <button
            type="submit"
            style={{
              padding: "12px", borderRadius: 12, background: "var(--accent)",
              color: "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700,
            }}
          >
            进入管理
          </button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Stats Editor
// ═══════════════════════════════════════════════════════════════════════════
function StatsEditor() {
  const [form, setForm] = useState(() => {
    const s = loadStats();
    return {
      startDate: s.startDate,
      donationCNY: String(s.donationCNY),
      sgd: String(s.rates.SGD),
      usd: String(s.rates.USD),
      peopleHelped: String(s.peopleHelped),
      volunteersCount: String(s.volunteersCount),
      articlesCount: String(s.articlesCount),
      productsCount: String(s.productsCount),
    };
  });
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function save() {
    const data = {
      startDate: form.startDate,
      donationCNY: parseFloat(form.donationCNY) || 0,
      rates: {
        SGD: parseFloat(form.sgd) || 0.189,
        USD: parseFloat(form.usd) || 0.138,
      },
      peopleHelped:    parseInt(form.peopleHelped) || 0,
      volunteersCount: parseInt(form.volunteersCount) || 0,
      articlesCount:   parseInt(form.articlesCount) || 0,
      productsCount:   parseInt(form.productsCount) || 0,
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(data));
    showToast("已保存 · 刷新首页后数据更新");
  }

  function reset() {
    if (!confirm("确认恢复默认数据？此操作将清除所有自定义数字。")) return;
    localStorage.removeItem(STATS_KEY);
    const s = STATS_CONFIG;
    setForm({
      startDate: s.startDate,
      donationCNY: String(s.donationCNY),
      sgd: String(s.rates.SGD),
      usd: String(s.rates.USD),
      peopleHelped:    String(s.peopleHelped),
      volunteersCount: String(s.volunteersCount),
      articlesCount:   String(s.articlesCount),
      productsCount:   String(s.productsCount),
    });
    showToast("已恢复默认数据");
  }

  const CARD = {
    className: "glass-card rounded-2xl ancient-border",
    style: { padding: 24, display: "flex", flexDirection: "column", gap: 16 },
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", margin: 0 }}>数据统计</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={reset}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text2)", cursor: "pointer", fontSize: 13 }}
          >
            <RotateCcw size={13} /> 恢复默认
          </button>
          <button
            onClick={save}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 10, background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
          >
            <Save size={13} /> 保存
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>

        {/* 基本信息 */}
        <div {...CARD}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>项目基本</h3>
          <Field
            label="启动日期" type="date"
            sub="用于自动计算「已运行天数」"
            value={form.startDate}
            onChange={v => setForm(f => ({ ...f, startDate: v }))}
          />
          <Field
            label="捐助总金额 (CNY)" type="number" step="0.01"
            sub="人民币总金额，其他币种自动换算"
            value={form.donationCNY}
            onChange={v => setForm(f => ({ ...f, donationCNY: v }))}
          />
        </div>

        {/* 汇率 */}
        <div {...CARD}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>汇率 (1 CNY = ?)</h3>
          <Field label="SGD 汇率" type="number" step="0.00001" value={form.sgd} onChange={v => setForm(f => ({ ...f, sgd: v }))} />
          <Field label="USD 汇率" type="number" step="0.00001" value={form.usd} onChange={v => setForm(f => ({ ...f, usd: v }))} />
        </div>

        {/* 统计数字 */}
        <div className="glass-card rounded-2xl ancient-border" style={{ padding: 24, gridColumn: "1 / -1" }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>统计数字</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <Field label="帮助人数" type="number" value={form.peopleHelped} onChange={v => setForm(f => ({ ...f, peopleHelped: v }))} />
            <Field label="志愿者人数" type="number" value={form.volunteersCount} onChange={v => setForm(f => ({ ...f, volunteersCount: v }))} />
            <Field label="发布文章数" type="number" value={form.articlesCount} onChange={v => setForm(f => ({ ...f, articlesCount: v }))} />
            <Field label="义卖产品数" type="number" value={form.productsCount} onChange={v => setForm(f => ({ ...f, productsCount: v }))} />
          </div>
        </div>

      </div>
      <p style={{ marginTop: 14, fontSize: 12, color: "var(--text3)" }}>
        ※ 数据存储在本地浏览器（localStorage）中，刷新首页后生效。
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Article Editor
// ═══════════════════════════════════════════════════════════════════════════
const EMPTY_ARTICLE = {
  id: "", date: "", category: { zh: "项目动态", en: "Project Update" },
  title: { zh: "", en: "" }, summary: { zh: "", en: "" },
  body: { zh: "", en: "" }, image: "", tags: [],
};

function ArticleEditor({ article, onSave, onCancel }) {
  const [form, setForm] = useState({ ...article });
  const [tagsInput, setTagsInput] = useState(
    (article.tags || []).map(t => (typeof t === "string" ? t : `${t.zh}/${t.en}`)).join(", ")
  );

  function setF(path, value) {
    const keys = path.split(".");
    setForm(prev => {
      if (keys.length === 1) return { ...prev, [keys[0]]: value };
      return { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: value } };
    });
  }

  function handleSave() {
    if (!form.id.trim()) { alert("请填写文章 ID（如：2026-001）"); return; }
    if (!form.title.zh.trim() && !form.title.en.trim()) { alert("请至少填写一个标题"); return; }
    const tags = tagsInput
      .split(",").map(t => t.trim()).filter(Boolean)
      .map(t => { const [zh, en] = t.split("/").map(s => s.trim()); return en ? { zh, en } : { zh: t, en: t }; });
    onSave({ ...form, tags });
  }

  const TS = { ...INPUT_STYLE, resize: "vertical", minHeight: 180, fontFamily: "inherit", lineHeight: 1.7 };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={onCancel}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text2)", fontSize: 14 }}
        >
          <ArrowLeft size={15} /> 返回列表
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", margin: 0, flex: 1 }}>
          {article.id ? "编辑文章" : "新建文章"}
        </h2>
        <button onClick={onCancel} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text2)", cursor: "pointer", fontSize: 13 }}>取消</button>
        <button
          onClick={handleSave}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 10, background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
        >
          <Save size={13} /> 保存发布
        </button>
      </div>

      {/* Meta row */}
      <div className="glass-card rounded-2xl ancient-border" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 16, marginBottom: 16 }}>
          <Field label="文章 ID" value={form.id} onChange={v => setF("id", v)} placeholder="2026-001" />
          <Field label="发布日期" type="date" value={form.date} onChange={v => setF("date", v)} />
          <Field label="封面图 URL" value={form.image} onChange={v => setF("image", v)} placeholder="https://images.unsplash.com/..." />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 16 }}>
          <Field label="分类（中文）" value={form.category.zh} onChange={v => setF("category.zh", v)} placeholder="项目动态" />
          <Field label="Category (En)" value={form.category.en} onChange={v => setF("category.en", v)} placeholder="Project Update" />
          <Field
            label="标签（逗号分隔 · 格式: 中文/English）"
            value={tagsInput} onChange={setTagsInput}
            placeholder="招新/Recruitment, 公益/Welfare"
          />
        </div>
      </div>

      {/* Bilingual body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* ZH */}
        <div className="glass-card rounded-2xl ancient-border" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>中文内容</h3>
          <Field label="标题" value={form.title.zh} onChange={v => setF("title.zh", v)} />
          <div>
            <label style={LABEL_STYLE}>摘要</label>
            <textarea style={{ ...TS, minHeight: 72 }} value={form.summary.zh} onChange={e => setF("summary.zh", e.target.value)} />
          </div>
          <div>
            <label style={LABEL_STYLE}>正文（支持 Markdown）</label>
            <textarea style={TS} value={form.body.zh} onChange={e => setF("body.zh", e.target.value)} />
          </div>
        </div>

        {/* EN */}
        <div className="glass-card rounded-2xl ancient-border" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>English Content</h3>
          <Field label="Title" value={form.title.en} onChange={v => setF("title.en", v)} />
          <div>
            <label style={LABEL_STYLE}>Summary</label>
            <textarea style={{ ...TS, minHeight: 72 }} value={form.summary.en} onChange={e => setF("summary.en", e.target.value)} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Body (Markdown)</label>
            <textarea style={TS} value={form.body.en} onChange={e => setF("body.en", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// News / Blog Editor
// ═══════════════════════════════════════════════════════════════════════════
function NewsEditor() {
  const [articles, setArticles] = useState(() => {
    try {
      const raw = localStorage.getItem(NEWS_KEY);
      return raw ? JSON.parse(raw) : [...DEFAULT_NEWS];
    } catch { return [...DEFAULT_NEWS]; }
  });
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function persist(list) {
    localStorage.setItem(NEWS_KEY, JSON.stringify(list));
    setArticles(list);
  }

  function saveArticle(article) {
    const idx = articles.findIndex(a => a.id === article.id);
    let next;
    if (idx >= 0) {
      next = articles.map((a, i) => i === idx ? article : a);
    } else {
      next = [article, ...articles];
    }
    next = [...next].sort((a, b) => b.date.localeCompare(a.date));
    persist(next);
    setEditing(null);
    showToast(idx >= 0 ? "文章已更新" : "文章已发布");
  }

  function deleteArticle(id) {
    if (!confirm("确认删除该文章？此操作不可撤销。")) return;
    persist(articles.filter(a => a.id !== id));
    showToast("已删除");
  }

  function resetNews() {
    if (!confirm("确认恢复默认文章列表？所有自定义文章将丢失。")) return;
    localStorage.removeItem(NEWS_KEY);
    setArticles([...DEFAULT_NEWS]);
    showToast("已恢复默认文章");
  }

  function newArticle() {
    setEditing({ ...EMPTY_ARTICLE, date: new Date().toISOString().slice(0, 10) });
  }

  if (editing) {
    return <ArticleEditor article={editing} onSave={saveArticle} onCancel={() => setEditing(null)} />;
  }

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", margin: 0 }}>博客文章管理</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={resetNews}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text2)", cursor: "pointer", fontSize: 13 }}
          >
            <RotateCcw size={13} /> 恢复默认
          </button>
          <button
            onClick={newArticle}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 10, background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
          >
            <Plus size={13} /> 新建文章
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {articles.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text3)", fontSize: 14 }}>
            暂无文章。点击「新建文章」开始创作。
          </div>
        )}
        {articles.map(a => (
          <div key={a.id} className="glass-card rounded-2xl ancient-border" style={{ display: "flex", alignItems: "center", gap: 16, padding: 18 }}>
            {a.image && (
              <img src={a.image} alt="" style={{ width: 90, height: 64, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>{a.category?.zh}</span>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>{a.date}</span>
                <span style={{ fontSize: 11, color: "var(--text3)", opacity: 0.5 }}>#{a.id}</span>
              </div>
              <p style={{ fontWeight: 600, fontSize: 15, color: "var(--text)", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {a.title?.zh}
              </p>
              <p style={{ fontSize: 12, color: "var(--text3)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {a.summary?.zh}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => setEditing({ ...a })}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text2)", cursor: "pointer", fontSize: 13 }}
              >
                <Edit3 size={13} /> 编辑
              </button>
              <button
                onClick={() => deleteArticle(a.id)}
                style={{ display: "flex", alignItems: "center", padding: "7px 10px", borderRadius: 8, border: "1px solid #ef4444", background: "transparent", color: "#ef4444", cursor: "pointer" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Admin Page — default export
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminPage({ onExit }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(PASS_KEY) === "1");
  const [tab, setTab] = useState("stats");

  if (!authed) {
    return <LoginScreen onExit={onExit} onSuccess={() => setAuthed(true)} />;
  }

  function logout() {
    sessionStorage.removeItem(PASS_KEY);
    setAuthed(false);
  }

  const TABS = [
    { key: "stats", label: "数据统计", Icon: Settings },
    { key: "news",  label: "博客文章", Icon: FileText },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid var(--border)",
        background: "var(--nav-bg)", backdropFilter: "blur(14px)",
        padding: "0 24px", display: "flex", alignItems: "center", height: 56,
      }}>
        <button
          onClick={onExit}
          onMouseOver={e => { e.currentTarget.style.opacity = "1"; }}
          onMouseOut={e => { e.currentTarget.style.opacity = "0.65"; }}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text2)", fontSize: 13, opacity: 0.65 }}
        >
          <ArrowLeft size={14} /> 返回网站
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span className="section-label" style={{ justifyContent: "center" }}>载物 · 管理后台</span>
        </div>
        <button
          onClick={logout}
          onMouseOver={e => { e.currentTarget.style.opacity = "1"; }}
          onMouseOut={e => { e.currentTarget.style.opacity = "0.45"; }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 12, opacity: 0.45 }}
        >
          退出登录
        </button>
      </header>

      {/* Tab bar */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg2)", padding: "0 24px", display: "flex" }}>
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "14px 20px", fontSize: 14, fontWeight: 600,
              background: "none", border: "none", cursor: "pointer",
              color: tab === key ? "var(--accent)" : "var(--text2)",
              borderBottom: tab === key ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {tab === "stats" ? <StatsEditor /> : <NewsEditor />}
      </div>

    </div>
  );
}
