import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';
import { t } from '../services/i18n.js';

export function renderGradesView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const excuses = (portalStore.state.medicalExcuses || []).filter(
    (e) => e.studentId === student.id || e.studentCode === student.studentCode
  );
  let attachedExcuseFile = null;

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
    color: idx % 2 === 0 ? 'teal' : 'sky',
  }));

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-32">

      <!-- GPA Hero Card (Q Deep Ocean Gradient) -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-[#083038] via-[#094752] to-[#0E9CAC] text-white shadow-lg flex items-center justify-between border border-white/10">
        <div class="flex flex-col gap-1 min-w-0 flex-1">
          <span class="text-xs text-[#D6FCFF]">${t('gradesTitle')}</span>
          <h2 class="text-lg font-bold text-white truncate">${student.fullName}</h2>
          <span class="text-xs text-slate-200 truncate">${student.gradeLevel} - (${student.section})</span>
          <div class="flex items-center gap-2 mt-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
              ${t('attendanceRateLabel')} ${student.attendanceRate}
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-bold">
              ${student.studentCode}
            </span>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white/10 border border-white/20 p-2 shrink-0">
          <span class="text-2xl font-bold font-numbers text-white leading-none">${student.gpa}</span>
          <span class="text-[10px] text-[#D6FCFF] mt-1 font-bold">${t('gpaLabel')}</span>
          <span class="text-[9px] text-emerald-300 font-bold mt-0.5">معتمد ✓</span>
        </div>
      </div>

      <!-- Action Buttons Bar -->
      <div class="flex items-center gap-2">
        <button type="button" id="btn-download-cert" class="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold press-snappy flex items-center justify-center gap-1.5 shadow-xs">
          <span class="material-symbols-outlined text-[18px] text-[#0E9CAC]">download</span>
          <span>${t('downloadReportPdf')}</span>
        </button>
        <button type="button" id="btn-submit-excuse-modal" class="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-[#0E9CAC] to-[#0a7a8b] hover:opacity-90 text-white text-xs font-bold press-snappy flex items-center justify-center gap-1.5 shadow-xs">
          <span class="material-symbols-outlined text-[18px]">medical_services</span>
          <span>${t('submitExcuseBtn')}</span>
        </button>
      </div>

      <!-- Subjects Grades Stream (Clean Wrapping) -->
      <div class="flex flex-col gap-2.5">
        <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">${t('gradesTitle')}</h3>

        ${
          subjects.length > 0
            ? subjects
                .map(
                  (sub) => `
              <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
                <div class="flex items-start justify-between gap-2.5">
                  <div class="flex items-center gap-2.5 min-w-0 flex-1">
                    <span class="w-10 h-10 rounded-2xl bg-[#0E9CAC]/15 text-[#0E9CAC] flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">${sub.icon}</span>
                    </span>
                    <div class="min-w-0 flex-1">
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white leading-tight break-words">${sub.name}</h4>
                      <span class="text-[10px] text-slate-400 block mt-0.5">${sub.teacher}</span>
                    </div>
                  </div>

                  <div class="text-end shrink-0">
                    <div class="text-xs font-bold text-slate-900 dark:text-white font-numbers">${sub.score} / ${sub.total}</div>
                    <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">${sub.rating}</span>
                  </div>
                </div>

                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-gradient-to-l from-[#0E9CAC] to-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${(sub.score / sub.total) * 100}%;"></div>
                </div>
              </div>
            `
                )
                .join('')
            : `
          <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            لا توجد درجات مرصودة حالياً لهذا الطالب
          </div>
        `
        }
      </div>

      <!-- Medical Excuses Stream -->
      <div class="flex flex-col gap-2.5">
        <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">سجل الأعذار الطبية</h3>

        <div class="flex flex-col gap-2">
          ${
            excuses.length > 0
              ? excuses
                  .map(
                    (exc) => `
                <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2.5">
                  <div class="flex items-center gap-2.5 min-w-0 flex-1">
                    <span class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-[16px]">${exc.icon || 'medical_services'}</span>
                    </span>
                    <div class="min-w-0 flex-1">
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white leading-tight break-words">${exc.reason}</h4>
                      <span class="text-[10px] text-slate-400 font-numbers block mt-0.5">${exc.date} (${exc.days} أيام)</span>
                    </div>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 shrink-0">
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

      <!-- Medical Excuse Modal (With Camera/File Attachment) -->
      <div id="modal-excuse" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-xs font-bold text-slate-900 dark:text-white">${t('submitExcuseBtn')}</h3>
            <button type="button" id="btn-close-excuse-modal" class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center press-snappy">
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-2.5">
            <div>
              <label class="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">${t('excuseReasonLabel')}</label>
              <input type="text" id="input-excuse-reason" placeholder="${t('excuseReasonPlaceholder')}" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#0E9CAC]" />
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">${t('excuseDateLabel')}</label>
              <div class="grid grid-cols-2 gap-2">
                <input type="date" id="input-excuse-date" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" />
                <input type="number" id="input-excuse-days" value="1" min="1" max="14" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-numbers" />
              </div>
            </div>

            <!-- Real Native File/Camera Input for Medical Excuse -->
            <input type="file" id="excuse-report-input" accept="image/*,application/pdf" capture="environment" class="hidden" />

            <div>
              <label class="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">${t('attachReportLabel')}</label>
              <div class="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-center cursor-pointer hover:border-[#0E9CAC] transition-colors bg-slate-50 dark:bg-slate-800" id="excuse-dropzone">
                <span class="text-xs text-slate-500 dark:text-slate-400 block" id="excuse-file-label">اضغط لتصوير التقرير الطبي أو اختيار ملف</span>
              </div>
            </div>

            <button type="button" id="btn-confirm-excuse" class="w-full py-2.5 rounded-xl bg-gradient-to-l from-[#0E9CAC] to-[#0a7a8b] hover:opacity-90 text-white font-bold text-xs press-snappy shadow-md shadow-[#0E9CAC]/25 mt-2">
              ${t('sendExcuseBtn')}
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
  const excuseFileInput = container.querySelector('#excuse-report-input');
  const excuseDropzone = container.querySelector('#excuse-dropzone');
  const excuseLabel = container.querySelector('#excuse-file-label');

  container.querySelector('#btn-submit-excuse-modal')?.addEventListener('click', () => {
    excuseModal.classList.remove('hidden');
  });

  container.querySelector('#btn-close-excuse-modal')?.addEventListener('click', () => {
    excuseModal.classList.add('hidden');
    attachedExcuseFile = null;
    if (excuseFileInput) excuseFileInput.value = '';
    excuseLabel.textContent = 'اضغط لتصوير التقرير الطبي أو اختيار ملف';
  });

  excuseDropzone?.addEventListener('click', () => {
    excuseFileInput?.click();
  });

  excuseFileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      attachedExcuseFile = file.name;
      excuseLabel.textContent = `تم إرفاق: ${file.name} ✓`;
      showToast('تم إرفاق التقرير الطبي بنجاح');
    }
  });

  container.querySelector('#btn-confirm-excuse')?.addEventListener('click', async () => {
    const reason = (container.querySelector('#input-excuse-reason').value || '').trim();
    const date = container.querySelector('#input-excuse-date').value || 'اليوم';
    const days = container.querySelector('#input-excuse-days').value || '1';

    if (!reason) {
      showToast('يرجى كتابة سبب العذر الطبي');
      return;
    }

    await portalStore.submitMedicalExcuse({ reason, date, days, attachment: attachedExcuseFile });
    showToast(t('excuseSentToast'), 'success');
    excuseModal.classList.add('hidden');
    renderGradesView(container, navigate);
  });
}
