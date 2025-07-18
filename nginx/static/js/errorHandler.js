export function showGlobalError(err) {
    const text = err?.message || err;
    console.error(text);
    
    const existingError = document.getElementById('globalError');
    if (existingError) {
        existingError.remove();
    }
    
    const div = document.createElement('div');
    div.id = 'globalError';
    div.style.cssText = `
        position: fixed; top: 10px; right: 10px;
        background: var(--danger); color: #fff;
        padding: 0.5rem 1rem; border-radius: 4px;
        z-index: 9999; max-width: 300px; word-break: break-word;
    `;
    div.textContent = text;
    document.body.appendChild(div);
    
    setTimeout(() => div.remove(), 5000);
}

export function initErrorHandlers() {
    window.addEventListener('error', showGlobalError);
    window.addEventListener('unhandledrejection', e => {
        e.preventDefault();
        showGlobalError(e.reason);
    });
}