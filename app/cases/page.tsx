import { FeedCard } from "@/components/FeedCard";
import { topics } from "@/data/topics";

export default function CasesPage() {
  return <main className="page-shell"><p className="eyebrow">TOPIC FILES</p><h1 className="page-title">Cases & public files</h1><div className="feed-list">{topics.map((topic) => <FeedCard topic={topic} key={topic.id} />)}</div></main>;
}
