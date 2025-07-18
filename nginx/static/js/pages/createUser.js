import { apiPost } from '../api.js';
import { navigate } from '../navigate.js';
import { showGlobalError } from '../main.js';

export async function showCreateUser() {
  document.title = 'Создать пользователя';
  document.querySelectorAll('section').forEach(s => s.hidden = true);
  const container = document.getElementById('createUserPage');
  container.hidden = false;
  container.innerHTML = `
    <h1>Создать пользователя</h1>
    <form id="createUserForm">
      <label>Логин <input name="username" required /></label>
      <label>Пароль <input type="password" name="password" required /></label>
      <label>Имя <input name="first_name" required /></label>
      <label>Фамилия <input name="last_name" required /></label>
      <label>Пол
        <select name="gender" required>
          <option value="">Выберите пол</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другое</option>
        </select>
      </label>
      <label>Дата рождения <input type="date" name="birthdate" required /></label>
      <button>Создать</button>
      <button type="button" id="cancelBtn">Отмена</button>
    </form>
  `;

  container.querySelector('#createUserForm').addEventListener('submit', async e => {
    e.preventDefault();
    const { username, password, first_name, last_name, gender, birthdate } = e.target.elements;
    try {
      const resp = await apiPost('/users', {
        username: username.value,
        password: password.value,
        first_name: first_name.value,
        last_name: last_name.value,
        gender: gender.value,
        birthdate: birthdate.value
      });
      if (!resp || resp.error) {
        showGlobalError(resp?.error || 'Ошибка создания пользователя');
        return;
      }
      navigate('/users');
      location.reload();
    } catch (err) {
      showGlobalError(err);
    }
  });

  container.querySelector('#cancelBtn').addEventListener('click', () => {
    navigate('/users');
    location.reload();
  });
} 