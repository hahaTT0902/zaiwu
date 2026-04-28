import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react";
import { fetchNews } from "./data/newsService";

// ── 阅读进度条 ─────────────────────────────────────────────────────────────
function ReadingProgress({ targetRef }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = targetRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const height = el.offsetHeight;
      const winH = window.innerHeight;
      const scrolled = window.scrollY;
      const start = top - winH * 0.15;
      const end = top + height - winH * 0.85;
      const progress = Math.min(1, Math.max(0, (scrolled - start) / (end - start)));
      setPct(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [targetRef]); 

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999]"
      style={{ height: "3px", background: "var(--surface2)" }}
    >
      <motion.div
        className="h-full"
        style={{
          width: `${pct * 100}%`,
          background: "linear-gradient(90deg, var(--accent), var(--gold))",
          boxShadow: "0 0 10px var(--accent)",
        }}
        transition={{ duration: 0.05 }}
      />
    </div>
  );
}

// ── 简单 Markdown 渲染 ─────────────────────────────────────────────────────
function MarkdownBody({ text }) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) {
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="text-xl font-bold mt-10 mb-4 pb-2"
          style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}
        >
          {line.slice(3)}
        </h2>
      );
      i++;
    } else if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 my-4 pl-1">
          {items.map((item, j) => (
            <li
              key={j}
              className="flex items-start gap-2.5 text-sm leading-relaxed"
              style={{ color: "var(--text2)" }}
            >
              <span className="mt-[3px] shrink-0" style={{ color: "var(--gold)" }}>◆</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                }}
              />
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <p key={i} className="text-sm leading-[1.95] my-3" style={{ color: "var(--text2)" }}>
          {line}
        </p>
      );
      i++;
    }
  }
  return <>{elements}</>;
}

// ── 文章详情页 ─────────────────────────────────────────────────────────────
function ArticleDetail({ article, lang, onBack }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [article.id]);

  return (
    <>
      <ReadingProgress targetRef={bodyRef} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto px-6 pt-28 pb-28"
      >
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-60"
          style={{ color: "var(--accent2)" }}
        >
          <ArrowLeft size={15} />
          {lang === "zh" ? "返回新闻列表" : "Back to News"}
        </button>

        {/* Cover */}
        {article.image && (
          <div className="rounded-3xl overflow-hidden mb-8 h-56 md:h-80">
            <img
              src={article.image}
              alt={article.title[lang]}
              className="w-full h-full object-cover"
              style={{ opacity: 0.85 }}
              onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <span
            className="px-3 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: "var(--surface2)", color: "var(--accent2)" }}
          >
            {article.category[lang]}
          </span>
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--text3)" }}
          >
            <Calendar size={12} />
            {article.date}
          </span>
          {article.tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--text3)" }}
            >
              <Tag size={10} />
              {tag[lang]}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl font-black leading-[1.12] pb-1 mb-8"
          style={{ color: "var(--text)" }}
        >
          {article.title[lang]}
        </h1>

        {/* Body */}
        <div ref={bodyRef}>
          <MarkdownBody text={article.body[lang]} />
        </div>

        {/* Footer nav */}
        <div
          className="mt-14 pt-6 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={onBack}
            className="btn-glass flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ color: "var(--accent2)" }}
          >
            <ArrowLeft size={14} />
            {lang === "zh" ? "返回列表" : "Back to List"}
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ── 新闻列表页 ─────────────────────────────────────────────────────────────
function NewsList({ lang, onBack, onSelect, news, isLoading, error, onRetry }) {
  const [filter, setFilter] = useState("all");

  const allCategories = Array.from(
    new Set(news.map((n) => n.category[lang]).filter(Boolean))
  );
  const filtered =
    filter === "all" ? news : news.filter((n) => n.category[lang] === filter);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 pt-36 pb-28"
    >
      {/* Back to home */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-60"
        style={{ color: "var(--accent2)" }}
      >
        <ArrowLeft size={15} />
        {lang === "zh" ? "返回主页" : "Back to Home"}
      </button>

      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">
          {lang === "zh" ? "最新动态" : "Latest Updates"}
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-gradient leading-[1.12] pb-1 mb-3">
          {lang === "zh" ? "新闻 & 博客" : "News & Blog"}
        </h1>
        <p className="text-sm" style={{ color: "var(--text3)" }}>
          {lang === "zh"
            ? "载物的项目动态、活动纪录与文化分享"
            : "Project updates, event records, and cultural sharing from Ink & Heritage"}
        </p>
      </div>

      {!isLoading && !error && (
        <>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {["all", ...allCategories].map((cat) => {
              const label =
                cat === "all" ? (lang === "zh" ? "全部" : "All") : cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={{
                    background: filter === cat ? "var(--accent)" : "var(--surface)",
                    color: filter === cat ? "#fff" : "var(--text2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((article, i) => (
            <motion.article
              key={article.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              onClick={() => onSelect(article.id)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
              style={{ transition: "transform 0.2s" }}
              whileHover={{ y: -4 }}
            >
              {/* Thumb */}
              <div className="h-44 overflow-hidden relative">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ opacity: 0.82 }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div
                  className="w-full h-full items-center justify-center text-3xl"
                  style={{
                    display: article.image ? 'none' : 'flex',
                    background: 'linear-gradient(135deg, var(--surface2) 0%, var(--surface) 100%)'
                  }}
                >
                  📜
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                    style={{
                      background: "var(--surface2)",
                      color: "var(--accent2)",
                    }}
                  >
                    {article.category[lang]}
                  </span>
                  <span
                    className="text-xs flex items-center gap-1"
                    style={{ color: "var(--text3)" }}
                  >
                    <Calendar size={10} />
                    {article.date}
                  </span>
                </div>

                <h2
                  className="font-bold text-base leading-snug"
                  style={{ color: "var(--text)" }}
                >
                  {article.title[lang]}
                </h2>

                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "var(--text3)",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {article.summary[lang]}
                </p>

                <div
                  className="flex items-center gap-1 text-xs font-semibold pt-1"
                  style={{ color: "var(--accent2)" }}
                >
                  {lang === "zh" ? "阅读全文" : "Read More"}
                  <ArrowRight size={12} />
                </div>
              </div>
            </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {isLoading && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            {lang === "zh" ? "正在从数据库加载新闻..." : "Loading news from database..."}
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="glass-card rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm" style={{ color: "#ef4444" }}>
            {lang === "zh" ? "数据库连接失败" : "Failed to load from database"}
          </p>
          <p className="text-xs" style={{ color: "var(--text3)" }}>
            {String(error)}
          </p>
          <button
            onClick={onRetry}
            className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold"
          >
            {lang === "zh" ? "重试" : "Retry"}
          </button>
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            {lang === "zh" ? "暂无文章" : "No posts yet"}
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ── 主出口：列表 / 详情切换 ───────────────────────────────────────────────
export default function NewsRoot({ lang, onGoHome }) {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [articleId, setArticleId] = useState(null);
  const article = articleId ? news.find((n) => n.id === articleId) : null;

  const loadFromDb = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchNews();
      setNews(data);
    } catch (err) {
      setError(err?.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      loadFromDb();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {article ? (
        <ArticleDetail
          key={articleId}
          article={article}
          lang={lang}
          onBack={() => setArticleId(null)}
        />
      ) : (
        <NewsList
          key="list"
          lang={lang}
          onBack={onGoHome}
          onSelect={setArticleId}
          news={news}
          isLoading={isLoading}
          error={error}
          onRetry={loadFromDb}
        />
      )}
    </AnimatePresence>
  );
}
