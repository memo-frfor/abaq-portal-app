import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';
import { t, getStoredLanguage } from '../services/i18n.js';

export function renderFinancialsView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const installments = portalStore.state.installments || [];
  const vouchers = (portalStore.state.vouchers || []).filter(
    (v) => !v.studentId || v.studentId === student.id
  );
  const isPaid = student.dueTuition <= 0;
  const isEn = getStoredLanguage() === 'en';

  const paidRatio = Math.round((student.tuitionPaid / student.tuitionTotal) * 100) || 0;
  let attachedSlip = null;

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-3.5 sm:px-4 py-4 gap-4 pb-32">

      <!-- Header -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <button type="button" id="btn-fin-back" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center press-snappy shrink-0">
            <span class="material-symbols-outlined text-[18px]">${isEn ? 'arrow_back' : 'arrow_forward'}</span>
          </button>
          <div class="min-w-0">
            <h1 class="text-base font-bold text-slate-900 dark:text-white leading-tight">${t('financeTitle')}</h1>
            <p class="text-xs text-slate-400 truncate">${t('financeSub')}</p>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full text-xs font-bold font-numbers shrink-0 ${
          isPaid ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
        }">
          ${isPaid ? t('paidInFull') : `${t('dueAmount')} ${student.dueTuition.toLocaleString('en-US')} ${t('currencySar')}`}
        </span>
      </div>

      <!-- Financial Overview Card (Q Deep Ocean Gradient) -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-[#083038] via-[#094752] to-[#0E9CAC] text-white shadow-lg flex flex-col gap-3.5 border border-white/10">
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-200">${t('totalTuition')}</span>
          <span class="text-xs font-bold text-[#D6FCFF] font-numbers">${student.tuitionTotal.toLocaleString('en-US')} ${t('currencySar')}</span>
        </div>

        <div class="flex items-baseline justify-between">
          <div>
            <span class="text-[11px] text-slate-200 block">${t('remainingDue')}</span>
            <span class="text-2xl font-bold font-numbers ${isPaid ? 'text-emerald-300' : 'text-rose-200'}">
              ${student.dueTuition.toLocaleString('en-US')} <span class="text-xs text-white">${t('currencySar')}</span>
            </span>
          </div>

          <div class="text-end">
            <span class="text-[11px] text-slate-200 block">${t('amountPaidSoFar')}</span>
            <span class="text-base font-bold text-emerald-300 font-numbers">${student.tuitionPaid.toLocaleString('en-US')} ${t('currencySar')}</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="flex flex-col gap-1 pt-1">
          <div class="flex justify-between text-[10px] text-slate-200 font-numbers">
            <span>${t('paymentRatio')}</span>
            <span class="text-white font-bold">${paidRatio}%</span>
          </div>
          <div class="w-full bg-black/25 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-l from-[#a3f4fb] to-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${paidRatio}%;"></div>
          </div>
        </div>

        ${
          !isPaid
            ? `
          <button type="button" id="btn-pay-now-modal" class="w-full py-3 rounded-2xl bg-white text-[#085461] hover:bg-slate-50 font-bold text-xs press-snappy flex items-center justify-center gap-2 shadow-md mt-1">
            <span class="material-symbols-outlined text-[18px]">credit_card</span>
            <span>${t('payNowBtn')}</span>
          </button>
        `
            : `
          <div class="w-full py-2.5 rounded-xl bg-white/15 border border-white/20 text-emerald-200 text-center text-xs font-bold flex items-center justify-center gap-1.5 mt-1">
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span>${t('paidInFull')}</span>
          </div>
        `
        }
      </div>

      <!-- School Bank IBAN Card -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-[#0E9CAC]/15 text-[#0E9CAC] dark:text-[#7bcfd6] flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[20px]">account_balance</span>
          </div>
          <div class="min-w-0">
            <span class="text-[10px] text-slate-400 block truncate">${t('schoolIbanTitle')}</span>
            <span class="text-xs font-bold text-slate-800 dark:text-white font-numbers tracking-wider truncate block">SA44 2000 0001 2345 6789 0123</span>
          </div>
        </div>
        <button type="button" id="btn-copy-iban" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold press-snappy flex items-center gap-1 shrink-0">
          <span class="material-symbols-outlined text-[16px]">content_copy</span>
          <span>${t('copyBtn')}</span>
        </button>
      </div>

      <!-- SECTION 1: Installments Schedule -->
      <div class="flex flex-col gap-2.5">
        <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300 px-1">${t('installmentsSchedule')}</h3>

        <div class="flex flex-col gap-2">
          ${installments
            .map(
              (inst, idx) => `
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2.5">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-8 h-8 rounded-xl ${
                  inst.status === 'paid' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                } flex items-center justify-center shrink-0 text-xs font-bold font-numbers">
                  ${idx + 1}
                </span>
                <div class="min-w-0">
                  <h4 class="text-xs font-bold text-slate-800 dark:text-white truncate">${isEn && inst.titleEn ? inst.titleEn : inst.title}</h4>
                  <span class="text-[10px] text-slate-400 font-numbers block">${t('dueWithin')} ${inst.dueDate || inst.date}</span>
                </div>
              </div>

              <div class="text-end shrink-0">
                <span class="text-xs font-bold text-slate-900 dark:text-white font-numbers block">${inst.amount.toLocaleString('en-US')} ${t('currencySar')}</span>
                <span class="inline-block text-[10px] font-bold ${
                  inst.status === 'paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }">
                  ${isEn && inst.statusTextEn ? inst.statusTextEn : inst.statusText}
                </span>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- SECTION 2: Verified Receipts & Payment Vouchers (سندات القبض المعتمدة) -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300">${t('vouchersTitle')}</h3>
          <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">${vouchers.length} ${t('paidInFull')}</span>
        </div>

        <div class="flex flex-col gap-2">
          ${
            vouchers.length > 0
              ? vouchers
                  .map(
                    (v) => `
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2.5 transition-all hover:border-[#0E9CAC]">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">verified</span>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-xs font-bold text-slate-900 dark:text-white">${isEn && v.titleEn ? v.titleEn : v.title}</span>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold border border-emerald-200 dark:border-emerald-800">${v.voucherNumber}</span>
                  </div>
                  <span class="text-[10px] text-slate-400 block mt-0.5 font-numbers">${v.date} • ${isEn && v.methodEn ? v.methodEn : v.method}</span>
                </div>
              </div>

              <div class="flex flex-col items-end gap-1 shrink-0">
                <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-numbers">${v.amount.toLocaleString('en-US')} ${t('currencySar')}</span>
                <button type="button" data-view-voucher="${v.id}" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0E9CAC] hover:text-white text-slate-600 dark:text-slate-300 text-[10px] font-bold press-snappy flex items-center gap-1 transition-colors">
                  <span class="material-symbols-outlined text-[13px]">receipt</span>
                  <span>${t('viewVoucherBtn')}</span>
                </button>
              </div>
            </div>
          `
                  )
                  .join('')
              : `
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              لا توجد سندات قبض مسجلة حالياً
            </div>
          `
          }
        </div>
      </div>

      <!-- SECTION 3: Upload Bank Transfer Receipt Button -->
      <button type="button" id="btn-upload-receipt-modal" class="w-full py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-[#0E9CAC] hover:bg-[#0E9CAC]/5 text-[#0E9CAC] dark:text-[#7bcfd6] font-bold text-xs press-snappy flex items-center justify-center gap-2 shadow-xs transition-colors">
        <span class="material-symbols-outlined text-[20px]">cloud_upload</span>
        <span>${t('uploadReceiptBtn')}</span>
      </button>

    </div>

    <!-- MODAL 1: Online Payment Simulation (Mada / Apple Pay) -->
    <div id="payment-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3.5 border border-slate-100 dark:border-slate-800">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-[#0E9CAC]/15 text-[#0E9CAC] flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">credit_card</span>
            </span>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">سداد القسط المدرسي الآمن</h3>
          </div>
          <button type="button" id="close-pay-modal-btn" class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <span class="text-xs text-slate-500 dark:text-slate-400">المبلغ المستحق:</span>
          <span class="text-base font-bold text-slate-900 dark:text-white font-numbers">${student.dueTuition.toLocaleString('en-US')} ${t('currencySar')}</span>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300">اختر طريقة السداد</label>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="p-3 rounded-xl border-2 border-[#0E9CAC] bg-[#0E9CAC]/10 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-1.5">
              <span>مدى (Mada)</span>
            </button>
            <button type="button" class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0E9CAC] text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5">
              <span>Apple Pay</span>
            </button>
          </div>
        </div>

        <button type="button" id="confirm-payment-btn" class="w-full py-3 rounded-xl bg-gradient-to-l from-[#0E9CAC] to-[#0a7a8b] hover:opacity-90 text-white font-bold text-xs press-snappy shadow-md shadow-[#0E9CAC]/25 text-center">
          تأكيد الدفع الإلكتروني الآن
        </button>
      </div>
    </div>

    <!-- MODAL 2: Bank Slip Camera/Gallery Upload Sheet -->
    <div id="receipt-upload-modal" class="hidden fixed inset-0 z-50 flex flex-col justify-end sheet-backdrop">
      <div class="fixed inset-0" id="close-receipt-backdrop"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-t-[32px] p-5 sm:p-6 shadow-2xl flex flex-col gap-3.5 max-w-lg mx-auto w-full sheet-panel border-t border-slate-100 dark:border-slate-800 pb-safe">
        <div class="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-1"></div>

        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-[#0E9CAC]/15 text-[#0E9CAC] flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">receipt_long</span>
            </span>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">${t('receiptUploadTitle')}</h3>
          </div>
          <button type="button" id="close-receipt-modal-btn" class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <!-- Hidden Native File/Camera Input for Bank Slip -->
        <input type="file" id="bank-slip-file-input" accept="image/*,application/pdf" capture="environment" class="hidden" />

        <div class="border-2 border-dashed border-[#0E9CAC]/30 hover:border-[#0E9CAC] rounded-2xl p-4 text-center cursor-pointer flex flex-col items-center gap-2 transition-all bg-[#f0fbfd]/50 dark:bg-slate-800/50" id="bank-slip-dropzone">
          <div class="flex items-center gap-3">
            <button type="button" id="btn-camera-slip" class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E9CAC] text-white font-bold text-xs press-snappy shadow-xs">
              <span class="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>${t('cameraOption')}</span>
            </button>
            <button type="button" id="btn-gallery-slip" class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs press-snappy">
              <span class="material-symbols-outlined text-[16px]">image</span>
              <span>${t('galleryOption')}</span>
            </button>
          </div>
          <span class="text-[11px] text-slate-500 dark:text-slate-400" id="slip-file-label">${t('receiptUploadHint')}</span>
        </div>

        <!-- Slip Preview Box -->
        <div id="slip-preview-box" class="hidden p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-xs">
          <div class="flex items-center gap-2.5 min-w-0">
            <img id="slip-preview-thumb" src="" alt="Slip" class="hidden w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
            <div id="slip-preview-pdf" class="hidden w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[24px]">picture_as_pdf</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span id="slip-preview-name" class="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[180px]"></span>
              <span id="slip-preview-size" class="text-[10px] text-slate-400 font-numbers"></span>
            </div>
          </div>
          <button type="button" id="btn-remove-slip" class="w-8 h-8 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center press-snappy shrink-0">
            <span class="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>

        <button type="button" id="confirm-upload-slip-btn" class="w-full py-3 rounded-2xl bg-gradient-to-l from-[#0E9CAC] to-[#0a7a8b] hover:opacity-90 text-white font-bold text-xs press-snappy shadow-md shadow-[#0E9CAC]/25 text-center mt-1">
          ${t('confirmReceiptSend')}
        </button>
      </div>
    </div>

    <!-- MODAL 3: Official Payment Voucher Details (سند القبض المعتمد) -->
    <div id="voucher-details-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3.5 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">verified</span>
            </span>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">سند قبض مالي معتمد</h3>
          </div>
          <button type="button" id="close-voucher-modal-btn" class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div id="voucher-modal-content" class="flex flex-col gap-3 text-xs">
          <!-- Dynamic Voucher Details Injected Here -->
        </div>

        <div class="flex items-center gap-2 pt-1">
          <button type="button" id="btn-print-voucher" class="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs press-snappy flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">print</span>
            <span>طباعة أو حفظ السند</span>
          </button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-fin-back').addEventListener('click', () => navigate('/home'));

  container.querySelector('#btn-copy-iban')?.addEventListener('click', () => {
    navigator.clipboard?.writeText('SA4420000001234567890123').catch(() => {});
    showToast(t('copiedToast'), 'success');
  });

  // Modal 1: Online Pay
  const payModal = container.querySelector('#payment-modal');
  const openPay = () => payModal?.classList.remove('hidden');
  const closePay = () => payModal?.classList.add('hidden');

  container.querySelector('#btn-pay-now-modal')?.addEventListener('click', openPay);
  container.querySelector('#close-pay-modal-btn')?.addEventListener('click', closePay);

  container.querySelector('#confirm-payment-btn')?.addEventListener('click', () => {
    portalStore.submitTuitionPayment(student.dueTuition, 'مدى (Mada Card)');
    closePay();
    renderFinancialsView(container, navigate);
    showToast('تمت عملية السداد بنجاح وإصدار سند القبض المعتمد ✓', 'success');
  });

  // Modal 2: Bank Slip Camera / File Upload
  const slipModal = container.querySelector('#receipt-upload-modal');
  const slipInput = container.querySelector('#bank-slip-file-input');
  const slipPreviewBox = container.querySelector('#slip-preview-box');
  const slipThumb = container.querySelector('#slip-preview-thumb');
  const slipPdf = container.querySelector('#slip-preview-pdf');
  const slipName = container.querySelector('#slip-preview-name');
  const slipSize = container.querySelector('#slip-preview-size');

  const openSlipModal = () => slipModal?.classList.remove('hidden');
  const closeSlipModal = () => {
    slipModal?.classList.add('hidden');
    attachedSlip = null;
    if (slipInput) slipInput.value = '';
    slipPreviewBox?.classList.add('hidden');
  };

  container.querySelector('#btn-upload-receipt-modal')?.addEventListener('click', openSlipModal);
  container.querySelector('#close-receipt-modal-btn')?.addEventListener('click', closeSlipModal);
  container.querySelector('#close-receipt-backdrop')?.addEventListener('click', closeSlipModal);

  container.querySelector('#btn-camera-slip')?.addEventListener('click', (e) => {
    e.stopPropagation();
    slipInput.setAttribute('capture', 'environment');
    slipInput.click();
  });

  container.querySelector('#btn-gallery-slip')?.addEventListener('click', (e) => {
    e.stopPropagation();
    slipInput.removeAttribute('capture');
    slipInput.click();
  });

  container.querySelector('#bank-slip-dropzone')?.addEventListener('click', () => {
    slipInput.removeAttribute('capture');
    slipInput.click();
  });

  slipInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      attachedSlip = {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type,
        dataUrl: ev.target.result,
      };

      slipName.textContent = attachedSlip.name;
      slipSize.textContent = attachedSlip.size;
      slipPreviewBox.classList.remove('hidden');

      if (file.type.startsWith('image/')) {
        slipThumb.src = ev.target.result;
        slipThumb.classList.remove('hidden');
        slipPdf.classList.add('hidden');
      } else {
        slipThumb.classList.add('hidden');
        slipPdf.classList.remove('hidden');
      }

      showToast(`تم إرفاق إشعار التحويل: ${file.name} ✓`, 'success');
    };
    reader.readAsDataURL(file);
  });

  container.querySelector('#btn-remove-slip')?.addEventListener('click', (e) => {
    e.stopPropagation();
    attachedSlip = null;
    if (slipInput) slipInput.value = '';
    slipPreviewBox.classList.add('hidden');
  });

  container.querySelector('#confirm-upload-slip-btn')?.addEventListener('click', () => {
    portalStore.submitTuitionPayment(student.dueTuition, 'تحويل بنكي (Al Rajhi)', attachedSlip ? attachedSlip.name : null);
    closeSlipModal();
    renderFinancialsView(container, navigate);
    showToast('تم استلام إيصال التحويل البنكي واعتماد سند القبض المالي ✓', 'success');
  });

  // Modal 3: View Voucher Details
  const voucherModal = container.querySelector('#voucher-details-modal');
  const voucherContent = container.querySelector('#voucher-modal-content');
  const closeVoucherModal = () => voucherModal?.classList.add('hidden');

  container.querySelector('#close-voucher-modal-btn')?.addEventListener('click', closeVoucherModal);

  container.querySelectorAll('[data-view-voucher]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const vid = btn.getAttribute('data-view-voucher');
      const v = vouchers.find((item) => item.id === vid);
      if (!v) return;

      voucherContent.innerHTML = `
        <div class="p-4 rounded-2xl bg-[#f0fbfd] dark:bg-slate-800 border border-[#0E9CAC]/20 flex flex-col gap-2">
          <div class="flex items-center justify-between pb-2 border-b border-[#0E9CAC]/15">
            <span class="font-bold text-slate-800 dark:text-white">${v.voucherNumber}</span>
            <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">${v.status}</span>
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-300">
            <span>اسم الطالب:</span>
            <span class="font-bold text-slate-900 dark:text-white">${student.fullName}</span>
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-300">
            <span>البيان:</span>
            <span class="font-bold">${v.title}</span>
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-300">
            <span>المبلغ المدفوع:</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400 font-numbers text-sm">${v.amount.toLocaleString('en-US')} ${t('currencySar')}</span>
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-300">
            <span>تاريخ السداد:</span>
            <span class="font-numbers">${v.date}</span>
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-300">
            <span>طريقة الدفع:</span>
            <span>${v.method}</span>
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-300">
            <span>الرقم المرجعي:</span>
            <span class="font-numbers text-slate-500">${v.refNo}</span>
          </div>
        </div>
      `;

      voucherModal.classList.remove('hidden');
    });
  });

  container.querySelector('#btn-print-voucher')?.addEventListener('click', () => {
    showToast('جاري تجهيز سند القبض المعتمد للطباعة...', 'info');
    setTimeout(() => {
      window.print?.();
    }, 500);
  });
}
