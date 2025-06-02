"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../AuthForm.module.css";

const getApiURL = () => {
  return (process.env.NODE_ENV === "development") ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL
}

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${getApiURL()}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      console.log(err);
      setError("Network error");
    }
    setLoading(false);
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Signup</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className={styles.input}
        />

        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          className={styles.input}
        />

        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="At least 6 characters"
          className={styles.input}
        />

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
    </main>
  );
}
