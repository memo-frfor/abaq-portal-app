import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderBusView(container, navigate) {
  const student = portalStore.getActiveStudent();

  const steps = [
    { title: 'انطلاق الحافلة', desc: 'بدء مسار الجولة الصباحية', done: student.busStep >= 1 },
    { title: 'في طريقها إلى الحي', desc: 'تبعد الحافلة 1.2 كم عن نقطة التجمع', done: student.busStep >= 2 },
    { title: 'صعود الطالب للحافلة', desc: 'تسجيل الحضور عبر مسح البطاقة الذكية', done: student.busStep >= 3 },
    { title: 'الوصول إلى المدرسة', desc: 'الدخول إلى بوابة مجمع النور بأمان', done: student.busStep >= 4 },
  ];

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button type="button" id="btn-bus-back" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <div>
            <h1 class="text-base font-bold text-slate-900">النقل المدرسي الذكي</h1>
            <p class="text-xs text-slate-400">تتبع مسار الحافلة وحالة الركوب اللحظية</p>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 font-numbers">
          حافلة ${student.busNumber}
        </span>
      </div>

      <!-- Bus Live Hero Card -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-md flex flex-col gap-3.5 border border-slate-800">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <span class="material-symbols-outlined text-[24px]">directions_bus</span>
            </div>
            <div>
              <span class="text-xs font-bold text-white leading-tight block">حافلة رقم ${student.busNumber}</span>
              <span class="text-[10px] text-slate-400 font-numbers">اللوحة: ${student.busPlate}</span>
            </div>
          </div>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>${student.busStatus}</span>
          </span>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <span class="text-[10px] text-slate-400 block">الوقت التقديري للوصول</span>
            <span class="text-base font-bold text-amber-300 font-numbers">${student.busEta}</span>
          </div>

          <div class="text-end">
            <span class="text-[10px] text-slate-400 block">نقطة التجمع</span>
            <span class="text-xs font-semibold text-white">حي الياسمين - فيلا 44</span>
          </div>
        </div>
      </div>

      <!-- Live Stepper Progress -->
      <div class="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3">
        <h3 class="text-xs font-bold text-slate-800 px-1">مراحل الرحلة المدرسية</h3>

        <div class="flex flex-col gap-3.5 pr-2">
          ${steps
            .map(
              (step, idx) => `
            <div class="flex items-start gap-3 relative">
              ${
                idx < steps.length - 1
                  ? `<div class="absolute right-[13px] top-[26px] bottom-[-16px] w-[2px] ${
                      step.done ? 'bg-blue-600' : 'bg-slate-200'
                    }"></div>`
                  : ''
              }
              <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                step.done
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }">
                <span class="material-symbols-outlined text-[15px]">${step.done ? 'check' : 'radio_button_unchecked'}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}">${step.title}</span>
                <span class="text-[10px] text-slate-400">${step.desc}</span>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Driver Contact Card -->
      <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
            أف
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-900">${student.busDriver}</h4>
            <span class="text-[10px] text-slate-400 font-numbers">${student.busDriverPhone} • سائق معتمد</span>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <button type="button" id="btn-call-driver" class="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center press-snappy border border-emerald-200">
            <span class="material-symbols-outlined text-[18px]">call</span>
          </button>
          <button type="button" id="btn-chat-driver" class="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center press-snappy border border-blue-200">
            <span class="material-symbols-outlined text-[18px]">chat</span>
          </button>
        </div>
      </div>

    </div>
  `;

  container.querySelector('#btn-bus-back').addEventListener('click', () => navigate('/home'));

  container.querySelector('#btn-call-driver')?.addEventListener('click', () => {
    showToast(`الاتصال بالسائق: ${student.busDriverPhone}`);
  });

  container.querySelector('#btn-chat-driver')?.addEventListener('click', () => {
    showToast('فتح محادثة سريعة مع مشرف الحافلة');
  });
}
