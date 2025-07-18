export function navigate(path) {
    history.pushState(null, null, path);
} 