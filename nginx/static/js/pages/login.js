import { login } from '../auth.js';
import { navigate } from '../navigate.js';

export function showLogin() {
  document.title = 'Вход';
  const nav = document.getElementById('nav');
  nav.hidden = true;

  const container = document.getElementById('loginPage');
  container.hidden = false;
  container.innerHTML = `
    <h1>Вход</h1>
    <form id="loginForm">
      <label>Логин <input name="username" required /></label>
      <label>Пароль <input type="password" name="password" required /></label>
      <button>Войти</button>
    </form>
    <p>Нет аккаунта? <a href="/register">Регистрация</a></p>
  `;

  container.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    await login(form.username.value, form.password.value).then(() => {
      navigate('/users');
      location.reload();
    }).catch(err => {
      showGlobalError(err);
    });
  });
}