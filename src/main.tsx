import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FooterLab from './pages/FooterLab';
import SignatureLab from './pages/SignatureLab';
import Wave2Lab from './pages/Wave2Lab';
import './index.css';

const lab = new URLSearchParams(window.location.search).get('lab');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {lab === 'signature' ? (
      <SignatureLab />
    ) : lab === 'wave2' ? (
      <Wave2Lab />
    ) : lab === 'footer' ? (
      <FooterLab />
    ) : (
      <App />
    )}
  </React.StrictMode>,
);
