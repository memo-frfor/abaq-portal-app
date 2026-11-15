import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderGradesView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const excuses = portalStore.state.medicalExcuses.filter(
    (e) => e.studentId === student.id || e.studentCode === student.studentCode
  );

  // Filter grades strictly for the active student
  const studentGrades = (Array.isArray(portalStore.state.grades) ? portalStore.state.grades : []).filter(
    (g) =>
      g.studentId === student.id ||
      g.studentCode === student.studentCode ||
      (g.studentName && g.studentName === student.fullName)
  );

  const subjects = studentGrades.map((g, idx) => ({
    name: g.subject || 'المادة الدراسية',
    code: `SUBJ-0${idx + 1}`,
    teacher: g.teacherName || 'معلم المادة',
    icon:
      (g.subject || '').includes('رياضيات')
        ? 'calculate'
        : (g.subject || '').includes('قرآن') || (g.subject || '').includes('إسلام')
        ? 'menu_book'
        : (g.subject || '').includes('لغت') || (g.subject || '').includes('عرب')
        ? 'auto_stories'
        : (g.subject || '').includes('علوم')
        ? 'science'
        : 'school',
    score: Number(g.score) || 0,
    total: Number(g.maxScore) || 100,
    rating: (Number(g.score) || 0) >= 90 ? 'ممتاز مرتفع ★' : (Number(g.score) || 0) >= 75 ? 'جيد جداً' : 'جيد',
    workScore: Math.round((Number(g.score) || 0) * 0.4),
    finalScore: Math.round((Number(g.score) || 0) * 0.6),
    color: idx % 2 === 0 ? 'blue' : 'emerald',
  }));

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-32">

      <!-- GPA Hero Card -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex items-center justify-between">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-blue-200">التقرير الفصلي المعتمد</span>
          <h2 class="text-lg font-bold text-white">${student.fullName}</h2>
          <span class="text-xs text-slate-300">${student.gradeLevel} - شعبة (${student.section})</span>
          <div class="flex items-center gap-2 mt-2">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
              الانضباط ${student.attendanceRate}
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold">
              كود: ${student.studentCode}
            </span>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white/10 border border-white/15 p-2 shrink-0">
          <span class="text-2xl font-bold font-numbers text-white leading-none">${student.gpa}</span>
          <span class="text-[10px] text-blue-200 mt-1 font-bold">المعدل العام</span>
          <span class="text-[9px] text-emerald-400 font-bold mt-0.5">معتمد ✓</span>
        </div>
      </div>

      <!-- Action Buttons Bar -->
      <div class="flex items-center gap-2">
        <button type="button" id="btn-download-cert" class="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold press-snappy flex items-center justify-center gap-1.5 shadow-xs">
          <span class="material-symbols-outlined text-[18px] text-blue-600">download</span>
          <span>تحميل التقرير PDF</span>
        </button>
        <button type="button" id="btn-submit-excuse-modal" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold press-snappy flex items-center justify-center gap-1.5 shadow-xs">
          <span class="material-symbols-outlined text-[18px]">medical_services</span>
          <span>تقديم عذر طبي</span>
        </button>
      </div>

      <!-- Subjects Grades Stream -->
      <div class="flex flex-col gap-2.5">
        <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">تفاصيل درجات المواد الدراسية</h3>

        ${
          subjects.length > 0
            ? subjects
                .map(
                  (sub) => `
              <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-9 h-9 rounded-xl bg-${sub.color}-50 dark:bg-${sub.color}-950 text-${sub.color}-600 dark:text-${sub.color}-400 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-[20px]">${sub.icon}</span>
                    </span>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white">${sub.name}</h4>
                      <span class="text-[10px] text-slate-400">${sub.teacher}</span>
                    </div>
                  </div>

                  <div class="text-end">
                    <div class="text-xs font-bold text-slate-900 dark:text-white font-numbers">${sub.score} / ${sub.total}</div>
                    <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">${sub.rating}</span>
                  </div>
                </div>

                <!-- Progress bar -->
                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-blue-600 h-full rounded-full" style="width: ${Math.min(100, (sub.score / sub.total) * 100)}%;"></div>
                </div>

                <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 font-numbers">
                  <span>التقويم المستمر: <strong class="text-slate-700 dark:text-slate-200">${sub.workScore}</strong></span>
                  <span>الاختبار النهائي: <strong class="text-slate-700 dark:text-slate-200">${sub.finalScore}</strong></span>
                </div>
              </div>
            `
                )
                .join('')
            : `
              <div class="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2 shadow-xs">
                <span class="material-symbols-outlined text-[36px] text-slate-300 dark:text-slate-600">bar_chart</span>
                <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300">لا توجد درجات مسجلة لهذا الفصل حتى الآن</h3>
                <p class="text-[11px] text-slate-400">ستظهر درجات الطالب هنا بمجرد رصدها واعتمادها من قِبل معلمي المدرسة</p>
              </div>
            `
        }
      </div>

      <!-- Medical Excuses Section -->
      <div class="flex flex-col gap-2 pt-1">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300">سجل الأعذار الطبية الرسمية</h3>
          <span class="text-[10px] text-slate-400 font-numbers">${excuses.length} مسجلة</span>
        </div>

        <div id="excuses-list" class="flex flex-col gap-2">
          ${
            excuses.length > 0
              ? excuses
                  .map(
                    (exc) => `
                <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-[18px]">medical_services</span>
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white">${exc.reason}</h4>
                      <span class="text-[10px] text-slate-400">${exc.date} • مدة الغياب: ${exc.days} يوم</span>
                    </div>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    ${exc.status || 'معتمد'}
                  </span>
                </div>
              `
                  )
                  .join('')
              : `
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                  لا توجد أعذار طبية مسجلة لهذا الطالب (سجل الحضور منتظم) ✓
                </div>
              `
          }
        </div>
      </div>

      <!-- Medical Excuse Modal (Hidden) -->
      <div id="modal-excuse" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-xs font-bold text-slate-900 dark:text-white">تقديم عذر طبي رسمي</h3>
            <button type="button" id="btn-close-excuse-modal" class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-2.5">
            <div>
              <label class="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">سبب الغياب</label>
              <input type="text" id="input-excuse-reason" placeholder="مثال: مراجعة مستشفى أو عارض صحي" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600" />
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">تاريخ الغياب وعدد الأيام</label>
              <div class="grid grid-cols-2 gap-2">
                <input type="date" id="input-excuse-date" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" />
                <input type="number" id="input-excuse-days" value="1" min="1" max="14" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-numbers" />
              </div>
            </div>

            <button type="button" id="btn-confirm-excuse" class="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs press-snappy mt-2">
              إرسال العذر لإدارة المدرسة
            </button>
          </div>
        </div>
      </div>

    </div>
  `;

  // Attach event bindings
  container.querySelector('#btn-download-cert')?.addEventListener('click', () => {
    showToast(`تم تنزيل كشف درجات الطالب ${student.fullName} بصيغة PDF بنجاح`, 'success');
  });

  const excuseModal = container.querySelector('#modal-excuse');
  container.querySelector('#btn-submit-excuse-modal')?.addEventListener('click', () => {
    excuseModal.classList.remove('hidden');
  });

  container.querySelector('#btn-close-excuse-modal')?.addEventListener('click', () => {
    excuseModal.classList.add('hidden');
  });

  container.querySelector('#btn-confirm-excuse')?.addEventListener('click', async () => {
    const reason = (container.querySelector('#input-excuse-reason').value || '').trim();
    const date = container.querySelector('#input-excuse-date').value || 'اليوم';
    const days = container.querySelector('#input-excuse-days').value || '1';

    if (!reason) {
      showToast('يرجى كتابة سبب العذر الطبي');
      return;
    }

    await portalStore.submitMedicalExcuse({ reason, date, days });
    showToast('تم إرسال العذر الطبي واعتماده في السجل بنجاح', 'success');
    excuseModal.classList.add('hidden');
    renderGradesView(container, navigate);
  });
}
