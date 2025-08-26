import { Routes, Route } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import Homepage from "../pages/HomePage";
import PrivateRoute from "../components/PrivateRoute";
import AdminBookManagement from "../pages/AdminBookMangement";
import BorrowHistory from "../pages/BorrowHistory";
const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Homepage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/books" element={<AdminBookManagement />} />
          <Route path="/borrow-history" element={<BorrowHistory />} />
        </Route >
      </Routes >
    </>
  )
}

export default AppRoutes
