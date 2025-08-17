'use client';

import React, { useEffect, useState } from 'react';

type Project = {
  id: string;
  name: string;
  ownerId: string;
  brandJson?: { primaryColor?: string } | null;
  createdAt: string;
  updatedAt: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState('My First Project');
  const [primaryColor, setPrimaryColor] = useState('#5B8DEF');
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch('/api/projects', { cache: 'no-store' });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.message || `HTTP ${r.status}`);
      setProjects(data || []);
    } catch (e:any) {
      setErr(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (creating) return;
    setCreating(true);
    setErr(null);
    try {
      const r = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, brandJson: { primaryColor } }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.message || `HTTP ${r.status}`);
      await load();
    } catch (e:any) {
      setErr(e?.message || 'Failed to create');
    } finally {
      setCreating(false);
    }
  }

  async function logout() {
    await fetch('/api/logout');
    location.href = '/login';
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 12 }}>Projects</h1>

      <button onClick={logout} style={{ marginBottom: 16 }}>Log out</button>

      <form onSubmit={create} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 200px 120px', alignItems: 'end', marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} required style={{ width:'100%', padding:8, border:'1px solid #ddd' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Primary Color</label>
          <input value={primaryColor} onChange={(e)=>setPrimaryColor(e.target.value)} required style={{ width:'100%', padding:8, border:'1px solid #ddd' }} />
        </div>
        <button disabled={creating} style={{ padding:'10px 12px', background:'#111', color:'#fff', border:0 }}>
          {creating ? 'Creating…' : 'Create'}
        </button>
      </form>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color:'crimson' }}>{err}</p>}

      {!loading && !err && (
        <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gap:12 }}>
          {projects.length === 0 && <li>No projects yet.</li>}
          {projects.map(p => (
            <li key={p.id} style={{ border:'1px solid #eee', padding:12, borderRadius:8 }}>
              <div style={{ fontWeight:600 }}>{p.name}</div>
              <div style={{ fontSize:12, color:'#555' }}>id: {p.id} • owner: {p.ownerId}</div>
              {p.brandJson?.primaryColor && (
                <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:12 }}>primaryColor:</span>
                  <span style={{ display:'inline-block', width:16, height:16, borderRadius:4, border:'1px solid #ddd', background:p.brandJson.primaryColor }} />
                  <code style={{ fontSize:12 }}>{p.brandJson.primaryColor}</code>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
