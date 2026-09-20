import { StrictMode, type ReactNode } from "react"
import ReactDOM from "react-dom/client"
import { CalculatorPage } from "./pages/CalculatorPage"
import { HomePage } from "./pages/HomePage"
import { JobXRayPage } from "./pages/JobXRayPage"
import { AboutPage } from "./pages/AboutPage"
import { HowItWorksPage } from "./pages/HowItWorksPage"
import "./index.css"

const pathname = window.location.pathname.replace(/\/+$/, "") || "/"

let page: ReactNode

if (pathname === "/") {
  page = <HomePage />
} else if (pathname === "/calculator") {
  page = <CalculatorPage />
} else if (pathname === "/job-xray") {
  page = <JobXRayPage />
} else if (pathname === "/how-it-works") {
  page = <HowItWorksPage />
} else if (pathname === "/about") {
  page = <AboutPage />
} else {
  page = <HomePage />
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>{page}</StrictMode>,
)
