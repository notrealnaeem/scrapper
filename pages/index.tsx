import { useEffect, useMemo, useState } from "react";

type NewsItem = {
  title: string;
  link: string;
};

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:4000/news");
      if (!res.ok) {
        throw new Error("Failed to load news");
      }
      const data = (await res.json()) as NewsItem[];
      setNews(Array.isArray(data) ? data : []);
      setUpdatedAt(new Date().toLocaleString());
    } catch (err) {
      console.error(err);
      setError("Unable to load news. Please check the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = useMemo(
    () =>
      news.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [news, query],
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <p style={styles.subtitle}>
              Live scraped headlines from Hacker News
            </p>
            <h1 style={styles.title}>Tech News Dashboard</h1>
            <p style={styles.meta}>
              {loading
                ? "Refreshing headlines..."
                : error
                  ? error
                  : `${filteredNews.length} of ${news.length} results`}
            </p>
          </div>
          <button style={styles.button} onClick={fetchNews} disabled={loading}>
            Refresh
          </button>
        </div>

        <div style={styles.toolbar}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search headlines..."
            style={styles.searchInput}
          />
          <span style={styles.timestamp}>
            {updatedAt ? `Updated ${updatedAt}` : "Waiting for data..."}
          </span>
        </div>

        {loading ? (
          <div style={styles.status}>Loading news…</div>
        ) : error ? (
          <div style={{ ...styles.status, ...styles.error }}>{error}</div>
        ) : filteredNews.length === 0 ? (
          <div style={styles.status}>No headlines match your search.</div>
        ) : (
          <div style={styles.grid}>
            {filteredNews.map((item, index) => (
              <article key={index} style={styles.cardItem}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.cardLink}
                >
                  {item.title}
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    background: "radial-gradient(circle at top, #f3f8ff, #ffffff)",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#111827",
  },
  card: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 28,
    borderRadius: 24,
    boxShadow: "0 20px 80px rgba(15, 23, 42, 0.08)",
    background: "#ffffff",
    border: "1px solid rgba(15, 23, 42, 0.06)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 22,
  },
  title: {
    margin: 0,
    fontSize: 38,
    lineHeight: 1.05,
  },
  subtitle: {
    margin: 0,
    color: "#4b5563",
    fontSize: 15,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  meta: {
    margin: "12px 0 0",
    color: "#6b7280",
    fontSize: 14,
  },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    minWidth: 220,
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: 15,
    color: "#111827",
  },
  timestamp: {
    color: "#6b7280",
    fontSize: 13,
  },
  button: {
    padding: "12px 20px",
    borderRadius: 14,
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.15s ease",
  },
  status: {
    padding: 24,
    borderRadius: 18,
    background: "#f8fafc",
    color: "#334155",
    fontSize: 15,
    textAlign: "center" as const,
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 18,
  },
  cardItem: {
    padding: 20,
    borderRadius: 20,
    background: "#fafbff",
    border: "1px solid rgba(99, 102, 241, 0.12)",
    minHeight: 120,
    display: "flex",
    alignItems: "center",
  },
  cardLink: {
    color: "#1d4ed8",
    textDecoration: "none",
    fontSize: 15,
    lineHeight: 1.6,
    fontWeight: 600,
  },
};
