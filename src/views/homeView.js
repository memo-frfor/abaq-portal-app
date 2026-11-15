import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderHomeView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const ann = portalStore.state.announcement;

  const pendingHw = portalStore.state.homework.filter(
    (h) => (h.studentId === student.id || h.gradeLevel === student.gradeLevel) && h.status === 'pending'
  );

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-32">

      <!-- Urgent Announcement (Clean, Unclipped Alert) -->
      ${
        ann.visible
          ? `
        <div id="banner-announcement" class="relative overflow-hidden rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 p-3.5 shadow-xs transition-all press-tactile cursor-pointer" id="btn-open-announcement">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <span class="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[20px]">campaign</span>
              </span>
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold">تعميم إداري</span>
                  <span class="text-xs font-bold text-slate-800 dark:text-white truncate">${ann.title}</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">${ann.summary}</p>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button type="button" id="btn-announcement-details" class="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] font-bold hover:bg-amber-500/25 transition-colors">
                عرض
              </button>
              <button type="button" id="btn-dismiss-announcement" class="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </div>
        </div>
      `
          : ''
      }

      <!-- Live Virtual Classroom Alert (When Active) -->
      ${
        student.liveClass && student.liveClass.active
          ? `
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-rose-600 to-rose-700 text-white p-4 shadow-md press-tactile">
          <div class="flex items-center justify-between pb-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>بث مباشر نشط الآن</span>
            </span>
            <span class="text-[11px] text-white/80">الفصل الافتراضي</span>
          </div>

          <h3 class="text-sm font-bold text-white leading-snug mt-1">${student.liveClass.title}</h3>
          <p class="text-xs text-white/90 mt-0.5">المعلم: ${student.liveClass.teacher}</p>

          <div class="flex items-center justify-between pt-3 mt-1 border-t border-white/15">
            <div class="flex items-center gap-1.5 text-xs text-white/90">
              <span class="material-symbols-outlined text-[16px]">groups</span>
              <span class="font-numbers">${student.liveClass.attendees} طالب متواجد</span>
            </div>
            <button type="button" id="btn-join-live" class="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-rose-700 text-xs font-bold shadow-sm press-snappy">
              <span>انضمام للحصة</span>
              <span class="material-symbols-outlined text-[16px]">videocam</span>
            </button>
          </div>
        </div>
      `
          : ''
      }

      <!-- Core Services 2-Column Bento Grid (Spacious, Zero Edge Cramping) -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-0.5">
          <h2 class="text-sm font-bold text-slate-800 dark:text-white">الخدمات الأساسية</h2>
          <span class="text-xs text-slate-400">الوصول السريع</span>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          <!-- 1: Grades & Academic -->
          <button type="button" data-route="/grades" class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">workspace_premium</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-slate-900 dark:text-white truncate">الدرجات والتقييم</span>
              <span class="text-[10px] text-slate-400 font-numbers mt-0.5 truncate">${student.gpa}% المعدل العام</span>
            </div>
          </button>

          <!-- 2: Homework -->
          <button type="button" data-route="/homework" class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">assignment</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-slate-900 dark:text-white truncate">الواجبات والتكليفات</span>
              <span class="text-[10px] ${pendingHw.length > 0 ? 'text-rose-500 font-semibold' : 'text-slate-400'} font-numbers mt-0.5 truncate">${pendingHw.length > 0 ? `${pendingHw.length} واجب مطلوب` : 'مكتمل بالكامل ✓'}</span>
            </div>
          </button>

          <!-- 3: Schedule & Weekly Plan -->
          <button type="button" data-route="/schedule" class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-slate-900 dark:text-white truncate">الجدول والخطة</span>
              <span class="text-[10px] text-slate-400 font-numbers mt-0.5 truncate">${student.todayClassesCount} حصص اليوم</span>
            </div>
          </button>

          <!-- 4: Financials & Tuition -->
          <button type="button" data-route="/financials" class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-slate-900 dark:text-white truncate">الملف المالي</span>
              <span class="text-[10px] text-slate-400 font-numbers mt-0.5 truncate">${student.dueTuition > 0 ? `${student.dueTuition} ر.س مستحق` : 'مسدد بالكامل ✓'}</span>
            </div>
          </button>

          <!-- 5: Digital Curriculum & Library -->
          <button type="button" data-route="/library" class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">local_library</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-slate-900 dark:text-white truncate">الكتب والمناهج</span>
              <span class="text-[10px] text-slate-400 mt-0.5 truncate">مقررات PDF الرسمية</span>
            </div>
          </button>

          <!-- 6: Live Virtual Broadcast -->
          <button type="button" data-route="/virtual-classes" class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">video_call</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-slate-900 dark:text-white truncate">الفصول الحية</span>
              <span class="text-[10px] text-rose-500 font-semibold mt-0.5 truncate">بث واجتماعات مباشرة</span>
            </div>
          </button>

          <!-- 7: Behavior & Conduct Points -->
          <button type="button" data-route="/behavior" class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">military_tech</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-slate-900 dark:text-white truncate">السلوك والمواظبة</span>
              <span class="text-[10px] text-amber-600 font-semibold font-numbers mt-0.5 truncate">${student.behaviorPoints} نقطة تميز</span>
            </div>
          </button>

          <!-- 8: School Bus Tracking -->
          <button type="button" data-route="/bus" class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 press-tactile transition-all text-start group">
            <div class="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">directions_bus</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-slate-900 dark:text-white truncate">الحافلة المدرسية</span>
              <span class="text-[10px] text-slate-400 font-numbers mt-0.5 truncate">حافلة رقم ${student.busNumber}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Pending Tasks Stream -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-0.5">
          <h2 class="text-sm font-bold text-slate-800 dark:text-white">الواجبات والتكليفات القادمة</h2>
          <button type="button" data-route="/homework" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            عرض الكل (${pendingHw.length})
          </button>
        </div>

        <div class="flex flex-col gap-2">
          ${
            pendingHw.length > 0
              ? pendingHw
                  .slice(0, 2)
                  .map(
                    (hw) => `
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 transition-all hover:border-blue-400">
              <div class="flex flex-col min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-blue-600 dark:text-blue-400">${hw.subject}</span>
                  <span class="text-[10px] text-slate-400">• ${hw.teacher}</span>
                </div>
                <h4 class="text-xs font-semibold text-slate-800 dark:text-white mt-1 truncate">${hw.title}</h4>
                <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-medium font-numbers">
                  <span class="material-symbols-outlined text-[13px]">event</span>
                  <span>${hw.dueTime}</span>
                </div>
              </div>
              <button type="button" data-route="/homework" class="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold press-tactile shrink-0">
                تسليم الحل
              </button>
            </div>
          `
                  )
                  .join('')
              : `
            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
              <span class="material-symbols-outlined text-[24px] text-emerald-500">task_alt</span>
              <span>جميع الواجبات المدرسية مكتملة أو لا توجد تكليفات جديدة.</span>
            </div>
          `
          }
        </div>
      </div>

      <!-- Digital Student ID Card Banner -->
      <div class="p-4 rounded-3xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-md border border-slate-800 press-tactile">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-white/10 text-blue-300 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px]">badge</span>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">بطاقة الطالب الرقمية المعتمدة</h4>
            <p class="text-[11px] text-slate-400 mt-0.5">رمز الدخول الذكي وتأكيد الركوب في الحافلة (QR & NFC)</p>
          </div>
        </div>
        <button type="button" data-route="/student-id" class="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold press-snappy shrink-0">
          عرض البطاقة
        </button>
      </div>

    </div>

    <!-- Announcement Detail Bottom Sheet (iOS Style) -->
    <div id="announcement-detail-modal" class="hidden fixed inset-0 z-50 flex flex-col justify-end sheet-backdrop">
      <div class="fixed inset-0" id="close-ann-backdrop"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-t-[32px] p-6 shadow-2xl flex flex-col gap-4 max-w-lg mx-auto w-full sheet-panel border-t border-slate-100 dark:border-slate-800 pb-safe">
        <div class="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-1"></div>

        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2.5">
            <span class="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <span class="material-symbols-outlined text-[20px]">campaign</span>
            </span>
            <div>
              <h3 class="text-sm font-bold text-slate-800 dark:text-white">تعميم إداري رسمي</h3>
              <span class="text-[10px] text-slate-400 font-numbers">${ann.number} • ${ann.date}</span>
            </div>
          </div>
          <button type="button" id="close-ann-detail-btn" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <h4 class="text-xs font-bold text-slate-900 dark:text-white leading-snug">${ann.title}</h4>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify">${ann.content}</p>
        </div>

        <button type="button" id="ack-ann-btn" class="w-full py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs press-snappy text-center shadow-md shadow-blue-600/25 mt-2">
          تأكيد القراءة والاعتماد
        </button>
      </div>
    </div>
  `;

  // Attach event bindings
  container.querySelectorAll('[data-route]').forEach((el) => {
    el.addEventListener('click', () => {
      const route = el.getAttribute('data-route');
      navigate(route);
    });
  });

  const annDetailModal = container.querySelector('#announcement-detail-modal');
  const openAnn = () => annDetailModal?.classList.remove('hidden');
  const closeAnn = () => annDetailModal?.classList.add('hidden');

  container.querySelector('#banner-announcement')?.addEventListener('click', openAnn);
  container.querySelector('#btn-announcement-details')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAnn();
  });
  container.querySelector('#close-ann-detail-btn')?.addEventListener('click', closeAnn);
  container.querySelector('#close-ann-backdrop')?.addEventListener('click', closeAnn);

  container.querySelector('#ack-ann-btn')?.addEventListener('click', () => {
    closeAnn();
    portalStore.dismissAnnouncement(ann.id);
    container.querySelector('#banner-announcement')?.remove();
    showToast('تم تأكيد قراءة التعميم الإداري بنجاح');
  });

  container.querySelector('#btn-dismiss-announcement')?.addEventListener('click', (e) => {
    e.stopPropagation();
    portalStore.dismissAnnouncement(ann.id);
    container.querySelector('#banner-announcement')?.remove();
    showToast('تم إخفاء التعميم');
  });

  container.querySelector('#btn-join-live')?.addEventListener('click', () => {
    navigate('/virtual-classes');
  });
}
