import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import AppProviders from "./AppProviders";

const AppAdmin = () => (
  <AppProviders>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AppProviders>
);

export default AppAdmin;
