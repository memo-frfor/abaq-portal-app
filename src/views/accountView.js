import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';
import { getStoredTheme, toggleTheme } from '../services/theme.js';
import { getStoredLanguage, toggleLanguage, t } from '../services/i18n.js';
import { checkBiometricHardware, hasSavedBiometric, removeBiometricCredentials, saveBiometricCredentials } from '../services/biometrics.js';

export async function renderAccountView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const currentId = portalStore.state.activeStudentId;
  const session = portalStore.session;
  const currentTheme = getStoredTheme();
  const currentLang = getStoredLanguage();
  const hasHardwareBio = await checkBiometricHardware();
  const isBioActive = hasSavedBiometric();

  const userName = session?.user?.name || student.guardianName || 'ولي أمر معتمد';
  const userPhone = session?.user?.phone || '0555555555';

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Parent Profile Card -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-md flex items-center justify-between">
        <div class="flex items-center gap-3.5">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-inner">
            ${userName.slice(0, 2)}
          </div>
          <div class="flex flex-col">
            <h2 class="text-base font-bold text-white leading-tight">${userName}</h2>
            <span class="text-xs text-blue-200 mt-0.5">${userPhone}</span>
            <span class="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-1 font-semibold">
              <span class="material-symbols-outlined text-[13px]">verified</span>
              <span>الحساب موثق لدى إدارة المدرسة (${portalStore.state.tenantId})</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Cloud Sync Real-Time Status Card -->
      <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <span class="material-symbols-outlined text-[20px]">cloud_sync</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-bold text-slate-800 dark:text-white">المزامنة مع السحابة المركزية</span>
            <span class="text-[10px] text-slate-400">
              ${portalStore.lastSyncTime ? `آخر تحديث: ${new Date(portalStore.lastSyncTime).toLocaleTimeString('ar-SA')}` : 'متصل بالخادم'}
            </span>
          </div>
        </div>
        <button type="button" id="btn-sync-cloud-now" class="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 press-snappy flex items-center gap-1 border border-blue-200 dark:border-blue-900">
          <span class="material-symbols-outlined text-[16px]">refresh</span>
          <span>مزامنة الآن</span>
        </button>
      </div>

      <!-- Linked Children Section -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300">الطلاب والحسابات المرتبطة</h3>
          <span class="text-[10px] text-slate-400">${Object.keys(portalStore.state.students).length} مسجلين</span>
        </div>

        <div class="flex flex-col gap-2">
          ${Object.values(portalStore.state.students).map((s) => {
            const isSelected = s.id === currentId;
            return `
              <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-all ${
                isSelected ? 'ring-2 ring-blue-500/30 border-blue-500' : ''
              }">
                <div class="flex items-center gap-3">
                  <img src="${s.avatar}" alt="${s.fullName}" class="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500" />
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white">${s.fullName}</h4>
                    <span class="text-[10px] text-slate-400">${s.gradeLevel} - ${s.section} • كود: ${s.studentCode}</span>
                  </div>
                </div>

                <div class="flex items-center gap-1.5">
                  ${
                    isSelected
                      ? '<span class="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">الملف النشط ✓</span>'
                      : `<button type="button" data-switch="${s.id}" class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-bold press-snappy">تبديل</button>`
                  }
                  <button type="button" data-route="/student-id" class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center press-snappy">
                    <span class="material-symbols-outlined text-[16px]">badge</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Add Dependent Button -->
        <button type="button" id="btn-add-new-student" class="w-full py-3 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-blue-400 dark:border-blue-700 hover:bg-blue-50/50 text-blue-600 dark:text-blue-400 font-bold text-xs press-snappy flex items-center justify-center gap-2 shadow-xs">
          <span class="material-symbols-outlined text-[18px]">person_add</span>
          <span>إضافة تابع جديد / تسجيل طالب في المدرسة</span>
        </button>
      </div>

      <!-- App Preferences Section -->
      <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
        <h3 class="text-xs font-bold text-slate-800 dark:text-white px-1">تفضيلات التطبيق والمظهر</h3>

        <!-- Dark / Light Theme Toggle -->
        <div class="flex items-center justify-between py-1">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">dark_mode</span>
            </span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">الوضع الليلي والنهاري</span>
          </div>
          <button type="button" id="btn-toggle-theme-account" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 press-snappy">
            <span class="material-symbols-outlined text-[16px]">${currentTheme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            <span>${currentTheme === 'dark' ? 'الوضع الليلي' : 'الوضع النهاري'}</span>
          </button>
        </div>

        <div class="h-px bg-slate-100 dark:bg-slate-800"></div>

        <!-- Language Switcher -->
        <div class="flex items-center justify-between py-1">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">language</span>
            </span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">لغة الواجهة</span>
          </div>
          <button type="button" id="btn-toggle-lang-account" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 press-snappy">
            <span class="material-symbols-outlined text-[16px]">translate</span>
            <span>${currentLang === 'ar' ? 'العربية (AR)' : 'English (EN)'}</span>
          </button>
        </div>

        ${hasHardwareBio ? `
          <div class="h-px bg-slate-100 dark:bg-slate-800"></div>

          <!-- Biometric Switch -->
          <div class="flex items-center justify-between py-1">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">fingerprint</span>
              </span>
              <div class="flex flex-col">
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">الدخول بالبصمة / Face ID</span>
                <span class="text-[10px] text-slate-400">فتح التطبيق فورياً دون كتابة كلمة المرور</span>
              </div>
            </div>
            <button type="button" id="btn-toggle-bio-account" class="px-3 py-1.5 rounded-xl ${isBioActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'} text-xs font-bold press-snappy">
              ${isBioActive ? 'مفعّلة ✓' : 'غير مفعّلة'}
            </button>
          </div>
        ` : ''}

      </div>

      <!-- Logout Action -->
      <button type="button" id="btn-parent-logout" class="w-full py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs press-snappy flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900">
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

  // Cloud Sync Now Button
  container.querySelector('#btn-sync-cloud-now')?.addEventListener('click', async () => {
    showToast('جاري الاتصال بالسحابة ومزامنة السجلات...', 'info');
    await portalStore.syncWithCloud(true);
    showToast('تمت المزامنة بنجاح مع قاعدة البيانات', 'success');
    renderAccountView(container, navigate);
  });

  // Theme Toggle
  container.querySelector('#btn-toggle-theme-account')?.addEventListener('click', () => {
    toggleTheme();
    renderAccountView(container, navigate);
  });

  // Language Toggle
  container.querySelector('#btn-toggle-lang-account')?.addEventListener('click', () => {
    toggleLanguage();
    renderAccountView(container, navigate);
  });

  // Biometric Toggle
  container.querySelector('#btn-toggle-bio-account')?.addEventListener('click', () => {
    if (isBioActive) {
      removeBiometricCredentials();
      showToast('تم إلغاء تفعيل البصمة');
    } else {
      saveBiometricCredentials({
        role: session?.role || 'parent',
        ident: session?.user?.identifier || session?.user?.phone || 'abdo',
        schoolCode: portalStore.state.tenantId,
      });
      showToast('تم تفعيل تسجيل الدخول بالبصمة بنجاح', 'success');
    }
    renderAccountView(container, navigate);
  });

  container.querySelector('#btn-add-new-student')?.addEventListener('click', () => {
    navigate('/register');
  });

  container.querySelector('#btn-parent-logout')?.addEventListener('click', () => {
    if (confirm('هل ترغب بالفعل في تسجيل الخروج من حسابك في بوابة عبق؟')) {
      portalStore.logout();
      navigate('/login', { replace: true });
    }
  });
}
