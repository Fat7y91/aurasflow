'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function LoginPage() {
  const [email, setEmail] = useState('test3@example.com');
  const [password, setPassword] = useState('secret123');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get('from') || '/projects';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErr(null);

    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const txt = await r.text();
      let data: any;
      try { data = JSON.parse(txt); } catch { data = { message: txt }; }

      if (!r.ok) {
        throw new Error(data?.message || `HTTP ${r.status}: ${txt}`);
      }

      // الكوكي اتكتب من الـ API route
      router.replace(redirectTo);
    } catch (e: any) {
      setErr(e?.message || 'fetch failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: '48px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 16 }}>Login</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, border: '1px solid #ddd' }}
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, border: '1px solid #ddd' }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{ padding: 12, background: '#111', color: '#fff', border: 0 }}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <div style={{ fontSize: 12, color: '#666' }}>Using API: {API_URL}</div>
        {err && <div style={{ color: 'crimson' }}>{err}</div>}
      </form>
    </main>
  );
}
