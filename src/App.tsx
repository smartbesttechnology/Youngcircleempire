
import AppProviders from "./AppProviders";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookingForm from "./pages/BookingForm";
import RentalForm from "./pages/RentalForm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import SmartLinkPage from "./pages/SmartLinkPage";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";

const App = () => (
  <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bookings" element={<BookingForm />} />
          <Route path="/rentals" element={<RentalForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/artist/:slug" element={<SmartLinkPage />} />
          <Route path="/tree/:slug" element={<SmartLinkPage />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  </AppProviders>
);

export default App;
