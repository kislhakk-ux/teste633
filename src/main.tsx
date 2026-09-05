import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
    (window as any).__appLoaded = true;
  }
} catch (err) {
  console.error('Fatal initialization error in main.tsx:', err);
  const errBox = document.getElementById('app-error-display');
  const preloader = document.getElementById('app-preloader');
  if (errBox) {
    errBox.style.display = 'flex';
    const msgEl = document.getElementById('app-error-message');
    if (msgEl && err instanceof Error) {
      msgEl.textContent = err.message;
    }
  }
  if (preloader) {
    preloader.style.display = 'none';
  }
}
