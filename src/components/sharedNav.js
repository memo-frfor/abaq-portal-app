import { portalStore } from '../store/portalStore.js';
import { t } from '../services/i18n.js';

export function renderSharedParentBottomNav(activeRoute, navigate) {
  const PARENT_TABS = [
    { route: '/home', icon: 'cottage', label: t('home') },
    { route: '/homework', icon: 'assignment', label: t('homework') },
    { route: '/grades', icon: 'bar_chart', label: t('grades') },
    { route: '/schedule', icon: 'calendar_month', label: t('schedule') },
    { route: '/account', icon: 'person', label: t('account') },
  ];

  const nav = document.createElement('nav');
  nav.className =
    'fixed bottom-3 inset-x-0 z-40 px-3 pointer-events-none transition-all duration-300';
  nav.setAttribute('data-shared-nav', 'parent');

  const itemsHtml = PARENT_TABS.map((tab) => {
    const isActive = activeRoute === tab.route;
    return `
      <button type="button" data-nav-route="${tab.route}"
        class="relative flex items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 press-tactile ${
          isActive
            ? 'bg-gradient-to-l from-[#0E9CAC] to-[#0a7a8b] text-white shadow-md shadow-[#0E9CAC]/35 font-bold scale-[1.02]'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
        }">
        <span class="material-symbols-outlined text-[20px] shrink-0" ${
          isActive ? `style="font-variation-settings: 'FILL' 1;"` : ''
        }>${tab.icon}</span>
        ${
          isActive
            ? `<span class="text-xs font-bold mr-1.5 whitespace-nowrap">${tab.label}</span>`
            : ''
        }
      </button>
    `;
  }).join('');

  nav.innerHTML = `
    <div class="max-w-sm mx-auto pointer-events-auto floating-glass-nav rounded-3xl p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.12)] flex items-center justify-around gap-1">
      ${itemsHtml}
    </div>
  `;

  nav.querySelectorAll('[data-nav-route]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-nav-route');
      navigate(target);
    });
  });

  return nav;
}

export function wireTeacherBottomNav(container, navigate, activeRoute) {
  const nav = container.querySelector('nav');
  if (!nav) return;

  nav.querySelectorAll('a, button').forEach((el) => {
    const text = el.textContent || '';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (text.includes('الواجبات')) {
        navigate('/teacher/create-task');
      } else if (text.includes('الرئيسية')) {
        navigate('/teacher');
      } else if (text.includes('الجدول')) {
        if (activeRoute !== '/teacher') navigate('/teacher');
      } else if (text.includes('خروج')) {
        navigate('/login', { replace: true });
      }
    });
  });
}
