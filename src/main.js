import '@fontsource-variable/hanken-grotesk';
import '@fontsource-variable/manrope';
import '@fontsource-variable/noto-kufi-arabic';
import 'material-symbols/outlined.css';
import './style.css';

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { initRouter, goBack } from './router.js';

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

document.addEventListener('DOMContentLoaded', () => {
  initNativeShell();
  initRouter();
});
