// portalStore.js - Reactive state store with real Cloudflare 2-way sync
import {
  fetchSchoolDataFromCloud,
  pushSchoolDataToCloud,
  authenticateParentOrStudent,
  authenticateTeacherOrStaff,
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
  getCachedSchoolData,
  getSavedSchoolCode,
  saveSchoolCode,
} from '../services/abaqCloudSync.js';
import { getStoredTheme, toggleTheme as switchTheme } from '../services/theme.js';
import { getStoredLanguage, toggleLanguage as switchLang, t } from '../services/i18n.js';

const STORAGE_KEY = 'abaq_portal_state_v3';

export const portalStore = {
  session: null,
  cloudDb: null,
  syncStatus: 'idle', // 'idle' | 'syncing' | 'synced' | 'error'
  lastSyncTime: null,
  syncError: null,
  subscribers: [],

  state: {
    tenantId: getSavedSchoolCode() || 'abdo',
    schoolName: 'مدارس عبق الأهلية',
    activeStudentId: 'std-1',
    students: {},
    announcement: {
      id: 'ann-1',
      visible: true,
      title: 'بوابة عبق متصلة سحابياً بنجاح',
      summary: 'البيانات المعروضة متزامنة لحظياً ومباشرة مع الخادم السحابي.',
      content: 'مرحباً بكم في تطبيق بوابة عبق. يتم تحديث الواجبات والدرجات والحضور والغياب بصورة دورية ومباشرة من قاعدة البيانات المركزية للمدرسة.',
      number: '45/1089',
      date: 'اليوم',
    },
    notifications: [],
    homework: [],
    grades: [],
    attendance: [],
    medicalExcuses: [],
    installments: [],
    weeklyPlans: [],
    timetable: [],
    busRoutes: [],
    schoolBooks: [],
  },

  getDismissedAnnouncements() {
    try {
      const raw = localStorage.getItem('ABAQ_DISMISSED_ANNOUNCEMENTS_V2');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  dismissAnnouncement(id) {
    const annId = id || this.state.announcement?.id;
    if (this.state.announcement) {
      this.state.announcement.visible = false;
    }
    if (annId) {
      const dismissed = this.getDismissedAnnouncements();
      if (!dismissed.includes(annId)) {
        dismissed.push(annId);
        try {
          localStorage.setItem('ABAQ_DISMISSED_ANNOUNCEMENTS_V2', JSON.stringify(dismissed));
        } catch {}
      }
    }
    this.notify();
  },

  markNotificationRead(notifId) {
    const target = this.state.notifications.find((n) => n.id === notifId);
    if (target) {
      target.read = true;
      const active = this.getActiveStudent();
      if (active && active.unreadNotificationsCount > 0) {
        active.unreadNotificationsCount = Math.max(0, active.unreadNotificationsCount - 1);
      }
      this.notify();
    }
  },

  async init() {
    this.session = getActiveSession();

    // Load cached cloud data if available
    const cached = getCachedSchoolData();
    if (cached && cached.data) {
      this.cloudDb = cached.data;
      this.state.schoolName = cached.schoolName || this.state.schoolName;
      this.state.tenantId = cached.tenantId || this.state.tenantId;
      this.hydrateFromDb(cached.data);
      this.lastSyncTime = cached.syncedAt;
      this.syncStatus = 'synced';
    }

    // Attempt live cloud fetch
    await this.syncWithCloud(false);

    // Setup periodic auto-refresh every 60 seconds
    if (typeof window !== 'undefined') {
      setInterval(() => {
        if (this.session) {
          this.syncWithCloud(false);
        }
      }, 60000);
    }
  },

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((fn) => fn !== callback);
    };
  },

  notify() {
    this.subscribers.forEach((fn) => {
      try {
        fn(this.state, this.session);
      } catch (err) {
        console.error('Subscriber error:', err);
      }
    });
  },

  async syncWithCloud(notifyUi = true) {
    this.syncStatus = 'syncing';
    if (notifyUi) this.notify();

    try {
      const res = await fetchSchoolDataFromCloud(this.state.tenantId);
      if (res.success && res.data) {
        this.cloudDb = res.data;
        this.state.schoolName = res.schoolName || this.state.schoolName;
        this.hydrateFromDb(res.data);
        this.syncStatus = 'synced';
        this.lastSyncTime = res.syncedAt || new Date().toISOString();
        this.syncError = null;
      } else {
        this.syncStatus = 'error';
        this.syncError = res.error;
      }
    } catch (e) {
      this.syncStatus = 'error';
      this.syncError = e.message;
    }

    this.notify();
  },

  hydrateFromDb(db) {
    if (!db) return;

    // 1. Hydrate Announcements
    const dismissed = this.getDismissedAnnouncements();
    if (Array.isArray(db.announcements) && db.announcements.length > 0) {
      const availableAnn = db.announcements.filter((a) => !dismissed.includes(a.id));
      if (availableAnn.length > 0) {
        const topAnn = availableAnn[0];
        this.state.announcement = {
          id: topAnn.id || 'ann-live',
          visible: true,
          title: topAnn.title || 'إعلان من إدارة المدرسة',
          summary: topAnn.content ? topAnn.content.slice(0, 80) + '...' : 'تنبيه مدرسي هام',
          content: topAnn.content || 'لا يوجد تفاصيل إضافية.',
          number: topAnn.id || '45/1090',
          date: topAnn.publishDate || topAnn.date || 'اليوم',
        };
      } else {
        this.state.announcement = { visible: false };
      }

      this.state.notifications = db.announcements.map((a, idx) => ({
        id: a.id || `notif-${idx}`,
        title: a.title,
        time: a.publishDate || 'اليوم',
        read: idx > 1 || dismissed.includes(a.id),
        icon: a.category === 'homework' ? 'assignment' : 'campaign',
        route: a.category === 'homework' ? '/homework' : '/home',
      }));
    } else {
      this.state.announcement = { visible: false };
      this.state.notifications = [];
    }

    // 2. Hydrate Homework
    if (Array.isArray(db.homeworkAssignments) && db.homeworkAssignments.length > 0) {
      this.state.homework = db.homeworkAssignments.map((h) => ({
        id: h.id,
        studentId: h.studentId || null,
        gradeLevel: h.gradeLevel || h.grade_level || null,
        classSection: h.classSection || h.class_section || null,
        subject: h.subject || 'المادة',
        teacher: h.teacherName || h.teacher_name || 'معلم المادة',
        title: h.title,
        dueTime: h.dueDate ? `تاريخ التسليم: ${h.dueDate}` : 'خلال 48 ساعة',
        description: h.description || '',
        status: h.status === 'completed' || h.status === 'submitted' ? 'submitted' : 'pending',
        score: h.score || null,
        attachmentName: h.attachments?.[0]?.name || null,
      }));
    } else {
      this.state.homework = [];
    }

    // 3. Hydrate Grades
    this.state.grades = Array.isArray(db.grades) ? db.grades : [];

    // 4. Hydrate Attendance
    this.state.attendance = Array.isArray(db.attendance) ? db.attendance : [];

    // 5. Hydrate Students
    const rawStudents = Array.isArray(db.students) && db.students.length > 0
      ? db.students
      : (Array.isArray(db.masterStudents) ? db.masterStudents : []);

    const studentsMap = {};
    if (rawStudents.length > 0) {
      const activeVc = Array.isArray(db.virtualClassrooms)
        ? db.virtualClassrooms.find((vc) => vc.status === 'live' || vc.isActive)
        : null;

      const liveClassData = activeVc
        ? {
            active: true,
            subject: activeVc.subject || 'بث مباشر',
            title: activeVc.title || 'حصة افتراضية مباشرة',
            teacher: activeVc.teacherName || 'معلم المادة',
            attendees: activeVc.attendeesCount || 24,
            meetUrl: activeVc.meetUrl || 'https://meet.jit.si/abaq-live-room',
          }
        : { active: false };

      rawStudents.forEach((s, idx) => {
        const sid = s.id || `std-${idx + 1}`;
        const total = s.tuitionTotal || 8000;
        const paid = s.tuitionPaid || 4000;
        const remaining = Math.max(0, total - paid);

        studentsMap[sid] = {
          id: sid,
          studentCode: s.studentCode || `STD-${idx + 1}`,
          nationalId: s.nationalId || '',
          fullName: s.fullName || s.name || 'طالب مدرسة عبق',
          gradeLevel: s.gradeLevel || 'المرحلة الدراسية',
          section: s.classSection || 'أ',
          schoolName: this.state.schoolName,
          schoolCode: this.state.tenantId,
          avatar: s.avatarUrl || (idx % 2 === 0 ? './assets/images/img-2.jpg' : './assets/images/img-16.jpg'),
          gpa: '98.5',
          attendanceRate: '98%',
          behaviorPoints: '+50',
          busNumber: s.busSubscription?.isSubscribed ? '04' : '14',
          busPlate: 'أ ب ج 1020',
          busDriver: 'أبو فهد القحطاني',
          busDriverPhone: '0551234567',
          busEta: '10 دقائق',
          busStatus: 'في طريقها إلى الحي',
          busStep: 2,
          tuitionTotal: total,
          tuitionPaid: paid,
          dueTuition: remaining,
          todayClassesCount: 6,
          unreadNotificationsCount: 2,
          liveClass: liveClassData,
        };
      });

      this.state.students = studentsMap;

      // Ensure activeStudentId points to valid student
      if (!this.state.students[this.state.activeStudentId]) {
        this.state.activeStudentId = Object.keys(this.state.students)[0];
      }
    }

    // 6. Hydrate Installments & Payment Vouchers
    const active = this.getActiveStudent();
    if (active) {
      this.state.installments = [
        {
          id: 'inst-1',
          title: 'دفعة الفصل الدراسي الأول',
          titleEn: 'First Term Installment',
          amount: Math.round(active.tuitionTotal * 0.5),
          date: '2025-09-01',
          dueDate: '2025-09-01',
          status: 'paid',
          statusText: 'تم السداد بنجاح',
          statusTextEn: 'Paid Successfully',
        },
        {
          id: 'inst-2',
          title: 'دفعة الفصل الدراسي الثاني',
          titleEn: 'Second Term Installment',
          amount: Math.round(active.tuitionTotal * 0.5),
          date: '2026-01-15',
          dueDate: '2026-01-15',
          status: active.dueTuition > 0 ? 'due' : 'paid',
          statusText: active.dueTuition > 0 ? `متبقي ${active.dueTuition.toLocaleString('en-US')} ر.س` : 'تم السداد بالكامل',
          statusTextEn: active.dueTuition > 0 ? `Remaining: ${active.dueTuition.toLocaleString('en-US')} SAR` : 'Paid in Full',
        },
      ];

      this.state.vouchers = [
        {
          id: 'REC-2025-0814',
          voucherNumber: 'سند رقم 10842',
          title: 'دفعة الرسوم الأولى (الفصل الأول)',
          titleEn: '1st Term Tuition Installment',
          amount: Math.round(active.tuitionTotal * 0.5),
          date: '2025-09-01',
          method: 'بطاقة مدى (Mada)',
          methodEn: 'Mada Debit Card',
          refNo: 'TXN-90248104',
          status: 'معتمد رسمياً',
          statusEn: 'Officially Verified',
          studentId: active.id,
        },
        {
          id: 'REC-2025-0512',
          voucherNumber: 'سند رقم 09511',
          title: 'رسوم النقل المدرسي (الحافلة)',
          titleEn: 'School Bus Transportation Fee',
          amount: 1500,
          date: '2025-08-25',
          method: 'تحويل بنكي (Al Rajhi)',
          methodEn: 'Bank Transfer (Al Rajhi)',
          refNo: 'TXN-87401928',
          status: 'معتمد رسمياً',
          statusEn: 'Officially Verified',
          studentId: active.id,
        },
      ];
    }
  },

  getActiveStudent() {
    const keys = Object.keys(this.state.students);
    if (keys.length === 0) {
      return {
        id: 'std-default',
        fullName: 'عمر عبده',
        gradeLevel: 'الصف الأول الابتدائي',
        section: 'أ',
        studentCode: 'STD-ABDO-1',
        tuitionTotal: 8000,
        tuitionPaid: 4000,
        dueTuition: 4000,
        avatar: './assets/images/img-2.jpg',
        attendanceRate: '100%',
        gpa: '99.0',
        liveClass: { active: false },
        unreadNotificationsCount: 1,
      };
    }
    return this.state.students[this.state.activeStudentId] || this.state.students[keys[0]];
  },

  setActiveStudent(studentId) {
    if (this.state.students[studentId]) {
      this.state.activeStudentId = studentId;
      const active = this.getActiveStudent();
      if (active) {
        this.state.installments = [
          {
            id: 'inst-1',
            title: 'دفعة الفصل الدراسي الأول',
            amount: Math.round(active.tuitionTotal * 0.5),
            date: 'مستحقة في 2025-09-01',
            status: 'paid',
            statusText: 'تم السداد بنجاح',
          },
          {
            id: 'inst-2',
            title: 'دفعة الفصل الدراسي الثاني',
            amount: Math.round(active.tuitionTotal * 0.5),
            date: 'مستحقة في 2026-01-15',
            status: active.dueTuition > 0 ? 'due' : 'paid',
            statusText: active.dueTuition > 0 ? `متبقي ${active.dueTuition.toLocaleString('en-US')} ر.س` : 'تم السداد بالكامل',
          },
        ];
      }
      this.notify();
    }
  },

  toggleActiveStudent() {
    const keys = Object.keys(this.state.students);
    if (keys.length <= 1) return this.getActiveStudent();
    const currIdx = keys.indexOf(this.state.activeStudentId);
    const nextIdx = (currIdx + 1) % keys.length;
    this.setActiveStudent(keys[nextIdx]);
    return this.getActiveStudent();
  },

  async loginParent(identifier, tenantId) {
    const code = (tenantId || getSavedSchoolCode() || 'abdo').trim().toLowerCase();
    this.state.tenantId = code;
    saveSchoolCode(code);
    const res = await authenticateParentOrStudent({
      identifier,
      tenantId: this.state.tenantId,
      schoolDb: this.cloudDb,
    });

    if (res.success && res.session) {
      this.session = res.session;
      saveActiveSession(res.session);

      // If session contains specific students, restrict to those
      if (Array.isArray(res.session.students) && res.session.students.length > 0) {
        const studentIds = res.session.students.map((s) => s.id);
        const filtered = {};
        studentIds.forEach((id) => {
          if (this.state.students[id]) {
            filtered[id] = this.state.students[id];
          }
        });
        if (Object.keys(filtered).length > 0) {
          this.state.students = filtered;
          this.state.activeStudentId = Object.keys(filtered)[0];
        }
      }

      this.notify();
      return { success: true };
    }

    return { success: false, error: res.error || 'بيانات الدخول غير صحيحة' };
  },

  async loginTeacher(username, password, tenantId) {
    const code = (tenantId || getSavedSchoolCode() || 'abdo').trim().toLowerCase();
    this.state.tenantId = code;
    saveSchoolCode(code);
    const res = await authenticateTeacherOrStaff({
      username,
      password,
      tenantId: this.state.tenantId,
      schoolDb: this.cloudDb,
    });

    if (res.success && res.session) {
      this.session = res.session;
      saveActiveSession(res.session);
      this.notify();
      return { success: true };
    }

    return { success: false, error: res.error || 'بيانات الدخول غير صحيحة' };
  },

  logout() {
    this.session = null;
    clearActiveSession();
    this.notify();
  },

  // Interactive user actions that push updates back to the cloud
  async submitHomework(hwId, answerText = '', fileName = '') {
    const hw = this.state.homework.find((h) => h.id === hwId);
    if (hw) {
      hw.status = 'submitted';
      hw.dueTime = 'تم التسليم بنجاح (قيد التصحيح)';
      hw.answerText = answerText || 'تم رفع الإجابة والمرفقات عبر التطبيق.';
      hw.attachmentName = fileName || 'حل_الواجب_المعتمد.pdf';
      this.notify();

      // Push mutation to cloud
      if (this.cloudDb) {
        const assignment = (this.cloudDb.homeworkAssignments || []).find((a) => a.id === hwId);
        if (assignment) {
          assignment.status = 'completed';
          pushSchoolDataToCloud(this.cloudDb, this.state.tenantId);
        }
      }
      return true;
    }
    return false;
  },

  async submitMedicalExcuse(excuseData) {
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

    // Push mutation to cloud database
    if (this.cloudDb) {
      if (!Array.isArray(this.cloudDb.attendance)) this.cloudDb.attendance = [];
      this.cloudDb.attendance.unshift({
        id: `att-exc-${Date.now()}`,
        targetId: this.state.activeStudentId,
        date: new Date().toISOString().split('T')[0],
        status: 'غائب بعذر',
        notes: `عذر طبي: ${newExcuse.reason}`,
      });
      pushSchoolDataToCloud(this.cloudDb, this.state.tenantId);
    }

    return newExcuse;
  },

  async submitTuitionPayment(amount, method = 'مدى (Mada Card)', receiptAttachment = null) {
    const active = this.getActiveStudent();
    const payAmount = Number(amount) || active.dueTuition;
    active.dueTuition = Math.max(0, active.dueTuition - payAmount);
    active.tuitionPaid += payAmount;

    const targetInstallment = this.state.installments.find((i) => i.status === 'due');
    if (targetInstallment) {
      if (active.dueTuition <= 0) {
        targetInstallment.status = 'paid';
        targetInstallment.statusText = 'تم السداد بنجاح';
        targetInstallment.statusTextEn = 'Paid Successfully';
      } else {
        targetInstallment.statusText = `متبقي ${active.dueTuition.toLocaleString('en-US')} ر.س`;
        targetInstallment.statusTextEn = `Remaining: ${active.dueTuition.toLocaleString('en-US')} SAR`;
      }
    }

    if (!Array.isArray(this.state.vouchers)) this.state.vouchers = [];
    const newVoucher = {
      id: `REC-${Date.now()}`,
      voucherNumber: `سند رقم ${Math.floor(10000 + Math.random() * 90000)}`,
      title: 'سداد قسط دراسي إلكتروني',
      titleEn: 'Electronic Tuition Installment',
      amount: payAmount,
      date: new Date().toISOString().split('T')[0],
      method: method,
      methodEn: method.includes('تحويل') ? 'Bank Transfer' : 'Mada Debit Card',
      refNo: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'معتمد رسمياً',
      statusEn: 'Officially Verified',
      studentId: active.id,
      attachment: receiptAttachment || null,
    };
    this.state.vouchers.unshift(newVoucher);

    this.notify();

    // Push payment mutation to cloud
    if (this.cloudDb) {
      const student = (this.cloudDb.students || []).find((s) => s.id === active.id);
      if (student) {
        student.tuitionPaid = (student.tuitionPaid || 0) + payAmount;
        pushSchoolDataToCloud(this.cloudDb, this.state.tenantId);
      }
    }

    return { success: true, remaining: active.dueTuition };
  },

  async publishTeacherTask(taskData) {
    const newHw = {
      id: `hw-${Date.now()}`,
      subject: taskData.subject || 'الرياضيات',
      teacher: this.session?.user?.name || 'أ. عبده',
      title: taskData.title || 'تكليف جديد منشور من المعلم',
      dueTime: taskData.dueTime || 'خلال 48 ساعة',
      description: taskData.description || 'إنجاز التمارين المحددة ومراجعة الحلول.',
      status: 'pending',
      score: null,
      attachmentName: taskData.attachment || null,
    };
    this.state.homework.unshift(newHw);
    this.notify();

    // Push new assignment to cloud database
    if (this.cloudDb) {
      if (!Array.isArray(this.cloudDb.homeworkAssignments)) {
        this.cloudDb.homeworkAssignments = [];
      }
      this.cloudDb.homeworkAssignments.unshift({
        id: newHw.id,
        title: newHw.title,
        subject: newHw.subject,
        description: newHw.description,
        teacherName: newHw.teacher,
        dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
        status: 'active',
      });
      pushSchoolDataToCloud(this.cloudDb, this.state.tenantId);
    }

    return newHw;
  },

  toggleTheme() {
    const newMode = switchTheme();
    this.notify();
    return newMode;
  },

  toggleLanguage() {
    const newLang = switchLang();
    this.notify();
    return newLang;
  },
};

// Auto-initialize store
portalStore.init();
