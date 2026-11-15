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
  const isEn = currentLang === 'en';
  const hasHardwareBio = await checkBiometricHardware();
  const isBioActive = hasSavedBiometric();

  const userName = session?.user?.name || student.guardianName || (isEn ? 'Authorized Guardian' : 'ولي أمر معتمد');
  const userPhone = session?.user?.phone || '0555555555';

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-32">

      <!-- Parent Profile Card (Q Deep Teal) -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-[#083038] via-[#094752] to-[#0E9CAC] text-white shadow-lg flex items-center justify-between border border-white/10">
        <div class="flex items-center gap-3.5 min-w-0">
          <div class="w-14 h-14 rounded-2xl bg-white/15 text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0 border border-white/20">
            ${userName.slice(0, 2)}
          </div>
          <div class="flex flex-col min-w-0">
            <h2 class="text-base font-bold text-white leading-tight truncate">${userName}</h2>
            <span class="text-xs text-[#D6FCFF] mt-0.5 font-numbers">${userPhone}</span>
            <span class="inline-flex items-center gap-1 text-[10px] text-emerald-300 mt-1 font-semibold truncate">
              <span class="material-symbols-outlined text-[13px]">verified</span>
              <span>${t('verifiedSchool')} (${portalStore.state.tenantId})</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Cloud Sync Real-Time Status Card -->
      <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[20px]">cloud_sync</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-xs font-bold text-slate-800 dark:text-white truncate">${t('cloudSyncTitle')}</span>
            <span class="text-[10px] text-slate-400 font-numbers truncate">
              ${portalStore.lastSyncTime ? `${t('lastSyncLabel')} ${new Date(portalStore.lastSyncTime).toLocaleTimeString(isEn ? 'en-US' : 'ar-SA')}` : t('verifiedSchool')}
            </span>
          </div>
        </div>
        <button type="button" id="btn-sync-cloud-now" class="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 press-snappy flex items-center gap-1 border border-blue-200 dark:border-blue-900 shrink-0">
          <span class="material-symbols-outlined text-[16px]">refresh</span>
          <span>${t('syncNowBtn')}</span>
        </button>
      </div>

      <!-- Linked Children Section -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300">${t('linkedProfiles')}</h3>
          <span class="text-[10px] text-slate-400 font-numbers">${Object.keys(portalStore.state.students).length}</span>
        </div>

        <div class="flex flex-col gap-2">
          ${Object.values(portalStore.state.students).map((s) => {
            const isSelected = s.id === currentId;
            return `
              <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-all ${
                isSelected ? 'ring-2 ring-[#0E9CAC]/30 border-[#0E9CAC]' : ''
              }">
                <div class="flex items-center gap-3 min-w-0">
                  <img src="${s.avatar}" alt="${s.fullName}" class="w-10 h-10 rounded-full object-cover ring-2 ring-[#0E9CAC] shrink-0" />
                  <div class="min-w-0">
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">${s.fullName}</h4>
                    <span class="text-[10px] text-slate-400 truncate block">${s.gradeLevel} - ${s.section} • ${s.studentCode}</span>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                  ${
                    isSelected
                      ? `<span class="px-2.5 py-1 rounded-full bg-[#0E9CAC]/15 text-[#0E9CAC] dark:text-[#7bcfd6] text-[10px] font-bold">${t('activeProfileBadge')}</span>`
                      : `<button type="button" data-switch="${s.id}" class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-bold press-snappy">${t('switchProfile')}</button>`
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
        <button type="button" id="btn-add-new-student" class="w-full py-3 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-[#0E9CAC] hover:bg-[#0E9CAC]/5 text-[#0E9CAC] dark:text-[#7bcfd6] font-bold text-xs press-snappy flex items-center justify-center gap-2 shadow-xs transition-colors">
          <span class="material-symbols-outlined text-[18px]">person_add</span>
          <span>${t('addDependent')}</span>
        </button>
      </div>

      <!-- App Preferences Section -->
      <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
        <h3 class="text-xs font-bold text-slate-800 dark:text-white px-1">${t('appPreferences')}</h3>

        <!-- Dark / Light Theme Toggle -->
        <div class="flex items-center justify-between py-1">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">dark_mode</span>
            </span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">${t('themeMode')}</span>
          </div>
          <button type="button" id="btn-toggle-theme-account" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 press-snappy">
            <span class="material-symbols-outlined text-[16px]">${currentTheme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            <span>${currentTheme === 'dark' ? t('themeDark') : t('themeLight')}</span>
          </button>
        </div>

        <div class="h-px bg-slate-100 dark:bg-slate-800"></div>

        <!-- Language Switcher -->
        <div class="flex items-center justify-between py-1">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-[#0E9CAC]/15 text-[#0E9CAC] dark:text-[#7bcfd6] flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">language</span>
            </span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">${t('appLanguage')}</span>
          </div>
          <button type="button" id="btn-toggle-lang-account" class="px-3.5 py-1.5 rounded-xl bg-[#0E9CAC] text-white text-xs font-bold flex items-center gap-1.5 press-snappy shadow-xs hover:bg-[#0b8a9e]">
            <span class="material-symbols-outlined text-[16px]">translate</span>
            <span>${isEn ? 'English (EN) ✓' : 'العربية (AR) ✓'}</span>
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
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">${t('biometricTitle')}</span>
                <span class="text-[10px] text-slate-400">${t('biometricDesc')}</span>
              </div>
            </div>
            <button type="button" id="btn-toggle-bio-account" class="px-3 py-1.5 rounded-xl ${isBioActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'} text-xs font-bold press-snappy">
              ${isBioActive ? t('bioActive') : t('bioInactive')}
            </button>
          </div>
        ` : ''}

      </div>

      <!-- School Direct Channels Card -->
      <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
        <h3 class="text-xs font-bold text-slate-800 dark:text-white px-1">${t('schoolContactTitle')}</h3>
        <div class="grid grid-cols-2 gap-2">
          <a href="https://wa.me/966555555555?text=${encodeURIComponent('السلام عليكم، استفسار بخصوص الطالب في مدارس عبق')}" target="_blank" class="py-2.5 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-900 press-snappy">
            <span class="material-symbols-outlined text-[18px]">chat</span>
            <span>${t('whatsappBtn')}</span>
          </a>
          <a href="tel:0555555555" class="py-2.5 px-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-900 press-snappy">
            <span class="material-symbols-outlined text-[18px]">call</span>
            <span>${t('callBtn')}</span>
          </a>
        </div>
      </div>

      <!-- App Info & Live Update Checker -->
      <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
            <span class="material-symbols-outlined text-[18px]">system_update</span>
          </span>
          <div class="flex flex-col">
            <span class="text-xs font-bold text-slate-800 dark:text-white">${t('appVersion')} v2.6 (Signed Release)</span>
            <span class="text-[10px] text-slate-400">Production Cloud Build</span>
          </div>
        </div>
      </div>

      <!-- Logout Action -->
      <button type="button" id="btn-parent-logout" class="w-full py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs press-snappy flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900">
        <span class="material-symbols-outlined text-[18px]">logout</span>
        <span>${t('logoutBtn')}</span>
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
      showToast(`${t('switchProfile')}: ${portalStore.getActiveStudent().fullName}`);
    });
  });

  // Cloud Sync Now Button
  container.querySelector('#btn-sync-cloud-now')?.addEventListener('click', async () => {
    showToast(isEn ? 'Syncing records with cloud...' : 'جاري الاتصال بالسحابة ومزامنة السجلات...', 'info');
    await portalStore.syncWithCloud(true);
    showToast(t('syncedToast'), 'success');
    renderAccountView(container, navigate);
  });

  // Theme Toggle
  container.querySelector('#btn-toggle-theme-account')?.addEventListener('click', () => {
    toggleTheme();
    renderAccountView(container, navigate);
  });

  // Language Toggle (Instant AR <-> EN with global re-render)
  container.querySelector('#btn-toggle-lang-account')?.addEventListener('click', () => {
    const nextLang = toggleLanguage();
    showToast(nextLang === 'en' ? 'Switched to English' : 'تم التحويل إلى اللغة العربية', 'success');
  });

  // Biometric Toggle
  container.querySelector('#btn-toggle-bio-account')?.addEventListener('click', () => {
    if (isBioActive) {
      removeBiometricCredentials();
      showToast(isEn ? 'Biometrics disabled' : 'تم إلغاء تفعيل البصمة');
    } else {
      saveBiometricCredentials({
        role: session?.role || 'parent',
        ident: session?.user?.identifier || session?.user?.phone || 'abdo',
        schoolCode: portalStore.state.tenantId,
      });
      showToast(isEn ? 'Biometrics enabled successfully' : 'تم تفعيل تسجيل الدخول بالبصمة بنجاح', 'success');
    }
    renderAccountView(container, navigate);
  });

  container.querySelector('#btn-add-new-student')?.addEventListener('click', () => {
    navigate('/register');
  });

  container.querySelector('#btn-parent-logout')?.addEventListener('click', () => {
    const confirmMsg = isEn ? 'Are you sure you want to sign out from the portal?' : 'هل ترغب بالفعل في تسجيل الخروج من حسابك في بوابة عبق؟';
    if (confirm(confirmMsg)) {
      portalStore.logout();
      navigate('/login', { replace: true });
    }
  });
}
