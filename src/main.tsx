import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const App = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>TJSP - Inscrição Definitiva</h1>
      <p>Inicializando o projeto...</p>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
