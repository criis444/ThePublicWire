"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Topic } from "@/data/topics";

const SAVED_KEY = "thepublicwire-saved-topics";

export function FeedCard({ topic }: { topic: Topic }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => { const ids: string[] = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? "[]"); setSaved(ids.includes(topic.id)); }, [topic.id]);
  function toggleSave() { const ids: string[] = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? "[]"); const next = saved ? ids.filter((id) => id !== topic.id) : [...new Set([...ids, topic.id])]; window.localStorage.setItem(SAVED_KEY, JSON.stringify(next)); setSaved(!saved); }
  return <article className="feed-card"><div className="feed-media" aria-label={topic.mediaLabel}><span className="feed-live">{topic.sourceStatus === "Verified" ? "CHECKED" : "DEVELOPING"}</span><div><p className="eyebrow">{topic.kind}</p><p className="feed-media-label">{topic.mediaLabel}</p></div></div><div className="feed-copy"><div className="feed-meta"><span>{topic.status}</span><span>{topic.updated}</span></div><h2>{topic.title}</h2><p>{topic.summary}</p><div className="source-chip"><span>✓</span> {topic.sourceStatus} information</div><div className="feed-actions"><span>📌 {topic.savedCount} tracking this</span><button onClick={toggleSave}>{saved ? "✓ Saved" : "🔖 Save"}</button><button onClick={() => navigator.share?.({ title: topic.title, text: topic.summary, url: `${window.location.origin}/topics/${topic.id}` })}>↗ Share</button></div><div className="feed-links"><Link href={`/topics/${topic.id}`}>Open topic</Link><Link href={`/discussions?topic=${topic.id}`}>↗ Discussion space · {topic.discussionCount}</Link></div></div></article>;
}
