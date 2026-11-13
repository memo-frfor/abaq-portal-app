import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';
import { checkBiometricHardware, hasSavedBiometric, getSavedBiometricCredentials, saveBiometricCredentials, promptBiometricAuth } from '../services/biometrics.js';
import { getStoredTheme, toggleTheme } from '../services/theme.js';
import { getStoredLanguage, toggleLanguage, t } from '../services/i18n.js';

export async function renderLoginView(container, navigate) {
  let mode = 'student'; // 'student' | 'teacher'
  const hasHardwareBio = await checkBiometricHardware();
  const hasSavedBio = hasSavedBiometric();
  const currentLang = getStoredLanguage();
  const currentTheme = getStoredTheme();

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-sm mx-auto px-4 py-6 min-h-screen justify-between pb-safe bg-slate-50 dark:bg-slate-950 transition-colors">

      <!-- Top Utilities (Lang + Theme) -->
      <div class="flex items-center justify-between w-full pt-2">
        <button type="button" id="btn-toggle-theme" class="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-xs press-snappy">
          <span class="material-symbols-outlined text-[18px]" id="theme-icon">
            ${currentTheme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <button type="button" id="btn-toggle-lang" class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-xs press-snappy flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">language</span>
          <span id="lang-text">${currentLang === 'ar' ? 'English' : 'عربي'}</span>
        </button>
      </div>

      <!-- Branding -->
      <div class="flex flex-col items-center text-center gap-2 pt-4">
        <div class="w-14 h-14 rounded-2xl bg-blue-600 dark:bg-blue-500 shadow-lg shadow-blue-600/25 flex items-center justify-center p-2.5 mb-1">
          <img src="./assets/images/img-1.jpg" alt="Abaq Logo" class="w-full h-full object-contain filter brightness-0 invert" />
        </div>
        <h1 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">${t('appName')}</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">${t('loginSubtitle')}</p>
        
        <!-- Live Cloud Status Pill -->
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold mt-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>${t('liveBadge')} (${portalStore.state.tenantId})</span>
        </div>
      </div>

      <!-- Main Login Container -->
      <div class="flex flex-col gap-4 my-auto py-4">

        <!-- Role Tabs Switcher -->
        <div class="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
          <button type="button" id="tab-student" class="flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs transition-all">
            <span class="material-symbols-outlined text-[18px]">school</span>
            <span>${t('parentTab')}</span>
          </button>
          <button type="button" id="tab-teacher" class="flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
            <span class="material-symbols-outlined text-[18px]">badge</span>
            <span>${t('teacherTab')}</span>
          </button>
        </div>

        <!-- Feedback Alert Box -->
        <div id="login-error-box" class="hidden p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
          <span class="material-symbols-outlined text-rose-500 text-[18px] shrink-0 mt-0.5">error</span>
          <span id="login-error-msg" class="flex-1 leading-relaxed"></span>
        </div>

        <!-- Student & Parent Form -->
        <div id="form-student" class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">${t('nationalIdLabel')}</label>
            <div class="relative flex items-center">
              <span class="absolute right-3 rtl:right-3 ltr:left-3 text-slate-400 pointer-events-none">
                <span class="material-symbols-outlined text-[20px]">person</span>
              </span>
              <input type="text" id="student-ident" placeholder="${t('nationalIdPlaceholder')}" class="w-full pr-10 pl-3 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-numbers font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">${t('schoolCodeLabel')}</label>
            <input type="text" id="school-code-parent" value="${portalStore.state.tenantId}" placeholder="${t('schoolCodePlaceholder')}" class="w-full px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-numbers text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-blue-600" />
          </div>

          <button type="button" id="btn-login-student" class="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 mt-1">
            <span id="btn-login-text">${t('loginBtn')}</span>
            <span class="material-symbols-outlined text-[18px]" id="btn-login-icon">arrow_back</span>
          </button>

          <!-- Biometric Login (Only if Hardware & Credentials exist) -->
          <button type="button" id="btn-bio-student" class="${hasHardwareBio && hasSavedBio ? '' : 'hidden'} w-full py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs press-snappy flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">fingerprint</span>
            <span>${t('biometricBtn')}</span>
          </button>
        </div>

        <!-- Teacher Form -->
        <div id="form-teacher" class="hidden flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">${t('teacherUserLabel')}</label>
            <div class="relative flex items-center">
              <span class="absolute right-3 rtl:right-3 ltr:left-3 text-slate-400 pointer-events-none">
                <span class="material-symbols-outlined text-[20px]">badge</span>
              </span>
              <input type="text" id="teacher-ident" placeholder="${t('teacherUserPlaceholder')}" class="w-full pr-10 pl-3 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-numbers font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between text-xs">
              <label class="font-bold text-slate-700 dark:text-slate-300">${t('passwordLabel')}</label>
            </div>
            <div class="relative flex items-center">
              <span class="absolute right-3 rtl:right-3 ltr:left-3 text-slate-400 pointer-events-none">
                <span class="material-symbols-outlined text-[20px]">lock</span>
              </span>
              <input type="password" id="teacher-pass" placeholder="${t('passwordPlaceholder')}" class="w-full pr-10 pl-10 rtl:pr-10 rtl:pl-10 ltr:pl-10 ltr:pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              <button type="button" id="toggle-pass-teacher" class="absolute left-3 rtl:left-3 ltr:right-3 text-slate-400 hover:text-slate-600">
                <span class="material-symbols-outlined text-[18px]">visibility</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">${t('schoolCodeLabel')}</label>
            <input type="text" id="school-code-teacher" value="${portalStore.state.tenantId}" placeholder="${t('schoolCodePlaceholder')}" class="w-full px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-numbers text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:border-blue-600" />
          </div>

          <button type="button" id="btn-login-teacher" class="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white font-bold text-xs press-snappy shadow-md flex items-center justify-center gap-2 mt-1">
            <span id="btn-login-teacher-text">${t('loginBtn')}</span>
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
        </div>

      </div>

      <!-- Footer Info -->
      <div class="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
        <span>الإصدار 2.5 السحابي</span>
        <span>بوابة عبق المعتمدة</span>
      </div>

      <!-- Biometric Enrollment Prompt Modal (Hidden) -->
      <div id="bio-enroll-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-3">
          <div class="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <span class="material-symbols-outlined text-[32px]">fingerprint</span>
          </div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">تفعيل البصمة للجهاز</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${t('enableBiometricPrompt')}</p>
          <div class="flex items-center gap-2 w-full pt-2">
            <button type="button" id="btn-bio-enable-yes" class="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold press-snappy">
              ${t('enableBiometricYes')}
            </button>
            <button type="button" id="btn-bio-enable-no" class="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold press-snappy">
              ${t('enableBiometricNo')}
            </button>
          </div>
        </div>
      </div>

    </div>
  `;

  // Attach event handlers
  const tabStudent = container.querySelector('#tab-student');
  const tabTeacher = container.querySelector('#tab-teacher');
  const formStudent = container.querySelector('#form-student');
  const formTeacher = container.querySelector('#form-teacher');
  const errorBox = container.querySelector('#login-error-box');
  const errorMsg = container.querySelector('#login-error-msg');

  function showError(msg) {
    if (msg) {
      errorMsg.textContent = msg;
      errorBox.classList.remove('hidden');
    } else {
      errorBox.classList.add('hidden');
    }
  }

  tabStudent.addEventListener('click', () => {
    mode = 'student';
    showError(null);
    tabStudent.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs transition-all';
    tabTeacher.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
    formStudent.classList.remove('hidden');
    formTeacher.classList.add('hidden');
  });

  tabTeacher.addEventListener('click', () => {
    mode = 'teacher';
    showError(null);
    tabTeacher.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs transition-all';
    tabStudent.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
    formTeacher.classList.remove('hidden');
    formStudent.classList.add('hidden');
  });

  // Theme Toggle
  container.querySelector('#btn-toggle-theme').addEventListener('click', () => {
    const nextTheme = toggleTheme();
    const icon = container.querySelector('#theme-icon');
    if (icon) icon.textContent = nextTheme === 'dark' ? 'light_mode' : 'dark_mode';
  });

  // Language Toggle
  container.querySelector('#btn-toggle-lang').addEventListener('click', () => {
    toggleLanguage();
    renderLoginView(container, navigate);
  });

  // Password Visibility Toggle
  const togglePassTeacher = container.querySelector('#toggle-pass-teacher');
  if (togglePassTeacher) {
    togglePassTeacher.addEventListener('click', () => {
      const input = container.querySelector('#teacher-pass');
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  }

  // Student Login Action
  const btnLoginStudent = container.querySelector('#btn-login-student');
  btnLoginStudent.addEventListener('click', async () => {
    const ident = (container.querySelector('#student-ident').value || '').trim();
    const schoolCode = (container.querySelector('#school-code-parent').value || 'abdo').trim();

    if (!ident) {
      showError('يرجى إدخال رقم الهوية الوطنية أو رقم الجوال أو الرقم الأكاديمي');
      return;
    }

    showError(null);
    btnLoginStudent.disabled = true;
    const txt = container.querySelector('#btn-login-text');
    txt.textContent = t('loggingIn');

    const res = await portalStore.loginParent(ident, schoolCode);
    btnLoginStudent.disabled = false;
    txt.textContent = t('loginBtn');

    if (res.success) {
      showToast('تم تسجيل الدخول بنجاح', 'success');
      
      // If device has biometric hardware and not enrolled yet, ask user
      if (hasHardwareBio && !hasSavedBio) {
        const modal = container.querySelector('#bio-enroll-modal');
        modal.classList.remove('hidden');
        
        container.querySelector('#btn-bio-enable-yes').onclick = () => {
          saveBiometricCredentials({ role: 'parent', ident, schoolCode });
          modal.classList.add('hidden');
          navigate('/home');
        };
        container.querySelector('#btn-bio-enable-no').onclick = () => {
          modal.classList.add('hidden');
          navigate('/home');
        };
      } else {
        navigate('/home');
      }
    } else {
      showError(res.error || 'فشل التحقق من بيانات الدخول');
    }
  });

  // Biometric Fast Login Action
  const btnBio = container.querySelector('#btn-bio-student');
  if (btnBio) {
    btnBio.addEventListener('click', async () => {
      const saved = getSavedBiometricCredentials();
      if (!saved) return;

      const bioResult = await promptBiometricAuth();
      if (bioResult.success) {
        showToast('تم التحقق من البصمة بنجاح', 'success');
        if (saved.role === 'teacher') {
          await portalStore.loginTeacher(saved.ident, saved.password, saved.schoolCode);
          navigate('/teacher');
        } else {
          await portalStore.loginParent(saved.ident, saved.schoolCode);
          navigate('/home');
        }
      } else {
        showError(bioResult.error || 'تعذر التحقق عبر البصمة');
      }
    });
  }

  // Teacher Login Action
  const btnLoginTeacher = container.querySelector('#btn-login-teacher');
  btnLoginTeacher.addEventListener('click', async () => {
    const user = (container.querySelector('#teacher-ident').value || '').trim();
    const pass = (container.querySelector('#teacher-pass').value || '').trim();
    const schoolCode = (container.querySelector('#school-code-teacher').value || 'abdo').trim();

    if (!user || !pass) {
      showError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    showError(null);
    btnLoginTeacher.disabled = true;
    const txt = container.querySelector('#btn-login-teacher-text');
    txt.textContent = t('loggingIn');

    const res = await portalStore.loginTeacher(user, pass, schoolCode);
    btnLoginTeacher.disabled = false;
    txt.textContent = t('loginBtn');

    if (res.success) {
      showToast('مرحباً بك في بوابة المعلم', 'success');
      navigate('/teacher');
    } else {
      showError(res.error || 'بيانات الدخول غير صحيحة');
    }
  });
}
