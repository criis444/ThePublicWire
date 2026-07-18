"use client";

import { useState } from "react";
import { topics } from "@/data/topics";
import { supabase } from "@/lib/supabase";

type ContributionType =
  | "source"
  | "video"
  | "perspective"
  | "document"
  | "discussion";

const choices: {
  id: ContributionType;
  title: string;
  detail: string;
  icon: string;
}[] = [
  {
    id: "source",
    icon: "↗",
    title: "Share a source",
    detail: "A news report, official statement, or public record.",
  },
  {
    id: "video",
    icon: "◉",
    title: "Add a relevant clip",
    detail: "A factual video connected to a real topic.",
  },
  {
    id: "perspective",
    icon: "✦",
    title: "Post a perspective",
    detail: "Your analysis, clearly labeled and backed by sources.",
  },
  {
    id: "document",
    icon: "▤",
    title: "Add a document",
    detail: "A public filing, report, or material people can verify.",
  },
  {
    id: "discussion",
    icon: "↝",
    title: "Open a discussion",
    detail: "A focused conversation around verified information.",
  },
];

export default function SharePage() {
  const [type, setType] = useState<ContributionType | null>(null);
  const [sent, setSent] = useState(false);

  const [title, setTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [description, setDescription] = useState("");

  const selected = choices.find((choice) => choice.id === type);

  async function submitPost(event: React.FormEvent) {
  event.preventDefault();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("CURRENT USER:", user);

  if (!user) {
  window.location.href = "/sign-in";
  return;
}

  console.log("ABOUT TO INSERT POST", {
    user: user.id,
    title,
    sourceUrl,
    description,
  });

  const { data, error } = await supabase
    .from("now_posts")
    .insert({
      title,
      summary: description,

      category: "General",

      video_url: "",
      source: "",
      evidence: "",

      approved_by: null,

      media_url: "",
      media_type: "text",
      media_source: "",

      source_url: sourceUrl,

      status: "analyzing",
      verification_level: "pending",

      ai_checked: false,
      ai_confidence: 0,

      human_verified: false,

      author_id: user.id,

      post_origin: "user",
      publish_mode: "ai_review",

      ai_summary: "",
    })
    .select();

  console.log("INSERT RESULT:", {
    data,
    error,
  });

  if (error) {
    alert(
      "DATABASE ERROR:\n\n" + error.message
    );
    return;
  }

  alert("POST CREATED SUCCESSFULLY");

  setSent(true);

  setTitle("");
  setSourceUrl("");
  setDescription("");
  setType(null);
}

  if (sent) {
    return (
      <main className="page-shell narrow">
        <section className="submission-received">
          <p className="eyebrow">SUBMITTED</p>

          <h1>
            Received for review.
          </h1>

          <p>
            Your contribution is being checked for source quality,
            relevance, and community safety before appearing on ThePublicWire.
          </p>

          <button
            className="primary-button"
            onClick={() => setSent(false)}
          >
            Share something else
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell narrow">

      <p className="eyebrow">
        SHARE
      </p>

      <h1 className="page-title">
        Put something useful on the wire.
      </h1>

      <p className="lead">
        Share sources, evidence, relevant clips, and
        source-backed perspectives.
      </p>

      <section className="contribution-choices">

        {choices.map((choice) => (
          <button
            key={choice.id}
            className={`contribution-choice ${
              type === choice.id ? "selected" : ""
            }`}
            onClick={() => setType(choice.id)}
          >
            <span>
              {choice.icon}
            </span>

            <div>
              <strong>
                {choice.title}
              </strong>

              <p>
                {choice.detail}
              </p>
            </div>

          </button>
        ))}

      </section>

      {selected && (

        <form
          className="share-form contribution-form"
          onSubmit={submitPost}
        >

          <div className="form-heading">

            <span>
              {selected.icon}
            </span>

            <div>
              <p className="eyebrow">
                {selected.title}
              </p>

              <p>
                Give people a way to verify what you share.
              </p>
            </div>

          </div>

          <label>
            Connect it to a topic

            <select required defaultValue="">
              <option value="" disabled>
                Choose a topic
              </option>

              {topics.map((topic) => (
                <option key={topic.id}>
                  {topic.title}
                </option>
              ))}

            </select>

          </label>

          <label>
            Headline or clear title

            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What should people understand first?"
            />

          </label>

          <label>
            Original source link

            <input
              type="url"
              required
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://"
            />

          </label>

          <label>
            Why does this matter?

            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the evidence and context."
            />

          </label>

          <div className="rules-preview">

            <strong>
              Before you share
            </strong>

            <span>
              Sources are required. Unsupported accusations,
              harassment, private information, and unrelated uploads
              are removed.
            </span>

          </div>

          <label className="check">

            <input
              type="checkbox"
              required
            />

            I confirm this contribution has a valid source.

          </label>

          <button className="primary-button">
            Send for AI review
          </button>

        </form>

      )}

    </main>
  );
}