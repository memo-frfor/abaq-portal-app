import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderGradesView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const excuses = portalStore.state.medicalExcuses.filter((e) => e.studentId === student.id);

  const subjects = [
    {
      name: 'الرياضيات',
      code: 'MATH-301',
      teacher: 'أ. خالد الشهري',
      icon: 'calculate',
      score: 100,
      total: 100,
      rating: 'الدرجة الكاملة ★',
      workScore: 40,
      finalScore: 60,
      color: 'blue',
    },
    {
      name: 'العلوم الطبيعية',
      code: 'SCI-302',
      teacher: 'أ. ماجد الغامدي',
      icon: 'science',
      score: 98,
      total: 100,
      rating: 'ممتاز مرتفع',
      workScore: 39,
      finalScore: 59,
      color: 'teal',
    },
    {
      name: 'الحاسب والذكاء الاصطناعي',
      code: 'CS-303',
      teacher: 'م. سلطان القرني',
      icon: 'terminal',
      score: 100,
      total: 100,
      rating: 'الدرجة الكاملة ★',
      workScore: 40,
      finalScore: 60,
      color: 'indigo',
    },
    {
      name: 'لغتي الخالدة',
      code: 'ARB-304',
      teacher: 'أ. فهد السالم',
      icon: 'menu_book',
      score: 99,
      total: 100,
      rating: 'ممتاز مرتفع',
      workScore: 40,
      finalScore: 59,
      color: 'emerald',
    },
    {
      name: 'اللغة الإنجليزية',
      code: 'ENG-305',
      teacher: 'Mr. David Miller',
      icon: 'translate',
      score: 97,
      total: 100,
      rating: 'ممتاز مرتفع',
      workScore: 38,
      finalScore: 59,
      color: 'amber',
    },
  ];

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- GPA Hero Card -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex items-center justify-between">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-blue-200">التقرير الفصلي المعتمد</span>
          <h2 class="text-lg font-bold text-white">${student.fullName}</h2>
          <span class="text-xs text-slate-300">${student.gradeLevel} - ${student.section}</span>
          <div class="flex items-center gap-2 mt-2">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
              الانضباط ${student.attendanceRate}
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold">
              العام 1446هـ
            </span>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white/10 border border-white/15 p-2 shrink-0">
          <span class="text-2xl font-bold font-numbers text-white leading-none">${student.gpa}</span>
          <span class="text-[10px] text-blue-200 mt-1 font-bold">المعدل التراكمي</span>
          <span class="text-[9px] text-emerald-400 font-bold mt-0.5">ممتاز مرتفع ★</span>
        </div>
      </div>

      <!-- Action Buttons Bar -->
      <div class="flex items-center gap-2">
        <button type="button" id="btn-download-cert" class="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 text-xs font-bold press-snappy flex items-center justify-center gap-1.5 shadow-sm">
          <span class="material-symbols-outlined text-[18px] text-blue-600">download</span>
          <span>تحميل الشهادة المعتمدة PDF</span>
        </button>

        <button type="button" id="btn-open-excuse-modal" class="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold press-snappy flex items-center gap-1 border border-blue-200">
          <span class="material-symbols-outlined text-[18px]">local_hospital</span>
          <span>تقديم عذر طبي</span>
        </button>
      </div>

      <!-- Term Selector -->
      <div class="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 text-xs font-semibold">
        <button type="button" class="flex-1 py-2 rounded-xl bg-white text-slate-900 shadow-sm text-center">
          الفصل الأول النهائي
        </button>
        <button type="button" class="flex-1 py-2 rounded-xl text-slate-500 hover:text-slate-900 text-center">
          منتصف الفصل الأول
        </button>
        <button type="button" class="flex-1 py-2 rounded-xl text-slate-500 hover:text-slate-900 text-center">
          الفصل الثاني (الحالي)
        </button>
      </div>

      <!-- Subjects Breakdown Cards -->
      <div class="flex flex-col gap-2.5">
        <h3 class="text-xs font-bold text-slate-500 px-1">تفاصيل درجات المواد الدراسية</h3>

        ${subjects
          .map(
            (sub) => `
          <div class="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-2.5">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-2.5">
                <span class="w-9 h-9 rounded-xl bg-${sub.color}-50 text-${sub.color}-600 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[20px]">${sub.icon}</span>
                </span>
                <div>
                  <h4 class="text-xs font-bold text-slate-900">${sub.name}</h4>
                  <span class="text-[10px] text-slate-400">${sub.teacher}</span>
                </div>
              </div>

              <div class="text-end">
                <div class="text-xs font-bold text-slate-900 font-numbers">${sub.score} / ${sub.total}</div>
                <span class="text-[10px] text-emerald-600 font-bold">${sub.rating}</span>
              </div>
            </div>

            <!-- Progress bar -->
            <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div class="bg-blue-600 h-full rounded-full" style="width: ${sub.score}%;"></div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-numbers">
              <span>أعمال السنة: <strong class="text-slate-700">${sub.workScore} / 40</strong></span>
              <span>الاختبار النهائي: <strong class="text-slate-700">${sub.finalScore} / 60</strong></span>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <!-- Academic Counselor Note -->
      <div class="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex flex-col gap-2">
        <div class="flex items-center justify-between text-xs font-bold text-blue-900">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-blue-600">thumb_up</span>
            <span>ملاحظة المرشد الطلابي الأكاديمي</span>
          </div>
          <span class="text-[10px] text-slate-400 font-numbers">1446/04/18هـ</span>
        </div>
        <p class="text-xs text-blue-900/90 leading-relaxed text-justify">
          "يُظهر الطالب ${student.fullName.split(' ')[0]} التزاماً أكاديمياً فائقاً وشغفاً بالمشاركة في الأنشطة الصفية والمسابقات العلمية. يُعد نموذجاً متميزاً يُحتذى به في الانضباط والأخلاق الفاضلة."
        </p>
      </div>

      <!-- Medical Excuses Section -->
      <div class="flex flex-col gap-2 pt-1">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold text-slate-700">سجل الأعذار الطبية الرسمية</h3>
          <span class="text-[10px] text-slate-400">منصة صحتي</span>
        </div>

        <div class="flex flex-col gap-2" id="excuses-list-container">
          ${
            excuses.length > 0
              ? excuses
                  .map(
                    (exc) => `
            <div class="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[18px]">verified</span>
                </span>
                <div>
                  <h4 class="font-bold text-slate-800">${exc.reason}</h4>
                  <span class="text-[10px] text-slate-400">${exc.date} • ${exc.days} يوم • ${exc.source}</span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                ${exc.status}
              </span>
            </div>
          `
                  )
                  .join('')
              : `
            <div class="p-4 rounded-2xl bg-white border border-slate-200/80 text-center text-xs text-slate-400">
              لا توجد أعذار طبية مسجلة.
            </div>
          `
          }
        </div>
      </div>

    </div>

    <!-- Medical Excuse Submission Modal -->
    <div id="medical-excuse-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3.5 border border-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">local_hospital</span>
            </span>
            <h3 class="text-sm font-bold text-slate-900">تقديم عذر طبي رسمي</h3>
          </div>
          <button type="button" id="close-excuse-modal-btn" class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-slate-700">تاريخ الغياب</label>
          <input type="text" id="excuse-date-input" value="1446/05/10هـ" class="p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-numbers" />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-slate-700">عدد أيام الغياب</label>
          <select id="excuse-days-select" class="p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500">
            <option value="1">يوم واحد</option>
            <option value="2">يومان</option>
            <option value="3">ثلاثة أيام</option>
            <option value="4">أربعة أيام أو أكثر</option>
          </select>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-slate-700">التشخيص أو سبب العذر</label>
          <textarea id="excuse-reason-input" rows="2" placeholder="اكتب سبب العذر الطبي باختصار..." class="p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500 resize-none">نزلة معوية حادة وإجهاد صحي</textarea>
        </div>

        <div class="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-800 flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-blue-600 shrink-0">verified</span>
          <span>يتم التحقق آلياً والربط مع سجل الإجازات المعتمد في منصة صحتي.</span>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <button type="button" id="submit-excuse-btn" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy text-center shadow-sm">
            إرسال العذر للاعتماد
          </button>
          <button type="button" id="cancel-excuse-btn" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs press-snappy">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach event bindings
  container.querySelector('#btn-download-cert')?.addEventListener('click', () => {
    showToast('جاري إنشاء وتحميل كشف الدرجات المعتمد PDF...');
  });

  const excuseModal = container.querySelector('#medical-excuse-modal');
  const openModal = () => excuseModal?.classList.remove('hidden');
  const closeModal = () => excuseModal?.classList.add('hidden');

  container.querySelector('#btn-open-excuse-modal')?.addEventListener('click', openModal);
  container.querySelector('#close-excuse-modal-btn')?.addEventListener('click', closeModal);
  container.querySelector('#cancel-excuse-btn')?.addEventListener('click', closeModal);

  container.querySelector('#submit-excuse-btn')?.addEventListener('click', () => {
    const reason = container.querySelector('#excuse-reason-input')?.value;
    const days = container.querySelector('#excuse-days-select')?.value;
    const date = container.querySelector('#excuse-date-input')?.value;

    portalStore.submitMedicalExcuse({ reason, days, date });
    closeModal();
    renderGradesView(container, navigate);
    showToast('تم رفع العذر الطبي بنجاح وجارٍ اعتماده آلياً');
  });
}
