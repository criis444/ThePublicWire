import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let updated = 0;

  const { data: posts, error } = await supabase
    .from("now_posts")
    .select("id, source_url, media_url")
    .is("media_url", null)
    .limit(100);

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  for (const post of posts ?? []) {
    if (!post.source_url) continue;

    try {
      const response = await fetch(post.source_url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (ThePublicWire Media Bot)",
        },
      });

      if (!response.ok) continue;

      const html = await response.text();

      const image =
        html.match(
          /<meta property="og:image" content="([^"]+)"/
        )?.[1] ??
        html.match(
          /<meta name="twitter:image" content="([^"]+)"/
        )?.[1] ??
        "";

      if (!image) continue;

      const { error: updateError } = await supabase
        .from("now_posts")
        .update({
          media_url: image,
          media_type: "image",
        })
        .eq("id", post.id);

      if (!updateError) {
        updated++;
      }

    } catch (err) {
      console.log(
        "MEDIA ERROR:",
        post.source_url,
        err
      );
    }
  }

  return new Response(
    JSON.stringify({
      updated,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});
