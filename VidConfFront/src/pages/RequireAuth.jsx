import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login with the "from" location saved in state
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};
export default RequireAuth;
