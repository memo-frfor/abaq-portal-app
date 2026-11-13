export function getActiveStudent(session) {
  if (!session || !Array.isArray(session.students) || session.students.length === 0) {
    return null;
  }
  const idx = session.activeStudentIndex || 0;
  return session.students[idx] || session.students[0];
}

export function hydrateScreenWithSession(routeId, container, session) {
  if (!session || session.role !== 'parent') return;
  const student = getActiveStudent(session);
  if (!student) return;

  const schoolName = session.school?.name || student.school_name || 'مدارس عبق';
  const fullName = student.full_name || student.name || 'الطالب';
  const gradeLine = [student.grade_level, student.class_section].filter(Boolean).join(' - ');
  const subLine = [gradeLine, schoolName].filter(Boolean).join(' • ');

  // 1. Hydrate shared header in _1, _4, _6, _7, _8
  const header = container.querySelector('header');
  if (header && [1, 4, 6, 7, 8].includes(routeId)) {
    const nameEl = header.querySelector('.font-headline-sm');
    if (nameEl) nameEl.textContent = fullName;

    const subEl = header.querySelector('.text-on-primary-container.font-label-sm, span.text-on-primary-container');
    if (subEl && subLine) subEl.textContent = subLine;

    // Update student switcher button label if multiple children exist
    const switchBtn = Array.from(header.querySelectorAll('button')).find(
      (b) => b.querySelector('.material-symbols-outlined')?.textContent?.trim() === 'sync_alt'
    );
    if (switchBtn) {
      if (session.students.length > 1) {
        const nextIdx = ((session.activeStudentIndex || 0) + 1) % session.students.length;
        const nextStudent = session.students[nextIdx];
        const nextFirst = (nextStudent.full_name || nextStudent.name || 'التالي').split(' ')[0];
        const labelSpan = switchBtn.querySelector('span:last-child');
        if (labelSpan) labelSpan.textContent = `${nextFirst} (${nextStudent.grade_level || 'تبديل'})`;
      } else {
        switchBtn.classList.add('hidden');
      }
    }
  }

  // 2. Hydrate _7 (Home Dashboard)
  if (routeId === 7) {
    const announcements = session.educationalData?.announcements || [];
    if (announcements.length > 0) {
      const latest = announcements[0];
      const bannerP = container.querySelector('#urgent-announcement-header p');
      if (bannerP && (latest.title || latest.content)) {
        bannerP.innerHTML = `<span class="font-label-md text-label-md text-amber-300 font-bold ml-1">تعميم عاجل:</span>${latest.title || latest.content}`;
      }
      const modalBody = container.querySelector('#announcement-modal p');
      if (modalBody && latest.content) {
        modalBody.textContent = latest.content;
      }
    }

    // Update due tuition badge on Financials quick card
    if (typeof student.tuition_total === 'number' || typeof student.tuition_paid === 'number') {
      const due = Math.max(0, Number(student.tuition_total || 0) - Number(student.tuition_paid || 0));
      const finCard = Array.from(container.querySelectorAll('a')).find((a) =>
        (a.textContent || '').includes('الرسوم والمالية')
      );
      const badge = finCard?.querySelector('span:last-child');
      if (badge) {
        badge.textContent = due > 0 ? `مستحق ${due.toLocaleString('en-US')} ر.س` : 'مسدد بالكامل';
      }
    }
  }

  // 3. Hydrate _2 (Account & Settings)
  if (routeId === 2) {
    const guardianName = session.user?.full_name || student.guardian_name;
    const h1 = container.querySelector('h1, h2');
    if (h1 && guardianName) h1.textContent = guardianName;
  }

  // 4. Hydrate _12 (Digital Student ID)
  if (routeId === 12) {
    const nameEls = container.querySelectorAll('h2, h3');
    nameEls.forEach((el) => {
      if ((el.textContent || '').includes('عبدالرحمن')) {
        el.textContent = fullName;
      }
    });
    container.querySelectorAll('span, p').forEach((el) => {
      const txt = el.textContent || '';
      if (txt.includes('0501234567') && student.guardian_phone) {
        el.textContent = txt.replace('0501234567', student.guardian_phone);
      }
    });
  }
}
