function switchChild(childId) {
    const btn1 = document.getElementById('btn-child-1');
    const btn2 = document.getElementById('btn-child-2');
    if (!btn1 || !btn2) return;

    if (childId === 1) {
      btn1.className = "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-surface-container-lowest text-on-surface shadow-sm transition-all duration-200";
      btn2.className = "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-on-surface-variant hover:text-on-surface transition-all duration-200";
    } else {
      btn2.className = "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-surface-container-lowest text-on-surface shadow-sm transition-all duration-200";
      btn1.className = "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-on-surface-variant hover:text-on-surface transition-all duration-200";
    }
  }

  let absenceActive = false;
  function toggleAbsence() {
    absenceActive = !absenceActive;
    const btn = document.getElementById('absence-toggle');
    const thumb = document.getElementById('absence-thumb');
    if (!btn || !thumb) return;

    if (absenceActive) {
      btn.classList.remove('bg-surface-container-highest');
      btn.classList.add('bg-error');
      thumb.classList.add('-translate-x-6');
      alert('تم تأكيد عدم ركوب الطالب اليوم، تم إشعار السائق والمشرفة بنجاح.');
    } else {
      btn.classList.add('bg-surface-container-highest');
      btn.classList.remove('bg-error');
      thumb.classList.remove('-translate-x-6');
    }
  }
