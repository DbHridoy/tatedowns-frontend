import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import SimpleLoader from "../Components/Common/SimpleLoader";
import { getRoleHomePath } from "../constants/roles";

const RoleGuard = ({ allowedRole }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user) return <SimpleLoader fullScreen />;

  const allowedRoles = Array.isArray(allowedRole)
    ? allowedRole
    : allowedRole
      ? [allowedRole]
      : [];

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHomePath(user.role)} replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
