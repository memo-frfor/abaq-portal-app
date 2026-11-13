// theme.js - Complete Dark/Light Mode Management
const THEME_KEY = 'abaq_theme_mode_v2';

export function initTheme() {
  const saved = getStoredTheme();
  applyTheme(saved);
  
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const current = getStoredTheme();
      if (current === 'system') {
        applyTheme('system');
      }
    });
  }
}

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(mode) {
  const isDark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {}

  return isDark;
}

export function toggleTheme() {
  const current = getStoredTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
