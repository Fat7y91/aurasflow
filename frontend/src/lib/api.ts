// Core fetch wrapper for Next.js API routes
async function apiFetch<T>(
  path: string,
  method: string,
  body?: unknown
): Promise<T> {
  // Ensure we're calling Next.js API routes
  const url = path.startsWith('/api/') ? path : `/api${path.startsWith('/') ? path : '/' + path}`;
  
  console.log(`API ${method} request to:`, url);
  
  const headers: Record<string, string> = {};
  
  // Add Content-Type for methods that send body
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    // Ensure credentials (cookies) are sent with requests
    credentials: 'include',
    // Don't cache responses
    cache: 'no-store',
  });
  
  console.log(`API ${method} response:`, response.status, response.statusText);
  
  // Handle non-ok responses
  if (!response.ok) {
    console.error(`API Error - URL: ${url}, Status: ${response.status}`);
    const data = await response.json().catch(() => ({}));
    const message = data.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  // Handle empty responses (common for DELETE)
  const text = await response.text();
  return text ? JSON.parse(text) : (null as T);
}// GET request
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
