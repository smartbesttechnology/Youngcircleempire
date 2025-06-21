import { BrowserRouter, Routes, Route } from "react-router-dom";
import RentalForm from "./pages/RentalForm";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import AppProviders from "./AppProviders";

const AppRentals = () => (
  <AppProviders>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RentalForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AppProviders>
);

export default AppRentals;
