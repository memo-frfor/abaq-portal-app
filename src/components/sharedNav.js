import { showToast } from '../utils/toast.js';

const PARENT_TABS = [
  { route: '/home', icon: 'cottage', label: 'الرئيسية' },
  { route: '/homework', icon: 'assignment', label: 'الواجبات' },
  { route: '/grades', icon: 'bar_chart', label: 'التقارير' },
  { route: '/notifications', icon: 'notifications', label: 'الإشعارات', badge: 3 },
  { route: '/account', icon: 'widgets', label: 'المزيد' },
];

export function renderSharedParentBottomNav(activeRoute) {
  const nav = document.createElement('nav');
  nav.className =
    'fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]';
  nav.setAttribute('data-shared-nav', 'parent');

  const itemsHtml = PARENT_TABS.map((tab) => {
    const isActive = activeRoute === tab.route;
    const colorClass = isActive
      ? 'text-secondary font-semibold'
      : 'text-on-surface-variant hover:text-on-surface';
    const badgeHtml = tab.badge
      ? `<span class="absolute top-1.5 left-3 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-error text-on-error font-label-sm text-[9px]">${tab.badge}</span>`
      : '';
    const fillStyle = isActive ? `style="font-variation-settings: 'FILL' 1;"` : '';
    return `
      <button type="button" data-nav-route="${tab.route}"
        class="relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] w-16 transition-colors ${colorClass}">
        <span class="material-symbols-outlined text-[22px]" ${fillStyle}>${tab.icon}</span>
        ${badgeHtml}
        <span class="font-label-sm text-label-sm mt-0.5">${tab.label}</span>
      </button>
    `;
  }).join('');

  nav.innerHTML = `<div class="flex justify-around items-center h-16 px-space-sm">${itemsHtml}</div>`;
  return nav;
}

export function attachParentHeaderActions(container, navigate, state, onStudentSwitch) {
  const header = container.querySelector('header');
  if (!header) return;

  // Wire menu button -> Account & Settings
  header.querySelectorAll('button').forEach((btn) => {
    const icon = btn.querySelector('.material-symbols-outlined')?.textContent?.trim();
    const text = btn.textContent || '';

    if (icon === 'menu' || icon === 'settings') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/account');
      });
    } else if (icon === 'notifications' || icon === 'notifications_active') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = container.querySelector('#announcement-modal');
        if (modal) {
          modal.classList.remove('hidden');
        } else {
          showToast('لديك إشعارات مدرسية جديدة');
        }
      });
    } else if (icon === 'sync_alt' || text.includes('سارة (ابتدائي)') || text.includes('عبدالرحمن')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (onStudentSwitch) {
          onStudentSwitch();
        } else {
          state.activeStudent = state.activeStudent === 'abdulrahman' ? 'sara' : 'abdulrahman';
          const label = state.activeStudent === 'sara' ? 'سارة محمد العتيبي (ابتدائي)' : 'عبدالرحمن محمد العتيبي (متوسط)';
          showToast(`تم التبديل إلى ملف: ${label}`);
        }
      });
    }
  });
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
        else showToast('عرض جدول الحصص الأسبوعي');
      } else if (text.includes('المحادثات')) {
        showToast('قسم المحادثات المدرسية');
      }
    });
  });
}
