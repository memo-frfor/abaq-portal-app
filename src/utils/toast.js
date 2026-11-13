let toastTimer = null;

export function showToast(message) {
  let el = document.getElementById('abaq-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'abaq-toast';
    el.className =
      'fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md shadow-lg opacity-0 pointer-events-none translate-y-2 whitespace-nowrap max-w-[90vw] truncate';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.remove('opacity-0', 'translate-y-2');
  el.classList.add('opacity-100', 'translate-y-0');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('opacity-100', 'translate-y-0');
    el.classList.add('opacity-0', 'translate-y-2');
  }, 2500);
}
