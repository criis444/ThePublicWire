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
  const [editing, setEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    setNote(localStorage.getItem(NOTES_KEY) ?? "");
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

    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    setDisplayName(data?.display_name ?? "");

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

    setEditing(false);
  }

  function saveNote() {
    localStorage.setItem(NOTES_KEY, note);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 1500);
  }


  return (
    <main className="page-shell profile-page">

      <section className="profile-hero">

        <div className="profile-avatar">
          {displayName
            ? displayName[0].toUpperCase()
            : "TP"}
        </div>

        {profileLoading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <h1>
              {displayName || "New Contributor"}
            </h1>

            <p className="profile-email">
              {userEmail}
            </p>

            <p className="profile-bio">
              Tracking stories, sources, and verified information.
            </p>

            <button
              className="primary-button"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Close" : "Edit Profile"}
            </button>

          </>
        )}

      </section>


      {editing && (
        <section className="profile-editor">

          <label>
            Display name

            <input
              value={displayName}
              onChange={(e) =>
                setDisplayName(e.target.value)
              }
              placeholder="Choose your display name"
            />

          </label>

          <button
            className="primary-button"
            onClick={saveProfile}
          >
            Save Changes
          </button>

        </section>
      )}



      <section className="profile-stats">

        <div>
          <strong>0</strong>
          <span>Posts</span>
        </div>

        <div>
          <strong>0</strong>
          <span>Saved</span>
        </div>

        <div>
          <strong>{topics.length}</strong>
          <span>Topics</span>
        </div>

      </section>



      <section className="board-section">

        <p className="eyebrow">
          YOUR BOARD
        </p>

        <h2>
          Keep the thread.
        </h2>

        <textarea
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
          placeholder="Save a source, question, or investigation..."
        />

        <button
          className="primary-button"
          onClick={saveNote}
        >
          {saved ? "Saved" : "Save Note"}
        </button>

      </section>



      <section className="saved-topics">

        <p className="eyebrow">
          FOLLOWING
        </p>

        <h2>
          Topics
        </h2>

        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.id}`}
            className="saved-topic"
          >
            <span>{topic.kind}</span>
            <strong>{topic.title}</strong>
            <small>{topic.updated}</small>
          </Link>
        ))}

      </section>

    </main>
  );
}