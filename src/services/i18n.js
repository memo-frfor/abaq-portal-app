// i18n.js - Comprehensive Bilingual Support (Arabic & English) with reactive view updates
const LANG_KEY = 'abaq_language_mode_v2';

const translations = {
  ar: {
    // App & Branding
    appName: 'بوابة عبق التعليمية',
    schoolDefaultName: 'مدارس عبق الأهلية',
    verifiedSchool: 'الحساب موثق لدى إدارة المدرسة',

    // Shared Navigation
    navHome: 'الرئيسية',
    navSchedule: 'الجدول',
    navHomework: 'الواجبات',
    navGrades: 'الدرجات',
    navAccount: 'حسابي',

    // Shared Header & Switcher
    linkedProfiles: 'الأبناء والملفات المرتبطة',
    selectProfileHint: 'اختر الملف الأكاديمي لعرض بياناته فوراً',
    activeProfileBadge: 'الملف النشط ✓',
    switchProfile: 'تبديل',
    addDependent: 'إضافة تابع جديد / تسجيل طالب',
    schoolNotifs: 'التنبيهات المدرسية',
    markAllRead: 'تحديد الكل كمقروء',
    pendingHwBadge: 'واجبات معلقة',

    // Home View
    urgentAnnouncement: 'تعميم إداري',
    viewDetails: 'عرض',
    liveClassActive: 'بث مباشر نشط الآن',
    virtualRoom: 'الفصل الافتراضي',
    teacherPrefix: 'المعلم: ',
    studentsPresent: 'طالب متواجد',
    joinLiveClass: 'انضمام للحصة',
    coreServices: 'الخدمات الأساسية',
    quickAccess: 'الوصول السريع',
    upcomingHomework: 'الواجبات والتكليفات القادمة',
    viewAll: 'عرض الكل',
    noPendingHw: 'لا توجد تكليفات معلقة حالياً ✓',
    dueWithin: 'موعد التسليم:',

    // Services Bento Grid Titles & Subtitles
    srvGradesTitle: 'الدرجات والتقييم',
    srvGradesSub: 'المعدل العام والأعمال',
    srvHomeworkTitle: 'الواجبات المدرسية',
    srvHomeworkSub: 'تكليفات وإرسال الحلول',
    srvScheduleTitle: 'الجدول والخطة',
    srvScheduleSub: 'الحصص والخطة الأسبوعية',
    srvFinanceTitle: 'الحسابات والمالية',
    srvFinanceSub: 'الأقساط وسندات القبض',
    srvLibraryTitle: 'الكتب والمناهج',
    srvLibrarySub: 'مقررات PDF الرسمية',
    srvVirtualTitle: 'الفصول الحية',
    srvVirtualSub: 'بث واجتماعات مباشرة',
    srvBehaviorTitle: 'السلوك والمواظبة',
    srvBehaviorSub: 'نقاط التميز والانضباط',
    srvBusTitle: 'النقل المدرسي',
    srvBusSub: 'تتبع الحافلة لحظياً',

    // Homework View
    homeworkTitle: 'الواجبات والتكليفات المدرسية',
    allFilter: 'الكل',
    statusGraded: 'معتمد',
    statusSubmitted: 'تم التسليم',
    statusPending: 'بانتظار التسليم',
    submitNow: 'تسليم الإجابة الآن',
    submittedSuccess: 'تم التسليم بنجاح',
    teacherNoteLabel: 'ملاحظة المعلم:',
    submitModalTitle: 'تسليم الواجب المدرسي',
    textAnswerLabel: 'إجابة نصية أو ملاحظة للمعلم',
    textAnswerPlaceholder: 'اكتب إجابتك أو أي استفسار هنا...',
    attachLabel: 'إرفاق ملف أو تصوير الحل بالكاميرا',
    attachHint: 'اضغط لفتح الكاميرا أو اختيار صورة / PDF',
    maxSizeHint: 'الحد الأقصى 15 ميجابايت',
    confirmSubmitBtn: 'تأكيد التسليم الرسمي',
    cancelBtn: 'إلغاء',
    removeAttachment: 'حذف المرفق',
    cameraOption: 'التقاط صورة بالكاميرا',
    galleryOption: 'اختيار من الاستوديو',

    // Financials View
    financeTitle: 'الملف المالي وسندات القبض',
    financeSub: 'سداد الرسوم المدرسية وكشف الحساب',
    paidInFull: 'مسدد بالكامل ✓',
    dueAmount: 'المبلغ المستحق',
    totalTuition: 'إجمالي الرسوم الدراسية السنوية',
    remainingDue: 'المبلغ المتبقي للاستحقاق',
    amountPaidSoFar: 'المبالغ المدفوعة سابقاً',
    paymentRatio: 'نسبة السداد',
    payNowBtn: 'دفع الآن (مدى / Apple Pay)',
    schoolIbanTitle: 'حساب المدرسة الرسمي (مصرف الراجحي)',
    copyBtn: 'نسخ',
    installmentsSchedule: 'جدول الأقساط والدفعات',
    vouchersTitle: 'سندات القبض المعتمدة والدفعات السابقة',
    voucherNo: 'سند رقم',
    voucherDate: 'تاريخ السداد',
    voucherMethod: 'طريقة الدفع',
    viewVoucherBtn: 'عرض السند الرسمي',
    uploadReceiptBtn: 'إرسال إيصال تحويل بنكي للاعتماد',
    receiptUploadTitle: 'إرفاق إيصال التحويل البنكي',
    receiptUploadHint: 'صور إيصال التحويل أو اختر ملف من الجوال',
    confirmReceiptSend: 'إرسال الإيصال للإدارة المالية',
    currencySar: 'ر.س',

    // Schedule View
    scheduleTitle: 'الجدول والخطة الدراسية',
    dailyTimetable: 'الجدول اليومي للحصص',
    weeklyPlan: 'الخطة الأسبوعية',
    periodLabel: 'الحصة',
    roomLabel: 'القاعة',
    todayLabel: '(اليوم)',

    // Grades View
    gradesTitle: 'التقرير الفصلي والدرجات',
    gpaLabel: 'المعدل العام',
    attendanceRateLabel: 'الانضباط والحضور',
    downloadReportPdf: 'تحميل التقرير PDF',
    submitExcuseBtn: 'تقديم عذر طبي',
    excuseReasonLabel: 'سبب الغياب',
    excuseReasonPlaceholder: 'مثال: عارض صحي أو مراجعة مستشفى',
    excuseDateLabel: 'تاريخ الغياب وعدد الأيام',
    attachReportLabel: 'إرفاق التقرير الطبي أو الإجازة المرضية (اختياري)',
    sendExcuseBtn: 'إرسال العذر لإدارة المدرسة',

    // Account & Preferences
    accountTitle: 'حساب ولي الأمر',
    cloudSyncTitle: 'المزامنة مع السحابة المركزية',
    syncNowBtn: 'مزامنة الآن',
    lastSyncLabel: 'آخر تحديث:',
    appPreferences: 'تفضيلات التطبيق والمظهر',
    themeMode: 'الوضع الليلي والنهاري',
    themeDark: 'الوضع الليلي',
    themeLight: 'الوضع النهاري',
    appLanguage: 'لغة الواجهة (Language)',
    biometricTitle: 'الدخول بالبصمة / Face ID',
    biometricDesc: 'فتح التطبيق فورياً دون كتابة كلمة المرور',
    bioActive: 'مفعّلة ✓',
    bioInactive: 'غير مفعّلة',
    schoolContactTitle: 'التواصل المباشر مع إدارة المدرسة',
    whatsappBtn: 'واتساب المدرسة',
    callBtn: 'اتصال هاتفي',
    appVersion: 'إصدار التطبيق',
    logoutBtn: 'تسجيل الخروج من البوابة',

    // Common Toasts
    copiedToast: 'تم النسخ بنجاح',
    syncedToast: 'تمت المزامنة بنجاح مع السحابة',
    submittedToast: 'تم التسليم بنجاح ✓',
    excuseSentToast: 'تم إرسال العذر الطبي بنجاح',
  },

  en: {
    // App & Branding
    appName: 'Abaq Educational Portal',
    schoolDefaultName: 'Abaq Private Schools',
    verifiedSchool: 'Verified by School Administration',

    // Shared Navigation
    navHome: 'Home',
    navSchedule: 'Schedule',
    navHomework: 'Homework',
    navGrades: 'Grades',
    navAccount: 'Account',

    // Shared Header & Switcher
    linkedProfiles: 'Students & Linked Profiles',
    selectProfileHint: 'Select academic profile to view instant records',
    activeProfileBadge: 'Active Profile ✓',
    switchProfile: 'Switch',
    addDependent: 'Add Dependent / Register Student',
    schoolNotifs: 'School Notifications',
    markAllRead: 'Mark All as Read',
    pendingHwBadge: 'Pending Tasks',

    // Home View
    urgentAnnouncement: 'Announcement',
    viewDetails: 'View',
    liveClassActive: 'Live Class in Progress',
    virtualRoom: 'Virtual Classroom',
    teacherPrefix: 'Teacher: ',
    studentsPresent: 'Students Online',
    joinLiveClass: 'Join Class',
    coreServices: 'Core Services',
    quickAccess: 'Quick Access',
    upcomingHomework: 'Upcoming Homework & Tasks',
    viewAll: 'View All',
    noPendingHw: 'No pending tasks at this moment ✓',
    dueWithin: 'Due Date:',

    // Services Bento Grid Titles & Subtitles
    srvGradesTitle: 'Grades & Evaluation',
    srvGradesSub: 'GPA & Term Reports',
    srvHomeworkTitle: 'Homework & Tasks',
    srvHomeworkSub: 'Assignments & Submissions',
    srvScheduleTitle: 'Timetable & Plan',
    srvScheduleSub: 'Daily Classes & Weekly Plan',
    srvFinanceTitle: 'Financials & Fees',
    srvFinanceSub: 'Installments & Receipts',
    srvLibraryTitle: 'Books & Curriculum',
    srvLibrarySub: 'Official PDF Textbooks',
    srvVirtualTitle: 'Virtual Classes',
    srvVirtualSub: 'Live Streams & Meetings',
    srvBehaviorTitle: 'Conduct & Points',
    srvBehaviorSub: 'Merit Points & Discipline',
    srvBusTitle: 'School Bus',
    srvBusSub: 'Live Bus Tracking',

    // Homework View
    homeworkTitle: 'School Homework & Assignments',
    allFilter: 'All',
    statusGraded: 'Graded',
    statusSubmitted: 'Submitted',
    statusPending: 'Pending Submission',
    submitNow: 'Submit Answer Now',
    submittedSuccess: 'Submitted Successfully',
    teacherNoteLabel: 'Teacher Note:',
    submitModalTitle: 'Submit Homework Assignment',
    textAnswerLabel: 'Written Answer or Note to Teacher',
    textAnswerPlaceholder: 'Type your answer or inquiry here...',
    attachLabel: 'Attach File or Take Photo with Camera',
    attachHint: 'Tap to open camera or choose image / PDF',
    maxSizeHint: 'Maximum file size: 15 MB',
    confirmSubmitBtn: 'Confirm Official Submission',
    cancelBtn: 'Cancel',
    removeAttachment: 'Remove Attachment',
    cameraOption: 'Take Photo with Camera',
    galleryOption: 'Choose from Gallery',

    // Financials View
    financeTitle: 'Financial Records & Receipts',
    financeSub: 'Tuition Fees & Account Statement',
    paidInFull: 'Paid in Full ✓',
    dueAmount: 'Due Amount',
    totalTuition: 'Total Annual Tuition Fees',
    remainingDue: 'Remaining Balance to Pay',
    amountPaidSoFar: 'Amounts Paid Previously',
    paymentRatio: 'Payment Rate',
    payNowBtn: 'Pay Now (Mada / Apple Pay)',
    schoolIbanTitle: 'Official School Bank Account (Al Rajhi)',
    copyBtn: 'Copy',
    installmentsSchedule: 'Installment & Payment Schedule',
    vouchersTitle: 'Verified Payment Receipts & Vouchers',
    voucherNo: 'Receipt #',
    voucherDate: 'Payment Date',
    voucherMethod: 'Method',
    viewVoucherBtn: 'View Official Voucher',
    uploadReceiptBtn: 'Upload Bank Transfer Slip',
    receiptUploadTitle: 'Attach Bank Transfer Receipt',
    receiptUploadHint: 'Photograph transfer slip or choose file',
    confirmReceiptSend: 'Send Slip to Finance Office',
    currencySar: 'SAR',

    // Schedule View
    scheduleTitle: 'Timetable & Weekly Plan',
    dailyTimetable: 'Daily Class Timetable',
    weeklyPlan: 'Weekly Plan',
    periodLabel: 'Period',
    roomLabel: 'Room',
    todayLabel: '(Today)',

    // Grades View
    gradesTitle: 'Term Grades & Report Card',
    gpaLabel: 'GPA',
    attendanceRateLabel: 'Attendance Rate',
    downloadReportPdf: 'Download PDF Report',
    submitExcuseBtn: 'Submit Medical Excuse',
    excuseReasonLabel: 'Absence Reason',
    excuseReasonPlaceholder: 'e.g. Doctor appointment or illness',
    excuseDateLabel: 'Absence Date & Days Count',
    attachReportLabel: 'Attach Medical Report or Doctor Note (Optional)',
    sendExcuseBtn: 'Send Excuse to School Administration',

    // Account & Preferences
    accountTitle: 'Parent Account',
    cloudSyncTitle: 'Central Cloud Synchronization',
    syncNowBtn: 'Sync Now',
    lastSyncLabel: 'Last Sync:',
    appPreferences: 'App Preferences & Appearance',
    themeMode: 'Dark & Light Mode',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    appLanguage: 'App Language (لغة الواجهة)',
    biometricTitle: 'Biometric Login / Face ID',
    biometricDesc: 'Open app instantly without typing password',
    bioActive: 'Active ✓',
    bioInactive: 'Inactive',
    schoolContactTitle: 'Direct School Contact Channels',
    whatsappBtn: 'School WhatsApp',
    callBtn: 'Phone Call',
    appVersion: 'App Version',
    logoutBtn: 'Sign Out from Portal',

    // Common Toasts
    copiedToast: 'Copied successfully',
    syncedToast: 'Synchronized with cloud successfully',
    submittedToast: 'Submitted successfully ✓',
    excuseSentToast: 'Medical excuse sent successfully',
  },
};

const listeners = [];

export function onLanguageChange(fn) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

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

  listeners.forEach((fn) => {
    try {
      fn(effectiveLang);
    } catch (e) {
      console.error('Error in i18n listener:', e);
    }
  });

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
  return translations[lang]?.[key] || translations.ar?.[key] || key;
}
