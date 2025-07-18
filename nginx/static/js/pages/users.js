import { apiGet } from '../api.js';
import { showGlobalError } from '../main.js';
import { checkAuth } from '../auth.js';
import { navigate } from '../navigate.js';

let state = { page: 1, sortBy: 'username', sort: 'ASC', gender: '', search: '' };
const limit = 10;

export async function showUsers() {
  const authed = await checkAuth();
  if (!authed) {
    navigate('/login');
    location.reload();
    return;
  }

  document.title = 'Пользователи';
  const nav = document.getElementById('nav');
  nav.hidden = false;

  const container = document.getElementById('usersPage');
  container.hidden = false;
  container.innerHTML = '<h1>Загрузка...</h1>';

  try {
    const resp = await apiGet('/users', {
      page: state.page,
      limit,
      sortby: state.sortBy,
      sort: state.sort,
      gender: state.gender,
      search: state.search
    });
    const rows = Array.isArray(resp?.rows) ? resp.rows : [];
    const count = typeof resp?.count === 'number' ? resp.count : rows.length;

    const pages = Math.max(1, Math.ceil(count / limit));

    container.innerHTML = `
      <h1>Пользователи</h1>
      <div class="box">
        <button id="createUserBtn">Создать пользователя</button>
        <input id="searchInput" placeholder="Поиск..." value="${state.search}" />
        <table>
          <thead>
            <tr>
              <th class="sortable" data-col="id">ID ${sortArrow('id')}</th>
              <th class="sortable" data-col="username">Username ${sortArrow('username')}</th>
              <th class="sortable" data-col="first_name">First Name ${sortArrow('first_name')}</th>
              <th class="sortable" data-col="last_name">Last Name ${sortArrow('last_name')}</th>
              <th class="sortable" data-col="gender">Gender ${sortArrow('gender')}</th>
              <th class="sortable" data-col="birthdate">Birthdate ${sortArrow('birthdate')}</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(u => `
              <tr class="row" data-id="${u.id}">
                <td>${u.id}</td>
                <td>${u.username}</td>
                <td>${u.first_name || ''}</td>
                <td>${u.last_name || ''}</td>
                <td>${u.gender}</td>
                <td>${u.birthdate || ''}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div id="pagination">
        <button id="prevPage" ${state.page === 1 ? 'disabled' : ''}>Назад</button>
        <span>Страница ${state.page} из ${pages}</span>
        <button id="nextPage" ${state.page === pages ? 'disabled' : ''}>Вперёд</button>
      </div>
    `;

    container.querySelector('#createUserBtn').addEventListener('click', () => {
      navigate('/create-user');
      location.reload();
    });
    container.querySelectorAll('.row').forEach(r =>
      r.addEventListener('click', () => {
        navigate(`/user?id=${r.dataset.id}`);
        location.reload();
      })
    );
    container.querySelectorAll('.sortable').forEach(th =>
      th.addEventListener('click', () => toggleSort(th.dataset.col))
    );
    container.querySelector('#prevPage').addEventListener('click', () => {
      if (state.page > 1) {
        state.page--;
        showUsers();
      }
    });
    container.querySelector('#nextPage').addEventListener('click', () => {
      if (state.page < pages) {
        state.page++;
        showUsers();
      }
    });
    container.querySelector('#searchInput').addEventListener('input', debounce(e => {
      state.search = e.target.value.trim();
      state.page = 1;
      showUsers();
    }, 500));
  } catch (err) {
    showGlobalError(err);
  }
}

/* ---------- helpers ---------- */
function sortArrow(col) {
  return state.sortBy === col ? (state.sort === 'ASC' ? '▲' : '▼') : '';
}

function toggleSort(col) {
  state.sortBy = col;
  state.sort = state.sort === 'ASC' ? 'DESC' : 'ASC';
  showUsers();
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}