import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for "Uncaught TypeError: Cannot set property fetch of #<Window> which has only a getter"
// This happens when some libraries try to polyfill fetch in an environment where it's already defined as a getter.
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  try {
    Object.defineProperty(window, 'fetch', {
      get: () => originalFetch,
      set: () => { /* ignore */ },
      configurable: true
    });
  } catch (e) {
    // If it fails, we just ignore it
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
