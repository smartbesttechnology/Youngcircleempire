import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmartLinkPage from "./pages/SmartLinkPage";
import AppProviders from "./AppProviders";

const AppLinks = () => (
  <AppProviders>
    <BrowserRouter>
      <Routes>
        <Route path="/artist/:slug" element={<SmartLinkPage />} />
        <Route path="/tree/:slug" element={<SmartLinkPage />} />
        <Route path="/:slug" element={<SmartLinkPage />} />
      </Routes>
    </BrowserRouter>
  </AppProviders>
);

export default AppLinks;
