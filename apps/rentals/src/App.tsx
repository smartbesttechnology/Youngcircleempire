import { BrowserRouter, Routes, Route } from "react-router-dom";
import RentalsForm from "./pages/RentalsForm";
import ThankYou from "./pages/ThankYou";
import AppProviders from "./AppProviders";

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RentalsForm />} />
        <Route path="/rentals" element={<RentalsForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<RentalsForm />} />
      </Routes>
    </BrowserRouter>
  </AppProviders>
);

export default App;
