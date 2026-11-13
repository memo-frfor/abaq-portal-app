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
  const student = portalStore.getActiveStudent();
  const nav = document.createElement('nav');
  nav.className =
    'fixed bottom-0 w-full z-40 pb-safe glass-nav shadow-[0_-4px_24px_rgba(15,23,42,0.06)] transition-all';
  nav.setAttribute('data-shared-nav', 'parent');

  const itemsHtml = PARENT_TABS.map((tab) => {
    const isActive = activeRoute === tab.route;
    const colorClass = isActive ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600';
    const fillStyle = isActive ? `style="font-variation-settings: 'FILL' 1;"` : '';

    return `
      <button type="button" data-nav-route="${tab.route}"
        class="relative flex flex-col items-center justify-center min-w-[52px] min-h-[52px] py-1 transition-all press-snappy ${colorClass} ${
      isActive ? '-translate-y-0.5' : ''
    }">
        <span class="material-symbols-outlined text-[23px] transition-transform ${
          isActive ? 'scale-110' : ''
        }" ${fillStyle}>${tab.icon}</span>
        <span class="text-[11px] mt-0.5 leading-tight">${tab.label}</span>
        ${
          isActive
            ? '<span class="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -bottom-0.5"></span>'
            : ''
        }
      </button>
    `;
  }).join('');

  nav.innerHTML = `<div class="flex justify-around items-center h-16 max-w-lg mx-auto px-3">${itemsHtml}</div>`;

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
