"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SubmitTipPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  async function submitTip(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("submissions")
      .insert([
        {
          title,
          description,
          category,
          status: "pending",
        },
      ]);

    if (error) {
      setMessage("Error submitting tip.");
      console.error(error);
      return;
    }

    setMessage("Tip submitted successfully.");
    setTitle("");
    setDescription("");
    setCategory("");
  }

  return (
    <main className="page-shell">
      <h1>Submit a Tip</h1>

      <form onSubmit={submitTip}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Describe what you know..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type="submit">
          Submit
        </button>
      </form>

      <p>{message}</p>
    </main>
  );
}
