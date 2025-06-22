import { Routes, Route } from "react-router-dom";
import SmartLinkPage from "./pages/SmartLinkPage";
import AppProviders from "./AppProviders";

const DefaultPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
    <h1 className="text-3xl font-bold mb-4">Young Circle Empire Links</h1>
    <p className="text-white/80 text-center mb-6 max-w-md">
      Welcome to our smart links platform. Please use a specific link URL to access content.
    </p>
    <div className="space-y-3">
      <p className="text-sm text-white/60">Example URLs:</p>
      <ul className="text-sm text-white/60 space-y-1">
        <li>• /artist/your-artist-name</li>
        <li>• /tree/your-tree-name</li>
        <li>• /your-custom-slug</li>
      </ul>
    </div>
    <div className="mt-8">
      <a 
        href="https://ycempire.studio" 
        className="px-4 py-2 border border-white/20 rounded-md hover:bg-white/10 transition"
      >
        Back to YCE
      </a>
    </div>
  </div>
);

const AppLinks = () => (
  <AppProviders>
    <Routes>
      <Route path="/" element={<DefaultPage />} />
      <Route path="/artist/:slug" element={<SmartLinkPage />} />
      <Route path="/tree/:slug" element={<SmartLinkPage />} />
      <Route path="/:slug" element={<SmartLinkPage />} />
    </Routes>
  </AppProviders>
);

export default AppLinks;
