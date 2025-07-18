import { apiPost } from './api.js';
import { navigate } from './navigate.js';
import { showGlobalError } from './errorHandler.js';

export async function login(username, password) {
  try {
    const resp = await apiPost('/auth/login', { username, password });
    if (!resp || resp.error) {
      showGlobalError(resp?.error || 'Ошибка входа');
      return;
    }
    navigate('/users');
    location.reload();
  } catch (err) {
    showGlobalError(err);
  }
}

export async function register(username, password, first_name, last_name, gender, birthdate) {
  try {
    const resp = await apiPost('/users', { username, password, first_name, last_name, gender, birthdate });
    if (!resp || resp.error) {
      showGlobalError(resp?.error || 'Ошибка регистрации');
      return;
    }
    navigate('/login');
    location.reload();
  } catch (err) {
    showGlobalError(err);
  }
}

export async function logout() {
  try {
    const resp = await apiPost('/auth/logout', {});
    if (!resp || resp.error) {
      showGlobalError(resp?.error || 'Ошибка выхода');
      return;
    }
    navigate('/login');
    location.reload();
  } catch (err) {
    showGlobalError(err);
  }
}

export async function checkAuth() {
  try {
    const resp = await fetch('/api/me', { credentials: 'include' }); // cookie
    if (!resp.ok) throw new Error('Not authed');
    return true;
  } catch {
    return false;
  }
}