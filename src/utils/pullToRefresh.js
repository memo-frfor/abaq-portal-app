// pullToRefresh.js - Smooth native pull-to-refresh touch gesture
import { portalStore } from '../store/portalStore.js';
import { showToast } from './toast.js';

export function setupPullToRefresh(container) {
  if (typeof window === 'undefined') return;

  let startY = 0;
  let currentY = 0;
  let isPulling = false;

  let indicator = document.getElementById('pull-refresh-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'pull-refresh-indicator';
    indicator.className =
      'fixed top-12 inset-x-0 mx-auto w-36 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 z-50 pointer-events-none transition-all duration-200 -translate-y-16 opacity-0';
    indicator.innerHTML = `
      <span class="material-symbols-outlined text-[18px] text-blue-600 animate-spin">sync</span>
      <span>جاري المزامنة...</span>
    `;
    document.body.appendChild(indicator);
  }

  container.addEventListener(
    'touchstart',
    (e) => {
      if (window.scrollY <= 5) {
        startY = e.touches[0].clientY;
        isPulling = true;
      } else {
        isPulling = false;
      }
    },
    { passive: true }
  );

  container.addEventListener(
    'touchmove',
    (e) => {
      if (!isPulling) return;
      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;

      if (pullDistance > 25 && pullDistance < 150) {
        indicator.style.opacity = `${Math.min(1, pullDistance / 70)}`;
        indicator.style.transform = `translateY(${Math.min(pullDistance - 15, 60)}px)`;
      }
    },
    { passive: true }
  );

  container.addEventListener(
    'touchend',
    async () => {
      if (!isPulling) return;
      const pullDistance = currentY - startY;
      isPulling = false;

      if (pullDistance > 65) {
        indicator.style.transform = 'translateY(55px)';
        indicator.style.opacity = '1';
        try {
          await portalStore.syncWithCloud(true);
          showToast('تم تحديث البيانات من السحابة بنجاح ✓', 'success');
        } catch {
          showToast('تعذر الاتصال بالسحابة، تم الإبقاء على البيانات المحفوظة');
        }
      }

      indicator.style.transform = 'translateY(-60px)';
      indicator.style.opacity = '0';
      startY = 0;
      currentY = 0;
    },
    { passive: true }
  );
}
