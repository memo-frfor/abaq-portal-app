import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderHomeworkView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const allHw = portalStore.state.homework.filter((h) => !h.studentId || h.studentId === student.id);
  let activeFilter = 'all';

  function renderList() {
    const listContainer = container.querySelector('#homework-items-list');
    if (!listContainer) return;

    const filtered =
      activeFilter === 'all' ? allHw : allHw.filter((h) => h.subject.includes(activeFilter));

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-[32px] text-slate-300">task_alt</span>
          <p class="text-xs">لا توجد واجبات في هذا التصنيف حالياً</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered
      .map(
        (hw) => `
      <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3 transition-all hover:border-blue-400" data-hw-id="${
        hw.id
      }">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-900">${hw.subject}</span>
              <span class="text-[10px] text-slate-400">• ${hw.teacher}</span>
            </div>
            <h3 class="text-sm font-bold text-slate-800 mt-1 leading-snug">${hw.title}</h3>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            hw.status === 'graded'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : hw.status === 'submitted'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }">
            ${
              hw.status === 'graded'
                ? `معتمد (${hw.score})`
                : hw.status === 'submitted'
                ? 'تم التسليم'
                : 'بانتظار التسليم'
            }
          </span>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed">${hw.description}</p>

        ${
          hw.teacherNote
            ? `
          <div class="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
            <span class="material-symbols-outlined text-amber-600 text-[16px] shrink-0 mt-0.5">record_voice_over</span>
            <div><span class="font-bold">ملاحظة المعلم: </span>"${hw.teacherNote}"</div>
          </div>
        `
            : ''
        }

        <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span class="text-[11px] text-slate-400 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">event</span>
            <span>${hw.dueTime}</span>
          </span>

          ${
            hw.status === 'pending'
              ? `
            <button type="button" data-action="submit" data-id="${hw.id}" class="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold press-snappy flex items-center gap-1 shadow-sm">
              <span>تسليم الحل</span>
              <span class="material-symbols-outlined text-[14px]">upload_file</span>
            </button>
          `
              : `
            <span class="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px]">check_circle</span>
              <span>مكتمل</span>
            </span>
          `
          }
        </div>
      </div>
    `
      )
      .join('');

    // Attach submit button listeners
    listContainer.querySelectorAll('[data-action="submit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const target = allHw.find((h) => h.id === id);
        if (target) openSubmitModal(target);
      });
    });
  }

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Header Title & Stats -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-slate-900">الواجبات والاختبارات المدرسية</h1>
          <p class="text-xs text-slate-400">متابعة التكليفات الأكاديمية وتسليم الإجابات</p>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-numbers border border-blue-200">
          ${allHw.filter((h) => h.status === 'pending').length} واجب متبقي
        </span>
      </div>

      <!-- Quick Quiz Hero Banner -->
      <div class="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
            <span class="material-symbols-outlined text-[24px]">timer</span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-white">اختبار قصير نشط</span>
              <span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">12 دقيقة</span>
            </div>
            <p class="text-[11px] text-slate-300 mt-0.5">مبادئ الذكاء الاصطناعي والبرمجة</p>
          </div>
        </div>
        <button type="button" id="btn-hero-quiz" class="px-3.5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold press-snappy shrink-0 shadow-sm">
          بدء الاختبار
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button type="button" data-filter="all" class="filter-tab px-3 py-1.5 rounded-full font-bold transition-all press-snappy bg-blue-600 text-white shadow-sm">
          الكل (${allHw.length})
        </button>
        <button type="button" data-filter="الرياضيات" class="filter-tab px-3 py-1.5 rounded-full font-bold transition-all press-snappy bg-white border border-slate-200 text-slate-600">
          الرياضيات
        </button>
        <button type="button" data-filter="العلوم" class="filter-tab px-3 py-1.5 rounded-full font-bold transition-all press-snappy bg-white border border-slate-200 text-slate-600">
          العلوم الطبيعية
        </button>
        <button type="button" data-filter="لغتي" class="filter-tab px-3 py-1.5 rounded-full font-bold transition-all press-snappy bg-white border border-slate-200 text-slate-600">
          لغتي
        </button>
      </div>

      <!-- Items List -->
      <div id="homework-items-list" class="flex flex-col gap-3"></div>

    </div>

    <!-- Homework Submission Modal -->
    <div id="hw-submit-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3.5 border border-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 class="text-sm font-bold text-slate-900" id="submit-modal-title">تسليم الواجب</h3>
            <span class="text-[11px] text-slate-400" id="submit-modal-subject"></span>
          </div>
          <button type="button" id="close-hw-modal-btn" class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-slate-700">إجابة نصية أو ملاحظة للمعلم</label>
          <textarea id="hw-answer-text" rows="3" placeholder="اكتب إجابتك أو أي استفسار هنا..." class="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-slate-700">إرفاق ملف أو تصوير الحل</label>
          <div class="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer flex flex-col items-center gap-1.5 transition-colors" id="hw-file-zone">
            <span class="material-symbols-outlined text-blue-600 text-[26px]">cloud_upload</span>
            <span class="text-xs font-semibold text-slate-700" id="hw-file-name-label">اضغط لاختيار صورة أو مستند PDF</span>
            <span class="text-[10px] text-slate-400">الحد الأقصى 15 ميجابايت</span>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <button type="button" id="confirm-submit-hw-btn" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy shadow-sm text-center">
            تأكيد التسليم الرسمي
          </button>
          <button type="button" id="cancel-submit-hw-btn" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs press-snappy">
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
          'filter-tab px-3 py-1.5 rounded-full font-bold transition-all press-snappy bg-white border border-slate-200 text-slate-600';
      });
      tab.className =
        'filter-tab px-3 py-1.5 rounded-full font-bold transition-all press-snappy bg-blue-600 text-white shadow-sm';
      activeFilter = tab.getAttribute('data-filter');
      renderList();
    });
  });

  container.querySelector('#btn-hero-quiz')?.addEventListener('click', () => navigate('/quiz'));

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

  container.querySelector('#hw-file-zone')?.addEventListener('click', () => {
    container.querySelector('#hw-file-name-label').textContent = 'تم إرفاق: حل_التمارين_ص64.pdf ✓';
    showToast('تم إرفاق ملف الحل بنجاح');
  });

  container.querySelector('#confirm-submit-hw-btn')?.addEventListener('click', () => {
    if (!currentTargetHw) return;
    const txt = container.querySelector('#hw-answer-text').value;
    portalStore.submitHomework(currentTargetHw.id, txt, 'حل_التمارين_ص64.pdf');
    closeModal();
    renderList();
    showToast('تم تسليم الواجب للمعلم بنجاح! ✓');
  });
}
