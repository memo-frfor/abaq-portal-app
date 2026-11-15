import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';
import { t } from '../services/i18n.js';

export function renderHomeView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const ann = portalStore.state.announcement;

  const pendingHw = portalStore.state.homework.filter(
    (h) => (h.studentId === student.id || h.gradeLevel === student.gradeLevel) && h.status === 'pending'
  );

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-3.5 sm:px-4 py-3.5 gap-3.5 pb-32">

      <!-- Urgent Announcement (Q-Inspired Mint Alert with clean wrapping) -->
      ${
        ann.visible
          ? `
        <div id="banner-announcement" class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#f0fbfd] to-[#e4f7f9] dark:bg-slate-900 border border-[#0E9CAC]/25 p-3.5 shadow-xs transition-all press-tactile cursor-pointer">
          <div class="flex items-start justify-between gap-2.5">
            <div class="flex items-start gap-2.5 min-w-0 flex-1">
              <span class="w-10 h-10 rounded-2xl bg-[#0E9CAC]/15 text-[#0E9CAC] dark:text-[#7bcfd6] flex items-center justify-center shrink-0 shadow-inner mt-0.5">
                <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">campaign</span>
              </span>
              <div class="flex flex-col min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="px-2 py-0.5 rounded-full bg-[#0E9CAC]/20 text-[#085461] dark:text-[#a3f4fb] text-[10px] font-bold shrink-0">${t('urgentAnnouncement')}</span>
                  <span class="text-xs font-bold text-slate-800 dark:text-white leading-tight break-words">${ann.title}</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2 break-words">${ann.summary}</p>
              </div>
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <button type="button" id="btn-announcement-details" class="px-2.5 py-1 rounded-xl bg-[#0E9CAC] text-white text-[11px] font-bold hover:bg-[#0b8a9e] transition-colors shadow-xs">
                ${t('viewDetails')}
              </button>
              <button type="button" id="btn-dismiss-announcement" class="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </div>
        </div>
      `
          : ''
      }

      <!-- Live Virtual Classroom Alert (When Active - Q Deep Teal Gradient) -->
      ${
        student.liveClass && student.liveClass.active
          ? `
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#085461] via-[#0E9CAC] to-[#12aebd] text-white p-4 shadow-md shadow-[#0E9CAC]/20 press-tactile">
          <div class="flex items-center justify-between pb-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
              <span class="w-2 h-2 rounded-full bg-[#D6FCFF] animate-pulse"></span>
              <span>${t('liveClassActive')}</span>
            </span>
            <span class="text-[11px] text-white/90">${t('virtualRoom')}</span>
          </div>

          <h3 class="text-sm font-bold text-white leading-snug mt-1 break-words">${student.liveClass.title}</h3>
          <p class="text-xs text-[#D6FCFF] mt-0.5">${t('teacherPrefix')}${student.liveClass.teacher}</p>

          <div class="flex items-center justify-between pt-3 mt-1 border-t border-white/20 flex-wrap gap-2">
            <div class="flex items-center gap-1.5 text-xs text-white/90">
              <span class="material-symbols-outlined text-[16px]">groups</span>
              <span class="font-numbers">${student.liveClass.attendees} ${t('studentsPresent')}</span>
            </div>
            <button type="button" id="btn-join-live" class="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-[#085461] text-xs font-bold shadow-sm press-snappy">
              <span>${t('joinLiveClass')}</span>
              <span class="material-symbols-outlined text-[16px]">videocam</span>
            </button>
          </div>
        </div>
      `
          : ''
      }

      <!-- Core Services Bento Grid (Q-App Inspired Duo-Tone Squircles with Clean Text Wrapping) -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-0.5">
          <h2 class="text-sm font-bold text-slate-800 dark:text-white">${t('coreServices')}</h2>
          <span class="text-xs text-[#0E9CAC] dark:text-[#7bcfd6] font-semibold">${t('quickAccess')}</span>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          <!-- 1: Grades & Evaluation -->
          <button type="button" data-route="/grades" class="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_16px_rgba(14,156,172,0.04)] hover:border-[#0E9CAC]/40 hover:shadow-[0_8px_24px_rgba(14,156,172,0.12)] press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D6FCFF] to-[#a3f4fb] text-[#0E9CAC] flex items-center justify-center shrink-0 border border-[#7bcfd6]/40 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[21px]" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-xs font-bold text-slate-900 dark:text-white leading-tight break-words line-clamp-2">${t('srvGradesTitle')}</span>
              <span class="text-[10px] text-slate-400 font-numbers mt-0.5 line-clamp-1">${student.gpa}% ${t('srvGradesSub')}</span>
            </div>
          </button>

          <!-- 2: Homework & Assignments -->
          <button type="button" data-route="/homework" class="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_16px_rgba(14,156,172,0.04)] hover:border-[#7C3AED]/40 hover:shadow-[0_8px_24px_rgba(124,58,237,0.12)] press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0 border border-[#C4B5FD]/40 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[21px]" style="font-variation-settings: 'FILL' 1;">assignment</span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-xs font-bold text-slate-900 dark:text-white leading-tight break-words line-clamp-2">${t('srvHomeworkTitle')}</span>
              <span class="text-[10px] ${pendingHw.length > 0 ? 'text-rose-500 font-bold' : 'text-emerald-600 font-medium'} font-numbers mt-0.5 line-clamp-1">${pendingHw.length > 0 ? `${pendingHw.length} ${t('pendingHwBadge')}` : t('noPendingHw')}</span>
            </div>
          </button>

          <!-- 3: Schedule & Weekly Plan -->
          <button type="button" data-route="/schedule" class="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_16px_rgba(14,156,172,0.04)] hover:border-[#0284C7]/40 hover:shadow-[0_8px_24px_rgba(2,132,199,0.12)] press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 border border-[#7DD3FC]/40 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[21px]" style="font-variation-settings: 'FILL' 1;">calendar_month</span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-xs font-bold text-slate-900 dark:text-white leading-tight break-words line-clamp-2">${t('srvScheduleTitle')}</span>
              <span class="text-[10px] text-slate-400 font-numbers mt-0.5 line-clamp-1">${student.todayClassesCount} ${t('dailyTimetable')}</span>
            </div>
          </button>

          <!-- 4: Financials & Tuition -->
          <button type="button" data-route="/financials" class="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_16px_rgba(14,156,172,0.04)] hover:border-[#059669]/40 hover:shadow-[0_8px_24px_rgba(5,150,105,0.12)] press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] text-[#059669] flex items-center justify-center shrink-0 border border-[#6EE7B7]/40 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[21px]" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-xs font-bold text-slate-900 dark:text-white leading-tight break-words line-clamp-2">${t('srvFinanceTitle')}</span>
              <span class="text-[10px] ${student.dueTuition > 0 ? 'text-rose-500 font-bold' : 'text-emerald-600 font-medium'} font-numbers mt-0.5 line-clamp-1">${student.dueTuition > 0 ? `${student.dueTuition} ${t('currencySar')}` : t('paidInFull')}</span>
            </div>
          </button>

          <!-- 5: Digital Curriculum & Library -->
          <button type="button" data-route="/library" class="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_16px_rgba(14,156,172,0.04)] hover:border-[#D97706]/40 hover:shadow-[0_8px_24px_rgba(217,119,6,0.12)] press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] text-[#D97706] flex items-center justify-center shrink-0 border border-[#FCD34D]/40 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[21px]" style="font-variation-settings: 'FILL' 1;">local_library</span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-xs font-bold text-slate-900 dark:text-white leading-tight break-words line-clamp-2">${t('srvLibraryTitle')}</span>
              <span class="text-[10px] text-slate-400 mt-0.5 line-clamp-1">${t('srvLibrarySub')}</span>
            </div>
          </button>

          <!-- 6: Live Virtual Broadcast -->
          <button type="button" data-route="/virtual-classes" class="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_16px_rgba(14,156,172,0.04)] hover:border-[#E11D48]/40 hover:shadow-[0_8px_24px_rgba(225,29,72,0.12)] press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFE4E6] to-[#FECDD3] text-[#E11D48] flex items-center justify-center shrink-0 border border-[#FDA4AF]/40 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[21px]" style="font-variation-settings: 'FILL' 1;">videocam</span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-xs font-bold text-slate-900 dark:text-white leading-tight break-words line-clamp-2">${t('srvVirtualTitle')}</span>
              <span class="text-[10px] text-[#E11D48] font-semibold mt-0.5 line-clamp-1">${t('srvVirtualSub')}</span>
            </div>
          </button>

          <!-- 7: Behavior & Conduct Points -->
          <button type="button" data-route="/behavior" class="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_16px_rgba(14,156,172,0.04)] hover:border-[#CA8A04]/40 hover:shadow-[0_8px_24px_rgba(202,138,4,0.12)] press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FEF9C3] to-[#FEF08A] text-[#CA8A04] flex items-center justify-center shrink-0 border border-[#FDE047]/40 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[21px]" style="font-variation-settings: 'FILL' 1;">military_tech</span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-xs font-bold text-slate-900 dark:text-white leading-tight break-words line-clamp-2">${t('srvBehaviorTitle')}</span>
              <span class="text-[10px] text-[#CA8A04] font-semibold font-numbers mt-0.5 line-clamp-1">${student.behaviorPoints} ${t('srvBehaviorSub')}</span>
            </div>
          </button>

          <!-- 8: School Bus Tracking -->
          <button type="button" data-route="/bus" class="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_16px_rgba(14,156,172,0.04)] hover:border-[#EA580C]/40 hover:shadow-[0_8px_24px_rgba(234,88,12,0.12)] press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA] text-[#EA580C] flex items-center justify-center shrink-0 border border-[#FDBA74]/40 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[21px]" style="font-variation-settings: 'FILL' 1;">directions_bus</span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-xs font-bold text-slate-900 dark:text-white leading-tight break-words line-clamp-2">${t('srvBusTitle')}</span>
              <span class="text-[10px] text-slate-400 font-numbers mt-0.5 line-clamp-1">${t('srvBusSub')} (${student.busNumber})</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Pending Tasks Stream -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-0.5">
          <h2 class="text-sm font-bold text-slate-800 dark:text-white">${t('upcomingHomework')}</h2>
          <button type="button" data-route="/homework" class="text-xs font-bold text-[#0E9CAC] dark:text-[#7bcfd6] hover:underline">
            ${t('viewAll')} (${pendingHw.length})
          </button>
        </div>

        <div class="flex flex-col gap-2">
          ${
            pendingHw.length > 0
              ? pendingHw
                  .slice(0, 2)
                  .map(
                    (hw) => `
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 transition-all hover:border-[#0E9CAC]/50">
              <div class="flex flex-col min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-[#0E9CAC] dark:text-[#7bcfd6]">${hw.subject}</span>
                  <span class="text-[10px] text-slate-400">• ${hw.teacher}</span>
                </div>
                <h4 class="text-xs font-semibold text-slate-800 dark:text-white mt-1 leading-snug break-words">${hw.title}</h4>
                <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-medium font-numbers">
                  <span class="material-symbols-outlined text-[13px]">schedule</span>
                  <span>${hw.dueTime}</span>
                </div>
              </div>

              <button type="button" data-route="/homework" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-l from-[#0E9CAC] to-[#0a7a8b] text-white text-xs font-bold shadow-xs hover:opacity-90 press-snappy shrink-0">
                ${t('submitNow')}
              </button>
            </div>
          `
                  )
                  .join('')
              : `
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
              <span>${t('noPendingHw')}</span>
            </div>
          `
          }
        </div>
      </div>

    </div>

    <!-- Announcement Details Bottom Sheet (iOS Style) -->
    <div id="announcement-sheet" class="hidden fixed inset-0 z-50 flex flex-col justify-end sheet-backdrop">
      <div class="fixed inset-0" id="ann-sheet-overlay"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-t-3xl p-5 shadow-2xl flex flex-col gap-3.5 max-w-lg mx-auto w-full sheet-panel border-t border-slate-100 dark:border-slate-800 pb-safe">
        <div class="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-1"></div>

        <div class="flex items-start justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2.5">
            <span class="w-10 h-10 rounded-2xl bg-[#0E9CAC]/15 text-[#0E9CAC] flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">campaign</span>
            </span>
            <div>
              <span class="px-2 py-0.5 rounded-full bg-[#0E9CAC]/20 text-[#085461] dark:text-[#a3f4fb] text-[10px] font-bold">${t('urgentAnnouncement')}</span>
              <h3 class="text-sm font-bold text-slate-800 dark:text-white mt-0.5 leading-snug break-words">${ann.title}</h3>
            </div>
          </div>
          <button type="button" id="close-ann-sheet-btn" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-[#f0fbfd] dark:bg-slate-800/60 p-4 rounded-2xl border border-[#0E9CAC]/20">
          <p class="font-bold text-slate-800 dark:text-white">${ann.summary}</p>
          <p class="text-slate-500 dark:text-slate-400 mt-1">${ann.details}</p>
          <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2 font-numbers">
            <span class="material-symbols-outlined text-[13px]">schedule</span>
            <span>${ann.date}</span>
          </div>
        </div>

        <button type="button" id="btn-confirm-read-ann" class="w-full py-3 rounded-2xl bg-[#0E9CAC] hover:bg-[#0b8a9e] text-white font-bold text-xs press-snappy text-center shadow-md shadow-[#0E9CAC]/25">
          تأكيد قراءة وفهم التعميم
        </button>
      </div>
    </div>
  `;

  // Attach Event Handlers
  container.querySelectorAll('[data-route]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const route = btn.getAttribute('data-route');
      navigate(route);
    });
  });

  // Announcement details sheet
  const sheet = container.querySelector('#announcement-sheet');
  const openSheet = () => sheet?.classList.remove('hidden');
  const closeSheet = () => sheet?.classList.add('hidden');

  container.querySelector('#btn-announcement-details')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openSheet();
  });

  container.querySelector('#banner-announcement')?.addEventListener('click', (e) => {
    if (e.target.closest('#btn-dismiss-announcement')) return;
    openSheet();
  });

  container.querySelector('#close-ann-sheet-btn')?.addEventListener('click', closeSheet);
  container.querySelector('#ann-sheet-overlay')?.addEventListener('click', closeSheet);

  container.querySelector('#btn-dismiss-announcement')?.addEventListener('click', (e) => {
    e.stopPropagation();
    portalStore.dismissAnnouncement(ann.id);
    showToast('تم إخفاء التعميم');
  });

  container.querySelector('#btn-confirm-read-ann')?.addEventListener('click', () => {
    closeSheet();
    portalStore.dismissAnnouncement(ann.id);
    showToast('تم تأكيد قراءة التعميم وحفظه في سجلك ✓');
  });

  // Join live virtual class
  container.querySelector('#btn-join-live')?.addEventListener('click', () => {
    if (student.liveClass && student.liveClass.meetUrl) {
      window.open(student.liveClass.meetUrl, '_blank');
    } else {
      navigate('/virtual-classes');
    }
  });
}
