import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./utils/navigateHelper";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <>
      <ToastContainer position='top-right' autoClose={2000} />
      <AppRoutes />
    </>
  );
}

export default App;
