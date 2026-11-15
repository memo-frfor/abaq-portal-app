import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderStudentIdView(container, navigate) {
  const student = portalStore.getActiveStudent();

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-32">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button type="button" id="btn-id-back" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <div>
            <h1 class="text-base font-bold text-slate-900">البطاقة المدرسية الذكية</h1>
            <p class="text-xs text-slate-400">الهوية المعتمدة لدخول الحرم المدرسي والحافلة</p>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          نشطة ومفعلة ✓
        </span>
      </div>

      <!-- Digital Pass Card (Executive Dark Minimalist) -->
      <div class="relative w-full rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-slate-900 via-[#13223f] to-slate-950 text-white p-6 border border-slate-700/60 flex flex-col gap-5">
        <!-- Top row: School Logo + NFC indicator -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <img src="./assets/images/img-1.jpg" alt="Abaq" class="w-8 h-8 rounded-xl bg-white/10 p-1 object-contain border border-white/20" />
            <div>
              <span class="text-xs font-bold text-white tracking-wide block">${student.schoolName}</span>
              <span class="text-[10px] text-blue-300">وزارة التعليم • المملكة العربية السعودية</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-blue-300 text-[26px]">contactless</span>
        </div>

        <!-- Student Photo & Core Details -->
        <div class="flex items-center gap-4">
          <img src="${student.avatar}" alt="${student.fullName}" class="w-16 h-20 rounded-2xl object-cover ring-2 ring-blue-400 shadow-md shrink-0" />
          <div class="flex flex-col gap-1">
            <h2 class="text-base font-bold text-white leading-tight">${student.fullName}</h2>
            <span class="text-xs text-blue-200">${student.gradeLevel} - شعبة (${student.section})</span>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-numbers text-[10px]">
                كود: ${student.studentCode}
              </span>
              <span class="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-numbers text-[10px]">
                هوية: ${student.nationalId}
              </span>
            </div>
          </div>
        </div>

        <!-- Barcode & Campus Access Bar -->
        <div class="pt-3 border-t border-white/15 flex flex-col items-center gap-2">
          <div class="w-full bg-white rounded-xl py-2 px-4 flex items-center justify-center">
            <!-- Simulated barcode lines -->
            <div class="flex items-center justify-center gap-[3px] h-8 w-full max-w-xs">
              ${Array.from({ length: 42 })
                .map(
                  (_, i) => `
                <div class="h-full bg-slate-900 ${
                  i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-[2px]'
                }"></div>
              `
                )
                .join('')}
            </div>
          </div>
          <span class="text-[10px] text-slate-400 font-numbers tracking-widest">${student.studentCode}</span>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-col gap-2.5">
        <button type="button" id="btn-add-wallet" class="w-full py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold press-snappy flex items-center justify-center gap-2 shadow-sm border border-slate-800">
          <span class="material-symbols-outlined text-[18px]">wallet</span>
          <span>إضافة إلى محفظة الهاتف (Apple Wallet / Google Wallet)</span>
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button type="button" id="btn-share-id" class="py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold press-snappy flex items-center justify-center gap-1.5 shadow-sm">
            <span class="material-symbols-outlined text-[16px] text-blue-600">share</span>
            <span>مشاركة البطاقة</span>
          </button>
          <button type="button" id="btn-emergency-call" class="py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold press-snappy flex items-center justify-center gap-1.5 shadow-sm">
            <span class="material-symbols-outlined text-[16px]">phone_in_talk</span>
            <span>هاتف الطوارئ</span>
          </button>
        </div>
      </div>

    </div>
  `;

  container.querySelector('#btn-id-back').addEventListener('click', () => navigate('/account'));

  container.querySelector('#btn-add-wallet')?.addEventListener('click', () => {
    showToast('تمت إضافة البطاقة إلى محفظة الهاتف بنجاح ✓');
  });

  container.querySelector('#btn-share-id')?.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `البطاقة المدرسية - ${student.fullName}`,
          text: `بطاقة الطالب المعتمدة: ${student.fullName}\nالصف: ${student.gradeLevel} - شعبة ${student.section}\nكود الطالب: ${student.studentCode}\nالمدرسة: ${student.schoolName}`,
        });
        return;
      } catch {}
    }
    showToast('تم نسخ بيانات البطاقة الرقمية للمشاركة ✓', 'success');
  });

  container.querySelector('#btn-emergency-call')?.addEventListener('click', () => {
    window.location.href = 'tel:0555555555';
  });
}
