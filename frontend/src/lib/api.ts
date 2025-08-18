// Base API URL from environment
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Get auth headers with token from localStorage
function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Handle 401 responses by clearing token and redirecting to login
function handle401() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('access_token');
  const currentPath = window.location.pathname;
  window.location.href = `/login?from=${encodeURIComponent(currentPath)}`;
}

// Core fetch wrapper
async function apiFetch<T>(
  path: string,
  method: string,
  body?: unknown
): Promise<T> {
  const url = path.startsWith('/') ? `${BASE_URL}${path}` : path;
  
  const headers: Record<string, string> = {
    ...getAuthHeaders(),
  };
  
  // Add Content-Type for methods that send body
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  
  // Handle 401 responses
  if (response.status === 401) {
    handle401();
    throw new Error('Unauthorized - redirecting to login');
  }
  
  // Handle other non-ok responses
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = data.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }
  
  // Handle empty responses (common for DELETE)
  const text = await response.text();
  return text ? JSON.parse(text) : (null as T);
}

// GET request
export async function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path, 'GET');
}

// POST request
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, 'POST', body);
}

// PATCH request
export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, 'PATCH', body);
}

// DELETE request
export async function apiDelete<T = void>(path: string): Promise<T> {
  return apiFetch<T>(path, 'DELETE');
}
