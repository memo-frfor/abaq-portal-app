import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderScheduleView(container, navigate) {
  const student = portalStore.getActiveStudent();
  let subTab = 'daily'; // 'daily' | 'weekly'
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
      subject: 'القرآن الكريم والدراسات الإسلامية',
      teacher: 'أ. عبدالرحمن المقرئ',
      room: 'قاعة الصف 1/أ',
      isLive: true,
      hasHomework: true,
      topic: 'تلاوة سورة الفجر وتفسير الآيات الكريمة',
    },
    {
      period: 'الحصة 2',
      time: '08:20 - 09:05',
      subject: 'لغتي - القراءة والكتابة',
      teacher: 'أ. أحمد المعلم',
      room: 'قاعة الصف 1/أ',
      isLive: false,
      hasHomework: true,
      topic: 'حرف الميم واللام: النطق والرسم الإملائي',
    },
    {
      period: 'الحصة 3',
      time: '09:10 - 09:55',
      subject: 'الرياضيات',
      teacher: 'أ. سارة أحمد',
      room: 'قاعة الصف 1/أ',
      isLive: false,
      hasHomework: true,
      topic: 'حل تمارين الجمع والمقارنة من ص 32 إلى 35',
    },
    {
      period: 'الحصة 4',
      time: '10:25 - 11:10',
      subject: 'العلوم الطبيعية',
      teacher: 'أ. ماجد الغامدي',
      room: 'معمل العلوم',
      isLive: false,
      hasHomework: false,
      topic: 'مخلوقات الله والكائنات الحية في محيطنا',
    },
    {
      period: 'الحصة 5',
      time: '11:15 - 12:00',
      subject: 'التربية الفنية',
      teacher: 'أ. فهد السالم',
      room: 'صالة الفنون',
      isLive: false,
      hasHomework: false,
      topic: 'التلوين والتشكيل الحر بألوان الباستيل',
    },
    {
      period: 'الحصة 6',
      time: '12:05 - 12:45',
      subject: 'التربية البدنية والدفاع عن النفس',
      teacher: 'ك. صالح الزهراني',
      room: 'الصالة الرياضية',
      isLive: false,
      hasHomework: false,
      topic: 'اللياقة البدنية والألعاب التوافقية الحركية',
    },
  ];

  const weeklyPlans = [
    {
      day: 'الأحد',
      subjects: [
        { name: 'القرآن الكريم', goal: 'حفظ سورة الفجر من آية 1 إلى 10', hw: 'تكرار التلاوة 3 مرات' },
        { name: 'لغتي', goal: 'مراجعة الحروف الهجائية وقراءتها بالحركات', hw: 'كتابة حرف الميم في كراسة الأنشطة' },
        { name: 'الرياضيات', goal: 'العد التصاعدي والتنازلي للأعداد حتى 20', hw: 'حل صفحة 28 من كتاب التمارين' },
      ],
    },
    {
      day: 'الإثنين',
      subjects: [
        { name: 'العلوم', goal: 'التمييز بين الكائنات الحية والجمادات', hw: 'إلصاق صور نباتات وحيوانات' },
        { name: 'التربية الفنية', goal: 'تنسيق الألوان وتلوين عناصر الطبيعة', hw: 'لا يوجد' },
        { name: 'لغتي', goal: 'المد الطويل والقصير مع الحركات', hw: 'قراءة صفحة 30' },
      ],
    },
    {
      day: 'الثلاثاء',
      subjects: [
        { name: 'الرياضيات', goal: 'مفهوم الجمع باستخدام الصور والمكعبات', hw: 'حل التمارين ص 34' },
        { name: 'القرآن الكريم', goal: 'إتقان الترتيل وحفظ الآيات من 11 إلى 20', hw: 'تسميع منزلي' },
        { name: 'اللغة الإنجليزية', goal: 'Letters A, B, C phonics and vocabulary', hw: 'Activity Book page 12' },
      ],
    },
    {
      day: 'الأربعاء',
      subjects: [
        { name: 'لغتي', goal: 'تركيب الكلمات البسيطة المكونة من 3 حروف', hw: 'ورقة عمل تركيب الكلمات' },
        { name: 'العلوم', goal: 'أجزاء النبات ووظيفة الجذور والأوراق', hw: 'مراجعة الدرس' },
        { name: 'التربية البدنية', goal: 'التوازن الحركي والتوافق العضلي العصبي', hw: 'لا يوجد' },
      ],
    },
    {
      day: 'الخميس',
      subjects: [
        { name: 'المهارات الحياتية', goal: 'النظافة الشخصية وترتيب الأدوات المدرسية', hw: 'تطبيق عملي' },
        { name: 'الرياضيات', goal: 'مراجعة أسبوعية واختبار قصير للجمع', hw: 'لا يوجد' },
        { name: 'القرآن الكريم', goal: 'مراجعة ختامية وتكريم الطلاب المتميزين', hw: 'لا يوجد' },
      ],
    },
  ];

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-slate-900 dark:text-white">الجدول والخطة الدراسية</h1>
          <p class="text-xs text-slate-400">${student.fullName} • ${student.gradeLevel}</p>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold font-numbers border border-blue-200 dark:border-blue-900">
          6 حصص اليوم
        </span>
      </div>

      <!-- Segment Switcher (Daily Timetable vs Weekly Plan) -->
      <div class="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
        <button type="button" id="tab-daily-schedule" class="flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs transition-all">
          <span class="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>الجدول اليومي للحصص</span>
        </button>
        <button type="button" id="tab-weekly-plan" class="flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
          <span class="material-symbols-outlined text-[18px]">menu_book</span>
          <span>الخطة الأسبوعية للمقررات</span>
        </button>
      </div>

      <!-- VIEW 1: Daily Schedule -->
      <div id="view-daily-schedule" class="flex flex-col gap-4">
        <!-- Days Carousel -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          ${scheduleDays
            .map(
              (d) => `
            <button type="button" data-day="${d.day}" class="day-tab flex flex-col items-center py-2 px-3.5 rounded-2xl border transition-all press-snappy shrink-0 ${
                d.day === activeDay
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
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
              (p, idx) => `
            <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border ${
              p.isLive ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800'
            } shadow-xs flex flex-col gap-2.5 transition-all">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full ${
                    p.isLive ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  } font-bold text-[10px]">
                    ${p.period}
                  </span>
                  <span class="text-xs font-numbers text-slate-400 font-medium">${p.time}</span>
                </div>

                <div class="flex items-center gap-1.5">
                  ${
                    p.isLive
                      ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold animate-pulse">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>جارية الآن</span>
                        </span>`
                      : ''
                  }
                  ${
                    p.hasHomework
                      ? `<span class="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">
                          واجب مرتبط
                        </span>`
                      : ''
                  }
                </div>
              </div>

              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">${p.subject}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${p.topic}</p>
                </div>
                <span class="text-[11px] font-medium text-slate-400 shrink-0 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                  ${p.room}
                </span>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[15px]">person</span>
                  <span>${p.teacher}</span>
                </span>

                ${
                  p.isLive
                    ? `<button type="button" class="btn-join-period px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-[11px] flex items-center gap-1 press-snappy">
                        <span class="material-symbols-outlined text-[14px]">sensors</span>
                        <span>انضمام للحصة</span>
                      </button>`
                    : ''
                }
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- VIEW 2: Weekly Plan -->
      <div id="view-weekly-plan" class="hidden flex flex-col gap-3">
        <div class="p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-blue-600 text-[26px]">assignment_turned_in</span>
            <div class="flex flex-col">
              <h3 class="text-xs font-bold">الخطة التعليمية للأسبوع الحالي</h3>
              <span class="text-[10px] text-blue-600 dark:text-blue-300">محدّثة ومعتمدة من الكادر التعليمي</span>
            </div>
          </div>
          <button type="button" id="btn-download-plan-pdf" class="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs press-snappy flex items-center gap-1">
            <span class="material-symbols-outlined text-[15px]">download</span>
            <span>تحميل PDF</span>
          </button>
        </div>

        <div class="flex flex-col gap-3">
          ${weeklyPlans.map((wp) => `
            <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span class="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>يوم ${wp.day}</span>
                </span>
                <span class="text-[10px] text-slate-400 font-numbers">${wp.subjects.length} مواد مبرمجة</span>
              </div>

              <div class="flex flex-col gap-2">
                ${wp.subjects.map((sub) => `
                  <div class="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex flex-col gap-1">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-blue-600 dark:text-blue-400">${sub.name}</span>
                      <span class="text-[10px] text-slate-400 font-medium">الواجب: ${sub.hw}</span>
                    </div>
                    <span class="text-[11px] text-slate-600 dark:text-slate-300">${sub.goal}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
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

  container.querySelectorAll('.btn-join-period').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigate('/virtual-classes');
    });
  });
}
