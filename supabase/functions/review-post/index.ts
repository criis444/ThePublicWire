import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function checkPost(post: any) {
  let score = 100;
  const flags: string[] = [];

  // URL required
  if (!post.source_url) {
    score -= 30;
    flags.push("missing source URL");
  }

  // Title length
  if (!post.title || post.title.length < 10) {
    score -= 15;
    flags.push("short title");
  }

  // Summary length
  if (!post.summary || post.summary.length < 30) {
    score -= 15;
    flags.push("short summary");
  }

  // Suspicious phrases
  const suspicious = [
    "you won't believe",
    "100% guaranteed",
    "secret truth",
    "they don't want you to know",
  ];

  const text = `${post.title} ${post.summary}`.toLowerCase();

  for (const phrase of suspicious) {
    if (text.includes(phrase)) {
      score -= 20;
      flags.push(`suspicious phrase: ${phrase}`);
    }
  }

  // Basic domain check
  if (post.source_url) {
    try {
      const domain = new URL(post.source_url).hostname;

      const allowed = [
        "cnn.com",
        "reuters.com",
        "apnews.com",
        "bbc.com",
        "nytimes.com",
        "gov",
      ];

      const trusted = allowed.some((site) =>
        domain.includes(site)
      );

      if (!trusted) {
        score -= 10;
        flags.push("unknown source domain");
      }
    } catch {
      score -= 20;
      flags.push("invalid URL");
    }
  }

  return {
    confidence: Math.max(score, 0),
    flags,
  };
}


Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: posts, error } = await supabase
    .from("now_posts")
    .select("*")
    .eq("status", "analyzing")
    .eq("ai_checked", false)
    .limit(10);

  if (error) {
    return new Response(error.message, {
      status: 500,
    });
  }

  for (const post of posts ?? []) {

    const review = checkPost(post);

    const approved =
      review.confidence >= 80;

    await supabase
      .from("now_posts")
      .update({
        ai_checked: true,

        ai_confidence:
          review.confidence,

        ai_summary:
          review.flags.length
            ? review.flags.join(", ")
            : "Passed automated verification checks.",

        status:
          approved
            ? "approved"
            : "review",

        verification_level:
          approved
            ? "verified"
            : "pending",
      })
      .eq("id", post.id);
  }

  return new Response(
    JSON.stringify({
      reviewed: posts?.length ?? 0,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});