let secondsLeft = 11 * 60 + 42;
  const timerMinEl = document.getElementById('timerMin');
  const timerSecEl = document.getElementById('timerSec');

  const countdownInterval = setInterval(() => {
    if (secondsLeft <= 0) {
      clearInterval(countdownInterval);
      showToast('انتهى الوقت المحدد للاختبار! جاري التسليم التلقائي...');
      return;
    }
    secondsLeft--;
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    timerMinEl.textContent = mins < 10 ? '0' + mins : mins;
    timerSecEl.textContent = secs < 10 ? '0' + secs : secs;
  }, 1000);

  let isMarkedForReview = false;
  function toggleReviewState() {
    isMarkedForReview = !isMarkedForReview;
    const btn = document.getElementById('reviewBtn');
    const icon = document.getElementById('reviewIcon');
    const label = document.getElementById('reviewLabel');

    if (isMarkedForReview) {
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
      btn.classList.add('bg-error-container', 'text-on-error-container');
      icon.textContent = 'flag';
      icon.style.fontVariationSettings = "'FILL' 1";
      label.textContent = 'تم تمييز السؤال للمراجعة قبل التسليم (نشط)';
      showToast('تم وضع علامة على السؤال لمراجعته لاحقاً');
    } else {
      btn.classList.add('bg-surface-container', 'text-on-surface-variant');
      btn.classList.remove('bg-error-container', 'text-on-error-container');
      icon.textContent = 'flag';
      icon.style.fontVariationSettings = "'FILL' 0";
      label.textContent = 'وضع علامة للمراجعة قبل التسليم النهائي';
      showToast('تمت إزالة علامة المراجعة');
    }
  }

  function selectOption(id) {
    showToast('تم تحديث الإجابة وحفظها في السحابة');
  }

  function navigateQuestion(step) {
    const nextQ = 3 + step;
    if (nextQ < 1 || nextQ > 5) {
      showToast('أنت في بداية أو نهاية نطاق الأسئلة');
      return;
    }
    showToast('جاري الانتقال إلى السؤال ' + nextQ);
  }

  function jumpToQuestion(qNum) {
    showToast('تم الانتقال المباشر إلى السؤال رقم ' + qNum);
  }

  function confirmExit() {
    if (confirm('تنبيه: سيتم حفظ إجاباتك الحالية والخروج من الجلسة. هل أنت متأكد؟')) {
      history.back();
    }
  }

  function promptFinalSubmission() {
    if (confirm('هل أنت متأكد من تسليم الاختبار؟ قمت بالإجابة على 3 من أصل 5 أسئلة.')) {
      showToast('تم تسليم الاختبار بنجاح، جاري إعداد بطاقة النتيجة...');
    }
  }

  function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    toastMsg.textContent = msg;
    toast.classList.remove('translate-y-32');
    setTimeout(() => {
      toast.classList.add('translate-y-32');
    }, 2800);
  }
