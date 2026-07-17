"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { topics } from "@/data/topics";

const NOTES_KEY = "thepublicwire-private-note";

export default function YouPage() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => setNote(window.localStorage.getItem(NOTES_KEY) ?? ""), []);
  function saveNote() { window.localStorage.setItem(NOTES_KEY, note); setSaved(true); window.setTimeout(() => setSaved(false), 1600); }
  return <main className="page-shell narrow"><p className="eyebrow">YOU</p><h1 className="page-title">Your wire.</h1><p className="lead">Track what matters, keep private notes, and return to sources without turning your account into a public profile.</p><section className="account-card"><div className="avatar">TP</div><div><p className="eyebrow">ACCOUNT</p><h2>Not signed in yet</h2><p>Create a free account to keep saved topics, alerts, and your board across devices.</p></div><Link href="/sign-in" className="primary-button">Create account / sign in</Link></section><section className="board-section"><div><p className="eyebrow">YOUR BOARD</p><h2>Keep the thread.</h2></div><p>This private demo board is stored only in this browser. It will move to secure account storage after authentication and the database are connected.</p><label className="note-label">Private note<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Save a question, source to revisit, or detail to check later." /></label><button type="button" className="primary-button" onClick={saveNote}>{saved ? "Saved" : "Save note"}</button></section><section className="saved-topics"><p className="eyebrow">START TRACKING</p><h2>Topics you can follow</h2>{topics.map((topic) => <Link className="saved-topic" href={`/topics/${topic.id}`} key={topic.id}><span>{topic.kind}</span><strong>{topic.title}</strong><small>{topic.updated}</small></Link>)}</section></main>;
}
