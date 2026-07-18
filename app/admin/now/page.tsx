import { supabase } from "@/lib/supabase";

export default async function AdminNowPage() {
  const { data: posts, error } = await supabase
    .from("now_posts")
    .select("*")
    .neq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="page-shell">
        <h1>Error loading review queue</h1>
      </main>
    );
  }

  return (
    <main className="page-shell now-shell">
      <section className="now-intro">
        <p className="eyebrow">ADMIN</p>
        <h1>NOW Review Center</h1>
        <p>
          Internal review queue for ThePublicWire intelligence feed.
        </p>
      </section>

      <section className="now-feed">
        {posts?.length === 0 && (
          <p>No posts waiting for review.</p>
        )}

        {posts?.map((post) => (
          <article key={post.id} className="feed-card now-card">
            <div className="feed-copy">
              <div className="feed-meta">
                <span>
                  Status: {post.status}
                </span>

                <span>
                  Level: {post.verification_level || "pending"}
                </span>
              </div>

              <h2>{post.title}</h2>

              <p>{post.summary}</p>

              {post.source && (
                <p>
                  Source: {post.source}
                </p>
              )}

              {post.ai_summary && (
                <p>
                  AI: {post.ai_summary}
                </p>
              )}

              {post.ai_confidence && (
                <p>
                  Confidence: {post.ai_confidence}
                </p>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
