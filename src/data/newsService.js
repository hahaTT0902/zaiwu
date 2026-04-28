import { hasSupabaseConfig, supabase } from "../lib/supabase";

// ── 统一入口：优先使用 PHP 代理 API，否则回退到 Supabase ─────────────────
export async function fetchNews() {
  const apiUrl = import.meta.env.VITE_NEWS_API_URL;
  if (apiUrl) {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`News API returned ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return (json.data || []).map(normalizeNewsRow);
  }
  // 回退到 Supabase
  return fetchNewsFromDatabase();
}

function fromMaybeObject(v, key) {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    return v[key] || "";
  }
  return "";
}

function normalizeTags(row) {
  if (Array.isArray(row.tags) && row.tags.length > 0) {
    if (typeof row.tags[0] === "string") {
      return row.tags.map((t) => ({ zh: t, en: t }));
    }
    return row.tags.map((t) => ({ zh: t?.zh || "", en: t?.en || "" }));
  }

  const zh = Array.isArray(row.tags_zh) ? row.tags_zh : [];
  const en = Array.isArray(row.tags_en) ? row.tags_en : [];
  const max = Math.max(zh.length, en.length);
  return Array.from({ length: max }).map((_, i) => ({
    zh: zh[i] || en[i] || "",
    en: en[i] || zh[i] || "",
  }));
}

function normalizeNewsRow(row) {
  return {
    id: String(row.id),
    date: row.date || row.published_at || row.created_at || "",
    category: {
      zh: row.category_zh || fromMaybeObject(row.category, "zh") || "",
      en: row.category_en || fromMaybeObject(row.category, "en") || "",
    },
    title: {
      zh: row.title_zh || fromMaybeObject(row.title, "zh") || "",
      en: row.title_en || fromMaybeObject(row.title, "en") || "",
    },
    summary: {
      zh: row.summary_zh || fromMaybeObject(row.summary, "zh") || "",
      en: row.summary_en || fromMaybeObject(row.summary, "en") || "",
    },
    body: {
      zh: row.body_zh || fromMaybeObject(row.body, "zh") || "",
      en: row.body_en || fromMaybeObject(row.body, "en") || "",
    },
    image: row.image || row.cover_image || "",
    tags: normalizeTags(row),
  };
}

export async function fetchNewsFromDatabase() {
  if (!hasSupabaseConfig) {
    throw new Error("Supabase env vars are missing");
  }

  const { data, error } = await supabase.from("news_posts").select("*");

  if (error) {
    throw error;
  }

  const normalized = (data || []).map(normalizeNewsRow);

  return normalized.sort((a, b) => {
    const ta = new Date(a.date).getTime();
    const tb = new Date(b.date).getTime();
    return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
  });
}
