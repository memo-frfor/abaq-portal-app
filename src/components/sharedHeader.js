import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';
import { t } from '../services/i18n.js';

export function renderSharedHeader(navigate, currentRoute = '/home') {
  const student = portalStore.getActiveStudent();
  const state = portalStore.state;

  const header = document.createElement('header');
  header.className =
    'sticky top-0 w-full z-40 pt-safe glass-header text-white shadow-[0_4px_20px_rgba(15,23,42,0.12)] transition-all';
  header.setAttribute('data-shared-header', 'true');

  header.innerHTML = `
    <div class="max-w-lg mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
      <!-- Right: Brand Logo + Student Switcher Pill -->
      <div class="flex items-center gap-2.5 min-w-0">
        <button type="button" id="btn-header-school" class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center p-1 press-snappy shrink-0 border border-white/15">
          <img src="./assets/images/img-1.jpg" alt="Abaq" class="w-full h-full object-contain" />
        </button>

        <button type="button" id="btn-student-selector" class="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full py-1 pe-3 ps-1 press-snappy transition-all min-w-0">
          <img src="${student.avatar}" alt="${student.fullName}" class="w-7 h-7 rounded-full object-cover ring-1 ring-white/40 shrink-0" />
          <div class="flex flex-col text-start leading-tight min-w-0">
            <span class="text-xs font-bold text-white truncate max-w-[130px]">${student.fullName.split(' ')[0]}</span>
            <span class="text-[10px] text-blue-200 truncate">${student.gradeLevel.replace('الصف ', '')}</span>
          </div>
          <span class="material-symbols-outlined text-[16px] text-blue-200">keyboard_arrow_down</span>
        </button>
      </div>

      <!-- Left: Notifications Badge + Settings Menu -->
      <div class="flex items-center gap-1.5 shrink-0">
        <button type="button" id="btn-header-notifs" class="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white press-snappy transition-colors border border-white/10">
          <span class="material-symbols-outlined text-[20px]">notifications</span>
          ${
            student.unreadNotificationsCount > 0
              ? `<span class="absolute top-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white font-numbers text-[9px] font-bold ring-2 ring-[#0f2b66]">${student.unreadNotificationsCount}</span>`
              : ''
          }
        </button>

        <button type="button" id="btn-header-settings" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white press-snappy transition-colors border border-white/10">
          <span class="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </div>
    </div>
  `;

  // Attach event handlers
  const studentBtn = header.querySelector('#btn-student-selector');
  studentBtn.addEventListener('click', () => {
    openStudentSwitchSheet(navigate);
  });

  const notifsBtn = header.querySelector('#btn-header-notifs');
  notifsBtn.addEventListener('click', () => {
    openNotificationsModal(navigate);
  });

  const settingsBtn = header.querySelector('#btn-header-settings');
  settingsBtn.addEventListener('click', () => {
    navigate('/account');
  });

  return header;
}

export function openStudentSwitchSheet(navigate) {
  let modal = document.getElementById('student-switch-sheet');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'student-switch-sheet';
    document.body.appendChild(modal);
  }

  const state = portalStore.state;
  const currentId = state.activeStudentId;

  modal.className = 'fixed inset-0 z-50 flex flex-col justify-end sheet-backdrop';
  modal.innerHTML = `
    <div class="fixed inset-0" id="sheet-overlay"></div>
    <div class="relative bg-white dark:bg-slate-900 rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 max-w-lg mx-auto w-full sheet-panel pb-safe">
      <div class="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-1"></div>
      
      <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 class="text-base font-bold text-slate-800 dark:text-white">${t('linkedProfiles')}</h3>
          <p class="text-xs text-slate-400">${t('selectProfileHint')}</p>
        </div>
        <button type="button" id="close-sheet-btn" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center press-snappy">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div class="flex flex-col gap-2.5 max-h-72 overflow-y-auto">
        ${Object.values(state.students).map((s) => {
          const isSelected = s.id === currentId;
          const pendingHw = portalStore.state.homework.filter(
            (h) => (h.studentId === s.id || h.gradeLevel === s.gradeLevel) && h.status === 'pending'
          ).length;

          return `
            <button type="button" data-switch-to="${s.id}" class="w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all press-snappy ${
              isSelected
                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 text-slate-900 dark:text-white'
                : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }">
              <div class="flex items-center gap-3">
                <img src="${s.avatar}" alt="${s.fullName}" class="w-11 h-11 rounded-full object-cover ring-2 ${
                  isSelected ? 'ring-blue-500' : 'ring-slate-300 dark:ring-slate-600'
                }" />
                <div class="flex flex-col text-start">
                  <span class="text-sm font-bold text-slate-800 dark:text-white">${s.fullName}</span>
                  <span class="text-xs text-slate-500 dark:text-slate-400">${s.gradeLevel} - ${s.section} • ${s.studentCode}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                ${
                  pendingHw > 0
                    ? `<span class="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-200">${pendingHw} ${t('pendingHwBadge')}</span>`
                    : ''
                }
                ${
                  isSelected
                    ? '<span class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white"><span class="material-symbols-outlined text-[16px]">check</span></span>'
                    : `<span class="text-xs text-slate-400 font-medium">${t('switchProfile')}</span>`
                }
              </div>
            </button>
          `;
        }).join('')}
      </div>

      <button type="button" id="btn-add-dependent" class="w-full py-3 rounded-xl border border-dashed border-blue-400 dark:border-blue-600 hover:bg-blue-50/50 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-1.5 press-snappy transition-colors">
        <span class="material-symbols-outlined text-[18px]">person_add</span>
        <span>${t('addDependent')}</span>
      </button>
    </div>
  `;

  const close = () => {
    modal.classList.add('hidden');
  };

  modal.classList.remove('hidden');
  modal.querySelector('#sheet-overlay').addEventListener('click', close);
  modal.querySelector('#close-sheet-btn').addEventListener('click', close);

  modal.querySelectorAll('[data-switch-to]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-switch-to');
      portalStore.setActiveStudent(targetId);
      close();
      const updated = portalStore.getActiveStudent();
      showToast(`${t('activeProfileBadge')}: ${updated.fullName}`);
    });
  });

  modal.querySelector('#btn-add-dependent').addEventListener('click', () => {
    close();
    navigate('/register');
  });
}

export function openNotificationsModal(navigate) {
  let modal = document.getElementById('notifications-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'notifications-modal';
    document.body.appendChild(modal);
  }

  const notifs = portalStore.state.notifications;

  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3.5 border border-slate-100 dark:border-slate-800 animate-fadeIn">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <span class="material-symbols-outlined text-[18px]">notifications</span>
          </span>
          <h3 class="text-base font-bold text-slate-800 dark:text-white">${t('schoolNotifs')}</h3>
        </div>
        <button type="button" id="close-notif-modal" class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center press-snappy">
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      <div class="flex flex-col gap-2 max-h-72 overflow-y-auto">
        ${notifs
          .map(
            (n) => `
          <div data-notif-id="${n.id}" data-notif-route="${n.route}" class="p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer press-gentle ${
              n.read ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-500' : 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-slate-800 dark:text-white'
            }">
            <span class="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-[18px]">${n.icon}</span>
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold leading-relaxed">${n.title}</p>
              <span class="text-[10px] text-slate-400 mt-1 block">${n.time}</span>
            </div>
            ${!n.read ? '<span class="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2"></span>' : ''}
          </div>
        `
          )
          .join('')}
      </div>

      <button type="button" id="mark-all-read" class="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs press-snappy transition-colors text-center">
        ${t('markAllRead')}
      </button>
    </div>
  `;

  const close = () => modal.classList.add('hidden');
  modal.classList.remove('hidden');
  modal.querySelector('#close-notif-modal').addEventListener('click', close);

  modal.querySelectorAll('[data-notif-id]').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-notif-id');
      const route = card.getAttribute('data-notif-route');
      portalStore.markNotificationRead(id);
      close();
      if (route) navigate(route);
    });
  });

  modal.querySelector('#mark-all-read').addEventListener('click', () => {
    portalStore.state.notifications.forEach((n) => (n.read = true));
    portalStore.getActiveStudent().unreadNotificationsCount = 0;
    portalStore.notify();
    close();
    showToast(t('markAllRead'));
  });
}
