export type UserRole = "admin" | "operator";

const AUTH_KEY = "cmmsAuth";

export type AuthSession = {
  isLoggedIn: boolean;
  role: UserRole;
  email?: string;
  backendRole?: string;
};

export function saveAuthSession(
  role: UserRole,
  email?: string,
  backendRole?: string,
  token?: string,
) {
  const session: AuthSession = {
    isLoggedIn: true,
    role,
    email,
    backendRole,
  };

  sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
  if (token) {
    sessionStorage.setItem("cmmsSessionToken", token);
  }
}

export function getAuthSession(): AuthSession | null {
  const session = sessionStorage.getItem(AUTH_KEY);

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session) as AuthSession;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem("cmmsSessionToken");
}

export function isOperatorRole(role?: string) {
  return role === "operator";
}