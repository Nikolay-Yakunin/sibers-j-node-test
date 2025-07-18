import { showLogin } from './pages/login.js';
import { showRegister } from './pages/register.js';
import { showUsers } from './pages/users.js';
import { showUser } from './pages/user.js';
import { showCreateUser } from './pages/createUser.js';
import { checkAuth } from './auth.js';
import { navigate } from './navigate.js';

const routes = {
    '/login': showLogin,
    '/register': showRegister,
    '/users': showUsers,
    '/user': showUser,
    '/create-user': showCreateUser
};

function navigateAndRoute(path) {
    navigate(path);
    handleRoute();
}

export async function handleRoute() {
    const path = location.pathname;
    const authed = await checkAuth();
    
    if (!authed && !['/login', '/register', '/create-user'].includes(path)) {
        navigateAndRoute('/login'); 
        return;
    }
    
    if (authed && ['/login', '/register'].includes(path)) {
        navigateAndRoute('/users'); 
        return;
    }
    
    const pageFn = routes[path] || routes['/login'];
    pageFn();
}

export function initRouter() {
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('DOMContentLoaded', handleRoute);
}

initRouter();