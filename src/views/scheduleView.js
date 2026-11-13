import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderScheduleView(container, navigate) {
  const student = portalStore.getActiveStudent();
  let activeDay = 'الثلاثاء';

  const scheduleDays = [
    { day: 'الأحد', date: '16 رجب', active: false },
    { day: 'الإثنين', date: '17 رجب', active: false },
    { day: 'الثلاثاء', date: '18 رجب (اليوم)', active: true },
    { day: 'الأربعاء', date: '19 رجب', active: false },
    { day: 'الخميس', date: '20 رجب', active: false },
  ];

  const periods = [
    {
      period: 'الحصة 1',
      time: '07:30 - 08:15',
      subject: 'الرياضيات',
      teacher: 'أ. خالد الشهري',
      room: 'قاعة 301',
      isLive: true,
      hasHomework: true,
      topic: 'المتطابقات المثلثية وقوانين جيب التمام',
    },
    {
      period: 'الحصة 2',
      time: '08:20 - 09:05',
      subject: 'العلوم الطبيعية',
      teacher: 'أ. ماجد الغامدي',
      room: 'مختبر الكيمياء',
      isLive: false,
      hasHomework: true,
      topic: 'تفاعلات الأكسدة والاحتراق الذاتي',
    },
    {
      period: 'الحصة 3',
      time: '09:10 - 09:55',
      subject: 'لغتي الخالدة',
      teacher: 'أ. فهد السالم',
      room: 'قاعة 301',
      isLive: false,
      hasHomework: true,
      topic: 'النص الوصفي والأساليب البلاغية',
    },
    {
      period: 'الحصة 4',
      time: '10:25 - 11:10',
      subject: 'الحاسب والذكاء الاصطناعي',
      teacher: 'م. سلطان القرني',
      room: 'معمل الحاسب 2',
      isLive: false,
      hasHomework: false,
      topic: 'مفاهيم تدريب النماذج والشبكات العصبية',
    },
    {
      period: 'الحصة 5',
      time: '11:15 - 12:00',
      subject: 'اللغة الإنجليزية',
      teacher: 'Mr. David Miller',
      room: 'قاعة اللغات',
      isLive: false,
      hasHomework: false,
      topic: 'Unit 4: Advanced Writing Skills',
    },
    {
      period: 'الحصة 6',
      time: '12:05 - 12:45',
      subject: 'التربية البدنية والدفاع عن النفس',
      teacher: 'ك. صالح الزهراني',
      room: 'الصالة الرياضية',
      isLive: false,
      hasHomework: false,
      topic: 'مهارات اللياقة البدنية والجمباز الحركي',
    },
  ];

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-slate-900">الجدول والخطة الأسبوعية</h1>
          <p class="text-xs text-slate-400">توزيع الحصص اليومية ومواعيد البث المباشر</p>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-numbers border border-blue-200">
          6 حصص اليوم
        </span>
      </div>

      <!-- Days Carousel -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        ${scheduleDays
          .map(
            (d) => `
          <button type="button" data-day="${d.day}" class="day-tab flex flex-col items-center py-2 px-3.5 rounded-2xl border transition-all press-snappy shrink-0 ${
              d.day === activeDay
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }">
            <span class="text-xs font-bold">${d.day}</span>
            <span class="text-[10px] ${d.day === activeDay ? 'text-blue-100' : 'text-slate-400'} font-numbers mt-0.5">${d.date}</span>
          </button>
        `
          )
          .join('')}
      </div>

      <!-- Periods Timeline -->
      <div class="flex flex-col gap-2.5" id="periods-list">
        ${periods
          .map(
            (p, idx) => `
          <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-2.5 transition-all hover:border-blue-400">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-numbers text-xs font-bold flex items-center justify-center shrink-0">
                  ${idx + 1}
                </span>
                <div>
                  <h3 class="text-xs font-bold text-slate-900">${p.subject}</h3>
                  <span class="text-[10px] text-slate-400">${p.teacher} • ${p.room}</span>
                </div>
              </div>

              <div class="flex items-center gap-1.5">
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-numbers font-medium">
                  ${p.time}
                </span>
                ${
                  p.isLive
                    ? `
                  <span class="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                    <span>مباشر</span>
                  </span>
                `
                    : ''
                }
              </div>
            </div>

            <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
              <strong class="text-slate-800">موضوع الدرس: </strong>${p.topic}
            </p>

            <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
              ${
                p.hasHomework
                  ? `
                <button type="button" data-route="/homework" class="text-blue-600 text-[11px] font-bold flex items-center gap-1 hover:underline">
                  <span class="material-symbols-outlined text-[15px]">assignment</span>
                  <span>مرتبط بواجب منزلي</span>
                </button>
              `
                  : '<span class="text-[11px] text-slate-400">لا يوجد واجب</span>'
              }

              ${
                p.isLive
                  ? `
                <button type="button" class="btn-join-period-live px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold press-snappy flex items-center gap-1">
                  <span>دخول الحصة</span>
                  <span class="material-symbols-outlined text-[14px]">videocam</span>
                </button>
              `
                  : ''
              }
            </div>
          </div>
        `
          )
          .join('')}
      </div>

    </div>
  `;

  // Attach event bindings
  container.querySelectorAll('[data-route]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const route = btn.getAttribute('data-route');
      navigate(route);
    });
  });

  container.querySelectorAll('.day-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.day-tab').forEach((t) => {
        t.className =
          'day-tab flex flex-col items-center py-2 px-3.5 rounded-2xl border transition-all press-snappy shrink-0 bg-white border-slate-200 text-slate-700 hover:border-slate-300';
      });
      tab.className =
        'day-tab flex flex-col items-center py-2 px-3.5 rounded-2xl border transition-all press-snappy shrink-0 bg-blue-600 border-blue-600 text-white shadow-sm';
      showToast(`عرض جدول يوم ${tab.getAttribute('data-day')}`);
    });
  });

  container.querySelectorAll('.btn-join-period-live').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('جاري فتح بث الحصة المباشرة...');
    });
  });
}
