import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderFinancialsView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const installments = portalStore.state.installments;
  const isPaid = student.dueTuition <= 0;

  const paidRatio = Math.round((student.tuitionPaid / student.tuitionTotal) * 100);

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button type="button" id="btn-fin-back" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <div>
            <h1 class="text-base font-bold text-slate-900">الملف المالي والأقساط</h1>
            <p class="text-xs text-slate-400">سداد الرسوم المدرسية وسندات القبض</p>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full text-xs font-bold font-numbers ${
          isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
        }">
          ${isPaid ? 'مسدد بالكامل ✓' : `مستحق ${student.dueTuition.toLocaleString('en-US')} ر.س`}
        </span>
      </div>

      <!-- Financial Overview Card -->
      <div class="p-5 rounded-3xl bg-slate-900 text-white shadow-md flex flex-col gap-3.5 border border-slate-800">
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-400">إجمالي الرسوم الدراسية السنوية</span>
          <span class="text-xs font-bold text-blue-300 font-numbers">${student.tuitionTotal.toLocaleString('en-US')} ر.س</span>
        </div>

        <div class="flex items-baseline justify-between">
          <div>
            <span class="text-[11px] text-slate-400 block">المبلغ المتبقي للاستحقاق</span>
            <span class="text-2xl font-bold font-numbers ${isPaid ? 'text-emerald-400' : 'text-rose-400'}">
              ${student.dueTuition.toLocaleString('en-US')} <span class="text-xs text-white">ر.س</span>
            </span>
          </div>

          <div class="text-end">
            <span class="text-[11px] text-slate-400 block">المبلغ المسدد</span>
            <span class="text-sm font-bold text-emerald-400 font-numbers">${student.tuitionPaid.toLocaleString('en-US')} ر.س</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="flex flex-col gap-1 pt-1">
          <div class="flex justify-between text-[10px] text-slate-400 font-numbers">
            <span>نسبة السداد</span>
            <span class="text-white font-bold">${paidRatio}%</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-l from-emerald-500 to-blue-500 h-full rounded-full transition-all duration-500" style="width: ${paidRatio}%;"></div>
          </div>
        </div>

        ${
          !isPaid
            ? `
          <button type="button" id="btn-pay-now-modal" class="w-full py-3 rounded-2xl bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs press-snappy flex items-center justify-center gap-2 shadow-md mt-1">
            <span class="material-symbols-outlined text-[18px]">credit_card</span>
            <span>دفع الآن ${student.dueTuition.toLocaleString('en-US')} ر.س (مدى / Apple Pay)</span>
          </button>
        `
            : `
          <div class="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-center text-xs font-bold flex items-center justify-center gap-1.5 mt-1">
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span>كافة الأقساط مسددة بالكامل لهذا العام الدراسي</span>
          </div>
        `
        }
      </div>

      <!-- School Bank IBAN Card -->
      <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[20px]">account_balance</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block">حساب المدرسة الرسمي (مصرف الراجحي)</span>
            <span class="text-xs font-bold text-slate-800 font-numbers tracking-wider">SA44 2000 0001 2345 6789 0123</span>
          </div>
        </div>
        <button type="button" id="btn-copy-iban" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold press-snappy flex items-center gap-1 shrink-0">
          <span class="material-symbols-outlined text-[16px]">content_copy</span>
          <span>نسخ</span>
        </button>
      </div>

      <!-- Installments List -->
      <div class="flex flex-col gap-2.5">
        <h3 class="text-xs font-bold text-slate-700 px-1">جدول الأقساط والدفعات</h3>

        <div class="flex flex-col gap-2">
          ${installments
            .map(
              (inst, idx) => `
            <div class="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-xl ${
                  inst.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                } flex items-center justify-center shrink-0 text-xs font-bold font-numbers">
                  ${idx + 1}
                </span>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">${inst.title}</h4>
                  <span class="text-[10px] text-slate-400 font-numbers">تاريخ الاستحقاق: ${inst.dueDate}</span>
                </div>
              </div>

              <div class="text-end">
                <span class="text-xs font-bold text-slate-900 font-numbers">${inst.amount.toLocaleString('en-US')} ر.س</span>
                <span class="block text-[10px] font-bold ${
                  inst.status === 'paid' ? 'text-emerald-600' : 'text-rose-600'
                }">
                  ${inst.statusText}
                </span>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Upload Bank Transfer Receipt Button -->
      <button type="button" id="btn-upload-receipt-modal" class="w-full py-3 rounded-2xl bg-white border border-dashed border-blue-400 hover:bg-blue-50/50 text-blue-600 font-bold text-xs press-snappy flex items-center justify-center gap-2 shadow-sm">
        <span class="material-symbols-outlined text-[20px]">receipt_long</span>
        <span>إرسال إيصال تحويل بنكي للاعتماد</span>
      </button>

    </div>

    <!-- Payment Processing Simulation Modal -->
    <div id="payment-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3.5 border border-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">credit_card</span>
            </span>
            <h3 class="text-sm font-bold text-slate-900">سداد القسط المدرسي الآمن</h3>
          </div>
          <button type="button" id="close-pay-modal-btn" class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
          <span class="text-xs text-slate-500">المبلغ المستحق:</span>
          <span class="text-base font-bold text-slate-900 font-numbers">${student.dueTuition.toLocaleString('en-US')} ر.س</span>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-slate-700">اختر طريقة السداد</label>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="p-3 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5">
              <span>مدى (Mada)</span>
            </button>
            <button type="button" class="p-3 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5">
              <span>Apple Pay</span>
            </button>
          </div>
        </div>

        <button type="button" id="confirm-payment-btn" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy shadow-sm text-center">
          تأكيد الدفع الآن
        </button>
      </div>
    </div>
  `;

  container.querySelector('#btn-fin-back').addEventListener('click', () => navigate('/home'));

  container.querySelector('#btn-copy-iban')?.addEventListener('click', () => {
    navigator.clipboard?.writeText('SA4420000001234567890123').catch(() => {});
    showToast('تم نسخ رقم الآيبان بنجاح');
  });

  const payModal = container.querySelector('#payment-modal');
  const openPay = () => payModal?.classList.remove('hidden');
  const closePay = () => payModal?.classList.add('hidden');

  container.querySelector('#btn-pay-now-modal')?.addEventListener('click', openPay);
  container.querySelector('#close-pay-modal-btn')?.addEventListener('click', closePay);

  container.querySelector('#confirm-payment-btn')?.addEventListener('click', () => {
    portalStore.submitTuitionPayment(student.dueTuition);
    closePay();
    renderFinancialsView(container, navigate);
    showToast('تمت عملية السداد بنجاح واعتماد الإيصال ✓');
  });

  container.querySelector('#btn-upload-receipt-modal')?.addEventListener('click', () => {
    portalStore.submitTuitionPayment(student.dueTuition);
    renderFinancialsView(container, navigate);
    showToast('تم استلام إيصال التحويل وجارٍ مراجعته من الإدارة المالية ✓');
  });
}
