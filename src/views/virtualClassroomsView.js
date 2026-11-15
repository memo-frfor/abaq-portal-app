import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderVirtualClassroomsView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const db = portalStore.cloudDb;

  const liveSessions = [
    {
      id: 'vc-live-1',
      subject: 'الرياضيات والمهارات الحسابية',
      title: 'حصة الرياضيات التفاعلية: حل تمارين الجمع والمقارنة',
      teacher: 'أ. أحمد المعلم',
      status: 'live',
      attendees: 28,
      time: 'الآن (جارية)',
      meetUrl: 'https://meet.jit.si/abaq-math-std1',
    },
    {
      id: 'vc-up-1',
      subject: 'القرآن الكريم',
      title: 'تسميع ومراجعة سورة الفجر وترتيل الآيات',
      teacher: 'أ. عبدالرحمن المقرئ',
      status: 'upcoming',
      attendees: 0,
      time: 'غداً، 04:30 مساءً',
      meetUrl: 'https://meet.jit.si/abaq-quran-std1',
    },
    {
      id: 'vc-up-2',
      subject: 'العلوم الطبيعية',
      title: 'استكشاف الكائنات الحية والبيئة المحيطة',
      teacher: 'أ. خالد الشهري',
      status: 'upcoming',
      attendees: 0,
      time: 'الثلاثاء، 05:00 مساءً',
      meetUrl: 'https://meet.jit.si/abaq-science-std1',
    },
  ];

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-32">

      <!-- Header with back button -->
      <div class="flex items-center justify-between">
        <button type="button" id="btn-back-vc" class="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center press-snappy shadow-xs">
          <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        <div class="flex flex-col text-center">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">الفصول الافتراضية المباشرة</h2>
          <span class="text-xs text-slate-400">${student.fullName} • ${student.gradeLevel}</span>
        </div>
        <div class="w-9 h-9"></div>
      </div>

      <!-- Live Broadcast Hero Card -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white shadow-lg shadow-blue-950/30 flex flex-col gap-3.5">
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white font-bold text-[10px] shadow-sm animate-pulse">
            <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>بث مباشر الآن</span>
          </span>
          <span class="text-xs text-blue-200 flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">group</span>
            <span class="font-numbers">28 طالب متصل</span>
          </span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-blue-300">الرياضيات • الصف الأول الابتدائي</span>
          <h3 class="text-sm font-bold text-white leading-snug">حصة الرياضيات التفاعلية: حل تمارين ومراجعة الوحدة</h3>
          <span class="text-xs text-slate-300 mt-0.5">المعلم: أ. أحمد المعلم</span>
        </div>

        <button type="button" id="btn-join-live" class="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy shadow-md shadow-blue-600/30 flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-[20px]">video_call</span>
          <span>الانضمام الفوري إلى غرفة البث</span>
        </button>
      </div>

      <!-- Upcoming Sessions List -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300">الحصص المجدولة القادمة</h3>
          <span class="text-[10px] text-slate-400">منصة عبق التفاعلية</span>
        </div>

        <div class="flex flex-col gap-2.5">
          ${liveSessions.filter((s) => s.status !== 'live').map((s) => `
            <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[22px]">calendar_today</span>
                </div>
                <div class="flex flex-col">
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white leading-tight">${s.title}</h4>
                  <span class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${s.subject} • ${s.teacher}</span>
                  <span class="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[13px]">schedule</span>
                    <span>${s.time}</span>
                  </span>
                </div>
              </div>

              <button type="button" class="btn-remind px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs press-snappy flex items-center gap-1" data-title="${s.title}">
                <span class="material-symbols-outlined text-[16px]">notifications</span>
                <span>تذكيري</span>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Live Meeting Room Modal (Hidden) -->
      <div id="live-room-modal" class="hidden fixed inset-0 z-50 bg-slate-950 flex flex-col">
        <div class="p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span class="text-xs font-bold truncate">غرفة البث المباشر - مدارس عبق النموذجية</span>
          </div>
          <button type="button" id="btn-close-room" class="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-xs press-snappy">
            مغادرة الحصة
          </button>
        </div>
        <div class="flex-1 w-full bg-slate-900 relative">
          <iframe id="live-iframe" src="" allow="camera; microphone; fullscreen; display-capture" class="w-full h-full border-0"></iframe>
        </div>
      </div>

    </div>
  `;

  // Attach event handlers
  container.querySelector('#btn-back-vc').addEventListener('click', () => {
    navigate('/home');
  });

  const roomModal = container.querySelector('#live-room-modal');
  const iframe = container.querySelector('#live-iframe');

  container.querySelector('#btn-join-live').addEventListener('click', () => {
    iframe.src = 'https://meet.jit.si/abaq-math-std1#config.startWithAudioMuted=true';
    roomModal.classList.remove('hidden');
  });

  container.querySelector('#btn-close-room').addEventListener('click', () => {
    iframe.src = '';
    roomModal.classList.add('hidden');
    showToast('تمت مغادرة الحصة المباشرة');
  });

  container.querySelectorAll('.btn-remind').forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      showToast(`تم ضبط منبه التذكير للحصة: ${title}`, 'success');
    });
  });
}
