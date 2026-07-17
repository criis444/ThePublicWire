export type SourceStatus = "Verified" | "Developing" | "Community analysis";

export type Topic = {
  id: string;
  kind: "Case" | "Public affairs" | "Court update" | "World event";
  title: string;
  summary: string;
  location: string;
  status: "Active" | "Under review" | "Resolved";
  sourceStatus: SourceStatus;
  updated: string;
  savedCount: string;
  discussionCount: string;
  mediaLabel: string;
  sources: { label: string; detail: string }[];
  timeline: { date: string; text: string }[];
};

export const topics: Topic[] = [
  {
    id: "river-search-update",
    kind: "Case",
    title: "River search update",
    summary:
      "A model topic showing how ThePublicWire groups an official update, source context, and a separate discussion space.",
    location: "United States",
    status: "Active",
    sourceStatus: "Verified",
    updated: "Updated 42 minutes ago",
    savedCount: "42.8K",
    discussionCount: "1.2K",
    mediaLabel: "Official update • video briefing",
    sources: [
      { label: "Official agency statement", detail: "Primary public update" },
      { label: "Local news reporting", detail: "Context and published recap" },
    ],
    timeline: [
      { date: "Today", text: "Public update added to the topic file." },
      { date: "Yesterday", text: "Source review opened for new reporting." },
    ],
  },
  {
    id: "public-records-explained",
    kind: "Court update",
    title: "New public records: what changed",
    summary:
      "A factual breakdown format for helping people understand newly released public material without replacing the original record.",
    location: "Public record",
    status: "Under review",
    sourceStatus: "Developing",
    updated: "Updated 2 hours ago",
    savedCount: "18.4K",
    discussionCount: "684",
    mediaLabel: "Document walkthrough • source links",
    sources: [
      { label: "Public filing", detail: "Original document" },
      { label: "Reporting roundup", detail: "Independent coverage" },
    ],
    timeline: [
      { date: "Today", text: "New record added for review." },
      { date: "Yesterday", text: "Topic opened after publication." },
    ],
  },
  {
    id: "community-policy-response",
    kind: "Public affairs",
    title: "Policy response: what the proposal says",
    summary:
      "A public-affairs topic with the primary document, reporting, and a place for source-backed perspectives.",
    location: "Public affairs",
    status: "Under review",
    sourceStatus: "Verified",
    updated: "Updated today",
    savedCount: "9.7K",
    discussionCount: "932",
    mediaLabel: "News clip • primary document",
    sources: [
      { label: "Primary policy document", detail: "Official publication" },
      { label: "Explainer reporting", detail: "Multiple outlets" },
    ],
    timeline: [
      { date: "Today", text: "Topic file created from primary materials." },
      { date: "This week", text: "Public response and reporting added." },
    ],
  },
];

export const getTopic = (id: string) => topics.find((topic) => topic.id === id);
