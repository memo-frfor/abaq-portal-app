const BASE_URL = 'https://abaq-api.to999sa.workers.dev';
const STORAGE_KEY = 'abaq_portal_session_v1';

export function loadSavedSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

async function fetchJson(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    return { ok: res.ok, status: res.status, data };
  } finally {
    clearTimeout(timer);
  }
}

export async function loginGuardianOrStudent({ identifier, schoolCode = '', password = '' }) {
  const cleanIdent = (identifier || '').trim();
  if (!cleanIdent) {
    return { success: false, message: 'يرجى إدخال الرقم الأكاديمي أو رقم الجوال أو رقم الهوية' };
  }

  const body = { identifier: cleanIdent };
  if (schoolCode && schoolCode.trim()) {
    body.school_code = schoolCode.trim().toLowerCase();
  }
  if (password) {
    body.password = password;
  }

  try {
    const res = await fetchJson(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok && res.data?.success && Array.isArray(res.data.students) && res.data.students.length > 0) {
      const session = {
        role: 'parent',
        token: res.data.token || null,
        user: res.data.user || null,
        school: res.data.school || { id: body.school_code || 'default', name: 'مدارس عبق' },
        students: res.data.students,
        activeStudentIndex: 0,
        educationalData: {
          homework: res.data.homework || [],
          weekly_plans: res.data.weekly_plans || [],
          announcements: res.data.announcements || [],
          grades: res.data.grades || [],
          attendance: res.data.attendance || [],
        },
        syncedAt: new Date().toISOString(),
      };
      saveSession(session);
      return { success: true, session };
    }

    return {
      success: false,
      message: res.data?.message || 'بيانات الدخول غير صحيحة أو لم يتم العثور على طالب مطابق',
    };
  } catch (err) {
    return {
      success: false,
      networkError: true,
      message: 'تعذر الاتصال بخادم عبق السحابي، تأكد من اتصال الإنترنت',
    };
  }
}

export async function fetchPortalEducationalData(schoolId, token = null) {
  if (!schoolId) return null;
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetchJson(
      `${BASE_URL}/api/v1/portal/data?school_id=${encodeURIComponent(schoolId.toLowerCase())}`,
      { method: 'GET', headers },
      9000
    );
    if (res.ok && res.data?.success) {
      return {
        homework: res.data.homework || [],
        weekly_plans: res.data.weekly_plans || [],
        announcements: res.data.announcements || [],
        grades: res.data.grades || [],
        attendance: res.data.attendance || [],
        updated_at: res.data.updated_at || new Date().toISOString(),
      };
    }
  } catch {}
  return null;
}

export async function fetchUnreadNotificationsCount(schoolId, token = null) {
  if (!schoolId) return null;
  const headers = { 'x-tenant-id': schoolId.toLowerCase() };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const res = await fetchJson(
      `${BASE_URL}/api/v1/portal/notifications/unread-count?school_id=${encodeURIComponent(schoolId.toLowerCase())}`,
      { method: 'GET', headers },
      7000
    );
    if (res.ok && typeof res.data?.unread_count === 'number') {
      return res.data.unread_count;
    }
  } catch {}
  return null;
}

export async function submitPaymentReceipt({
  schoolId,
  token,
  student,
  amount,
  receiptBase64 = '',
  receiptFileName = 'receipt.jpg',
  notes = '',
}) {
  const effectiveTenant = (schoolId || 'default').toLowerCase();
  const headers = {
    'Content-Type': 'application/json',
    'x-tenant-id': effectiveTenant,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const idempotencyKey = `rcpt-${Date.now()}-${student?.id || 'std'}`;
  try {
    const res = await fetchJson(`${BASE_URL}/api/v1/portal/payments/receipt`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        student_id: student?.id,
        amount: Number(amount) || 0,
        receipt_base64: receiptBase64,
        receipt_file_name: receiptFileName,
        notes,
        guardian_phone: student?.guardian_phone || '',
        idempotency_key: idempotencyKey,
      }),
    });
    return {
      success: Boolean(res.ok && res.data?.success),
      message: res.data?.message || (res.ok ? 'تم إرسال الإيصال للاعتماد بنجاح' : 'تعذر إرسال الإيصال'),
    };
  } catch {
    return { success: false, message: 'تعذر الاتصال بالخادم أثناء إرسال الإيصال' };
  }
}

export async function logoutSession(token) {
  try {
    if (token) {
      await fetchJson(`${BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }, 5000);
    }
  } catch {}
  clearSession();
}
