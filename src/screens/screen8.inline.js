function switchSection(tab) {
    const hwTab = document.getElementById('tab-hw');
    const quizTab = document.getElementById('tab-quizzes');
    
    if (tab === 'hw') {
      hwTab.className = "py-2.5 px-3 rounded-DEFAULT font-label-lg text-label-lg transition-all flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface shadow-sm";
      quizTab.className = "py-2.5 px-3 rounded-DEFAULT font-label-lg text-label-lg transition-all flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface";
    } else {
      quizTab.className = "py-2.5 px-3 rounded-DEFAULT font-label-lg text-label-lg transition-all flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface shadow-sm";
      hwTab.className = "py-2.5 px-3 rounded-DEFAULT font-label-lg text-label-lg transition-all flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface";
    }
  }

  function openQuizModal() {
    const modal = document.getElementById('quiz-sheet');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeQuizModal() {
    const modal = document.getElementById('quiz-sheet');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function showSubmissionToast(type) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    
    if (type === 'photo') {
      toastText.innerText = "جاري فتح الكاميرا وضغط الصور التلقائي...";
    } else {
      toastText.innerText = "تم فتح نموذج الإجابة النصية المباشرة.";
    }

    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }
