import { apiGet, apiPut, apiDelete } from '../api.js';
import { navigate } from '../navigate.js';
import { showGlobalError } from '../main.js';

export async function showUser() {
  document.title = 'Пользователь';
  const nav = document.getElementById('nav');
  nav.hidden = false;

  const id = new URLSearchParams(location.search).get('id');
  let user;
  try {
    const resp = await apiGet(`/users/${id}`);
    if (!resp || typeof resp !== 'object' || !resp.username) {
      showGlobalError('Пользователь не найден или ошибка API');
      return;
    }
    user = resp;
  } catch (err) {
    showGlobalError(err);
    return;
  }

  const container = document.getElementById('userPage');
  container.hidden = false;
  container.innerHTML = `
    <h1>Редактировать ${user.username}</h1>
    <form id="userForm">
      <label>Username: <input name="username" value="${user.username}" required /></label>
      <label>Имя: <input name="first_name" value="${user.first_name || ''}" required /></label>
      <label>Фамилия: <input name="last_name" value="${user.last_name || ''}" required /></label>
      <label>Gender:
        <select name="gender" required>
          <option value="male" ${user.gender==='male'?'selected':''}>Male</option>
          <option value="female" ${user.gender==='female'?'selected':''}>Female</option>
          <option value="other" ${user.gender==='other'?'selected':''}>Other</option>
        </select>
      </label>
      <label>Дата рождения: <input type="date" name="birthdate" value="${user.birthdate || ''}" required /></label>
      <button>Сохранить</button>
      <button type="button" id="delBtn">Удалить</button>
    </form>
  `;

  container.querySelector('#userForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const resp = await apiPut(`/users/${id}`, { ...data });
      if (!resp || resp.error) {
        showGlobalError(resp?.error || 'Ошибка при сохранении');
        return;
      }
      navigate('/users');
      location.reload();
    } catch (err) {
      showGlobalError(err);
    }
  });

  container.querySelector('#delBtn').addEventListener('click', async () => {
    try {
      const resp = await apiDelete(`/users/${id}`);
      if (!resp || resp.error) {
        showGlobalError(resp?.error || 'Ошибка при удалении');
        return;
      }
      navigate('/users');
      location.reload();
    } catch (err) {
      showGlobalError(err);
    }
  });
}

if (location.pathname === '/user') {
  document.addEventListener('DOMContentLoaded', showUser);
}