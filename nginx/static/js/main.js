import { showGlobalError, initErrorHandlers } from './errorHandler.js';
import { handleRoute } from './router.js';
import { logout } from './auth.js';

initErrorHandlers();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleRoute);
} else {
    handleRoute();
}

document.getElementById('logoutBtn')?.addEventListener('click', logout);

export { showGlobalError };