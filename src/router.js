import screen1Html from './screens/screen1.html?raw';
import screen2Html from './screens/screen2.html?raw';
import screen3Html from './screens/screen3.html?raw';
import screen4Html from './screens/screen4.html?raw';
import screen5Html from './screens/screen5.html?raw';
import screen6Html from './screens/screen6.html?raw';
import screen7Html from './screens/screen7.html?raw';
import screen8Html from './screens/screen8.html?raw';
import screen9Html from './screens/screen9.html?raw';
import screen10Html from './screens/screen10.html?raw';
import screen11Html from './screens/screen11.html?raw';
import screen12Html from './screens/screen12.html?raw';
import screen13Html from './screens/screen13.html?raw';
import screen14Html from './screens/screen14.html?raw';

import screen1Js from './screens/screen1.inline.js?raw';
import screen2Js from './screens/screen2.inline.js?raw';
import screen4Js from './screens/screen4.inline.js?raw';
import screen5Js from './screens/screen5.inline.js?raw';
import screen6Js from './screens/screen6.inline.js?raw';
import screen8Js from './screens/screen8.inline.js?raw';
import screen9Js from './screens/screen9.inline.js?raw';
import screen10Js from './screens/screen10.inline.js?raw';
import screen11Js from './screens/screen11.inline.js?raw';
import screen14Js from './screens/screen14.inline.js?raw';

import meta from './screens/meta.json';
import {
  renderSharedParentBottomNav,
  attachParentHeaderActions,
  wireTeacherBottomNav,
} from './components/sharedNav.js';
import { showToast } from './utils/toast.js';
import {
  loadSavedSession,
  saveSession,
  loginGuardianOrStudent,
  fetchPortalEducationalData,
  submitPaymentReceipt,
  logoutSession,
} from './services/abaqApi.js';
import { hydrateScreenWithSession, getActiveStudent } from './services/screenHydrator.js';

export const ROUTES = {
  '/login': { id: 11, html: screen11Html, js: screen11Js, role: 'public' },
  '/home': { id: 7, html: screen7Html, js: null, role: 'parent', tab: true },
  '/homework': { id: 8, html: screen8Html, js: screen8Js, role: 'parent', tab: true },
  '/quiz': { id: 9, html: screen9Html, js: screen9Js, role: 'parent' },
  '/schedule': { id: 6, html: screen6Html, js: screen6Js, role: 'parent', tab: true },
  '/grades': { id: 1, html: screen1Html, js: screen1Js, role: 'parent', tab: true },
  '/financials': { id: 3, html: screen3Html, js: null, role: 'parent' },
  '/bus': { id: 4, html: screen4Html, js: screen4Js, role: 'parent', tab: true },
  '/student-id': { id: 12, html: screen12Html, js: null, role: 'parent' },
  '/account': { id: 2, html: screen2Html, js: screen2Js, role: 'parent', tab: true },
  '/register': { id: 14, html: screen14Html, js: screen14Js, role: 'parent' },
  '/admission': { id: 13, html: screen13Html, js: null, role: 'parent' },
  '/teacher': { id: 10, html: screen10Html, js: screen10Js, role: 'teacher' },
  '/teacher/create-task': { id: 5, html: screen5Html, js: screen5Js, role: 'teacher' },
};

export const state = {
  role: null, // 'parent' | 'teacher' | null
  activeStudent: 'abdulrahman',
  session: null,
  history: ['/login'],
};

let syncTimer = null;

function handleStudentSwitch() {
  if (state.session?.students?.length > 1) {
    state.session.activeStudentIndex =
      ((state.session.activeStudentIndex || 0) + 1) % state.session.students.length;
    saveSession(state.session);
    const active = getActiveStudent(state.session);
    showToast(`تم التبديل إلى ملف: ${active?.full_name || active?.name || ''}`);
    renderRoute(getCurrentRoute());
  }
}

async function syncCloudData(silent = true) {
  if (!state.session || state.session.role !== 'parent') return;
  const schoolId = state.session.school?.id || state.session.students?.[0]?.school_id;
  if (!schoolId) return;
  const fresh = await fetchPortalEducationalData(schoolId, state.session.token);
  if (fresh) {
    state.session.educationalData = fresh;
    state.session.syncedAt = new Date().toISOString();
    saveSession(state.session);
    if (!silent) showToast('تمت مزامنة البيانات مع برنامج عبق');
    renderRoute(getCurrentRoute());
  }
}

let currentCleanup = null;
let lastBackPress = 0;

function runInlineScript(code) {
  if (!code) return;
  // Convert top-level function declarations to window assignments so onclick="..." works
  const transformed = code.replace(
    /^function\s+([a-zA-Z0-9_$]+)\s*\(/gm,
    'window.$1 = function('
  );
  const fn = new Function(transformed);
  fn();
}

export function getCurrentRoute() {
  const hash = window.location.hash.replace(/^#/, '');
  return ROUTES[hash] ? hash : '/login';
}

export function navigate(path, { replace = false } = {}) {
  if (!ROUTES[path]) {
    path = '/login';
  }

  const target = ROUTES[path];
  // Enforce strict role separation between Parent/Student and Teacher
  if (target.role === 'teacher' && state.role !== 'teacher') {
    path = '/login';
  } else if (target.role === 'parent' && state.role !== 'parent') {
    path = '/login';
  }

  if (replace) {
    state.history[state.history.length - 1] = path;
  } else if (state.history[state.history.length - 1] !== path) {
    state.history.push(path);
  }

  if (window.location.hash !== `#${path}`) {
    window.location.hash = `#${path}`;
  } else {
    renderRoute(path);
  }
}

export function goBack(onExitApp) {
  const current = getCurrentRoute();

  // If on root screen for current role, double-back to exit
  if (current === '/login' || current === '/home' || current === '/teacher') {
    const now = Date.now();
    if (now - lastBackPress < 2000) {
      if (onExitApp) onExitApp();
    } else {
      lastBackPress = now;
      showToast('اضغط مرة أخرى للخروج من التطبيق');
    }
    return;
  }

  if (state.history.length > 1) {
    state.history.pop();
    const prev = state.history[state.history.length - 1] || (state.role === 'teacher' ? '/teacher' : '/home');
    window.location.hash = `#${prev}`;
  } else {
    navigate(state.role === 'teacher' ? '/teacher' : '/home', { replace: true });
  }
}

function wireCommonBackButtons(container, fallbackRoute) {
  container.querySelectorAll('header button, header a').forEach((btn) => {
    const icon = btn.querySelector('.material-symbols-outlined')?.textContent?.trim();
    if (icon === 'arrow_forward' || icon === 'arrow_forward_ios' || icon === 'arrow_back') {
      if (btn.closest('#urgent-announcement-header')) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.history.length > 1) {
          goBack();
        } else {
          navigate(fallbackRoute, { replace: true });
        }
      });
    }
  });
}

function wireScreenInteractions(routePath, routeDef, container) {
  const id = routeDef.id;

  // Screen 11: Login (Strict separation between Parent/Student & Teacher - Offline Standalone)
  if (id === 11) {
    container.querySelectorAll('button').forEach((btn) => {
      const txt = btn.textContent || '';
      if (txt.includes('تسجيل دخول الطالب / ولي الأمر')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          state.role = 'parent';
          state.history = ['/home'];
          showToast('تم تسجيل الدخول بنجاح');
          navigate('/home', { replace: true });
        });
      } else if (
        txt.includes('تسجيل دخول الكادر التعليمي') ||
        txt.includes('بصمة المدرس')
      ) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          state.role = 'teacher';
          state.history = ['/teacher'];
          showToast('مرحباً بك في بوابة المعلم');
          navigate('/teacher', { replace: true });
        });
      } else if (txt.includes('الدخول السريع عبر البصمة')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          state.role = 'parent';
          state.history = ['/home'];
          showToast('تم التحقق عبر البصمة بنجاح');
          navigate('/home', { replace: true });
        });
      }
    });
    return;
  }

  // Screen 7: Parent/Student Home Dashboard
  if (id === 7) {
    attachParentHeaderActions(container, navigate, state, handleStudentSwitch);
    container.querySelectorAll('a, button').forEach((el) => {
      const txt = el.textContent || '';
      if (txt.includes('الرسوم والمالية')) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/financials'); });
      } else if (txt.includes('الدرجات والشهادات') || txt.includes('الحضور والغياب') || txt.includes('الأنشطة والسلوك')) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/grades'); });
      } else if (txt.includes('الجدول والخطة') || txt.includes('عرض الكل') || txt.includes('متابعة القراءة')) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/schedule'); });
      } else if (txt.includes('النقل المدرسي')) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/bus'); });
      } else if (txt.includes('تسليم الحل')) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/homework'); });
      } else if (txt.includes('بدء الاختبار')) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/quiz'); });
      } else if (txt.includes('انضم للبث')) {
        el.addEventListener('click', (e) => { e.preventDefault(); showToast('جاري الانضمام إلى البث المباشر للحصة...'); });
      }
    });
  }

  // Screen 8: Homework & Quizzes
  if (id === 8) {
    attachParentHeaderActions(container, navigate, state, handleStudentSwitch);
    container.querySelectorAll('button, a').forEach((el) => {
      const txt = el.textContent || '';
      if (txt.includes('بدء الاختبار التفاعلي الآن')) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/quiz'); });
      }
    });
  }

  // Screen 9: Interactive Quiz Player
  if (id === 9) {
    wireCommonBackButtons(container, '/homework');
    // Override inline confirmExit & promptFinalSubmission to navigate back cleanly
    window.confirmExit = () => {
      if (confirm('تنبيه: سيتم حفظ إجاباتك الحالية والخروج من الجلسة. هل أنت متأكد؟')) {
        navigate('/homework', { replace: true });
      }
    };
    window.promptFinalSubmission = () => {
      if (confirm('هل أنت متأكد من تسليم الاختبار؟ قمت بالإجابة على 3 من أصل 5 أسئلة.')) {
        showToast('تم تسليم الاختبار بنجاح!');
        setTimeout(() => navigate('/homework', { replace: true }), 900);
      }
    };
  }

  // Screen 6: Schedule & Weekly Plan
  if (id === 6) {
    attachParentHeaderActions(container, navigate, state, handleStudentSwitch);
    container.querySelectorAll('button, a').forEach((el) => {
      const icon = el.querySelector('.material-symbols-outlined')?.textContent?.trim();
      const txt = el.textContent || '';
      if (icon === 'assignment' && !el.closest('nav')) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/homework'); });
      } else if (txt.includes('انضمام للبث المباشر')) {
        el.addEventListener('click', (e) => { e.preventDefault(); showToast('جاري فتح البث المباشر للدرس...'); });
      }
    });
  }

  // Screen 1: Grades & Reports
  if (id === 1) {
    attachParentHeaderActions(container, navigate, state, handleStudentSwitch);
  }

  // Screen 3: Financials & Tuition
  if (id === 3) {
    wireCommonBackButtons(container, '/home');
    container.querySelectorAll('button').forEach((btn) => {
      const txt = btn.textContent || '';
      if (txt.includes('نسخ')) {
        btn.addEventListener('click', () => {
          navigator.clipboard?.writeText('SA4420000001234567890123').catch(() => {});
          showToast('تم نسخ رقم الآيبان بنجاح');
        });
      } else if (txt.includes('دفع الآن')) {
        btn.addEventListener('click', () => showToast('جاري تحويلك لبوابة الدفع الآمنة (مدى / Apple Pay)...'));
      } else if (txt.includes('إرسال الإيصال')) {
        btn.addEventListener('click', async () => {
          const student = getActiveStudent(state.session);
          if (!student) {
            showToast('تم إرسال إيصال التحويل للاعتماد المالي');
            return;
          }
          btn.disabled = true;
          const res = await submitPaymentReceipt({
            schoolId: state.session?.school?.id || student.school_id,
            token: state.session?.token,
            student,
            amount: 1200,
            notes: 'إرسال إيصال من تطبيق بوابة عبق',
          });
          btn.disabled = false;
          showToast(res.message);
        });
      }
    });
  }

  // Screen 4: Bus Tracking
  if (id === 4) {
    attachParentHeaderActions(container, navigate, state, handleStudentSwitch);
  }

  // Screen 12: Digital Student ID
  if (id === 12) {
    wireCommonBackButtons(container, '/account');
  }

  // Screen 2: Account & Settings
  if (id === 2) {
    attachParentHeaderActions(container, navigate, state, handleStudentSwitch);
    window.confirmLogout = async () => {
      if (confirm('هل ترغب بالفعل في تسجيل الخروج من حساب ولي الأمر في بوابة عبق؟')) {
        await logoutSession(state.session?.token);
        state.session = null;
        state.role = null;
        state.history = ['/login'];
        navigate('/login', { replace: true });
      }
    };
    container.querySelectorAll('button, a').forEach((el) => {
      const txt = el.textContent || '';
      if (txt.includes('إضافة تابع جديد')) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/register'); });
      } else if (txt.includes('تبديل العرض') || (el.querySelector('.material-symbols-outlined')?.textContent?.trim() === 'chevron_left' && txt.includes('عبدالرحمن'))) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/student-id'); });
      } else if (txt.includes('تسجيل الخروج')) {
        el.addEventListener('click', (e) => { e.preventDefault(); window.confirmLogout(); });
      }
    });
  }

  // Screen 14: New Student Registration
  if (id === 14) {
    wireCommonBackButtons(container, '/account');
    container.querySelectorAll('button, a').forEach((el) => {
      const txt = el.textContent || '';
      if (txt.includes('متابعة إلى خطوة المرفقات')) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/admission'); });
      } else if (txt.includes('حفظ كمسودة')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          showToast('تم حفظ المسودة بنجاح');
          navigate('/account');
        });
      }
    });
  }

  // Screen 13: Admission Notice
  if (id === 13) {
    wireCommonBackButtons(container, '/home');
    container.querySelectorAll('button, a').forEach((el) => {
      const txt = el.textContent || '';
      if (txt.includes('الانتقال للملف الأكاديمي')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          state.history = ['/home'];
          navigate('/home', { replace: true });
        });
      }
    });
  }

  // Screen 10: Teacher Home
  if (id === 10) {
    wireTeacherBottomNav(container, navigate, '/teacher');
    container.querySelectorAll('button, a').forEach((el) => {
      const txt = el.textContent || '';
      if (txt.includes('تحضير') && !txt.includes('الذكاء الاصطناعي') && !txt.includes('تعديل التحضير')) {
        el.addEventListener('click', (e) => { e.preventDefault(); navigate('/teacher/create-task'); });
      }
    });
    // Add clean logout action on teacher profile/notifications if needed, or via a dedicated button
    const headerBtns = container.querySelectorAll('header button');
    headerBtns.forEach((btn) => {
      const icon = btn.querySelector('.material-symbols-outlined')?.textContent?.trim();
      if (icon === 'logout') {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          state.role = null;
          state.history = ['/login'];
          navigate('/login', { replace: true });
        });
      }
    });
  }

  // Screen 5: Teacher Create Assignment / Quiz
  if (id === 5) {
    wireCommonBackButtons(container, '/teacher');
    container.querySelectorAll('button').forEach((btn) => {
      const txt = btn.textContent || '';
      if (txt.includes('نشر التكليف للفصل الآن')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          showToast('تم نشر التكليف للفصل بنجاح!');
          setTimeout(() => navigate('/teacher', { replace: true }), 800);
        });
      } else if (txt.includes('حفظ كمسودة')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          showToast('تم حفظ التكليف كمسودة');
          navigate('/teacher', { replace: true });
        });
      }
    });
  }
}

export function renderRoute(path) {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  const routeDef = ROUTES[path] || ROUTES['/login'];

  // Enforce strict role separation
  if (routeDef.role === 'teacher' && state.role !== 'teacher') {
    window.location.hash = '#/login';
    return;
  }
  if (routeDef.role === 'parent' && state.role !== 'parent') {
    window.location.hash = '#/login';
    return;
  }

  const appRoot = document.getElementById('app');
  const screenMeta = meta[String(routeDef.id)] || {};
  document.body.className = `${screenMeta.bodyClass || ''} screen-${routeDef.id}`.trim();

  appRoot.innerHTML = routeDef.html;

  // Reuse shared Parent/Student bottom navigation across all Parent/Student tab screens
  if (routeDef.tab) {
    const existingNav = appRoot.querySelector('nav.fixed.bottom-0');
    const sharedNav = renderSharedParentBottomNav(path);
    sharedNav.querySelectorAll('[data-nav-route]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-nav-route');
        if (target === '/notifications') {
          const modal = appRoot.querySelector('#announcement-modal');
          if (modal) modal.classList.remove('hidden');
          else showToast('لديك 3 إشعارات مدرسية جديدة');
          return;
        }
        navigate(target);
      });
    });
    if (existingNav) {
      existingNav.replaceWith(sharedNav);
    } else {
      appRoot.appendChild(sharedNav);
    }
  }

  // Run screen's inline JS while capturing any setInterval created on quiz screen
  const origSetInterval = window.setInterval;
  const intervals = [];
  window.setInterval = (...args) => {
    const id = origSetInterval(...args);
    intervals.push(id);
    return id;
  };
  try {
    runInlineScript(routeDef.js);
  } finally {
    window.setInterval = origSetInterval;
  }

  currentCleanup = () => {
    intervals.forEach((id) => clearInterval(id));
  };

  wireScreenInteractions(path, routeDef, appRoot);
  hydrateScreenWithSession(routeDef.id, appRoot, state.session);
  window.scrollTo(0, 0);
}

export function initRouter() {
  window.addEventListener('hashchange', () => {
    renderRoute(getCurrentRoute());
  });

  if (!window.location.hash) {
    window.location.hash = '#/login';
  } else {
    renderRoute(getCurrentRoute());
  }
}
