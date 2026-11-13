import { showToast } from '../utils/toast.js';

export function renderRegisterView(container, navigate) {
  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button type="button" id="btn-reg-back" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <div>
            <h1 class="text-base font-bold text-slate-900">تسجيل طالب جديد</h1>
            <p class="text-xs text-slate-400">الالتحاق بمدارس النور الأهلية للعام 1446-1447هـ</p>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-numbers border border-blue-200">
          الخطوة 1 من 2
        </span>
      </div>

      <!-- Registration Form -->
      <div class="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3.5">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700">اسم الطالب الرباعي (كما في الهوية)</label>
          <input type="text" id="reg-name" value="سلمان محمد عبدالرحمن العتيبي" class="p-3 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700">رقم الهوية الوطنية / الإقامة</label>
            <input type="text" id="reg-id" value="1122334455" class="p-3 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-numbers" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700">المرحلة المراد التسجيل بها</label>
            <select id="reg-grade" class="p-3 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium">
              <option value="1-pri">الأول الابتدائي</option>
              <option value="kindergarten">رياض الأطفال (تمهيدي)</option>
              <option value="1-int">الأول المتوسط</option>
              <option value="1-sec">الأول الثانوي (مسارات)</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700">الصورة الشخصية للطالب (خلفية بيضاء)</label>
          <div id="reg-photo-zone" class="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer flex flex-col items-center gap-1.5 transition-colors">
            <span class="material-symbols-outlined text-blue-600 text-[26px]">photo_camera</span>
            <span class="text-xs font-semibold text-slate-700" id="reg-photo-label">اختيار صورة من الاستوديو أو التقاطها</span>
            <span class="text-[10px] text-slate-400">حجم 4×6 سم معتمدة لبطاقة الطالب</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 pt-2">
        <button type="button" id="btn-submit-reg" class="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy shadow-md flex items-center justify-center gap-1.5">
          <span>متابعة إلى خطوة القبول النهائي</span>
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
        </button>
        <button type="button" id="btn-save-reg-draft" class="px-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs press-snappy">
          حفظ كمسودة
        </button>
      </div>

    </div>
  `;

  container.querySelector('#btn-reg-back').addEventListener('click', () => navigate('/account'));

  container.querySelector('#reg-photo-zone')?.addEventListener('click', () => {
    container.querySelector('#reg-photo-label').textContent = 'تم إرفاق الصورة الشخصية بنجاح ✓';
    showToast('تم اختيار الصورة الشخصية للطالب');
  });

  container.querySelector('#btn-submit-reg')?.addEventListener('click', () => {
    showToast('تم تقديم طلب التسجيل بنجاح! جاري تحويلك إلى إشعار القبول...');
    setTimeout(() => navigate('/admission', { replace: true }), 600);
  });

  container.querySelector('#btn-save-reg-draft')?.addEventListener('click', () => {
    showToast('تم حفظ مسودة التسجيل');
    navigate('/account');
  });
}

export function renderAdmissionView(container, navigate) {
  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button type="button" id="btn-adm-back" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <div>
            <h1 class="text-base font-bold text-slate-900">إشعار القبول النهائي</h1>
            <p class="text-xs text-slate-400">وثيقة الاعتماد الأكاديمي الرسمية</p>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          مقبول نهائياً ✓
        </span>
      </div>

      <!-- Congratulatory Hero Card -->
      <div class="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white shadow-lg flex flex-col items-center text-center gap-3">
        <div class="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-emerald-300 text-3xl mb-1">
          🎓
        </div>
        <h2 class="text-lg font-bold text-white">مبارك القبول النهائي في مدارس النور!</h2>
        <p class="text-xs text-slate-200 max-w-xs leading-relaxed">
          يسر إدارة مجمع النور الأكاديمي تهنئتكم بقبول الطالب <strong class="text-emerald-300">سلمان محمد العتيبي</strong> للعام الدراسي الجديد.
        </p>

        <div class="w-full p-3 rounded-2xl bg-white/10 border border-white/15 flex justify-around text-xs font-numbers mt-2">
          <div>
            <span class="text-[10px] text-emerald-200 block">رقم الملف</span>
            <span class="font-bold text-white">STD-1447-0104</span>
          </div>
          <div class="w-px h-7 bg-white/20"></div>
          <div>
            <span class="text-[10px] text-emerald-200 block">المرحلة المقبول بها</span>
            <span class="font-bold text-white">الأول الابتدائي</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-2.5">
        <button type="button" id="btn-download-adm-form" class="w-full py-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 text-slate-800 font-bold text-xs press-snappy flex items-center justify-center gap-2 shadow-sm">
          <span class="material-symbols-outlined text-[20px] text-blue-600">download</span>
          <span>تحميل استمارة التسجيل الرسمية المعتمدة (PDF)</span>
        </button>

        <button type="button" id="btn-go-to-student-profile" class="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy flex items-center justify-center gap-2 shadow-md">
          <span>الانتقال للملف الأكاديمي الشامل للطالب</span>
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>
      </div>

    </div>
  `;

  container.querySelector('#btn-adm-back').addEventListener('click', () => navigate('/account'));

  container.querySelector('#btn-download-adm-form')?.addEventListener('click', () => {
    showToast('جاري إعداد وتحميل استمارة القبول PDF...');
  });

  container.querySelector('#btn-go-to-student-profile')?.addEventListener('click', () => {
    navigate('/home', { replace: true });
    showToast('مرحباً بك في البوابة الأكاديمية للطالب');
  });
}
