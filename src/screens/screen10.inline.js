// Simple micro-interaction for AI Modal
  const aiBtn = document.getElementById('aiPrepBtn');
  const aiModal = document.getElementById('aiModal');
  const closeAiModal = document.getElementById('closeAiModal');
  const applyAiPrep = document.getElementById('applyAiPrep');

  if (aiBtn && aiModal && closeAiModal) {
    aiBtn.addEventListener('click', () => {
      aiModal.classList.remove('hidden');
      aiModal.classList.add('flex');
    });

    closeAiModal.addEventListener('click', () => {
      aiModal.classList.add('hidden');
      aiModal.classList.remove('flex');
    });

    if (applyAiPrep) {
      applyAiPrep.addEventListener('click', () => {
        applyAiPrep.innerHTML = '<span class="material-symbols-outlined animate-spin text-[20px]">sync</span><span>جاري توليد الخطة بالذكاء الاصطناعي...</span>';
        setTimeout(() => {
          aiModal.classList.add('hidden');
          aiModal.classList.remove('flex');
          applyAiPrep.innerHTML = '<span class="material-symbols-outlined text-[20px] text-tertiary-fixed">smart_toy</span><span>توليد وتضمين في خطة الأسبوع</span>';
        }, 900);
      });
    }
  }
