import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import NewHomePage from './pages/NewHomePage'
import { ComingSoonPage } from './components/ComingSoonPage'
import './index.css'

// Route based on pathname
const pathname = window.location.pathname.replace(/\/+$/, '') || '/';

let page: React.ReactNode;

if (pathname === '/') {
  page = <NewHomePage />;
} else if (pathname === '/calculator' || pathname === '/old' || pathname === '/app') {
  page = <App />;
} else if (pathname === '/compare' || pathname === '/job-xray' || pathname === '/how-it-works' || pathname === '/about') {
  page = <ComingSoonPage />;
} else {
  page = <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {page}
  </React.StrictMode>,
)
