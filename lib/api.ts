export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
export interface User { id: string; email: string; name: string; }
export interface LoginResponse { access_token: string; token_type: string; }
export interface Project { id: string; name: string; description: string; status: string; area_ha: number; }
// Add more types as needed

// Token Management
export const saveToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem('token', token);
};
export const getToken = () => {
  if (typeof window !== 'undefined') return localStorage.getItem('token');
  return null;
};
export const clearToken = () => {
  if (typeof window !== 'undefined') localStorage.removeItem('token');
};
export const isLoggedIn = () => !!getToken();

// API Helper
async function apiRequest(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let msg = 'API Error';
    try {
      const data = await res.json();
      msg = data.detail || msg;
    } catch (e) {}
    throw new Error(msg);
  }
  return res.json();
}

// API Functions
export const api = {
  auth: {
    login: (data: any) => apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => apiRequest('/api/users/me'),
  },
  projects: {
    fetchProjects: () => apiRequest('/api/projects'),
    fetchProject: (id: string) => apiRequest(`/api/projects/${id}`),
    createProject: (data: any) => apiRequest('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  },
  // Add more endpoint wrappers as needed
};
