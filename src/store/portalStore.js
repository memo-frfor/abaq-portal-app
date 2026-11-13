const STORAGE_KEY = 'abaq_portal_state_v2';

const INITIAL_DATA = {
  activeStudentId: 'abdulrahman',
  students: {
    abdulrahman: {
      id: 'abdulrahman',
      studentCode: 'STD-1446-9921',
      nationalId: '1098453210',
      fullName: 'عبدالرحمن محمد العتيبي',
      gradeLevel: 'الصف الثالث المتوسط',
      section: 'أ',
      schoolName: 'مدارس النور الأهلية',
      schoolCode: 'NOOR-ACAD-01',
      avatar: './assets/images/img-2.jpg',
      gpa: '98.4',
      attendanceRate: '99%',
      behaviorPoints: '+45',
      busNumber: '14',
      busPlate: 'أ ح د 1420',
      busDriver: 'أبو فهد القحطاني',
      busDriverPhone: '0551234567',
      busEta: '12 دقيقة',
      busStatus: 'في طريقها إلى الحي',
      busStep: 2, // 1: Started, 2: In neighborhood, 3: Boarded, 4: At School
      tuitionTotal: 12000,
      tuitionPaid: 10800,
      dueTuition: 1200,
      todayClassesCount: 6,
      unreadNotificationsCount: 3,
      liveClass: {
        active: true,
        subject: 'الرياضيات',
        title: 'حصة الرياضيات التفاعلية: حل نماذج اختبار الفصل الأول',
        teacher: 'أ. خالد الشهري',
        attendees: 34,
        meetUrl: 'https://meet.jit.si/abaq-math-room-301',
      },
    },
    sara: {
      id: 'sara',
      studentCode: 'STD-1446-4418',
      nationalId: '1109876543',
      fullName: 'سارة محمد العتيبي',
      gradeLevel: 'الصف الرابع الابتدائي',
      section: 'ب',
      schoolName: 'مدارس النور الأهلية',
      schoolCode: 'NOOR-ACAD-01',
      avatar: './assets/images/img-16.jpg',
      gpa: '99.1',
      attendanceRate: '100%',
      behaviorPoints: '+60',
      busNumber: '08',
      busPlate: 'ب ط ل 8812',
      busDriver: 'أبو سعد الدوسري',
      busDriverPhone: '0557654321',
      busEta: 'وصلت المدرسة',
      busStatus: 'تم الوصول للمدرسة بأمان',
      busStep: 4,
      tuitionTotal: 9500,
      tuitionPaid: 9500,
      dueTuition: 0,
      todayClassesCount: 5,
      unreadNotificationsCount: 1,
      liveClass: {
        active: false,
        subject: 'العلوم',
        title: 'العلوم الطبيعية: دورة حياة النباتات والتمثيل الضوئي',
        teacher: 'أ. هدى الحربي',
        attendees: 22,
        meetUrl: 'https://meet.jit.si/abaq-science-room-402',
      },
    },
  },
  announcement: {
    id: 'ann-1',
    visible: true,
    title: 'تعديل موعد الانصراف يوم الخميس',
    summary: 'تعديل موعد الانصراف بمناسبة فعاليات اليوم المفتوح لجميع المراحل.',
    content:
      'إشارة إلى تنظيم فعاليات اليوم المفتوح والأنشطة المدرسية اللاصفية المشتركة، نفيدكم بأن موعد انصراف جميع المراحل التعليمية (الابتدائي، المتوسط، الثانوي) سيكون بمشيئة الله في تمام الساعة 11:45 صباحاً. نرجو من أولياء الأمور وسائقي الحافلات الالتزام بالمواعيد المحددة لضمان سلامة أبنائنا الطلاب.',
    number: '45/1089',
    date: '14 شعبان 1446هـ',
  },
  notifications: [
    {
      id: 'notif-1',
      title: 'رصد درجات اختبار الرياضيات الفصلي',
      time: 'منذ نصف ساعة',
      read: false,
      icon: 'calculate',
      route: '/grades',
    },
    {
      id: 'notif-2',
      title: 'واجب جديد: المتطابقات المثلثية صفحة 64',
      time: 'منذ ساعتين',
      read: false,
      icon: 'assignment',
      route: '/homework',
    },
    {
      id: 'notif-3',
      title: 'حافلة رقم 14 انطلقت من المحطة الأولى',
      time: 'منذ 3 ساعات',
      read: false,
      icon: 'directions_bus',
      route: '/bus',
    },
  ],
  homework: [
    {
      id: 'hw-1',
      studentId: 'abdulrahman',
      subject: 'الرياضيات',
      teacher: 'أ. خالد الشهري',
      title: 'حل تمارين المتطابقات المثلثية صفحة 64',
      dueTime: 'متبقي 6 ساعات',
      description: 'المطلوب: إنجاز المسائل من رقم 1 إلى 8 مع توضيح خطوات الحل التفصيلية وقوانين جيب التمام.',
      status: 'pending', // pending, submitted, graded
      score: null,
      attachmentName: 'أوراق عمل المتطابقات.pdf',
    },
    {
      id: 'hw-2',
      studentId: 'abdulrahman',
      subject: 'العلوم الطبيعية',
      teacher: 'أ. ماجد الغامدي',
      title: 'تقرير تجربة التفاعل الكيميائي وتحديد نواتج الاحتراق',
      dueTime: 'تم التسليم في الموعد',
      description: 'تسليم رسم تخطيطي لخطوات التفاعل واستنتاج معادلة الاحتراق المتزنة.',
      status: 'graded',
      score: '10 / 10',
      teacherNote: 'إجابة نموذجية ورسومات بيانية واضحة، بارك الله فيك ومستواك متميز يا عبدالرحمن.',
    },
    {
      id: 'hw-3',
      studentId: 'abdulrahman',
      subject: 'لغتي الخالدة',
      teacher: 'أ. فهد السالم',
      title: 'كتابة نص وصفي عن معالم المملكة التاريخية',
      dueTime: 'الخميس القادم (متبقي يومان)',
      description: 'صياغة فقرتين وصفيّتين حول موقع مدائن صالح أو الدرعية التاريخية مع ضبط الكلمات بالشكل.',
      status: 'pending',
      score: null,
    },
    {
      id: 'hw-4',
      studentId: 'sara',
      subject: 'الرياضيات',
      teacher: 'أ. نورة العتيبي',
      title: 'جدول الضرب (6 و 7) وتطبيقات عملية',
      dueTime: 'غداً الساعة 4:00 عصراً',
      description: 'حل أسئلة كتاب التمارين صفحة 22 كاملة.',
      status: 'pending',
      score: null,
    },
    {
      id: 'hw-5',
      studentId: 'sara',
      subject: 'لغتي الجميلة',
      teacher: 'أ. سارة القحطاني',
      title: 'قراءة درس «أحب لغتي» واستخراج الأسماء الموصولة',
      dueTime: 'تم التسليم والاعتماد',
      description: 'تسجيل مقطع صوتي للقراءة لا يتجاوز دقيقة واحدة.',
      status: 'graded',
      score: '10 / 10',
      teacherNote: 'قراءة معبرة ونطق سليم لمخارج الحروف يا بنيتي.',
    },
  ],
  quiz: {
    id: 'quiz-ai-1',
    title: 'اختبار قصير: مبادئ الذكاء الاصطناعي والبرمجة',
    subject: 'الحاسب والذكاء الاصطناعي',
    teacher: 'م. سلطان القرني',
    durationMinutes: 12,
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        text: 'ما هو المفهوم الأساسي لـ «تعلم الآلة» (Machine Learning) في الذكاء الاصطناعي الحديث؟',
        options: [
          'برمجة كل خطوة يدوياً بواسطة قواعد ثابتة (If-Else)',
          'قدرة النظام على التعلم واستخلاص الأنماط من البيانات دون برمجة صريحة لكل حالة',
          'تسريع سرعة المعالج المركزي في الحواسيب الفائقة',
          'تحويل الملفات النصية إلى لغة التجميع (Assembly)',
        ],
        correctIndex: 1,
      },
      {
        id: 2,
        text: 'أي من لغات البرمجة التالية هي الأكثر استخداماً وشهرة في تدريب وتطوير نماذج الذكاء الاصطناعي؟',
        options: ['HTML & CSS', 'Python', 'Pascal', 'PHP 5.6'],
        correctIndex: 1,
      },
      {
        id: 3,
        text: 'ما هي وظيفة «الشبكات العصبية الاصطناعية» (Neural Networks)؟',
        options: [
          'تنظيف ذاكرة الوصول العشوائي (RAM) دورياً',
          'محاكاة طريقة معالجة الدماغ البشري للإشارات والبيانات المعقدة',
          'ضغط أحجام الصور دون تقليل الدقة',
          'فحص سلامة أسلاك الشبكة المحلية في المختبر',
        ],
        correctIndex: 1,
      },
      {
        id: 4,
        text: 'ما الفرق الرئيسي بين التعلم الخاضع للإشراف (Supervised) والتعلم غير الخاضع للإشراف (Unsupervised)؟',
        options: [
          'الأول يستخدم بيانات موسومة (Labeled Data) والثاني يتعامل مع بيانات غير موسومة',
          'الأول مخصص للهواتف الذكية والثاني للخوادم السحابية',
          'لا يوجد أي فرق بينهما',
          'الأول لا يحتاج إلى حاسوب لتشغيله',
        ],
        correctIndex: 0,
      },
      {
        id: 5,
        text: 'ما هي الخوارزمية المسؤولة عن معالجة النصوص واللغات الطبيعية في النماذج اللغوية الكبيرة (LLMs)؟',
        options: ['Binary Search', 'Transformer Architecture', 'Bubble Sort', 'Dijkstra Algorithm'],
        correctIndex: 1,
      },
    ],
  },
  medicalExcuses: [
    {
      id: 'exc-1',
      studentId: 'abdulrahman',
      date: '1446/04/12هـ',
      days: 2,
      reason: 'نزلة معوية حادة وإجهاد حراري',
      source: 'منصة صحتي (معتمد آلياً)',
      status: 'معتمد',
      icon: 'check_circle',
    },
  ],
  installments: [
    {
      id: 'inst-1',
      title: 'القسط الأول (الفصل الدراسي الأول)',
      amount: 4000,
      dueDate: '1446/02/01هـ',
      status: 'paid',
      statusText: 'تم السداد',
    },
    {
      id: 'inst-2',
      title: 'القسط الثاني (منتصف العام)',
      amount: 4000,
      dueDate: '1446/05/15هـ',
      status: 'paid',
      statusText: 'تم السداد',
    },
    {
      id: 'inst-3',
      title: 'القسط الثالث (الفصل الدراسي الثاني)',
      amount: 4000,
      dueDate: '1446/08/01هـ',
      status: 'due',
      dueAmount: 1200,
      statusText: 'متبقي 1,200 ر.س',
    },
  ],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_DATA, ...parsed };
  } catch {
    return INITIAL_DATA;
  }
}

export const portalStore = {
  state: loadState(),
  listeners: new Set(),

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  notify() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {}
    this.listeners.forEach((fn) => {
      try {
        fn(this.state);
      } catch (e) {
        console.error('Store listener error:', e);
      }
    });
  },

  getActiveStudent() {
    return this.state.students[this.state.activeStudentId] || this.state.students.abdulrahman;
  },

  setActiveStudent(studentId) {
    if (this.state.students[studentId]) {
      this.state.activeStudentId = studentId;
      this.notify();
    }
  },

  toggleActiveStudent() {
    const nextId = this.state.activeStudentId === 'abdulrahman' ? 'sara' : 'abdulrahman';
    this.setActiveStudent(nextId);
    return this.getActiveStudent();
  },

  dismissAnnouncement() {
    this.state.announcement.visible = false;
    this.notify();
  },

  markNotificationRead(id) {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif && !notif.read) {
      notif.read = true;
      const active = this.getActiveStudent();
      active.unreadNotificationsCount = Math.max(0, active.unreadNotificationsCount - 1);
      this.notify();
    }
  },

  submitHomework(hwId, answerText = '', fileName = '') {
    const hw = this.state.homework.find((h) => h.id === hwId);
    if (hw) {
      hw.status = 'submitted';
      hw.dueTime = 'تم التسليم بنجاح (قيد التصحيح)';
      hw.answerText = answerText || 'تم رفع الإجابة والمرفقات عبر التطبيق.';
      hw.attachmentName = fileName || 'حل_الواجب_المعتمد.pdf';
      this.notify();
      return true;
    }
    return false;
  },

  submitMedicalExcuse(excuseData) {
    const newExcuse = {
      id: `exc-${Date.now()}`,
      studentId: this.state.activeStudentId,
      date: excuseData.date || 'اليوم',
      days: Number(excuseData.days) || 1,
      reason: excuseData.reason || 'عذر طبي رسمي',
      source: excuseData.source || 'منصة صحتي (تحقق فوري)',
      status: 'قيد الاعتماد',
      icon: 'schedule',
    };
    this.state.medicalExcuses.unshift(newExcuse);
    this.notify();
    return newExcuse;
  },

  submitTuitionPayment(amount, receiptFile = null) {
    const active = this.getActiveStudent();
    const payAmount = Number(amount) || active.dueTuition;
    active.dueTuition = Math.max(0, active.dueTuition - payAmount);
    active.tuitionPaid += payAmount;

    const targetInstallment = this.state.installments.find((i) => i.status === 'due');
    if (targetInstallment) {
      if (active.dueTuition <= 0) {
        targetInstallment.status = 'paid';
        targetInstallment.statusText = 'تم السداد بنجاح';
      } else {
        targetInstallment.statusText = `متبقي ${active.dueTuition.toLocaleString('en-US')} ر.س`;
      }
    }
    this.notify();
    return { success: true, remaining: active.dueTuition };
  },

  publishTeacherTask(taskData) {
    const newHw = {
      id: `hw-${Date.now()}`,
      studentId: 'abdulrahman',
      subject: taskData.subject || 'الرياضيات',
      teacher: 'أ. خالد الشهري',
      title: taskData.title || 'تكليف جديد منشور من المعلم',
      dueTime: taskData.dueTime || 'خلال 48 ساعة',
      description: taskData.description || 'إنجاز التمارين المحددة ومراجعة الحلول.',
      status: 'pending',
      score: null,
      attachmentName: taskData.attachment || null,
    };
    this.state.homework.unshift(newHw);
    this.notify();
    return newHw;
  },
};
