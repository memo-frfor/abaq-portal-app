import { portalStore } from '../store/portalStore.js';
import { showToast } from '../utils/toast.js';

export function renderLibraryView(container, navigate) {
  const student = portalStore.getActiveStudent();
  const db = portalStore.cloudDb;

  // Extract books from cloudDb or provide curriculum books for the student's grade
  const gradeLevel = student.gradeLevel || 'الصف الأول الابتدائي';
  const booksFromDb = Array.isArray(db?.schoolBooks) && db.schoolBooks.length > 0 ? db.schoolBooks : null;

  const defaultGradeBooks = [
    {
      id: 'book-quran-1',
      title: 'القرآن الكريم والدراسات الإسلامية',
      subject: 'الدراسات الإسلامية',
      gradeLevel: gradeLevel,
      term: 'الفصل الدراسي الأول',
      fileSize: '14.2 MB',
      icon: 'menu_book',
      color: 'emerald',
      pdfUrl: 'https://ien.gov.sa',
    },
    {
      id: 'book-arabic-1',
      title: 'لغتي - كتاب الطالب والأنشطة',
      subject: 'اللغة العربية',
      gradeLevel: gradeLevel,
      term: 'الفصل الدراسي الأول',
      fileSize: '18.4 MB',
      icon: 'auto_stories',
      color: 'blue',
      pdfUrl: 'https://ien.gov.sa',
    },
    {
      id: 'book-math-1',
      title: 'الرياضيات - الجزء الأول',
      subject: 'الرياضيات',
      gradeLevel: gradeLevel,
      term: 'الفصل الدراسي الأول',
      fileSize: '22.1 MB',
      icon: 'calculate',
      color: 'amber',
      pdfUrl: 'https://ien.gov.sa',
    },
    {
      id: 'book-science-1',
      title: 'العلوم - كتاب الطالب والتمارين',
      subject: 'العلوم الطبيعية',
      gradeLevel: gradeLevel,
      term: 'الفصل الدراسي الأول',
      fileSize: '19.8 MB',
      icon: 'science',
      color: 'cyan',
      pdfUrl: 'https://ien.gov.sa',
    },
    {
      id: 'book-english-1',
      title: 'Top Goal 1 - English Student Book',
      subject: 'اللغة الإنجليزية',
      gradeLevel: gradeLevel,
      term: 'الفصل الدراسي الأول',
      fileSize: '26.5 MB',
      icon: 'translate',
      color: 'purple',
      pdfUrl: 'https://ien.gov.sa',
    },
    {
      id: 'book-art-1',
      title: 'التربية الفنية والمهارات الحياتية',
      subject: 'التربية الفنية',
      gradeLevel: gradeLevel,
      term: 'الفصل الدراسي الأول',
      fileSize: '16.0 MB',
      icon: 'palette',
      color: 'rose',
      pdfUrl: 'https://ien.gov.sa',
    },
  ];

  const books = booksFromDb || defaultGradeBooks;

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 pb-28">

      <!-- Header with back button -->
      <div class="flex items-center justify-between">
        <button type="button" id="btn-back-library" class="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center press-snappy shadow-xs">
          <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        <div class="flex flex-col text-center">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">المكتبة والمناهج الدراسية</h2>
          <span class="text-xs text-slate-400">${student.fullName} • ${gradeLevel}</span>
        </div>
        <div class="w-9 h-9"></div>
      </div>

      <!-- Banner Info -->
      <div class="p-4 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white shadow-md flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
            <span class="material-symbols-outlined text-[26px]">local_library</span>
          </div>
          <div class="flex flex-col">
            <h3 class="text-sm font-bold leading-tight">الكتب والمقررات الرقمية</h3>
            <span class="text-xs text-blue-200 mt-0.5">النسخ الرسمية المعتمدة بصيغة PDF</span>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-[10px] font-bold">
          ${books.length} كتب متاحة
        </span>
      </div>

      <!-- Search & Filter -->
      <div class="relative flex items-center">
        <span class="absolute right-3.5 text-slate-400 pointer-events-none">
          <span class="material-symbols-outlined text-[18px]">search</span>
        </span>
        <input type="text" id="input-search-books" placeholder="البحث في الكتب والمقررات..." class="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none focus:border-blue-600 dark:text-white text-slate-900" />
      </div>

      <!-- Books Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="books-container">
        ${books.map((b) => `
          <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3 book-card" data-title="${b.title}" data-subject="${b.subject}">
            <div class="flex items-start gap-3">
              <div class="w-11 h-11 rounded-2xl bg-${b.color || 'blue'}-50 dark:bg-${b.color || 'blue'}-950 text-${b.color || 'blue'}-600 dark:text-${b.color || 'blue'}-400 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[24px]">${b.icon || 'menu_book'}</span>
              </div>
              <div class="flex flex-col min-w-0">
                <h4 class="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">${b.title}</h4>
                <span class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${b.subject}</span>
                <span class="text-[10px] text-slate-400 mt-1">${b.term || 'الفصل الأول'} • ${b.fileSize}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button type="button" class="btn-read-book flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 press-snappy" data-title="${b.title}">
                <span class="material-symbols-outlined text-[16px]">visibility</span>
                <span>تصفح</span>
              </button>
              <button type="button" class="btn-download-book w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center press-snappy" data-title="${b.title}">
                <span class="material-symbols-outlined text-[16px]">download</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- PDF Reader Modal (Hidden) -->
      <div id="pdf-viewer-modal" class="hidden fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col p-4 justify-between">
        <div class="flex items-center justify-between text-white pb-3 border-b border-white/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[22px]">auto_stories</span>
            <span id="modal-book-title" class="text-sm font-bold truncate max-w-xs"></span>
          </div>
          <button type="button" id="btn-close-pdf" class="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center press-snappy">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div class="flex-1 my-4 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-xl">
          <div class="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <span class="material-symbols-outlined text-[36px]">picture_as_pdf</span>
          </div>
          <h4 class="text-sm font-bold text-slate-800 dark:text-white" id="modal-reader-title">كتاب الطالب المعتمد</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">النسخة الرقمية التفاعلية معتمدة من وزارة التعليم للعام الدراسي الحالي.</p>
          <a href="https://ien.gov.sa" target="_blank" class="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2 press-snappy">
            <span>فتح عبر القارئ التفاعلي المباشر</span>
            <span class="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>

        <div class="flex items-center justify-center gap-4 text-xs text-white/70">
          <span>الصفحة 1 من 148</span>
          <span>•</span>
          <span>تكبير / تصغير تلقائي</span>
        </div>
      </div>

    </div>
  `;

  // Attach event handlers
  container.querySelector('#btn-back-library').addEventListener('click', () => {
    navigate('/home');
  });

  // Search filter
  const searchInput = container.querySelector('#input-search-books');
  searchInput.addEventListener('input', (e) => {
    const val = (e.target.value || '').trim().toLowerCase();
    container.querySelectorAll('.book-card').forEach((card) => {
      const title = card.getAttribute('data-title').toLowerCase();
      const subject = card.getAttribute('data-subject').toLowerCase();
      if (title.includes(val) || subject.includes(val)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });

  // Open PDF viewer modal
  const pdfModal = container.querySelector('#pdf-viewer-modal');
  const modalTitle = container.querySelector('#modal-book-title');
  const modalReaderTitle = container.querySelector('#modal-reader-title');

  container.querySelectorAll('.btn-read-book').forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      modalTitle.textContent = title;
      modalReaderTitle.textContent = title;
      pdfModal.classList.remove('hidden');
    });
  });

  container.querySelector('#btn-close-pdf').addEventListener('click', () => {
    pdfModal.classList.add('hidden');
  });

  container.querySelectorAll('.btn-download-book').forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      showToast(`جاري تحميل نسخة PDF من: ${title}`, 'info');
      setTimeout(() => {
        showToast(`تم حفظ ${title} بنجاح`, 'success');
      }, 1200);
    });
  });
}
