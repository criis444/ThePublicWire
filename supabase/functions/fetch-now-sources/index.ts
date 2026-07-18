import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const feeds = [
    {
      url: "https://feeds.bbci.co.uk/news/rss.xml",
      source: "BBC News",
    },
    {
      url: "https://www.npr.org/rss/rss.php?id=1001",
      source: "NPR",
    },
  ];

  let inserted = 0;

  for (const feed of feeds) {
    let xml = "";

    try {
      const response = await fetch(feed.url);

      if (!response.ok) {
        console.log("FAILED FEED:", feed.source);
        continue;
      }

      xml = await response.text();

    } catch {
      console.log("FETCH ERROR:", feed.source);
      continue;
    }


    const items = [
      ...xml.matchAll(/<item>([\s\S]*?)<\/item>/g),
    ];


    for (const item of items) {
      const content = item[1];


      const title =
        content.match(/<title>(.*?)<\/title>/)?.[1]
          ?.replace("<![CDATA[", "")
          .replace("]]>", "")
          .trim()
        ?? "";


      const rawSourceUrl =
        content.match(/<link>(.*?)<\/link>/)?.[1]
        ?? "";


      // Remove tracking parameters so duplicates are detected
      const cleanUrl = rawSourceUrl.split("?")[0];


      let image =
        content.match(/<media:content[^>]*url="([^"]+)"/)?.[1]
        ??
        content.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1]
        ??
        content.match(/<enclosure[^>]*url="([^"]+)"/)?.[1]
        ??
        "";


      if (!image && cleanUrl) {
        try {

          const page = await fetch(cleanUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0",
            },
          });


          const html = await page.text();


          image =
            html.match(
              /<meta property="og:image" content="([^"]+)"/
            )?.[1]
            ??
            html.match(
              /<meta name="twitter:image" content="([^"]+)"/
            )?.[1]
            ??
            "";

        } catch {
          console.log("IMAGE FETCH FAILED:", title);
        }
      }


      if (!title || !cleanUrl) continue;


      // Prevent duplicate stories
      const { data: existing } = await supabase
        .from("now_posts")
        .select("id")
        .eq("source_url", cleanUrl)
        .maybeSingle();


      if (existing) {
        continue;
      }


      const { error } = await supabase
        .from("now_posts")
        .insert({

          title,

          summary:
            "Automatically collected from a trusted public source.",

          source:
            feed.source,

          source_url:
            cleanUrl,

          media_url:
            image,

          media_type:
            image ? "image" : "",

          category:
            "NEWS",

          status:
            "approved",

          verification_level:
            "verified",

          ai_checked:
            false,

          ai_confidence:
            0,

          human_verified:
            false,

          post_origin:
            "source",

          publish_mode:
            "automatic",

        });


      if (!error) {
        inserted++;
      } else {
        console.log(
          "INSERT ERROR:",
          error.message
        );
      }

    }
  }


  return new Response(
    JSON.stringify({
      inserted,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});