import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppLinks from './AppLinks';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppLinks />
  </BrowserRouter>
);
