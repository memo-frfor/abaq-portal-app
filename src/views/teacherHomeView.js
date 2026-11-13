import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderTeacherHomeView(container, navigate) {
  let activeTeacherDay = 'الثلاثاء';

  container.innerHTML = `
    <!-- Teacher Header Bar -->
    <header class="sticky top-0 w-full z-40 pt-safe bg-slate-900 text-white shadow-md">
      <div class="px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
            أخ
          </div>
          <div>
            <span class="text-xs font-bold text-white block">أ. خالد بن فهد الشهري</span>
            <span class="text-[10px] text-slate-400">معلم الرياضيات • مجمع النور الأكاديمي</span>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <button type="button" id="btn-teacher-ai-prep" class="px-3 py-1.5 rounded-xl bg-gradient-to-l from-indigo-600 to-blue-600 text-white text-xs font-bold press-snappy flex items-center gap-1 shadow-sm">
            <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>تحضير ذكي</span>
          </button>
          <button type="button" id="btn-teacher-logout" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Active Lesson Hero Card -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
            الحصة القادمة (اليوم 10:25 ص)
          </span>
          <span class="text-xs text-slate-400 font-numbers">الصف 3 / أ</span>
        </div>

        <div>
          <h2 class="text-base font-bold text-white">حل المعادلات الخطية بيانياً وجبرياً</h2>
          <p class="text-xs text-slate-300 mt-0.5">الوحدة الثالثة • معمل الرياضيات والذكاء الاصطناعي</p>
        </div>

        <div class="flex items-center gap-2 pt-2 border-t border-white/10">
          <button type="button" id="btn-start-class-now" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold press-snappy flex items-center justify-center gap-1.5 shadow-sm">
            <span class="material-symbols-outlined text-[18px]">play_arrow</span>
            <span>بدء الحصة والبث المباشر</span>
          </button>
          <button type="button" id="btn-create-task-shortcut" class="py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold press-snappy flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">add</span>
            <span>إضافة تكليف</span>
          </button>
        </div>
      </div>

      <!-- Weekly Schedule Tracker -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold text-slate-700">جدول الحصص والتحضير الأسبوعي</h3>
          <span class="text-[10px] text-slate-400">الفصل الأول 1446هـ</span>
        </div>

        <div class="grid grid-cols-5 gap-1.5 text-center text-xs">
          ${['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
            .map(
              (d) => `
            <div class="p-2 rounded-xl border flex flex-col items-center gap-1 ${
              d === activeTeacherDay
                ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                : 'bg-white text-slate-700 border-slate-200'
            }">
              <span class="text-[11px]">${d}</span>
              <span class="material-symbols-outlined text-[16px] ${
                d === 'الأحد' || d === 'الإثنين'
                  ? 'text-emerald-500'
                  : d === 'الثلاثاء'
                  ? 'text-amber-300'
                  : 'text-slate-300'
              }">
                ${d === 'الأحد' || d === 'الإثنين' ? 'check_circle' : d === 'الثلاثاء' ? 'pending' : 'schedule'}
              </span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Quick Teacher Actions -->
      <div class="grid grid-cols-2 gap-2.5">
        <button type="button" id="btn-nav-create-task" class="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 shadow-sm flex items-center gap-3 press-snappy text-start">
          <span class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px]">assignment_add</span>
          </span>
          <div>
            <h4 class="text-xs font-bold text-slate-900">إنشاء تكليف / واجب</h4>
            <span class="text-[10px] text-slate-400 block mt-0.5">نشر للطلاب ومتابعة الحلول</span>
          </div>
        </button>

        <button type="button" id="btn-export-plan-pdf" class="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 shadow-sm flex items-center gap-3 press-snappy text-start">
          <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px]">picture_as_pdf</span>
          </span>
          <div>
            <h4 class="text-xs font-bold text-slate-900">تصدير الخطة PDF</h4>
            <span class="text-[10px] text-slate-400 block mt-0.5">طباعة الخطة الأسبوعية المعتمدة</span>
          </div>
        </button>
      </div>

    </div>

    <!-- AI Plan Preparation Modal -->
    <div id="teacher-ai-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3.5 border border-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">auto_awesome</span>
            </span>
            <h3 class="text-sm font-bold text-slate-900">التحضير الذكي للدرس بالذكاء الاصطناعي</h3>
          </div>
          <button type="button" id="close-ai-modal-btn" class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-slate-700">عنوان الدرس ومخرجات التعلم</label>
          <input type="text" id="ai-lesson-title" value="حل المعادلات الخطية بيانياً وجبرياً" class="p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 leading-relaxed">
          <span class="font-bold block mb-1">الخطة المقترحة آلياً:</span>
          • تهيئة حافزة بمسألة حياتية واقعية (5 دقائق).<br/>
          • شرح التمثيل البياني لنظام المعادلات (15 دقيقة).<br/>
          • نشاط جماعي وتحدي فصلي للحل الجبري (15 دقيقة).<br/>
          • تقويم ختامي وتكليف منزلي قصير (10 دقائق).
        </div>

        <button type="button" id="apply-ai-prep-btn" class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy shadow-sm text-center">
          اعتماد وتضمين في خطة الأسبوع ✓
        </button>
      </div>
    </div>

    <!-- Teacher Bottom Navigation Bar -->
    <nav class="fixed bottom-0 w-full z-40 pb-safe glass-nav shadow-lg">
      <div class="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        <button type="button" class="flex flex-col items-center justify-center text-blue-600 font-bold press-snappy">
          <span class="material-symbols-outlined text-[22px]">grid_view</span>
          <span class="text-[11px] mt-0.5">الرئيسية</span>
        </button>
        <button type="button" id="btn-tnav-tasks" class="flex flex-col items-center justify-center text-slate-400 hover:text-slate-700 press-snappy">
          <span class="material-symbols-outlined text-[22px]">assignment_turned_in</span>
          <span class="text-[11px] mt-0.5">الواجبات</span>
        </button>
        <button type="button" id="btn-tnav-logout" class="flex flex-col items-center justify-center text-slate-400 hover:text-rose-600 press-snappy">
          <span class="material-symbols-outlined text-[22px]">logout</span>
          <span class="text-[11px] mt-0.5">تسجيل خروج</span>
        </button>
      </div>
    </nav>
  `;

  // Attach event bindings
  container.querySelector('#btn-nav-create-task')?.addEventListener('click', () => navigate('/teacher/create-task'));
  container.querySelector('#btn-create-task-shortcut')?.addEventListener('click', () => navigate('/teacher/create-task'));
  container.querySelector('#btn-tnav-tasks')?.addEventListener('click', () => navigate('/teacher/create-task'));

  const logout = () => {
    if (confirm('هل ترغب بالفعل في تسجيل الخروج من بوابة الكادر التعليمي؟')) {
      navigate('/login', { replace: true });
    }
  };
  container.querySelector('#btn-teacher-logout')?.addEventListener('click', logout);
  container.querySelector('#btn-tnav-logout')?.addEventListener('click', logout);

  container.querySelector('#btn-start-class-now')?.addEventListener('click', () => {
    showToast('تم إطلاق غرفة البث المباشر للحصة وتنبيه الطلاب ✓');
  });

  container.querySelector('#btn-export-plan-pdf')?.addEventListener('click', () => {
    showToast('جاري تصدير الخطة الأسبوعية بصيغة PDF معتمدة...');
  });

  const aiModal = container.querySelector('#teacher-ai-modal');
  container.querySelector('#btn-teacher-ai-prep')?.addEventListener('click', () => {
    aiModal?.classList.remove('hidden');
  });
  container.querySelector('#close-ai-modal-btn')?.addEventListener('click', () => {
    aiModal?.classList.add('hidden');
  });
  container.querySelector('#apply-ai-prep-btn')?.addEventListener('click', () => {
    aiModal?.classList.add('hidden');
    showToast('تم اعتماد خطة التحضير الذكي وتضمينها بنجاح ✓');
  });
}
