import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderHomeView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const ann = portalStore.state.announcement;
  const isSara = portalStore.state.activeStudentId === 'sara';

  const pendingHw = portalStore.state.homework.filter(
    (h) => h.studentId === student.id && h.status === 'pending'
  );

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Urgent Announcement (Dismissible, Clean) -->
      ${
        ann.visible
          ? `
        <div id="banner-announcement" class="relative overflow-hidden rounded-2xl bg-amber-50 border border-amber-200/80 p-3.5 shadow-sm transition-all duration-300">
          <div class="flex items-start justify-between gap-2.5">
            <div class="flex items-start gap-2.5 min-w-0 flex-1 cursor-pointer" id="btn-open-announcement">
              <span class="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-[19px]">campaign</span>
              </span>
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-bold text-amber-900">تعميم عاجل:</span>
                  <span class="text-xs font-semibold text-amber-800 truncate">${ann.title}</span>
                </div>
                <p class="text-[11px] text-amber-700/90 line-clamp-1 mt-0.5">${ann.summary}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-1 shrink-0">
              <button type="button" id="btn-announcement-details" class="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 text-[11px] font-bold press-snappy transition-colors">
                التفاصيل
              </button>
              <button type="button" id="btn-dismiss-announcement" class="w-7 h-7 rounded-lg text-amber-600 hover:bg-amber-200/50 flex items-center justify-center press-snappy">
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
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-l from-rose-600 to-rose-700 text-white p-4 shadow-md press-gentle">
          <div class="flex items-center justify-between pb-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>مباشر الآن</span>
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

      <!-- 6 Core Services Grid (High-Density, Crisp 1px Borders) -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-0.5">
          <h2 class="text-sm font-bold text-slate-800">الخدمات الأساسية</h2>
          <span class="text-xs text-slate-400">الوصول المباشر</span>
        </div>

        <div class="grid grid-cols-3 gap-2.5">
          <!-- 1: Financials -->
          <button type="button" data-route="/financials" class="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-400 press-snappy transition-all group">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
            <span class="text-xs font-bold text-slate-800">الرسوم والمالية</span>
            <span class="text-[10px] text-slate-400 mt-0.5">سداد الأقساط</span>
            <span class="mt-2 px-2 py-0.5 rounded-full font-numbers text-[10px] font-bold ${
              student.dueTuition > 0 ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-700'
            }">
              ${student.dueTuition > 0 ? `مستحق ${student.dueTuition.toLocaleString('en-US')} ر.س` : 'مسدد بالكامل ✓'}
            </span>
          </button>

          <!-- 2: Grades -->
          <button type="button" data-route="/grades" class="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-400 press-snappy transition-all group">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">workspace_premium</span>
            </div>
            <span class="text-xs font-bold text-slate-800">الدرجات والشهادات</span>
            <span class="text-[10px] text-slate-400 mt-0.5">نتائج الشهور</span>
            <span class="mt-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-numbers text-[10px] font-bold border border-blue-200">
              المعدل ${student.gpa}%
            </span>
          </button>

          <!-- 3: Schedule -->
          <button type="button" data-route="/schedule" class="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-400 press-snappy transition-all group">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <span class="text-xs font-bold text-slate-800">الجدول والخطة</span>
            <span class="text-[10px] text-slate-400 mt-0.5">الحصص الأسبوعية</span>
            <span class="mt-2 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-numbers text-[10px] font-bold border border-indigo-200">
              اليوم ${student.todayClassesCount} حصص
            </span>
          </button>

          <!-- 4: Attendance -->
          <button type="button" data-route="/grades" class="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-400 press-snappy transition-all group">
            <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">fact_check</span>
            </div>
            <span class="text-xs font-bold text-slate-800">الحضور والانضباط</span>
            <span class="text-[10px] text-slate-400 mt-0.5">سجل الغياب</span>
            <span class="mt-2 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-numbers text-[10px] font-bold border border-teal-200">
              ${student.attendanceRate} انضباط
            </span>
          </button>

          <!-- 5: Behavior -->
          <button type="button" data-route="/grades" class="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-400 press-snappy transition-all group">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">military_tech</span>
            </div>
            <span class="text-xs font-bold text-slate-800">الأنشطة والسلوك</span>
            <span class="text-[10px] text-slate-400 mt-0.5">شارات الشرف</span>
            <span class="mt-2 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-numbers text-[10px] font-bold border border-amber-200">
              ${student.behaviorPoints} نقطة
            </span>
          </button>

          <!-- 6: Transport -->
          <button type="button" data-route="/bus" class="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-400 press-snappy transition-all group">
            <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[22px]">directions_bus</span>
            </div>
            <span class="text-xs font-bold text-slate-800">النقل المدرسي</span>
            <span class="text-[10px] text-slate-400 mt-0.5">تتبع الحافلة</span>
            <span class="mt-2 px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-numbers text-[10px] font-bold border border-orange-200">
              حافلة ${student.busNumber}
            </span>
          </button>
        </div>
      </div>

      <!-- Quick Interactive Quiz Launcher -->
      <div class="rounded-2xl bg-gradient-to-l from-slate-900 to-blue-950 text-white p-4 shadow-sm flex items-center justify-between gap-3 border border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[24px]">quiz</span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-white">اختبار تفاعلي قصير</span>
              <span class="px-1.5 py-0.2 bg-blue-500/30 text-blue-200 text-[10px] rounded-md font-numbers">5 أسئلة</span>
            </div>
            <p class="text-[11px] text-slate-300 mt-0.5">مبادئ الذكاء الاصطناعي والبرمجة</p>
          </div>
        </div>

        <button type="button" id="btn-start-quiz" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold press-snappy shadow-sm shrink-0 flex items-center gap-1">
          <span>بدء الآن</span>
          <span class="material-symbols-outlined text-[16px]">bolt</span>
        </button>
      </div>

      <!-- Pending Tasks Stream -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-0.5">
          <h2 class="text-sm font-bold text-slate-800">الواجبات والتكليفات المطلوبة</h2>
          <button type="button" data-route="/homework" class="text-xs font-bold text-blue-600 hover:underline">
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
            <div class="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start justify-between gap-3">
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-900">${hw.subject}</span>
                  <span class="text-[10px] text-slate-400">• ${hw.teacher}</span>
                </div>
                <h4 class="text-xs font-medium text-slate-700 mt-1 leading-snug">${hw.title}</h4>
                <div class="flex items-center gap-1.5 text-[10px] text-rose-600 mt-1.5 font-medium">
                  <span class="material-symbols-outlined text-[14px]">alarm</span>
                  <span>${hw.dueTime}</span>
                </div>
              </div>
              <button type="button" data-route="/homework" class="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold press-snappy shrink-0 self-center">
                تسليم الحل
              </button>
            </div>
          `
                  )
                  .join('')
              : `
            <div class="p-5 rounded-2xl bg-white border border-slate-200/80 text-center text-xs text-slate-400">
              لا توجد واجبات معلقة للطالب حالياً.
            </div>
          `
          }
        </div>
      </div>

      <!-- Digital Student ID Card Banner -->
      <div class="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-md border border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/10 text-blue-300 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px]">badge</span>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">البطاقة المدرسية الرقمية</h4>
            <p class="text-[11px] text-slate-400 mt-0.5">استخدم بطاقة الطالب للدخول والحافلة عبر NFC / QR</p>
          </div>
        </div>
        <button type="button" data-route="/student-id" class="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold press-snappy shrink-0">
          عرض البطاقة
        </button>
      </div>

    </div>

    <!-- Announcement Detail Dialog -->
    <div id="announcement-detail-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3.5 border border-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">campaign</span>
            </span>
            <h3 class="text-sm font-bold text-slate-800">تعميم إداري رسمي</h3>
          </div>
          <button type="button" id="close-ann-detail-btn" class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <h4 class="text-xs font-bold text-slate-900 leading-snug">${ann.title}</h4>
          <p class="text-xs text-slate-600 leading-relaxed text-justify">${ann.content}</p>
        </div>

        <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between text-[11px] text-slate-500 font-numbers">
          <span>الرقم: ${ann.number}</span>
          <span>التاريخ: ${ann.date}</span>
        </div>

        <button type="button" id="ack-ann-btn" class="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs press-snappy text-center shadow-sm">
          تأكيد القراءة
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

  container.querySelector('#btn-open-announcement')?.addEventListener('click', openAnn);
  container.querySelector('#btn-announcement-details')?.addEventListener('click', openAnn);
  container.querySelector('#close-ann-detail-btn')?.addEventListener('click', closeAnn);
  container.querySelector('#ack-ann-btn')?.addEventListener('click', () => {
    closeAnn();
    showToast('تم تأكيد قراءة التعميم الإداري');
  });

  container.querySelector('#btn-dismiss-announcement')?.addEventListener('click', () => {
    portalStore.dismissAnnouncement();
    container.querySelector('#banner-announcement')?.remove();
    showToast('تم إخفاء التعميم');
  });

  container.querySelector('#btn-start-quiz')?.addEventListener('click', () => {
    navigate('/quiz');
  });

  container.querySelector('#btn-join-live')?.addEventListener('click', () => {
    showToast('جاري فتح غرفة الفصل الافتراضي المباشر...');
  });
}
