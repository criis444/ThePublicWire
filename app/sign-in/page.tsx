"use client";

import { useState } from "react";

export default function SignInPage() {
  const [notice, setNotice] = useState(false);
  return <main className="page-shell auth-page"><section className="auth-card"><p className="eyebrow">THEPUBLICWIRE ACCOUNT</p><h1>Keep your wire close.</h1><p>Save topics, follow updates, keep private board notes, and join source-based discussion spaces. Free to use—no membership required.</p><div className="provider-row"><button type="button" onClick={() => setNotice(true)}>Continue with Google</button><button type="button" onClick={() => setNotice(true)}>Continue with Apple</button></div><div className="divider"><span>or</span></div><form className="share-form" onSubmit={(event) => { event.preventDefault(); setNotice(true); }}><label>Email<input required type="email" placeholder="you@example.com" /></label><label>Password<input required type="password" placeholder="Create or enter a password" /></label><button className="primary-button">Continue</button></form>{notice && <div className="auth-notice"><strong>Account wiring is next.</strong><p>This screen is ready for secure authentication. Google, Apple, email verification, password reset, rate limiting, and database storage must be connected before launch.</p></div>}</section></main>;
}
