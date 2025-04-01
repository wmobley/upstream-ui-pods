import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router basename="/ui">
      <App />
    </Router>
  </StrictMode>,
);
