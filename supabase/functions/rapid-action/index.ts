import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


function extractImage(xml:string) {

  const media =
    xml.match(
      /<media:thumbnail[^>]*url="([^"]+)"/
    );

  if (media?.[1]) {
    return media[1];
  }


  const contentImage =
    xml.match(
      /<img[^>]+src="([^"]+)"/
    );

  if (contentImage?.[1]) {
    return contentImage[1];
  }


  const enclosure =
    xml.match(
      /<enclosure[^>]*url="([^"]+)"/
    );

  if (enclosure?.[1]) {
    return enclosure[1];
  }


  return null;

}



Deno.serve(async () => {


  const supabase =
    createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );



  const { data: posts } =
    await supabase

      .from("source_queue")

      .select("*")

      .is("media_url", null)

      .limit(50);



  let updated = 0;



  for (const post of posts ?? []) {


    try {


      const response =
        await fetch(
          post.source_url
        );


      const html =
        await response.text();



      const image =
        extractImage(html);



      if (!image) {
        continue;
      }



      await supabase

        .from("source_queue")

        .update({

          media_url:
            image,


          media_type:
            "image",

        })

        .eq(
          "id",
          post.id
        );



      updated++;



    } catch(error) {

      console.log(
        "failed",
        post.source_url
      );

    }


  }



  return new Response(

    JSON.stringify({

      updated,

    }),

    {

      headers: {
        "Content-Type":
          "application/json",
      },

    }

  );


});