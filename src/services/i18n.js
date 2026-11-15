// i18n.js - Bilingual support (Arabic & English) with dynamic RTL/LTR flipping
const LANG_KEY = 'abaq_language_mode_v2';

const translations = {
  ar: {
    appName: 'بوابة عبق التعليمية',
    schoolDefaultName: 'مدارس عبق الأهلية',
    loginTitle: 'تسجيل الدخول إلى البوابة',
    loginSubtitle: 'المنظومة التعليمية الذكية لأولياء الأمور والطلاب والمعلمين',
    parentTab: 'ولي الأمر / الطالب',
    teacherTab: 'المعلم / الإدارة',
    nationalIdLabel: 'رقم الهوية الوطنية أو الجوال أو الرقم الأكاديمي',
    nationalIdPlaceholder: 'أدخل رقم الهوية أو الجوال المسجل',
    teacherUserLabel: 'اسم المستخدم أو البريد الإلكتروني',
    teacherUserPlaceholder: 'أدخل اسم المستخدم للمعلم أو الإداري',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    schoolCodeLabel: 'معرّف المدرسة (كود المستأجر)',
    schoolCodePlaceholder: 'مثال: abdo',
    loginBtn: 'دخول البوابة',
    loggingIn: 'جاري التحقق من الخادم...',
    biometricBtn: 'الدخول السريع بالبصمة',
    enableBiometricPrompt: 'هل ترغب بتفعيل تسجيل الدخول بالبصمة على هذا الجهاز للمرات القادمة؟',
    enableBiometricYes: 'نعم، تفعيل البصمة',
    enableBiometricNo: 'ليس الآن',
    forgotPassword: 'نسيت كلمة المرور؟',
    contactSupport: 'الدعم الفني للمدرسة',
    home: 'الرئيسية',
    schedule: 'الجدول',
    homework: 'الواجبات',
    grades: 'الدرجات',
    account: 'حسابي',
    themeDark: 'الوضع الليلي',
    themeLight: 'الوضع النهاري',
    langSwitch: 'English',
    pullToRefresh: 'اسحب للأسفل للتحديث',
    refreshing: 'جاري جلب أحدث البيانات من السحابة...',
    lastSync: 'آخر مزامنة',
    syncNow: 'مزامنة السحابة الآن',
    liveBadge: 'بيانات حية متزامنة',
  },
  en: {
    appName: 'Abaq Educational Portal',
    schoolDefaultName: 'Abaq Private Schools',
    loginTitle: 'Sign In to Portal',
    loginSubtitle: 'Smart educational platform for parents, students, and staff',
    parentTab: 'Parent / Student',
    teacherTab: 'Teacher / Staff',
    nationalIdLabel: 'National ID, Phone, or Academic Code',
    nationalIdPlaceholder: 'Enter registered ID or phone number',
    teacherUserLabel: 'Username or Email',
    teacherUserPlaceholder: 'Enter staff username or email',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    schoolCodeLabel: 'School Code (Tenant ID)',
    schoolCodePlaceholder: 'e.g. abdo',
    loginBtn: 'Sign In to Portal',
    loggingIn: 'Verifying with cloud server...',
    biometricBtn: 'Quick Biometric Sign In',
    enableBiometricPrompt: 'Would you like to enable fingerprint sign-in on this device?',
    enableBiometricYes: 'Yes, Enable',
    enableBiometricNo: 'Not Now',
    forgotPassword: 'Forgot password?',
    contactSupport: 'Technical Support',
    home: 'Home',
    schedule: 'Schedule',
    homework: 'Homework',
    grades: 'Grades',
    account: 'Account',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    langSwitch: 'عربي',
    pullToRefresh: 'Pull down to refresh',
    refreshing: 'Fetching real-time cloud data...',
    lastSync: 'Last sync',
    syncNow: 'Sync Cloud Now',
    liveBadge: 'Live Cloud Synced',
  },
};

export function initLanguage() {
  const lang = getStoredLanguage();
  applyLanguage(lang);
}

export function getStoredLanguage() {
  try {
    return localStorage.getItem(LANG_KEY) || 'ar';
  } catch {
    return 'ar';
  }
}

export function applyLanguage(lang) {
  const isEn = lang === 'en';
  const effectiveLang = isEn ? 'en' : 'ar';

  document.documentElement.setAttribute('lang', effectiveLang);
  document.documentElement.setAttribute('dir', isEn ? 'ltr' : 'rtl');

  try {
    localStorage.setItem(LANG_KEY, effectiveLang);
  } catch {}

  return effectiveLang;
}

export function toggleLanguage() {
  const current = getStoredLanguage();
  const next = current === 'ar' ? 'en' : 'ar';
  applyLanguage(next);
  return next;
}

export function t(key) {
  const lang = getStoredLanguage();
  return translations[lang]?.[key] || translations.ar[key] || key;
}
