import { FeedCard } from "@/components/FeedCard";
import { topics } from "@/data/topics";
export default function NowPage() {
  return (
    <main className="page-shell now-shell">
      <section className="now-intro">
        <p className="eyebrow">THE PUBLIC WIRE</p>
        <h1>What is happening<br />right now.</h1>
        <p>Real events, source-backed perspectives, and places to talk—not a social network.</p>
      </section>
      <div className="topic-tabs"><span className="active">Now</span><span>Cases</span><span>Public affairs</span><span>Justice</span><span>World</span></div>
      <section className="feed-list" aria-label="Current topics">
        {topics.map((topic) => <FeedCard key={topic.id} topic={topic} />)}
      </section>
    </main>
  );
}
