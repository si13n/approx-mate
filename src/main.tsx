import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import NewHomePage from './pages/NewHomePage'
import './index.css'

// Route based on pathname
const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
const page = pathname === '/new' ? <NewHomePage /> : <App />;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {page}
  </React.StrictMode>,
)
