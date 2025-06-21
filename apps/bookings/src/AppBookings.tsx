import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookingForm from "./pages/BookingForm";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import AppProviders from "./AppProviders";

const AppBookings = () => (
  <AppProviders>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AppProviders>
);

export default AppBookings;
