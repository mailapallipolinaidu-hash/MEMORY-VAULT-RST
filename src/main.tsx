import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MemoryProvider } from './context/MemoryContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MemoryProvider>
          <App />
        </MemoryProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
