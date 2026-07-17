"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { topics, type Topic } from "@/data/topics";

const filters: ("All" | Topic["kind"])[] = ["All", "Case", "Public affairs", "Court update", "World event"];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const results = useMemo(() => topics.filter((topic) => {
    const matchesFilter = filter === "All" || topic.kind === filter;
    const searchable = `${topic.title} ${topic.kind} ${topic.location} ${topic.summary} ${topic.sourceStatus}`.toLowerCase();
    return matchesFilter && searchable.includes(query.toLowerCase());
  }), [filter, query]);
  return <main className="page-shell"><section className="explore-hero"><p className="eyebrow">EXPLORE</p><h1 className="page-title">Follow the thread.</h1><p className="lead">Search the public wire by what matters to you—cases, public affairs, court updates, or a discussion worth entering.</p><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics, discussions, and sources" /></section><section className="explore-feature"><div><p className="eyebrow">ON THE WIRE</p><h2>Stories people are tracking right now.</h2><p>Each topic keeps its sources, timeline, and discussion space together.</p></div><Link href={`/topics/${topics[0].id}`}>Open featured topic →</Link></section><div className="filter-row">{filters.map((item) => <button onClick={() => setFilter(item)} className={filter === item ? "active" : ""} key={item}>{item}</button>)}</div><section className="result-list" aria-live="polite">{results.length ? results.map((topic) => <Link href={`/topics/${topic.id}`} key={topic.id} className="result-row"><div><p className="eyebrow">{topic.kind} · {topic.sourceStatus}</p><h2>{topic.title}</h2><p>{topic.summary}</p></div><span>{topic.updated} →</span></Link>) : <div className="empty-state"><h2>Nothing matched that yet.</h2><p>Try a broader search or look through the categories above.</p></div>}</section><section className="discover-discussions"><p className="eyebrow">DISCUSSION SPACES</p><h2>Talk around a source. Keep it connected to the story.</h2><Link className="primary-button" href="/discussions">Discover discussions</Link></section></main>;
}
