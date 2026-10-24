import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FooterLab from './pages/FooterLab';
import SignatureLab from './pages/SignatureLab';
import Wave2Lab from './pages/Wave2Lab';
import { tagRuntimeProfile } from './utils/runtimeProfile';
import './index.css';

// Tag known-fragile in-app browsers before first paint, so CSS can opt out of
// effects their WebView can't composite (see utils/runtimeProfile.ts).
tagRuntimeProfile();

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
