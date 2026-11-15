import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderHomeworkView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const allHw = portalStore.state.homework.filter(
    (h) =>
      h.studentId === student.id ||
      (h.gradeLevel && h.gradeLevel === student.gradeLevel) ||
      (!h.studentId && !h.gradeLevel)
  );
  let activeFilter = 'all';
  const expandedHwIds = new Set();

  const subjectFilters = ['all', ...new Set(allHw.map((h) => h.subject).filter(Boolean))];

  function renderList() {
    const listContainer = container.querySelector('#homework-items-list');
    if (!listContainer) return;

    const filtered =
      activeFilter === 'all' ? allHw : allHw.filter((h) => h.subject === activeFilter);

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-3 shadow-xs">
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <span class="material-symbols-outlined text-[32px]">task_alt</span>
          </div>
          <h3 class="text-sm font-bold text-slate-800 dark:text-white">لا توجد واجبات في هذا التصنيف</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            جميع التكليفات مسلّمة بالكامل أو لا توجد واجبات جديدة مسندة حالياً.
          </p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered
      .map((hw) => {
        const isExpanded = expandedHwIds.has(hw.id);
        return `
        <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col gap-3 transition-all hover:border-blue-400 cursor-pointer" data-hw-card-id="${hw.id}">
          <div class="flex items-start justify-between gap-2.5">
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <span class="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[20px]">assignment</span>
              </span>
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-blue-600 dark:text-blue-400">${hw.subject}</span>
                  <span class="text-[10px] text-slate-400">• ${hw.teacher}</span>
                </div>
                <h3 class="text-xs font-bold text-slate-800 dark:text-white mt-0.5 leading-snug truncate">${hw.title}</h3>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                hw.status === 'graded'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : hw.status === 'submitted'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }">
                ${
                  hw.status === 'graded'
                    ? `معتمد (${hw.score})`
                    : hw.status === 'submitted'
                    ? 'تم التسليم'
                    : 'بانتظار التسليم'
                }
              </span>
              <span class="material-symbols-outlined text-slate-400 text-[18px] transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-600' : ''}">
                keyboard_arrow_down
              </span>
            </div>
          </div>

          <!-- Expandable Details (Accordion) -->
          <div class="${isExpanded ? 'flex' : 'hidden'} flex-col gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs animate-fadeIn">
            ${hw.description ? `<p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">${hw.description}</p>` : ''}

            ${
              hw.teacherNote
                ? `
              <div class="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-2">
                <span class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[18px] shrink-0 mt-0.5">record_voice_over</span>
                <div><span class="font-bold">ملاحظة المعلم: </span>"${hw.teacherNote}"</div>
              </div>
            `
                : ''
            }

            <div class="flex items-center justify-between pt-1">
              <span class="text-[11px] text-slate-400 flex items-center gap-1 font-numbers">
                <span class="material-symbols-outlined text-[14px]">event</span>
                <span>${hw.dueTime}</span>
              </span>

              ${
                hw.status === 'pending'
                  ? `
                <button type="button" data-action="submit" data-id="${hw.id}" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold press-tactile flex items-center gap-1 shadow-sm">
                  <span>تسليم الإجابة الآن</span>
                  <span class="material-symbols-outlined text-[15px]">upload_file</span>
                </button>
              `
                  : `
                <span class="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>تم التسليم بنجاح</span>
                </span>
              `
              }
            </div>
          </div>
        </div>
      `;
      })
      .join('');

    // Attach card accordion toggle
    listContainer.querySelectorAll('[data-hw-card-id]').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="submit"]')) return;
        const id = card.getAttribute('data-hw-card-id');
        if (expandedHwIds.has(id)) {
          expandedHwIds.delete(id);
        } else {
          expandedHwIds.add(id);
        }
        renderList();
      });
    });

    // Attach submit button listeners
    listContainer.querySelectorAll('[data-action="submit"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const target = allHw.find((h) => h.id === id);
        if (target) openSubmitModal(target);
      });
    });
  }

  const pendingCount = allHw.filter((h) => h.status === 'pending').length;

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-32">

      <!-- Header Title & Stats -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-slate-900 dark:text-white">الواجبات والتكليفات المدرسية</h1>
          <p class="text-xs text-slate-400">${student.fullName} • ${student.gradeLevel}</p>
        </div>
        <span class="px-2.5 py-1 rounded-full ${
          pendingCount > 0
            ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
            : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
        } text-xs font-bold font-numbers">
          ${pendingCount > 0 ? `${pendingCount} واجب معلق` : 'لا توجد معلقات ✓'}
        </span>
      </div>

      <!-- Filter Tabs (Dynamic) -->
      ${
        subjectFilters.length > 2
          ? `
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          ${subjectFilters
            .map(
              (sub) => `
            <button type="button" data-filter="${sub}" class="filter-tab px-3 py-1.5 rounded-full font-bold transition-all press-tactile ${
                sub === activeFilter
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }">
              ${sub === 'all' ? `الكل (${allHw.length})` : sub}
            </button>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }

      <!-- Items List with Accordion -->
      <div id="homework-items-list" class="flex flex-col gap-3"></div>

    </div>

    <!-- Homework Submission Bottom Sheet (iOS Style) -->
    <div id="hw-submit-modal" class="hidden fixed inset-0 z-50 flex flex-col justify-end sheet-backdrop">
      <div class="fixed inset-0" id="close-hw-backdrop"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-t-[32px] p-6 shadow-2xl flex flex-col gap-4 max-w-lg mx-auto w-full sheet-panel border-t border-slate-100 dark:border-slate-800 pb-safe">
        <div class="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-1"></div>

        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white" id="submit-modal-title">تسليم الواجب المدرسي</h3>
            <span class="text-[11px] text-slate-400" id="submit-modal-subject"></span>
          </div>
          <button type="button" id="close-hw-modal-btn" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300">إجابة نصية أو ملاحظة للمعلم</label>
          <textarea id="hw-answer-text" rows="3" placeholder="اكتب إجابتك أو أي استفسار هنا..." class="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300">إرفاق ملف أو تصوير الحل</label>
          <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 rounded-2xl p-4 text-center cursor-pointer flex flex-col items-center gap-1.5 transition-colors" id="hw-file-zone">
            <span class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[26px]">cloud_upload</span>
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-300" id="hw-file-name-label">اضغط لاختيار صورة أو مستند PDF</span>
            <span class="text-[10px] text-slate-400">الحد الأقصى 15 ميجابايت</span>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <button type="button" id="confirm-submit-hw-btn" class="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy shadow-md shadow-blue-600/25 text-center">
            تأكيد التسليم الرسمي
          </button>
          <button type="button" id="cancel-submit-hw-btn" class="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs press-snappy">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  `;

  renderList();

  // Wire Filter tabs
  container.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.filter-tab').forEach((t) => {
        t.className =
          'filter-tab px-3 py-1.5 rounded-full font-bold transition-all press-tactile bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300';
      });
      tab.className =
        'filter-tab px-3 py-1.5 rounded-full font-bold transition-all press-tactile bg-blue-600 text-white shadow-xs';
      activeFilter = tab.getAttribute('data-filter');
      renderList();
    });
  });

  // Wire Submit Modal
  const modal = container.querySelector('#hw-submit-modal');
  let currentTargetHw = null;

  function openSubmitModal(hw) {
    currentTargetHw = hw;
    container.querySelector('#submit-modal-title').textContent = hw.title;
    container.querySelector('#submit-modal-subject').textContent = `${hw.subject} • ${hw.teacher}`;
    container.querySelector('#hw-answer-text').value = '';
    container.querySelector('#hw-file-name-label').textContent = 'اضغط لاختيار صورة أو مستند PDF';
    modal.classList.remove('hidden');
  }

  const closeModal = () => modal.classList.add('hidden');
  container.querySelector('#close-hw-modal-btn')?.addEventListener('click', closeModal);
  container.querySelector('#cancel-submit-hw-btn')?.addEventListener('click', closeModal);
  container.querySelector('#close-hw-backdrop')?.addEventListener('click', closeModal);

  container.querySelector('#hw-file-zone')?.addEventListener('click', () => {
    container.querySelector('#hw-file-name-label').textContent = 'تم إرفاق: حل_الواجب_المعتمد.pdf ✓';
    showToast('تم إرفاق ملف الحل بنجاح');
  });

  container.querySelector('#confirm-submit-hw-btn')?.addEventListener('click', () => {
    if (!currentTargetHw) return;
    const txt = container.querySelector('#hw-answer-text').value;
    portalStore.submitHomework(currentTargetHw.id, txt, 'حل_الواجب_المعتمد.pdf');
    closeModal();
    renderList();
    showToast('تم تسليم الواجب للمعلم بنجاح! ✓');
  });
}
