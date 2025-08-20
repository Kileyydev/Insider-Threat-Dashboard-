// lib/api.ts
const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000/api';

function authHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = '';
    try {
      msg = await res.text();
    } catch {
      msg = String(res.status);
    }
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ----------- GET -----------
export async function apiGet<T = any>(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers: { ...authHeader() } });
  return handleResponse<T>(res);
}

// ----------- POST -----------
export async function apiPost<T = any>(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

// ----------- PUT -----------
export async function apiPut<T = any>(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

// ----------- PATCH -----------
export async function apiPatch<T = any>(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

// ----------- DELETE -----------
export async function apiDelete<T = any>(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (res.status === 204) return null as T; // no content
  return handleResponse<T>(res);
}

// ----------- FILE UPLOAD -----------
export async function apiUpload<T = any>(path: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { ...authHeader() }, // don’t set Content-Type; browser handles it
    body: formData,
  });
  return handleResponse<T>(res);
}

// ----------- RAW GET WITH TOKEN (optional override) -----------
export async function apiGetWithAuth(url: string, token: string | null) {
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include', // if also using cookies
  });
  return handleResponse(res);
}
