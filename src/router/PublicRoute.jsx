import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import SimpleLoader from "../Components/Common/SimpleLoader";
import { getRoleHomePath } from "../constants/roles";

const PublicRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return children || <Outlet />;
  if (!user) return <SimpleLoader fullScreen />;

  return <Navigate to={getRoleHomePath(user.role)} replace />;
};

export default PublicRoute;
