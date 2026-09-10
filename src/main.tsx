import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import NewHomePage from './pages/NewHomePage'
import './index.css'

// Route based on pathname
const pathname = window.location.pathname.replace(/\/+$/, '') || '/';

let page: React.ReactNode;

if (pathname === '/') {
  page = <NewHomePage />;
} else if (pathname === '/calculator' || pathname === '/old' || pathname === '/app') {
  page = <App />;
} else if (pathname === '/compare') {
  page = <App />;  // Compare page is part of App
} else if (pathname === '/how-it-works' || pathname === '/about') {
  // Blank pages
  page = (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Coming Soon</h1>
        <button
          onClick={() => window.location.href = '/'}
          style={{ padding: '12px 24px', fontSize: '16px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
} else {
  page = <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {page}
  </React.StrictMode>,
)
