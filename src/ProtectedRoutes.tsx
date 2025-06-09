import { Navigate, Outlet } from "react-router-dom";
import { getFromLocalStorage } from "./utils/webstorage.utls";

const ProtectedRoute = () => {
  const isAuthenticated = getFromLocalStorage("authToken");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
