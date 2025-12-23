import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mountRoot = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Critical Error: Root element '#root' not found.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Mounting Error:", error);
  }
};

// Ensure DOM is fully loaded before mounting to avoid black screen on some deployments
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountRoot);
} else {
  mountRoot();
}