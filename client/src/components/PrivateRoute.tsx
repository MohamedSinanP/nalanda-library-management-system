import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../redux/store";


const PrivateRoute = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;