import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RoleGuard = ({ allowedRole }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user) return <div>Loading...</div>;

  if (allowedRole && user.role !== allowedRole) {
    // redirect based on user.role
    switch (user.role) {
      case "Admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "Sales Rep":
        return <Navigate to="/sales-rep/home" replace />;
      case "Production Manager":
        return <Navigate to="/production-manager/home" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default RoleGuard;
