"use client";

import { useState } from "react";
import { topics } from "@/data/topics";

type ContributionType = "source" | "video" | "perspective" | "document" | "discussion";

const choices: { id: ContributionType; title: string; detail: string; icon: string }[] = [
  { id: "source", icon: "↗", title: "Share a source", detail: "A news report, official statement, or public record." },
  { id: "video", icon: "◉", title: "Add a relevant clip", detail: "A factual video connected to a real topic—not unrelated content." },
  { id: "perspective", icon: "✦", title: "Post a perspective", detail: "Your analysis, clearly labeled and backed by sources." },
  { id: "document", icon: "▤", title: "Add a document", detail: "A public filing, report, or other material people can verify." },
  { id: "discussion", icon: "↝", title: "Open a discussion", detail: "A focused space for people to talk around a source or topic." },
];

export default function SharePage() {
  const [type, setType] = useState<ContributionType | null>(null);
  const [sent, setSent] = useState(false);
  const selected = choices.find((choice) => choice.id === type);

  if (sent) return <main className="page-shell narrow"><section className="submission-received"><p className="eyebrow">SUBMITTED</p><h1>Received for review.</h1><p>Your contribution is not public yet. The live version will check the source, relevance, privacy concerns, and community-rule compliance before it appears.</p><button className="primary-button" onClick={() => { setSent(false); setType(null); }}>Share something else</button></section></main>;

  return <main className="page-shell narrow"><p className="eyebrow">SHARE</p><h1 className="page-title">Put something useful on the wire.</h1><p className="lead">This is for real-world context—sources, relevant clips, and source-backed perspectives. It is not a creator upload page.</p><section className="contribution-choices">{choices.map((choice) => <button key={choice.id} className={`contribution-choice ${type === choice.id ? "selected" : ""}`} onClick={() => setType(choice.id)}><span>{choice.icon}</span><div><strong>{choice.title}</strong><p>{choice.detail}</p></div></button>)}</section>{selected && <form className="share-form contribution-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><div className="form-heading"><span>{selected.icon}</span><div><p className="eyebrow">{selected.title}</p><p>Give people a way to check what you are sharing.</p></div></div><label>Connect it to a topic<select required defaultValue=""><option value="" disabled>Choose a topic</option>{topics.map((topic) => <option key={topic.id}>{topic.title}</option>)}</select></label><label>Headline or clear title<input required placeholder="What should people understand first?" /></label><label>Original source link<input type="url" required placeholder="https://" /></label>{type === "video" && <label>What is in the clip?<textarea required placeholder="Explain the source, when it was published, and why it belongs with this topic." /></label>}{type === "perspective" && <label>What is your perspective?<textarea required placeholder="Separate what the source says from what you think it may mean." /></label>}{type === "discussion" && <label>What should this discussion focus on?<textarea required placeholder="Example: Compare two published timelines using the linked sources." /></label>}{(type === "source" || type === "document") && <label>Why does this matter?<textarea required placeholder="State the relevant information without making unsupported accusations." /></label>}<div className="rules-preview"><strong>Before you share</strong><span>Sources are required. Personal information, harassment, hate speech, sexual content, unrelated uploads, and unsupported accusations are removed.</span></div><label className="check"><input type="checkbox" required /> I confirm that I have a valid source and that this contribution follows ThePublicWire Community Rules.</label><button className="primary-button">Send for review</button></form>}</main>;
}
