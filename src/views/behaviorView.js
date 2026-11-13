import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderBehaviorView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const db = portalStore.cloudDb;

  const records = [
    {
      id: 'beh-1',
      title: 'المشاركة الفعالة والتفوق الصفي',
      subject: 'لغتي والمهارات اللغوية',
      points: '+15',
      type: 'positive',
      teacher: 'أ. أحمد المعلم',
      date: 'الأربعاء، 12 ربيع الأول',
      icon: 'star',
    },
    {
      id: 'beh-2',
      title: 'الانضباط والالتزام بالحضور الصباحي',
      subject: 'المواظبة العامة',
      points: '+15',
      type: 'positive',
      teacher: 'إدارة المدرسة',
      date: 'الأحد، 09 ربيع الأول',
      icon: 'verified',
    },
    {
      id: 'beh-3',
      title: 'إتقان تلاوة الآيات المقررة بأحكام التجويد',
      subject: 'القرآن الكريم',
      points: '+20',
      type: 'positive',
      teacher: 'أ. عبدالرحمن المقرئ',
      date: 'الخميس، 06 ربيع الأول',
      icon: 'workspace_premium',
    },
  ];

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Header with back button -->
      <div class="flex items-center justify-between">
        <button type="button" id="btn-back-behavior" class="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center press-snappy shadow-xs">
          <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        <div class="flex flex-col text-center">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">السلوك والمواظبة والتميز</h2>
          <span class="text-xs text-slate-400">${student.fullName} • ${student.gradeLevel}</span>
        </div>
        <div class="w-9 h-9"></div>
      </div>

      <!-- Hero Points Card -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/20 flex items-center justify-between">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-amber-100">رصيد نقاط التميز السلوكي</span>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold font-numbers tracking-tight">+50</span>
            <span class="text-sm font-bold text-amber-100">نقطة إيجابية</span>
          </div>
          <span class="inline-flex items-center gap-1 text-[11px] text-amber-200 mt-1">
            <span class="material-symbols-outlined text-[14px]">military_tech</span>
            <span>مستوى السلوك: مثالي (درجة كاملة 100%)</span>
          </span>
        </div>

        <div class="w-16 h-16 rounded-3xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-inner">
          <span class="material-symbols-outlined text-[36px]">award_star</span>
        </div>
      </div>

      <!-- Certificate of Appreciation Card -->
      <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[26px]">workspace_premium</span>
          </div>
          <div class="flex flex-col">
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">شهادة شكر وتقدير في الانضباط</h4>
            <span class="text-[11px] text-slate-500 dark:text-slate-400">صادرة من إدارة مدرسة عبق النموذجية</span>
          </div>
        </div>

        <button type="button" id="btn-view-certificate" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs press-snappy flex items-center gap-1 shadow-xs">
          <span class="material-symbols-outlined text-[16px]">visibility</span>
          <span>عرض</span>
        </button>
      </div>

      <!-- Behavior Timeline List -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300">سجل التقييمات السلوكية</h3>
          <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">صفر مخالفات مسجلة ✓</span>
        </div>

        <div class="flex flex-col gap-2">
          ${records.map((r) => `
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[20px]">${r.icon}</span>
                </div>
                <div class="flex flex-col">
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white leading-tight">${r.title}</h4>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">${r.subject} • ${r.teacher}</span>
                  <span class="text-[9px] text-slate-400 mt-0.5">${r.date}</span>
                </div>
              </div>

              <span class="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-numbers">
                ${r.points}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Certificate Modal (Hidden) -->
      <div id="certificate-modal" class="hidden fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-4">
          <div class="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center">
            <span class="material-symbols-outlined text-[36px]">workspace_premium</span>
          </div>

          <div class="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-3 w-full">
            <span class="text-[10px] font-bold text-amber-600 tracking-wider uppercase">شهادة شكر وتقدير</span>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">${student.fullName}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
              تتقدم إدارة المدرسة بوافر الشكر والتقدير للطالب لتميزه في الانضباط السلوكي والمواظبة اليومية خلال الفصل الدراسي.
            </p>
          </div>

          <div class="flex items-center justify-between w-full text-xs text-slate-500 dark:text-slate-400 px-2">
            <span>المدير: أ. عبده</span>
            <span>العام: 1447هـ</span>
          </div>

          <div class="flex items-center gap-2 w-full pt-1">
            <button type="button" id="btn-download-cert" class="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold press-snappy flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">download</span>
              <span>حفظ الشهادة</span>
            </button>
            <button type="button" id="btn-close-cert" class="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold press-snappy">
              إغلاق
            </button>
          </div>
        </div>
      </div>

    </div>
  `;

  // Attach event handlers
  container.querySelector('#btn-back-behavior').addEventListener('click', () => {
    navigate('/home');
  });

  const certModal = container.querySelector('#certificate-modal');
  container.querySelector('#btn-view-certificate').addEventListener('click', () => {
    certModal.classList.remove('hidden');
  });

  container.querySelector('#btn-close-cert').addEventListener('click', () => {
    certModal.classList.add('hidden');
  });

  container.querySelector('#btn-download-cert').addEventListener('click', () => {
    showToast('تم حفظ الشهادة في مجلد التنزيلات بنجاح', 'success');
    certModal.classList.add('hidden');
  });
}
