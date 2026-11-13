function switchTab(mode) {
    const loginTab = document.getElementById('tab-login');
    const regTab = document.getElementById('tab-register');
    const loginView = document.getElementById('view-login');
    const regView = document.getElementById('view-register');

    if (mode === 'login') {
      loginTab.className = 'py-2.5 px-3 rounded-lg font-label-lg text-label-lg transition-all text-on-surface bg-surface-container-lowest shadow-sm flex items-center justify-center gap-1.5';
      regTab.className = 'py-2.5 px-3 rounded-lg font-label-lg text-label-lg transition-all text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1.5';
      loginView.classList.remove('hidden');
      loginView.classList.add('flex');
      regView.classList.add('hidden');
      regView.classList.remove('flex');
    } else {
      regTab.className = 'py-2.5 px-3 rounded-lg font-label-lg text-label-lg transition-all text-on-surface bg-surface-container-lowest shadow-sm flex items-center justify-center gap-1.5';
      loginTab.className = 'py-2.5 px-3 rounded-lg font-label-lg text-label-lg transition-all text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1.5';
      regView.classList.remove('hidden');
      regView.classList.add('flex');
      loginView.classList.add('hidden');
      loginView.classList.remove('flex');
    }
  }

  function togglePasswordVisibility() {
    const passInput = document.getElementById('portal-password');
    const eyeIcon = document.getElementById('eye-icon');
    if (passInput.type === 'password') {
      passInput.type = 'text';
      eyeIcon.textContent = 'visibility';
    } else {
      passInput.type = 'password';
      eyeIcon.textContent = 'visibility_off';
    }
  }

  function triggerQrScan() {
    const idInput = document.getElementById('student-identifier');
    idInput.value = 'STD-2025-9941';
    idInput.classList.add('bg-secondary-fixed');
    setTimeout(() => {
      idInput.classList.remove('bg-secondary-fixed');
    }, 600);
  }

  function authenticateBiometric() {
    const btn = event.currentTarget;
    btn.classList.add('bg-secondary-fixed');
    setTimeout(() => {
      btn.classList.remove('bg-secondary-fixed');
      const pass = document.getElementById('portal-password');
      const id = document.getElementById('student-identifier');
      id.value = '1098453210';
      pass.value = '••••••••••••';
    }, 450);
  }
