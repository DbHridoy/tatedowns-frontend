import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "../redux/api/userApi";
import { logout } from "../redux/slice/authSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { error, isLoading } = useGetMeQuery(undefined, { skip: !isAuthenticated });

  useEffect(() => {
    if (error) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  if (isAuthenticated && isLoading) return <div>Loading...</div>;

  return children;
};

export default AuthInitializer;
