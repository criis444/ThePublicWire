"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateNowPost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("video");
  const [source, setSource] = useState("");
  const [evidence, setEvidence] = useState("");
  const [message, setMessage] = useState("");

  async function createPost(event: React.FormEvent) {
    event.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be signed in.");
      return;
    }

    const { error } = await supabase
      .from("now_posts")
      .insert({
        title,
        summary,
        category,

        media_url: mediaUrl,
        media_type: mediaType,

        source,
        evidence,

        status: "pending",
        verification_level: "pending",

        ai_checked: false,
        ai_confidence: null,

        human_verified: false,

        author_id: user.id,

        post_origin: "user",
        publish_mode: "review",
      });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Post submitted for review.");

    setTitle("");
    setSummary("");
    setCategory("");
    setMediaUrl("");
    setMediaType("video");
    setSource("");
    setEvidence("");
  }

  return (
    <main className="page-shell narrow">
      <section className="now-intro">
        <p className="eyebrow">SUBMIT</p>

        <h1>Create NOW Post</h1>

        <p>
          Share factual updates, evidence, sources, and relevant media.
          Posts are reviewed before appearing publicly.
        </p>
      </section>

      <form
        className="share-form"
        onSubmit={createPost}
      >
        <label>
          Title
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Breaking update title"
          />
        </label>

        <label>
          Summary
          <textarea
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Explain what happened..."
          />
        </label>

        <label>
          Category
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Politics, Weather, Science..."
          />
        </label>

        <label>
          Media URL
          <input
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="Video or image URL"
          />
        </label>

        <label>
          Media Type
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
          >
            <option value="video">
              Video
            </option>

            <option value="image">
              Image
            </option>

            <option value="document">
              Document
            </option>
          </select>
        </label>

        <label>
          Source
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Source name"
          />
        </label>

        <label>
          Evidence URL
          <input
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Evidence link"
          />
        </label>

        <button className="primary-button">
          Submit for review
        </button>
      </form>

      {message && (
        <p>
          {message}
        </p>
      )}
    </main>
  );
}