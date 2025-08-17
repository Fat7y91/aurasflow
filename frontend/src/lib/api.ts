export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

function authHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = window.localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${path} -> ${res.status}: ${text}`);
  }
  return res.json();
}

// POST
export async function apiPost<T>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`POST ${path} -> ${res.status}: ${text}`);
  }
  return res.json();
}

// PATCH
export async function apiPatch<T>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`PATCH ${path} -> ${res.status}: ${text}`);
  }
  return res.json();
}

// DELETE
export async function apiDelete<T = any>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`DELETE ${path} -> ${res.status}: ${text}`);
  }
  
  // DELETE might return empty response
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
