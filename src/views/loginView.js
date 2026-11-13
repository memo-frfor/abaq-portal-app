import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderLoginView(container, navigate) {
  let mode = 'student'; // 'student' | 'teacher'

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-sm mx-auto px-4 py-8 min-h-screen justify-between pb-safe">

      <!-- Top Branding -->
      <div class="flex flex-col items-center text-center gap-2 pt-6">
        <div class="w-16 h-16 rounded-3xl bg-blue-600 shadow-xl shadow-blue-600/30 flex items-center justify-center p-3 mb-1">
          <img src="./assets/images/img-1.jpg" alt="Abaq Logo" class="w-full h-full object-contain filter brightness-0 invert" />
        </div>
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">منظومة عبق التعليمية</h1>
        <p class="text-xs text-slate-500">البوابة الرسمية لأولياء الأمور والطلاب والمعلمين</p>
      </div>

      <!-- Main Login Container -->
      <div class="flex flex-col gap-4 my-auto py-6">

        <!-- Role Tabs Switcher -->
        <div class="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/60 shadow-inner">
          <button type="button" id="tab-student" class="flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white text-slate-900 shadow-sm transition-all">
            <span class="material-symbols-outlined text-[18px]">school</span>
            <span>ولي الأمر / الطالب</span>
          </button>
          <button type="button" id="tab-teacher" class="flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 transition-all">
            <span class="material-symbols-outlined text-[18px]">badge</span>
            <span>الكادر التعليمي</span>
          </button>
        </div>

        <!-- Student & Parent Form -->
        <div id="form-student" class="flex flex-col gap-3.5">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-700">الرقم الأكاديمي أو رقم الجوال أو الهوية</label>
            <div class="relative flex items-center">
              <span class="absolute right-3 text-slate-400 pointer-events-none">
                <span class="material-symbols-outlined text-[20px]">person</span>
              </span>
              <input type="text" id="student-ident" value="1098453210" placeholder="مثال: 1098453210 أو 0501234567" class="w-full pr-10 pl-3 py-3 rounded-2xl border border-slate-200 text-xs font-numbers font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between text-xs">
              <label class="font-bold text-slate-700">كلمة المرور</label>
              <button type="button" class="text-blue-600 font-semibold text-[11px] hover:underline" onclick="alert('يرجى التواصل مع إدارة المدرسة لاستعادة كلمة المرور');">
                نسيت كلمة المرور؟
              </button>
            </div>
            <div class="relative flex items-center">
              <span class="absolute right-3 text-slate-400 pointer-events-none">
                <span class="material-symbols-outlined text-[20px]">lock</span>
              </span>
              <input type="password" id="student-pass" value="••••••••••••" class="w-full pr-10 pl-10 py-3 rounded-2xl border border-slate-200 text-xs outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white" />
              <button type="button" id="toggle-pass-student" class="absolute left-3 text-slate-400 hover:text-slate-600">
                <span class="material-symbols-outlined text-[18px]">visibility</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-700">كود المدرسة المعتمد</label>
            <input type="text" id="student-school-code" value="NOOR-2025" class="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-numbers text-slate-600 bg-slate-50 outline-none" />
          </div>

          <button type="button" id="btn-login-student" class="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 mt-1">
            <span>تسجيل دخول الطالب / ولي الأمر</span>
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>

          <!-- Biometric Fast Login -->
          <button type="button" id="btn-bio-student" class="w-full py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs press-snappy flex items-center justify-center gap-2 border border-slate-200">
            <span class="material-symbols-outlined text-blue-600 text-[20px]">fingerprint</span>
            <span>الدخول السريع عبر البصمة / Face ID</span>
          </button>
        </div>

        <!-- Teacher Form (Initially Hidden) -->
        <div id="form-teacher" class="hidden flex flex-col gap-3.5">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-700">الرقم الوظيفي أو البريد الأكاديمي</label>
            <div class="relative flex items-center">
              <span class="absolute right-3 text-slate-400 pointer-events-none">
                <span class="material-symbols-outlined text-[20px]">badge</span>
              </span>
              <input type="text" id="teacher-ident" value="TEACH-9941" placeholder="مثال: TEACH-9941" class="w-full pr-10 pl-3 py-3 rounded-2xl border border-slate-200 text-xs font-numbers font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-700">كلمة مرور الكادر التعليمي</label>
            <div class="relative flex items-center">
              <span class="absolute right-3 text-slate-400 pointer-events-none">
                <span class="material-symbols-outlined text-[20px]">lock</span>
              </span>
              <input type="password" id="teacher-pass" value="••••••••••••" class="w-full pr-10 pl-3 py-3 rounded-2xl border border-slate-200 text-xs outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-700">كود مجمع المدارس</label>
            <input type="text" id="teacher-school-code" value="NOOR-ACAD-01" class="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-numbers text-slate-600 bg-slate-50 outline-none" />
          </div>

          <button type="button" id="btn-login-teacher" class="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs press-snappy shadow-md flex items-center justify-center gap-1.5 mt-1">
            <span>تسجيل دخول الكادر التعليمي</span>
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
        </div>

      </div>

      <!-- Footer Info -->
      <div class="flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-slate-100">
        <span>الإصدار 2.0 المحدث</span>
        <span>جميع الحقوق محفوظة © منظومة عبق</span>
      </div>

    </div>
  `;

  // Wire Tab switching
  const studentTab = container.querySelector('#tab-student');
  const teacherTab = container.querySelector('#tab-teacher');
  const studentForm = container.querySelector('#form-student');
  const teacherForm = container.querySelector('#form-teacher');

  studentTab.addEventListener('click', () => {
    mode = 'student';
    studentTab.className =
      'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white text-slate-900 shadow-sm transition-all';
    teacherTab.className =
      'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 transition-all';
    studentForm.classList.remove('hidden');
    teacherForm.classList.add('hidden');
  });

  teacherTab.addEventListener('click', () => {
    mode = 'teacher';
    teacherTab.className =
      'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 bg-white text-slate-900 shadow-sm transition-all';
    studentTab.className =
      'flex-1 py-2.5 rounded-xl font-bold text-xs press-snappy flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 transition-all';
    teacherForm.classList.remove('hidden');
    studentForm.classList.add('hidden');
  });

  // Toggle password visibility
  let passShown = false;
  container.querySelector('#toggle-pass-student')?.addEventListener('click', () => {
    passShown = !passShown;
    const inp = container.querySelector('#student-pass');
    inp.type = passShown ? 'text' : 'password';
  });

  // Wire Login actions
  container.querySelector('#btn-login-student')?.addEventListener('click', () => {
    portalStore.state.role = 'parent';
    showToast('تم تسجيل الدخول بنجاح');
    navigate('/home', { replace: true });
  });

  container.querySelector('#btn-bio-student')?.addEventListener('click', () => {
    showToast('تم التحقق عبر البصمة / Face ID بنجاح ✓');
    portalStore.state.role = 'parent';
    setTimeout(() => navigate('/home', { replace: true }), 350);
  });

  container.querySelector('#btn-login-teacher')?.addEventListener('click', () => {
    portalStore.state.role = 'teacher';
    showToast('مرحباً بك في بوابة الكادر التعليمي');
    navigate('/teacher', { replace: true });
  });
}
