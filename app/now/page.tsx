import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

export default async function NowPage() {
  const { data: posts, error } = await supabase
    .from("now_posts")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Error loading NOW feed</div>;
  }

  return (
    <main className="now-page">

      {posts?.map((post) => (
        <article
          key={post.id}
          className="now-slide"
        >

          <div className="now-background">

            {post.media_type === "video" && post.media_url && (
              <video
                src={post.media_url}
                autoPlay
                muted
                loop
                playsInline
              />
            )}

            {post.media_type === "image" && post.media_url && (
              <img
                src={post.media_url}
                alt={post.title}
              />
            )}

          </div>


          <div className="now-overlay">


            <div className="now-top">

              <span className="live-pill">
                LIVE
              </span>

              <span>
                {formatDistanceToNow(
                  new Date(post.created_at),
                  { addSuffix: true }
                )}
              </span>

            </div>


            <div className="now-content">

              <p className="now-category">
                {post.category || "UPDATE"}
              </p>


              <h1>
                {post.title}
              </h1>


              <p>
                {post.summary}
              </p>


              {post.source && (
                <div className="verified-pill">
                  ✓ {post.source}
                </div>
              )}


              <div className="now-actions">

                <button>
                  🔖 Save
                </button>

                <button>
                  💬 Discuss
                </button>

                <button>
                  ↗ Share
                </button>

              </div>


            </div>


          </div>

        </article>
      ))}

    </main>
  );
}