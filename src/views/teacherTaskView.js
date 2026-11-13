import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderTeacherTaskView(container, navigate) {
  let taskType = 'homework'; // homework | quiz
  let selectedClass = '٣/أ';

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button type="button" id="btn-create-back" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <div>
            <h1 class="text-base font-bold text-slate-900">إنشاء ونشر تكليف دراسي</h1>
            <p class="text-xs text-slate-400">إرسال واجب أو اختبار قصير متزامن للفصل</p>
          </div>
        </div>
      </div>

      <!-- Task Type Toggle -->
      <div class="flex items-center gap-2 p-1 rounded-2xl bg-slate-100">
        <button type="button" id="type-hw-btn" class="flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white text-slate-900 shadow-sm">
          <span class="material-symbols-outlined text-[18px]">assignment</span>
          <span>واجب منزلي</span>
        </button>
        <button type="button" id="type-quiz-btn" class="flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900">
          <span class="material-symbols-outlined text-[18px]">timer</span>
          <span>اختبار قصير تفاعلي</span>
        </button>
      </div>

      <!-- Class Section Selector -->
      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-slate-700">اختر الفصل المستهدف</label>
        <div class="grid grid-cols-2 gap-2">
          <button type="button" data-class="٣/أ" class="class-pill p-3 rounded-2xl border-2 border-blue-600 bg-blue-50/60 text-slate-900 text-xs font-bold flex flex-col items-start gap-0.5 press-snappy">
            <span class="text-xs font-bold text-blue-700">الصف الثالث متوسط (أ)</span>
            <span class="text-[10px] text-slate-500">الرياضيات • 28 طالباً ✓</span>
          </button>
          <button type="button" data-class="١/ب" class="class-pill p-3 rounded-2xl border border-slate-200 bg-white text-slate-700 text-xs font-bold flex flex-col items-start gap-0.5 press-snappy">
            <span class="text-xs font-bold text-slate-800">الصف الأول متوسط (ب)</span>
            <span class="text-[10px] text-slate-400">الرياضيات • 26 طالباً</span>
          </button>
        </div>
      </div>

      <!-- Task Title & Description -->
      <div class="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700">عنوان التكليف أو الواجب</label>
          <input type="text" id="task-title-input" value="حل مسائل المتطابقات المثلثية ومعادلات جيب التمام" class="p-3 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700">التعليمات والتوجيهات للطلاب</label>
          <textarea id="task-desc-input" rows="3" class="p-3 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed">المطلوب إنجاز المسائل من رقم 1 إلى 8 بصفحة 64 مع توضيح خطوات الحل بالتفصيل وإرفاق صورة الحل أو مستند PDF.</textarea>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-slate-600">موعد التسليم النهائي</label>
            <input type="text" id="task-due-input" value="الخميس 4:00 عصراً" class="p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-numbers" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-slate-600">الدرجة المخصصة</label>
            <input type="number" id="task-score-input" value="10" class="p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-numbers" />
          </div>
        </div>
      </div>

      <!-- Add Questions from Abaq Academic Question Bank -->
      <button type="button" id="btn-add-q-bank" class="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-between press-snappy">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[20px]">local_library</span>
          <div class="text-start">
            <span class="block">إضافة أسئلة من بنك عبق الأكاديمي</span>
            <span class="text-[10px] text-blue-500 font-medium">أكثر من 120 سؤالاً معيارياً معتمداً لهذه الوحدة</span>
          </div>
        </div>
        <span class="material-symbols-outlined text-[18px]">add_circle</span>
      </button>

      <!-- Publish & Save Actions -->
      <div class="flex items-center gap-2 pt-2">
        <button type="button" id="btn-publish-task" class="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy shadow-md flex items-center justify-center gap-1.5">
          <span class="material-symbols-outlined text-[18px]">send</span>
          <span>نشر التكليف للفصل الآن</span>
        </button>
        <button type="button" id="btn-save-draft" class="px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs press-snappy">
          حفظ كمسودة
        </button>
      </div>

    </div>
  `;

  // Attach event bindings
  container.querySelector('#btn-create-back').addEventListener('click', () => navigate('/teacher'));

  container.querySelector('#type-hw-btn').addEventListener('click', () => {
    taskType = 'homework';
    container.querySelector('#type-hw-btn').className =
      'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white text-slate-900 shadow-sm';
    container.querySelector('#type-quiz-btn').className =
      'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900';
  });

  container.querySelector('#type-quiz-btn').addEventListener('click', () => {
    taskType = 'quiz';
    container.querySelector('#type-quiz-btn').className =
      'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white text-slate-900 shadow-sm';
    container.querySelector('#type-hw-btn').className =
      'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900';
  });

  container.querySelectorAll('.class-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.class-pill').forEach((p) => {
        p.className =
          'class-pill p-3 rounded-2xl border border-slate-200 bg-white text-slate-700 text-xs font-bold flex flex-col items-start gap-0.5 press-snappy';
      });
      pill.className =
        'class-pill p-3 rounded-2xl border-2 border-blue-600 bg-blue-50/60 text-slate-900 text-xs font-bold flex flex-col items-start gap-0.5 press-snappy';
      selectedClass = pill.getAttribute('data-class');
    });
  });

  container.querySelector('#btn-add-q-bank')?.addEventListener('click', () => {
    showToast('تم إدراج 3 أسئلة قياسية من بنك عبق الأكاديمي بنجاح ✓');
  });

  container.querySelector('#btn-publish-task')?.addEventListener('click', () => {
    const title = container.querySelector('#task-title-input')?.value;
    const desc = container.querySelector('#task-desc-input')?.value;
    const due = container.querySelector('#task-due-input')?.value;

    portalStore.publishTeacherTask({
      title,
      description: desc,
      dueTime: due,
      subject: 'الرياضيات',
    });

    showToast(`تم نشر التكليف بنجاح لطلاب فصل ${selectedClass} ✓`);
    setTimeout(() => navigate('/teacher', { replace: true }), 700);
  });

  container.querySelector('#btn-save-draft')?.addEventListener('click', () => {
    showToast('تم حفظ مسودة التكليف');
    navigate('/teacher');
  });
}
