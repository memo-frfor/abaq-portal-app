import { portalStore } from './store/portalStore.js';
import { renderSharedHeader } from './components/sharedHeader.js';
import { renderSharedParentBottomNav } from './components/sharedNav.js';
import { showToast } from './utils/toast.js';

import { renderLoginView } from './views/loginView.js';
import { renderHomeView } from './views/homeView.js';
import { renderHomeworkView } from './views/homeworkView.js';
import { renderQuizView } from './views/quizView.js';
import { renderGradesView } from './views/gradesView.js';
import { renderFinancialsView } from './views/financialsView.js';
import { renderBusView } from './views/busView.js';
import { renderStudentIdView } from './views/studentIdView.js';
import { renderScheduleView } from './views/scheduleView.js';
import { renderAccountView } from './views/accountView.js';
import { renderRegisterView, renderAdmissionView } from './views/registerView.js';
import { renderTeacherHomeView } from './views/teacherHomeView.js';
import { renderTeacherTaskView } from './views/teacherTaskView.js';

export const ROUTES = {
  '/login': { render: renderLoginView, role: 'public', hasHeader: false, hasNav: false },
  '/home': { render: renderHomeView, role: 'parent', hasHeader: true, hasNav: true },
  '/homework': { render: renderHomeworkView, role: 'parent', hasHeader: true, hasNav: true },
  '/quiz': { render: renderQuizView, role: 'parent', hasHeader: false, hasNav: false },
  '/grades': { render: renderGradesView, role: 'parent', hasHeader: true, hasNav: true },
  '/financials': { render: renderFinancialsView, role: 'parent', hasHeader: true, hasNav: false },
  '/bus': { render: renderBusView, role: 'parent', hasHeader: true, hasNav: true },
  '/student-id': { render: renderStudentIdView, role: 'parent', hasHeader: false, hasNav: false },
  '/schedule': { render: renderScheduleView, role: 'parent', hasHeader: true, hasNav: true },
  '/account': { render: renderAccountView, role: 'parent', hasHeader: true, hasNav: true },
  '/register': { render: renderRegisterView, role: 'parent', hasHeader: false, hasNav: false },
  '/admission': { render: renderAdmissionView, role: 'parent', hasHeader: false, hasNav: false },
  '/teacher': { render: renderTeacherHomeView, role: 'teacher', hasHeader: false, hasNav: false },
  '/teacher/create-task': { render: renderTeacherTaskView, role: 'teacher', hasHeader: false, hasNav: false },
};

export const state = {
  history: ['/login'],
};

let lastBackPress = 0;

export function getCurrentRoute() {
  const hash = window.location.hash.replace(/^#/, '');
  return ROUTES[hash] ? hash : '/login';
}

export function navigate(path, { replace = false } = {}) {
  if (!ROUTES[path]) path = '/login';

  const target = ROUTES[path];
  const role = portalStore.state.role;

  // Strict role guard
  if (target.role === 'teacher' && role !== 'teacher') {
    path = '/login';
  } else if (target.role === 'parent' && role !== 'parent') {
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
    const prev = state.history[state.history.length - 1] || '/home';
    window.location.hash = `#${prev}`;
  } else {
    navigate('/home', { replace: true });
  }
}

export function renderRoute(path) {
  const routeDef = ROUTES[path] || ROUTES['/login'];
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  appRoot.innerHTML = '';

  // Render Compact Shared Header if required
  if (routeDef.hasHeader) {
    const header = renderSharedHeader(navigate, path);
    appRoot.appendChild(header);
  }

  // Render Main Scrollable Content Container
  const main = document.createElement('main');
  main.className = 'w-full flex-1 flex flex-col min-h-screen';
  appRoot.appendChild(main);

  routeDef.render(main, navigate);

  // Render Bottom Nav if required
  if (routeDef.hasNav) {
    const nav = renderSharedParentBottomNav(path, navigate);
    appRoot.appendChild(nav);
  }

  window.scrollTo(0, 0);
}

export function initRouter() {
  window.addEventListener('hashchange', () => {
    renderRoute(getCurrentRoute());
  });

  // Re-render when store updates active student
  portalStore.subscribe(() => {
    const current = getCurrentRoute();
    if (current !== '/login') {
      renderRoute(current);
    }
  });

  if (!window.location.hash) {
    window.location.hash = '#/login';
  } else {
    renderRoute(getCurrentRoute());
  }
}
