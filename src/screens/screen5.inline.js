function switchTaskType(type) {
    const tabAssignment = document.getElementById('tab-assignment');
    const tabQuiz = document.getElementById('tab-quiz');
    const submitBtnText = document.getElementById('submit-btn-text');
    const quizOptionsPanel = document.getElementById('quiz-options-panel');

    if (type === 'quiz') {
      tabQuiz.className = "flex-1 py-2.5 px-space-md rounded-xl bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2";
      tabAssignment.className = "flex-1 py-2.5 px-space-md rounded-xl text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg font-semibold transition-all flex items-center justify-center gap-2";
      submitBtnText.textContent = 'جدولة ونشر الاختبار التفاعلي';
      quizOptionsPanel.classList.remove('opacity-60');
    } else {
      tabAssignment.className = "flex-1 py-2.5 px-space-md rounded-xl bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2";
      tabQuiz.className = "flex-1 py-2.5 px-space-md rounded-xl text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg font-semibold transition-all flex items-center justify-center gap-2";
      submitBtnText.textContent = 'نشر التكليف للفصل الآن';
    }
  }

  function handleSubmit() {
    const btn = document.getElementById('submit-btn-text');
    const originalText = btn.textContent;
    btn.textContent = 'جارٍ النشر والتوزيع...';
    setTimeout(() => {
      btn.textContent = 'تم النشر بنجاح ✓';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    }, 800);
  }
