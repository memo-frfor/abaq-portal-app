import { portalStore } from '../store/portalStore.js';
import { t } from '../services/i18n.js';

export function renderSharedParentBottomNav(activeRoute, navigate) {
  const PARENT_TABS = [
    { route: '/home', icon: 'cottage', labelKey: 'navHome' },
    { route: '/homework', icon: 'assignment', labelKey: 'navHomework' },
    { route: '/grades', icon: 'bar_chart', labelKey: 'navGrades' },
    { route: '/schedule', icon: 'calendar_month', labelKey: 'navSchedule' },
    { route: '/account', icon: 'person', labelKey: 'navAccount' },
  ];

  const nav = document.createElement('nav');
  nav.className =
    'fixed bottom-3 inset-x-0 z-40 px-3 pointer-events-none transition-all duration-300';
  nav.setAttribute('data-shared-nav', 'parent');

  const itemsHtml = PARENT_TABS.map((tab) => {
    const isActive = activeRoute === tab.route;
    const label = t(tab.labelKey);

    return `
      <button type="button" data-nav-route="${tab.route}"
        class="relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 press-tactile flex-1 ${
          isActive
            ? 'bg-[#0E9CAC]/15 dark:bg-[#0E9CAC]/25 text-[#0E9CAC] dark:text-[#7bcfd6] font-bold'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
        }">
        <span class="material-symbols-outlined text-[22px] transition-transform ${
          isActive ? 'scale-105' : ''
        }" style="${isActive ? "font-variation-settings: 'FILL' 1;" : ''}">${tab.icon}</span>
        <span class="text-[10px] leading-tight mt-0.5 whitespace-nowrap transition-colors ${
          isActive ? 'font-bold text-[#0E9CAC] dark:text-[#7bcfd6]' : 'font-medium'
        }">${label}</span>
      </button>
    `;
  }).join('');

  nav.innerHTML = `
    <div class="max-w-md mx-auto pointer-events-auto floating-glass-nav rounded-3xl p-1.5 shadow-[0_12px_36px_rgba(15,23,42,0.14)] flex items-center justify-around gap-1">
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
      if (text.includes('الواجبات') || text.toLowerCase().includes('homework')) {
        navigate('/teacher/create-task');
      } else if (text.includes('الرئيسية') || text.toLowerCase().includes('home')) {
        navigate('/teacher');
      } else if (text.includes('الجدول') || text.toLowerCase().includes('schedule')) {
        if (activeRoute !== '/teacher') navigate('/teacher');
      } else if (text.includes('خروج') || text.toLowerCase().includes('logout')) {
        navigate('/login', { replace: true });
      }
    });
  });
}
