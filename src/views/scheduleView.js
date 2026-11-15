import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';
import { t } from '../services/i18n.js';

export function renderScheduleView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const db = portalStore.cloudDb;
  let subTab = 'daily'; // 'daily' | 'weekly'
  let activeDay = 'الثلاثاء';

  const scheduleDays = [
    { day: 'الأحد', date: '16 رجب' },
    { day: 'الإثنين', date: '17 رجب' },
    { day: 'الثلاثاء', date: `18 رجب ${t('todayLabel')}` },
    { day: 'الأربعاء', date: '19 رجب' },
    { day: 'الخميس', date: '20 رجب' },
  ];

  // Standard physical school class timetable (Periods 1 - 6)
  const periods = [
    {
      period: `${t('periodLabel')} 1`,
      time: '07:30 - 08:15',
      subject: 'القرآن الكريم والدراسات الإسلامية',
      teacher: 'أ. عبدالرحمن المقرئ',
      room: `${t('roomLabel')} ${student.section || '1/أ'}`,
    },
    {
      period: `${t('periodLabel')} 2`,
      time: '08:20 - 09:05',
      subject: 'لغتي - القراءة والكتابة',
      teacher: 'أ. أحمد المعلم',
      room: `${t('roomLabel')} ${student.section || '1/أ'}`,
    },
    {
      period: `${t('periodLabel')} 3`,
      time: '09:10 - 09:55',
      subject: 'الرياضيات',
      teacher: 'أ. سارة أحمد',
      room: `${t('roomLabel')} ${student.section || '1/أ'}`,
    },
    {
      period: `${t('periodLabel')} 4`,
      time: '10:25 - 11:10',
      subject: 'العلوم الطبيعية',
      teacher: 'أ. ماجد الغامدي',
      room: 'معمل العلوم',
    },
    {
      period: `${t('periodLabel')} 5`,
      time: '11:15 - 12:00',
      subject: 'التربية الفنية',
      teacher: 'أ. فهد السالم',
      room: 'صالة الفنون',
    },
    {
      period: `${t('periodLabel')} 6`,
      time: '12:05 - 12:45',
      subject: 'التربية البدنية والدفاع عن النفس',
      teacher: 'ك. صالح الزهراني',
      room: 'الصالة الرياضية',
    },
  ];

  // Weekly plans from cloud database filtered for student grade level
  const rawPlans = Array.isArray(db?.weeklyPlans) ? db.weeklyPlans : [];
  const weeklyPlans = rawPlans.filter(
    (wp) => !wp.gradeLevel || wp.gradeLevel === student.gradeLevel
  );

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-32">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-slate-900 dark:text-white">${t('scheduleTitle')}</h1>
          <p class="text-xs text-slate-400">${student.fullName} • ${student.gradeLevel}</p>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-[#0E9CAC]/15 text-[#0E9CAC] dark:text-[#7bcfd6] text-xs font-bold font-numbers border border-[#0E9CAC]/20">
          6 حصص يومياً
        </span>
      </div>

      <!-- Segment Switcher (Daily Timetable vs Weekly Plan) -->
      <div class="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
        <button type="button" id="tab-daily-schedule" class="flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs transition-all">
          <span class="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>${t('dailyTimetable')}</span>
        </button>
        <button type="button" id="tab-weekly-plan" class="flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
          <span class="material-symbols-outlined text-[18px]">menu_book</span>
          <span>${t('weeklyPlan')}</span>
        </button>
      </div>

      <!-- VIEW 1: Daily Schedule (Physical timetable with clean wrapping) -->
      <div id="view-daily-schedule" class="flex flex-col gap-4">
        <!-- Days Carousel -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          ${scheduleDays
            .map(
              (d) => `
            <button type="button" data-day="${d.day}" class="day-tab flex flex-col items-center py-2 px-3.5 rounded-2xl border transition-all press-snappy shrink-0 ${
                d.day === activeDay
                  ? 'bg-[#0E9CAC] border-[#0E9CAC] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }">
              <span class="text-xs font-bold leading-tight">${d.day}</span>
              <span class="text-[10px] mt-0.5 opacity-80 font-numbers">${d.date}</span>
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Periods List -->
        <div class="flex flex-col gap-2.5">
          ${periods
            .map(
              (p) => `
            <div class="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2.5 transition-all hover:border-[#0E9CAC] press-tactile">
              <div class="flex items-center gap-2.5 min-w-0 flex-1">
                <div class="w-12 h-12 rounded-2xl bg-[#0E9CAC]/15 text-[#0E9CAC] dark:text-[#7bcfd6] flex flex-col items-center justify-center shrink-0 border border-[#0E9CAC]/20">
                  <span class="text-[11px] font-bold">${p.period}</span>
                </div>
                <div class="flex flex-col min-w-0 flex-1">
                  <h3 class="text-xs font-bold text-slate-900 dark:text-white leading-tight break-words">${p.subject}</h3>
                  <div class="flex items-center gap-2 text-[11px] text-slate-400 mt-1 flex-wrap">
                    <span class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-[13px]">person</span>
                      <span>${p.teacher}</span>
                    </span>
                    <span>•</span>
                    <span class="font-numbers">${p.time}</span>
                  </div>
                </div>
              </div>

              <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl shrink-0">
                ${p.room}
              </span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- VIEW 2: Weekly Plan -->
      <div id="view-weekly-plan" class="hidden flex flex-col gap-3">
        ${
          weeklyPlans.length > 0
            ? `
          <div class="p-4 rounded-3xl bg-[#0E9CAC]/15 border border-[#0E9CAC]/30 text-slate-900 dark:text-white flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <span class="material-symbols-outlined text-[#0E9CAC] text-[26px] shrink-0">assignment_turned_in</span>
              <div class="flex flex-col min-w-0">
                <h3 class="text-xs font-bold leading-tight">الخطة التعليمية المعتمدة</h3>
                <span class="text-[10px] text-slate-500 dark:text-slate-400">محدثة ومرفوعة من إدارة المدرسة</span>
              </div>
            </div>
            <button type="button" id="btn-download-plan-pdf" class="px-3 py-1.5 rounded-xl bg-[#0E9CAC] text-white font-bold text-xs press-snappy flex items-center gap-1 shrink-0">
              <span class="material-symbols-outlined text-[15px]">download</span>
              <span>تحميل PDF</span>
            </button>
          </div>

          <div class="flex flex-col gap-3">
            ${weeklyPlans
              .map(
                (wp) => `
              <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
                <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span class="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-[#0E9CAC]"></span>
                    <span>${wp.day || wp.title}</span>
                  </span>
                  <span class="text-[10px] text-slate-400 font-numbers">${(wp.subjects || []).length} مواد مبرمجة</span>
                </div>

                <div class="flex flex-col gap-2">
                  ${(wp.subjects || [])
                    .map(
                      (sub) => `
                    <div class="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex flex-col gap-1">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[#0E9CAC] dark:text-[#7bcfd6]">${sub.name || sub.subject}</span>
                        ${sub.hw ? `<span class="text-[10px] text-slate-400 font-medium">الواجب: ${sub.hw}</span>` : ''}
                      </div>
                      ${sub.goal ? `<span class="text-[11px] text-slate-600 dark:text-slate-300 leading-snug break-words">${sub.goal}</span>` : ''}
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : `
          <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-[#0E9CAC]/15 text-[#0E9CAC] flex items-center justify-center">
              <span class="material-symbols-outlined text-[32px]">menu_book</span>
            </div>
            <h3 class="text-sm font-bold text-slate-800 dark:text-white">لم يتم اعتماد خطة أسبوعية لهذا الصف حتى الآن</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              يقوم المشرف الأكاديمي ومعلمو الصف بررفع وتحديث الخطة الدراسية وتوزيع المناهج دورياً مع بداية كل أسبوع.
            </p>
          </div>
        `
        }
      </div>

    </div>
  `;

  // Attach event bindings
  const tabDaily = container.querySelector('#tab-daily-schedule');
  const tabWeekly = container.querySelector('#tab-weekly-plan');
  const viewDaily = container.querySelector('#view-daily-schedule');
  const viewWeekly = container.querySelector('#view-weekly-plan');

  tabDaily.addEventListener('click', () => {
    subTab = 'daily';
    tabDaily.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs transition-all';
    tabWeekly.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
    viewDaily.classList.remove('hidden');
    viewWeekly.classList.add('hidden');
  });

  tabWeekly.addEventListener('click', () => {
    subTab = 'weekly';
    tabWeekly.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs transition-all';
    tabDaily.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
    viewWeekly.classList.remove('hidden');
    viewDaily.classList.add('hidden');
  });

  container.querySelectorAll('.day-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeDay = btn.getAttribute('data-day');
      renderScheduleView(container, navigate);
    });
  });

  container.querySelector('#btn-download-plan-pdf')?.addEventListener('click', () => {
    showToast('تم تحميل الخطة الأسبوعية بصيغة PDF بنجاح', 'success');
  });
}
