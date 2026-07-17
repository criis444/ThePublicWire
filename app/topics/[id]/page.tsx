import Link from "next/link";
import { getTopic } from "@/data/topics";

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = getTopic(id);
  if (!topic) return <main className="page-shell"><h1 className="page-title">Topic not found</h1></main>;

  return (
    <main className="page-shell topic-page">
      <section className="topic-hero"><p className="eyebrow">{topic.kind} · {topic.location}</p><h1>{topic.title}</h1><p>{topic.summary}</p><div className="hero-chips"><span className="source-chip">✓ {topic.sourceStatus}</span><span className="status-chip">{topic.status}</span><span>{topic.updated}</span></div></section>
      <section className="topic-grid">
        <div className="panel"><p className="eyebrow">WHAT WE KNOW</p><h2>Timeline</h2>{topic.timeline.map((entry) => <div className="timeline" key={entry.date}><span>{entry.date}</span><p>{entry.text}</p></div>)}</div>
        <div className="panel"><p className="eyebrow">SOURCE TRAIL</p><h2>Where this comes from</h2>{topic.sources.map((source) => <div className="source-row" key={source.label}><strong>{source.label}</strong><span>{source.detail}</span></div>)}</div>
      </section>
      <section className="panel discussion-panel"><p className="eyebrow">NO COMMENT SECTION</p><h2>Discussion happens in a separate space.</h2><p>Bring sources, questions, or clearly labeled analysis. Personal information, harassment, hate speech, sexual content, and unsupported accusations are removed.</p><Link className="primary-button" href={`/discussions?topic=${topic.id}`}>Enter discussion space</Link></section>
      <section className="topic-actions"><Link href="/share">Share information</Link><Link href="/support">Verified support</Link><Link href="/ai">Ask ThePublicWire AI</Link></section>
    </main>
  );
}
