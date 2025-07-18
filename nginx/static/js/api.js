const API_BASE = '/api';

export async function apiGet(path, params = {}) {
  const url = new URL(API_BASE + path, window.location.origin);
  Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));
  return fetch(url, { credentials: 'include' }).then(r => r.json());
}

export async function apiPost(path, body) {
  return fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include'
  }).then(r => r.json());
}

export async function apiPut(path, body) {
  return fetch(API_BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include'
  }).then(r => r.json());
}

export async function apiDelete(path) {
  return fetch(API_BASE + path, {
    method: 'DELETE',
    credentials: 'include'
  }).then(r => r.json());
}