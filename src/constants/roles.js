export const APP_ROLES = {
  ADMIN: "Admin",
  SALES_REP: "Sales Rep",
  PRODUCTION_MANAGER: "Production Manager",
  PAINTER: "Painter",
};

export const ROLE_HOME_PATHS = {
  [APP_ROLES.ADMIN]: "/admin/dashboard",
  [APP_ROLES.SALES_REP]: "/sales-rep/home",
  [APP_ROLES.PRODUCTION_MANAGER]: "/production-manager/home",
  [APP_ROLES.PAINTER]: "/painter/dashboard",
};

export const getRoleHomePath = (role) => ROLE_HOME_PATHS[role] || "/login";

