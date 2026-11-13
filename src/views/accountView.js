import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';
import { openStudentSwitchSheet } from '../components/sharedHeader.js';

export function renderAccountView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const currentId = portalStore.state.activeStudentId;

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Parent Profile Card -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-md flex items-center justify-between">
        <div class="flex items-center gap-3.5">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-inner">
            م ع
          </div>
          <div class="flex flex-col">
            <h2 class="text-base font-bold text-white leading-tight">محمد بن عبدالرحمن العتيبي</h2>
            <span class="text-xs text-blue-200 mt-0.5">ولي أمر معتمد • 0501234567</span>
            <span class="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-1 font-semibold">
              <span class="material-symbols-outlined text-[13px]">verified</span>
              <span>الحساب موثق لدى إدارة المدارس</span>
            </span>
          </div>
        </div>

        <button type="button" id="btn-edit-profile" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center press-snappy border border-white/10">
          <span class="material-symbols-outlined text-[18px]">edit</span>
        </button>
      </div>

      <!-- Linked Children Section -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold text-slate-700">الأبناء والحسابات المرتبطة</h3>
          <span class="text-[10px] text-slate-400">2 طلاب مسجلين</span>
        </div>

        <div class="flex flex-col gap-2">
          <!-- Abdulrahman -->
          <div class="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between transition-all ${
            currentId === 'abdulrahman' ? 'ring-2 ring-blue-500/30 border-blue-500' : ''
          }">
            <div class="flex items-center gap-3">
              <img src="./assets/images/img-2.jpg" alt="عبدالرحمن" class="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500" />
              <div>
                <h4 class="text-xs font-bold text-slate-900">عبدالرحمن محمد العتيبي</h4>
                <span class="text-[10px] text-slate-400">الصف الثالث المتوسط - أ • حافلة 14</span>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              ${
                currentId === 'abdulrahman'
                  ? '<span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">الملف النشط ✓</span>'
                  : `<button type="button" data-switch="abdulrahman" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold press-snappy">تبديل</button>`
              }
              <button type="button" data-route="/student-id" class="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center press-snappy">
                <span class="material-symbols-outlined text-[16px]">badge</span>
              </button>
            </div>
          </div>

          <!-- Sara -->
          <div class="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between transition-all ${
            currentId === 'sara' ? 'ring-2 ring-blue-500/30 border-blue-500' : ''
          }">
            <div class="flex items-center gap-3">
              <img src="./assets/images/img-16.jpg" alt="سارة" class="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500" />
              <div>
                <h4 class="text-xs font-bold text-slate-900">سارة محمد العتيبي</h4>
                <span class="text-[10px] text-slate-400">الصف الرابع الابتدائي - ب • حافلة 08</span>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              ${
                currentId === 'sara'
                  ? '<span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">الملف النشط ✓</span>'
                  : `<button type="button" data-switch="sara" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold press-snappy">تبديل</button>`
              }
              <button type="button" data-route="/student-id" class="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center press-snappy">
                <span class="material-symbols-outlined text-[16px]">badge</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Add Dependent Button -->
        <button type="button" id="btn-add-new-student" class="w-full py-3 rounded-2xl bg-white border border-dashed border-blue-400 hover:bg-blue-50/50 text-blue-600 font-bold text-xs press-snappy flex items-center justify-center gap-2 shadow-sm">
          <span class="material-symbols-outlined text-[18px]">person_add</span>
          <span>إضافة تابع جديد / تسجيل طالب في المدرسة</span>
        </button>
      </div>

      <!-- App Preferences Section -->
      <div class="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3">
        <h3 class="text-xs font-bold text-slate-800 px-1">تفضيلات التطبيق والمظهر</h3>

        <!-- Language toggle -->
        <div class="flex items-center justify-between py-1">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">language</span>
            </span>
            <span class="text-xs font-bold text-slate-800">لغة الواجهة</span>
          </div>
          <div class="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 text-xs">
            <button type="button" class="px-3 py-1 rounded-lg bg-white text-slate-900 font-bold shadow-sm">العربية</button>
            <button type="button" class="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800">English</button>
          </div>
        </div>

        <div class="h-px bg-slate-100"></div>

        <!-- Calendar toggle -->
        <div class="flex items-center justify-between py-1">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">calendar_month</span>
            </span>
            <span class="text-xs font-bold text-slate-800">التقويم الأكاديمي</span>
          </div>
          <div class="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 text-xs">
            <button type="button" class="px-3 py-1 rounded-lg bg-white text-slate-900 font-bold shadow-sm">أم القرى (هجري)</button>
            <button type="button" class="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800">الميلادي</button>
          </div>
        </div>
      </div>

      <!-- Logout Action -->
      <button type="button" id="btn-parent-logout" class="w-full py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs press-snappy flex items-center justify-center gap-2 border border-rose-200">
        <span class="material-symbols-outlined text-[18px]">logout</span>
        <span>تسجيل الخروج من البوابة</span>
      </button>

    </div>
  `;

  // Attach event bindings
  container.querySelectorAll('[data-route]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const route = btn.getAttribute('data-route');
      navigate(route);
    });
  });

  container.querySelectorAll('[data-switch]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-switch');
      portalStore.setActiveStudent(id);
      renderAccountView(container, navigate);
      showToast(`تم التبديل إلى ملف: ${portalStore.getActiveStudent().fullName}`);
    });
  });

  container.querySelector('#btn-add-new-student')?.addEventListener('click', () => {
    navigate('/register');
  });

  container.querySelector('#btn-edit-profile')?.addEventListener('click', () => {
    showToast('تعديل الملف الشخصي لولي الأمر');
  });

  container.querySelector('#btn-parent-logout')?.addEventListener('click', () => {
    if (confirm('هل ترغب بالفعل في تسجيل الخروج من حساب ولي الأمر في بوابة عبق؟')) {
      portalStore.state.role = null;
      navigate('/login', { replace: true });
    }
  });
}
