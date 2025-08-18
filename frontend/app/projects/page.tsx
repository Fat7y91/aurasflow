'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '../../src/lib/api';

type Project = {
  id: string;
  name: string;
  ownerId: string;
  brandJson?: { primaryColor?: string } | null;
  createdAt: string;
  updatedAt: string;
};

type PaginatedResponse = {
  items: Project[];
  page: number;
  limit: number;
  total: number;
  pageCount: number;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);

  const [name, setName] = useState('My First Project');
  const [primaryColor, setPrimaryColor] = useState('#5B8DEF');
  const [creating, setCreating] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function loadPage(page: number, append = false) {
    const isFirstLoad = page === 1 && !append;
    if (isFirstLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setErr(null);
    
    try {
      const data = await apiGet<PaginatedResponse>(`/api/projects?page=${page}&limit=10`);
      
      if (append) {
        setProjects(prev => [...prev, ...data.items]);
      } else {
        setProjects(data.items);
      }
      
      setCurrentPage(data.page);
      setPageCount(data.pageCount);
      setTotal(data.total);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  async function loadMore() {
    if (currentPage < pageCount && !loadingMore) {
      await loadPage(currentPage + 1, true);
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
      // Reload first page to show new project
      await loadPage(1, false);
    } catch (e: any) {
      setErr(e?.message || 'Failed to create');
    } finally {
      setCreating(false);
    }
  }

  async function logout() {
    try {
      setLoggingOut(true);
      // Call the API logout route to clear server-side cookie
      await fetch('/api/logout');
      // Clear client-side token
      localStorage.removeItem('access_token');
      // Redirect to login
      location.href = '/login';
    } catch (e) {
      // Even if the API call fails, still clear localStorage and redirect
      localStorage.removeItem('access_token');
      location.href = '/login';
    }
  }

  useEffect(() => { 
    loadPage(1, false); 
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 12 }}>Projects</h1>

      <button 
        onClick={logout} 
        disabled={loggingOut}
        style={{ 
          marginBottom: 16,
          cursor: loggingOut ? 'not-allowed' : 'pointer',
          opacity: loggingOut ? 0.6 : 1
        }}
      >
        {loggingOut ? 'Logging out…' : 'Log out'}
      </button>

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

      {!loading && (
        <>
          {total > 0 && (
            <p style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
              Showing {projects.length} of {total} projects
            </p>
          )}
          
          <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gap:12 }}>
            {projects.length === 0 && <li>No projects yet.</li>}
            {projects.map(p => (
              <li key={p.id} style={{ border:'1px solid #eee', padding:12, borderRadius:8 }}>
                <Link href={`/projects/${p.id}`} style={{ textDecoration:'none', color:'inherit' }}>
                  <div style={{ fontWeight:600 }}>{p.name}</div>
                  <div style={{ fontSize:12, color:'#555' }}>id: {p.id} • owner: {p.ownerId}</div>
                  {p.brandJson?.primaryColor && (
                    <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:12 }}>primaryColor:</span>
                      <span style={{ display:'inline-block', width:16, height:16, borderRadius:4, border:'1px solid #ddd', background:p.brandJson.primaryColor }} />
                      <code style={{ fontSize:12 }}>{p.brandJson.primaryColor}</code>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Load More Button */}
          {projects.length > 0 && currentPage < pageCount && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                onClick={loadMore}
                disabled={loadingMore}
                style={{
                  padding: '12px 24px',
                  background: loadingMore ? '#ccc' : '#007bff',
                  color: '#fff',
                  border: 0,
                  borderRadius: 4,
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  fontSize: 14
                }}
              >
                {loadingMore ? 'Loading…' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
