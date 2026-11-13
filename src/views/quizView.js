import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderQuizView(container, navigate) {
  const quiz = portalStore.state.quiz;
  let currentIdx = 0;
  const userAnswers = {};
  const flagged = new Set();
  let secondsRemaining = quiz.durationMinutes * 60;
  let timerId = null;

  function renderQuestion() {
    const q = quiz.questions[currentIdx];
    const total = quiz.questions.length;

    container.querySelector('#q-counter').textContent = `السؤال ${currentIdx + 1} من ${total}`;
    container.querySelector('#q-progress-bar').style.width = `${((currentIdx + 1) / total) * 100}%`;
    container.querySelector('#q-text').textContent = q.text;

    // Render numbers nav 1..5
    const navPills = container.querySelector('#q-nav-pills');
    navPills.innerHTML = quiz.questions
      .map((_, i) => {
        const isCurrent = i === currentIdx;
        const isAnswered = userAnswers[i] !== undefined;
        const isFlagged = flagged.has(i);

        let cls = 'bg-white border-slate-200 text-slate-700';
        if (isCurrent) cls = 'bg-blue-600 text-white font-bold shadow-sm';
        else if (isFlagged) cls = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
        else if (isAnswered) cls = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold';

        return `
        <button type="button" data-jump="${i}" class="w-8 h-8 rounded-xl border text-xs font-numbers press-snappy flex items-center justify-center ${cls}">
          ${i + 1}
        </button>
      `;
      })
      .join('');

    navPills.querySelectorAll('[data-jump]').forEach((b) => {
      b.addEventListener('click', () => {
        currentIdx = Number(b.getAttribute('data-jump'));
        renderQuestion();
      });
    });

    // Render options
    const optContainer = container.querySelector('#q-options-container');
    optContainer.innerHTML = q.options
      .map((opt, optIdx) => {
        const isSelected = userAnswers[currentIdx] === optIdx;
        return `
        <button type="button" data-opt="${optIdx}" class="w-full p-3.5 rounded-2xl border text-start transition-all press-gentle flex items-center gap-3 ${
          isSelected
            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 text-slate-900 font-semibold shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
        }">
          <span class="w-7 h-7 rounded-full border flex items-center justify-center shrink-0 text-xs font-numbers ${
            isSelected
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-slate-300 text-slate-400'
          }">
            ${['أ', 'ب', 'ج', 'د'][optIdx] || optIdx + 1}
          </span>
          <span class="text-xs leading-relaxed flex-1">${opt}</span>
        </button>
      `;
      })
      .join('');

    optContainer.querySelectorAll('[data-opt]').forEach((b) => {
      b.addEventListener('click', () => {
        const opt = Number(b.getAttribute('data-opt'));
        userAnswers[currentIdx] = opt;
        renderQuestion();
        showToast('تم حفظ الإجابة');
      });
    });

    // Update flag button
    const flagBtn = container.querySelector('#btn-toggle-flag');
    const isFl = flagged.has(currentIdx);
    flagBtn.className = `px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 press-snappy transition-colors ${
      isFl
        ? 'bg-amber-100 border-amber-300 text-amber-800'
        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
    }`;
    flagBtn.innerHTML = `
      <span class="material-symbols-outlined text-[16px] ${isFl ? 'material-symbols-fill text-amber-700' : ''}">flag</span>
      <span>${isFl ? 'تم تمييز السؤال للمراجعة' : 'وضع علامة للمراجعة'}</span>
    `;

    // Prev / Next button states
    container.querySelector('#btn-prev-q').disabled = currentIdx === 0;
    container.querySelector('#btn-prev-q').classList.toggle('opacity-50', currentIdx === 0);

    const nextBtn = container.querySelector('#btn-next-q');
    if (currentIdx === total - 1) {
      nextBtn.innerHTML = `<span>تسليم الاختبار النهائي</span><span class="material-symbols-outlined text-[16px]">check_circle</span>`;
      nextBtn.className =
        'flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs press-snappy shadow-sm flex items-center justify-center gap-1.5';
    } else {
      nextBtn.innerHTML = `<span>السؤال التالي</span><span class="material-symbols-outlined text-[16px]">arrow_back</span>`;
      nextBtn.className =
        'flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy shadow-sm flex items-center justify-center gap-1.5';
    }
  }

  function startTimer() {
    const minEl = container.querySelector('#timer-min');
    const secEl = container.querySelector('#timer-sec');

    timerId = setInterval(() => {
      if (secondsRemaining <= 0) {
        clearInterval(timerId);
        showToast('انتهى الوقت المحدد للاختبار! جاري التسليم التلقائي...');
        finishQuiz();
        return;
      }
      secondsRemaining--;
      const m = Math.floor(secondsRemaining / 60);
      const s = secondsRemaining % 60;
      if (minEl && secEl) {
        minEl.textContent = m < 10 ? `0${m}` : m;
        secEl.textContent = s < 10 ? `0${s}` : s;
      }
    }, 1000);
  }

  function finishQuiz() {
    clearInterval(timerId);
    let correctCount = 0;
    quiz.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctIndex) correctCount++;
    });

    const scoreModal = container.querySelector('#quiz-score-modal');
    container.querySelector('#score-result-val').textContent = `${correctCount} / ${quiz.questions.length}`;
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    container.querySelector('#score-percentage-val').textContent = `${percentage}%`;

    const gradeBadge = container.querySelector('#score-grade-badge');
    if (percentage >= 90) {
      gradeBadge.textContent = 'ممتاز مرتفع ★';
      gradeBadge.className = 'px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold';
    } else if (percentage >= 75) {
      gradeBadge.textContent = 'جيد جداً مرتفع';
      gradeBadge.className = 'px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold';
    } else {
      gradeBadge.textContent = 'تم إنجاز الاختبار';
      gradeBadge.className = 'px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold';
    }

    scoreModal.classList.remove('hidden');
  }

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-3 gap-3.5 pb-24">

      <!-- Quiz Header Card -->
      <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <button type="button" id="btn-quiz-exit" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <div>
            <h2 class="text-xs font-bold text-slate-800">${quiz.title}</h2>
            <span class="text-[10px] text-slate-400">${quiz.subject} • ${quiz.teacher}</span>
          </div>
        </div>

        <!-- Live Countdown Timer -->
        <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-numbers font-bold text-xs">
          <span class="material-symbols-outlined text-[16px] animate-pulse">timer</span>
          <span id="timer-min">12</span>:<span id="timer-sec">00</span>
        </div>
      </div>

      <!-- Question Tracker & Progress -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span id="q-counter">السؤال 1 من 5</span>
          <span class="text-blue-600 font-bold">إجباري</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div id="q-progress-bar" class="bg-blue-600 h-full rounded-full transition-all duration-300" style="width: 20%;"></div>
        </div>
      </div>

      <!-- Questions Navigation Pills (1 to 5) -->
      <div class="flex items-center justify-center gap-2 py-1" id="q-nav-pills"></div>

      <!-- Question Box -->
      <div class="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3">
        <h3 class="text-sm font-bold text-slate-900 leading-relaxed" id="q-text"></h3>
        
        <div class="flex justify-end">
          <button type="button" id="btn-toggle-flag" class="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 press-snappy">
            <span class="material-symbols-outlined text-[16px]">flag</span>
            <span>وضع علامة للمراجعة</span>
          </button>
        </div>

        <!-- Options Container -->
        <div class="flex flex-col gap-2 pt-1" id="q-options-container"></div>
      </div>

      <!-- Footer Navigation Buttons -->
      <div class="flex items-center gap-2 pt-1">
        <button type="button" id="btn-prev-q" class="px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs press-snappy flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          <span>السابق</span>
        </button>
        <button type="button" id="btn-next-q" class="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs press-snappy shadow-sm flex items-center justify-center gap-1.5">
          <span>السؤال التالي</span>
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
        </button>
      </div>

    </div>

    <!-- Final Score Report Modal -->
    <div id="quiz-score-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-3.5 border border-slate-100">
        <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
          <span class="material-symbols-outlined text-[36px]">emoji_events</span>
        </div>

        <h3 class="text-base font-bold text-slate-900">تم تسليم الاختبار بنجاح!</h3>
        <p class="text-xs text-slate-500">تم تسجيل إجاباتك واعتماد نتيجتك في بطاقة الطالب الأكاديمية.</p>

        <div class="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-around">
          <div>
            <span class="text-[10px] text-slate-400 block">الدرجة المحققة</span>
            <span class="text-lg font-bold text-slate-900 font-numbers" id="score-result-val">5 / 5</span>
          </div>
          <div class="w-px h-8 bg-slate-200"></div>
          <div>
            <span class="text-[10px] text-slate-400 block">النسبة المئوية</span>
            <span class="text-lg font-bold text-blue-600 font-numbers" id="score-percentage-val">100%</span>
          </div>
        </div>

        <div id="score-grade-badge"></div>

        <button type="button" id="btn-return-hw" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs press-snappy shadow-sm mt-1">
          العودة للواجبات والتقارير
        </button>
      </div>
    </div>
  `;

  renderQuestion();
  startTimer();

  // Wire buttons
  container.querySelector('#btn-prev-q').addEventListener('click', () => {
    if (currentIdx > 0) {
      currentIdx--;
      renderQuestion();
    }
  });

  container.querySelector('#btn-next-q').addEventListener('click', () => {
    if (currentIdx < quiz.questions.length - 1) {
      currentIdx++;
      renderQuestion();
    } else {
      if (confirm('هل أنت متأكد من تسليم الاختبار النهائي؟')) {
        finishQuiz();
      }
    }
  });

  container.querySelector('#btn-toggle-flag').addEventListener('click', () => {
    if (flagged.has(currentIdx)) {
      flagged.delete(currentIdx);
      showToast('تمت إزالة علامة المراجعة');
    } else {
      flagged.add(currentIdx);
      showToast('تم تمييز السؤال للمراجعة قبل التسليم');
    }
    renderQuestion();
  });

  container.querySelector('#btn-quiz-exit').addEventListener('click', () => {
    if (confirm('تنبيه: سيتم حفظ إجاباتك الحالية والخروج. هل أنت متأكد؟')) {
      clearInterval(timerId);
      navigate('/homework');
    }
  });

  container.querySelector('#btn-return-hw')?.addEventListener('click', () => {
    navigate('/homework', { replace: true });
  });
}
