(function initPortalGrades() {
    const excuseModal = document.getElementById('excuseModal');
    const openExcuseModalBtn = document.getElementById('openExcuseModalBtn');
    const closeExcuseModalBtn = document.getElementById('closeExcuseModalBtn');
    const cancelExcuseBtn = document.getElementById('cancelExcuseBtn');
    const submitExcuseBtn = document.getElementById('submitExcuseBtn');
    const downloadCertificateBtn = document.getElementById('downloadCertificateBtn');
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');

    function showToast(msg) {
      if (!toast) return;
      toastMessage.textContent = msg;
      toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
      setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
      }, 3200);
    }

    function toggleModal(open) {
      if (!excuseModal) return;
      if (open) {
        excuseModal.classList.remove('hidden');
        excuseModal.classList.add('flex');
      } else {
        excuseModal.classList.add('hidden');
        excuseModal.classList.remove('flex');
      }
    }

    if (openExcuseModalBtn) {
      openExcuseModalBtn.addEventListener('click', () => toggleModal(true));
    }
    if (closeExcuseModalBtn) {
      closeExcuseModalBtn.addEventListener('click', () => toggleModal(false));
    }
    if (cancelExcuseBtn) {
      cancelExcuseBtn.addEventListener('click', () => toggleModal(false));
    }

    if (submitExcuseBtn) {
      submitExcuseBtn.addEventListener('click', () => {
        toggleModal(false);
        showToast('تم إرسال العذر الطبي للإدارة بنجاح وجارٍ التحقق');
      });
    }

    if (downloadCertificateBtn) {
      downloadCertificateBtn.addEventListener('click', () => {
        showToast('جاري إنشاء الشهادة الرسمية وتنزيل ملف PDF...');
      });
    }
  })();
