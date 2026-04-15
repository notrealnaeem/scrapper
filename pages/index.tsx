import { useEffect, useState } from "react";

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:4000/news")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load news");
        }
        return res.json();
      })
      .then((data) => setNews(data || []))
      .catch((err) => {
        console.error(err);
        setError("Unable to load news.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1> Tech News Dashboard</h1>

      {loading ? (
        <p>Loading news...</p>
      ) : error ? (
        <p>{error}</p>
      ) : news.length === 0 ? (
        <p>No news available yet.</p>
      ) : (
        news.map((item, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <a href={item.link} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          </div>
        ))
      )}
    </div>
  );
}
