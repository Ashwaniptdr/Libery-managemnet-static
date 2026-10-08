export interface AuthUser {
  name: string;
  role: string;
  email: string;
  avatarText: string;
  center?: string;
}

export const DEMO_USERS: Record<string, AuthUser> = {
  neeta: {
    name: 'Neeta Sharma',
    role: 'Section Head - Library & Publications',
    email: 'neeta.sharma@aiggpa.gov.in',
    avatarText: 'NS',
    center: 'Central Library & Publications Division',
  },
  advisor: {
    name: 'Dr. R. K. Sharma',
    role: 'Center Advisor',
    email: 'rk.sharma@aiggpa.gov.in',
    avatarText: 'RS',
    center: 'Centre for Public Policy & Governance (CPPG)',
  },
  admin: {
    name: 'Rajesh Malviya',
    role: 'Library IT & Accession Officer',
    email: 'admin.library@aiggpa.gov.in',
    avatarText: 'RM',
    center: 'Centre for Knowledge Management (CKM)',
  },
};

const AUTH_KEY = 'aiggpa-auth';
const USER_KEY = 'aiggpa-user';

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function getCurrentUser(): AuthUser {
  if (typeof window === 'undefined') return DEMO_USERS.neeta;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const u = JSON.parse(raw);
      if (u.name === 'Neeta Verma') {
        u.name = 'Neeta Sharma';
        u.email = 'neeta.sharma@aiggpa.gov.in';
        u.avatarText = 'NS';
        localStorage.setItem(USER_KEY, JSON.stringify(u));
      }
      return u;
    }
  } catch {}
  return DEMO_USERS.neeta;
}

export function login(user: AuthUser = DEMO_USERS.neeta): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('aiggpa-auth-changed'));
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new CustomEvent('aiggpa-auth-changed'));
}
