(function initRegistrationScreen() {
    const healthToggle = document.getElementById('healthToggle');
    const healthDetailsBox = document.getElementById('healthDetailsBox');
    const nafathBtn = document.getElementById('nafathSyncBtn');

    if (healthToggle && healthDetailsBox) {
      healthToggle.addEventListener('change', function() {
        if (this.checked) {
          healthDetailsBox.classList.remove('hidden');
          healthDetailsBox.classList.add('flex');
        } else {
          healthDetailsBox.classList.add('hidden');
          healthDetailsBox.classList.remove('flex');
        }
      });
    }

    if (nafathBtn) {
      nafathBtn.addEventListener('click', function() {
        const originalText = nafathBtn.innerHTML;
        nafathBtn.innerHTML = `
          <span class="material-symbols-outlined text-[18px] animate-spin">refresh</span>
          <span>جارٍ التحقق والمزامنة مع نظام نور...</span>
        `;
        nafathBtn.classList.add('opacity-90');

        setTimeout(() => {
          nafathBtn.innerHTML = `
            <span class="material-symbols-outlined text-[18px]">check_circle</span>
            <span>تم استيراد سجل الطالب بنجاح!</span>
          `;
          nafathBtn.classList.remove('bg-primary');
          nafathBtn.classList.add('bg-secondary');

          setTimeout(() => {
            nafathBtn.innerHTML = originalText;
            nafathBtn.classList.remove('bg-secondary', 'opacity-90');
            nafathBtn.classList.add('bg-primary');
          }, 2400);
        }, 1200);
      });
    }
  })();
