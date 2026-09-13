import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import NewHomePage from "./pages/NewHomePage"
import { JobXRayPage } from "./pages/JobXRayPage"
import { ComingSoonPage } from "./components/ComingSoonPage"
import "./index.css"

// Route based on pathname
const pathname = window.location.pathname.replace(/\/+$/, "") || "/"

let page: React.ReactNode

if (pathname === "/") {
  page = <NewHomePage />
} else if (
  pathname === "/calculator" ||
  pathname === "/old" ||
  pathname === "/app"
) {
  page = <App />
} else if (pathname === "/job-xray") {
  page = <JobXRayPage />
} else if (pathname === "/compare") {
  page = <ComingSoonPage activePage="compare" />
} else if (pathname === "/how-it-works") {
  page = <ComingSoonPage activePage="how-it-works" />
} else if (pathname === "/about") {
  page = <ComingSoonPage activePage="about" />
} else {
  page = <App />
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{page}</React.StrictMode>,
)
