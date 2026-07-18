"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice(
      "Account created. Check your email to confirm your account."
    );
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Signed in successfully.");

    router.push("/you");
  }

  return (
    <main className="page-shell auth-page">
      <section className="auth-card">
        <p className="eyebrow">
          THEPUBLICWIRE ACCOUNT
        </p>

        <h1>
          Keep your wire close.
        </h1>

        <p>
          Save topics, submit evidence, and participate in source-based discussions.
        </p>

        <form className="share-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              required
            />
          </label>

          <button
            type="button"
            className="primary-button"
            onClick={signIn}
          >
            Sign in
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={signUp}
          >
            Create account
          </button>
        </form>

        {notice && (
          <div className="auth-notice">
            {notice}
          </div>
        )}
      </section>
    </main>
  );
}