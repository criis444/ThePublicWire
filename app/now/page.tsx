import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

export default async function NowPage() {

  console.log("🔥 NOW PAGE RUNNING");

  const { data: posts, error } = await supabase
    .from("now_posts")
    .select(`
      id,
      title,
      summary,
      source,
      source_url,
      media_url,
      media_type,
      category,
      created_at
    `)
    .eq("status", "approved")
    .order("created_at", { ascending: false });


  console.log(
    "MEDIA CHECK:",
    posts?.map((post) => ({
      title: post.title,
      media_url: post.media_url,
      media_type: post.media_type
    }))
  );


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

            {post.media_type === "image" && post.media_url && (
              <img
                src={post.media_url}
                alt={post.title}
              />
            )}

            {post.media_type === "video" && post.media_url && (
              <video
                src={post.media_url}
                autoPlay
                muted
                loop
                playsInline
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
                  {
                    addSuffix:true
                  }
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


              {post.source_url && (
                <a
                  href={post.source_url}
                  target="_blank"
                  className="source-link"
                >
                  View Source
                </a>
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
