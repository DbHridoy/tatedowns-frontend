import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import SimpleLoader from "../Components/Common/SimpleLoader";

const PublicRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return children || <Outlet />;
  if (!user) return <SimpleLoader fullScreen />;

  // redirect authenticated users to their dashboard
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
};

export default PublicRoute;
