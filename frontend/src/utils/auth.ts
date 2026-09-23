export type UserRole =
  | "super_admin"
  | "general_manager"
  | "manager"
  | "team_leader"
  | "teknisi"
  | "operator";

export type AppPermission = "dashboard" | "work-orders" | "equipment" | "user-management";

const rolePermissions: Record<Exclude<UserRole, "operator">, AppPermission[]> = {
  super_admin: ["dashboard", "work-orders", "equipment", "user-management"],
  general_manager: ["dashboard", "work-orders", "equipment"],
  manager: ["dashboard", "work-orders", "equipment"],
  team_leader: ["work-orders", "equipment"],
  teknisi: ["work-orders"],
};

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

export function canAccess(role: UserRole | undefined, permission: AppPermission) {
  return role !== "operator" && role !== undefined && role in rolePermissions && rolePermissions[role as Exclude<UserRole, "operator">].includes(permission);
}

export function getLandingPath(role: UserRole) {
  if (canAccess(role, "dashboard")) return "/dashboard";
  return "/work-orders";
}