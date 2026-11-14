import '@fontsource-variable/hanken-grotesk';
import '@fontsource-variable/manrope';
import '@fontsource-variable/noto-kufi-arabic';
import 'material-symbols/outlined.css';
import './style.css';

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { initRouter, goBack } from './router.js';
import { initTheme } from './services/theme.js';
import { initLanguage } from './services/i18n.js';

async function initNativeShell() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setBackgroundColor({ color: '#1c419f' });
    await StatusBar.setStyle({ style: Style.Dark });
  } catch (err) {
    console.warn('StatusBar setup skipped:', err);
  }

  App.addListener('backButton', () => {
    goBack(() => App.exitApp());
  });
}

function initNetworkMonitoring() {
  if (typeof window === 'undefined') return;

  const showOfflinePill = () => {
    let pill = document.getElementById('network-status-pill');
    if (!pill) {
      pill = document.createElement('div');
      pill.id = 'network-status-pill';
      pill.className =
        'fixed top-2 inset-x-4 mx-auto max-w-sm z-50 bg-amber-500 text-white text-[11px] font-bold py-1 px-3.5 rounded-full shadow-md flex items-center justify-center gap-1.5 transition-all';
      pill.innerHTML = `
        <span class="material-symbols-outlined text-[15px]">wifi_off</span>
        <span>أنت في وضع عدم الاتصال - البيانات معروضة من الذاكرة المحلية</span>
      `;
      document.body.appendChild(pill);
    }
    pill.classList.remove('hidden');
  };

  const hideOfflinePill = () => {
    const pill = document.getElementById('network-status-pill');
    if (pill) pill.classList.add('hidden');
  };

  window.addEventListener('offline', showOfflinePill);
  window.addEventListener('online', hideOfflinePill);

  if (!navigator.onLine) {
    showOfflinePill();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initNetworkMonitoring();
  initNativeShell();
  initRouter();
});
