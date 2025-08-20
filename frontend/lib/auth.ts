// Utility function to get access token from localStorage
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Get token from cookie (for server-side or verification)
export function getTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access_token') {
      return value || null;
    }
  }
  return null;
}

// Check if user is authenticated (checks both localStorage and cookie)
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const localToken = getAccessToken();
  const cookieToken = getTokenFromCookie();
  
  // Validate that token exists and is not empty
  const validLocalToken = localToken && localToken.trim() && localToken !== 'undefined' && localToken !== 'null';
  const validCookieToken = cookieToken && cookieToken.trim() && cookieToken !== 'undefined' && cookieToken !== 'null';
  
  // If we have valid localStorage token, use it
  if (validLocalToken) {
    return true;
  }
  
  // If we have valid cookie token but no localStorage, sync them
  if (validCookieToken && !validLocalToken) {
    console.log('Auth: Syncing cookie token to localStorage');
    localStorage.setItem('access_token', cookieToken);
    return true;
  }
  
  return false;
}

// Clear authentication and dispatch auth change event
export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    console.log('Auth: Clearing token from localStorage and cookie');
    
    // Clear from localStorage
    localStorage.removeItem('access_token');
    
    // Clear from cookie
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Dispatch custom event for auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged'));
    console.log('Auth: Token cleared and event dispatched');
  }
}

// Save token and dispatch auth change event
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    console.log('Auth: Saving token to localStorage and cookie');
    
    // Save to localStorage for client-side checks
    localStorage.setItem('access_token', token);
    
    // Save to cookie for middleware/server-side checks
    document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
    
    // Dispatch custom event for auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged'));
    console.log('Auth: Token saved and event dispatched');
  }
}

// Add auth change listener
export function onAuthChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'access_token') {
      callback();
    }
  };
  
  const handleAuthStateChange = () => {
    callback();
  };
  
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('authStateChanged', handleAuthStateChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('authStateChanged', handleAuthStateChange);
  };
}
