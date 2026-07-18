"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { topics } from "@/data/topics";
import { supabase } from "@/lib/supabase";

const NOTES_KEY = "thepublicwire-private-note";

export default function YouPage() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    setNote(
      window.localStorage.getItem(NOTES_KEY) ?? ""
    );

    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfileLoading(false);
      return;
    }

    setUserEmail(user.email ?? "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }

    setProfileLoading(false);
  }

  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        display_name: displayName,
      })
      .eq("id", user.id);
  }

  function saveNote() {
    window.localStorage.setItem(
      NOTES_KEY,
      note
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1600);
  }

  return (
    <main className="page-shell narrow">

      <p className="eyebrow">
        YOU
      </p>

      <h1 className="page-title">
        Your wire.
      </h1>

      <p className="lead">
        Track what matters, keep private notes,
        and return to sources without turning
        your account into a public profile.
      </p>


      <section className="account-card">

        <div className="avatar">
          {displayName
            ? displayName.charAt(0).toUpperCase()
            : "TP"}
        </div>

        <div>
          <p className="eyebrow">
            ACCOUNT
          </p>

          {profileLoading ? (
            <h2>
              Loading...
            </h2>
          ) : (
            <>
              <h2>
                {displayName || "Set your display name"}
              </h2>

              <p>
                {userEmail}
              </p>

              {!displayName && (
                <input
                  value={displayName}
                  onChange={(e) =>
                    setDisplayName(e.target.value)
                  }
                  placeholder="Display name"
                />
              )}

              <button
                className="primary-button"
                onClick={saveProfile}
              >
                Save profile
              </button>
            </>
          )}
        </div>

      </section>


      <section className="board-section">

        <div>
          <p className="eyebrow">
            YOUR BOARD
          </p>

          <h2>
            Keep the thread.
          </h2>
        </div>

        <p>
          Save a question, source to revisit,
          or detail to check later.
        </p>

        <label className="note-label">
          Private note

          <textarea
            value={note}
            onChange={(event) =>
              setNote(event.target.value)
            }
            placeholder="Save something to revisit."
          />
        </label>

        <button
          type="button"
          className="primary-button"
          onClick={saveNote}
        >
          {saved ? "Saved" : "Save note"}
        </button>

      </section>


      <section className="saved-topics">

        <p className="eyebrow">
          START TRACKING
        </p>

        <h2>
          Topics you can follow
        </h2>

        {topics.map((topic) => (
          <Link
            className="saved-topic"
            href={`/topics/${topic.id}`}
            key={topic.id}
          >
            <span>
              {topic.kind}
            </span>

            <strong>
              {topic.title}
            </strong>

            <small>
              {topic.updated}
            </small>

          </Link>
        ))}

      </section>

    </main>
  );
}