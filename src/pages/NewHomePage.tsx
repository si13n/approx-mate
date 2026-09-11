import { useState, useMemo } from "react";
import { calculateB2BFromGross } from "../lib/taxCalculations";
import { DEFAULT_TAX_PROFILE } from "../config/tax";
import "./NewHomePage.css";

// SVG Asset imports
import logoMark from "../assets/new-homepage/logo-mark.svg";
import iconMoon from "../assets/new-homepage/icon-moon.svg";
import iconLink from "../assets/new-homepage/icon-link.svg";
import orbitBottomLeft from "../assets/new-homepage/orbit-bottom-left.svg";
import orbitRight from "../assets/new-homepage/orbit-right.svg";
import orbitTopLeft from "../assets/new-homepage/orbit-top-left.svg";
import orbitPoint from "../assets/new-homepage/orbit-point.svg";

function SalarySlider({
  sliderValue,
  onSliderChange,
  isMobile,
}: {
  sliderValue: number;
  onSliderChange: (val: number) => void;
  isMobile?: boolean;
}) {
  const sliderMin = 5000;
  const sliderMax = isMobile ? 50000 : 100000;
  const percentage = useMemo(
    () => ((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100,
    [sliderValue]
  );

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative" style={{ height: "32px" }}>
        {/* Background track */}
        <div className="absolute left-0 top-1/2 w-full h-1.5 -translate-y-1/2 rounded-full bg-[#DEE3ED]" />

        {/* Gradient active track (sized to slider value) */}
        <div
          className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(to right, #7A45F9, #42A3FE)",
          }}
        />

        {/* Native range input (transparent track, styled thumb via CSS) */}
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={100}
          value={sliderValue}
          onChange={(e) => onSliderChange(Number(e.target.value))}
          className="new-home-salary-slider absolute left-0 top-0 w-full"
          style={{ height: "32px" }}
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between text-sm" style={{ color: "#8c96b2" }}>
        <span>5 000</span>
        <span>{isMobile ? "50 000+" : "100 000"}</span>
      </div>
    </div>
  );
}

export function NewHomePage() {
  const [sliderValue, setSliderValue] = useState<number>(22000);
  const [jobOfferInput, setJobOfferInput] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // Calculate B2B net income with 1000 PLN business cost deduction
  const result = useMemo(() => {
    const calc = calculateB2BFromGross(sliderValue, DEFAULT_TAX_PROFILE);
    const netAfterCosts = Math.max(0, calc.monthlyNet - 1000);
    return {
      gross: sliderValue,
      net: calc.monthlyNet,
      netAfterCosts,
    };
  }, [sliderValue]);

  const formatAmount = (amount: number) => {
    return Math.round(amount).toLocaleString("pl-PL");
  };

  const navigate = (path: string) => {
    window.location.href = path;
  };

  const handleJobOfferAnalyze = () => {
    if (jobOfferInput.trim()) {
      // Pass job offer to main app via URL parameter or storage
      sessionStorage.setItem('jobOfferInput', jobOfferInput);
      navigate('/calculator');
    }
  };

  return (
    <div
      className="w-screen relative overflow-hidden"
      style={{ background: "#fdfdff" }}
    >
      {/* Background orbit decorations (absolute, behind everything) - clipped */}
      <div className="absolute -left-[330px] top-[570px] w-[540px] h-[540px] pointer-events-none hidden md:block">
        <img src={orbitBottomLeft} alt="" className="w-full h-full" />
      </div>
      <div className="absolute -left-[260px] -top-[345px] w-[620px] h-[620px] pointer-events-none hidden md:block">
        <img src={orbitTopLeft} alt="" className="w-full h-full" />
      </div>
      <div className="absolute right-[-62px] top-[330px] w-[520px] h-[520px] pointer-events-none hidden md:block">
        <img src={orbitRight} alt="" className="w-full h-full" />
      </div>

      {/* Orbit points */}
      <div className="absolute left-[122px] top-[634px] w-2 h-2 pointer-events-none">
        <img src={orbitPoint} alt="" className="w-full h-full" />
      </div>
      <div className="absolute right-[122px] top-[565px] w-2 h-2 pointer-events-none">
        <img src={orbitPoint} alt="" className="w-full h-full" />
      </div>
      <div className="absolute left-[244px] top-[194px] w-2 h-2 pointer-events-none">
        <img src={orbitPoint} alt="" className="w-full h-full" />
      </div>

      {/* Editorial text labels (decorative, behind content) */}
      <div
        className="absolute left-[58px] top-[338px] w-40 text-center pointer-events-none hidden md:block"
        style={{
          fontSize: "8px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          letterSpacing: "4.5px",
          color: "rgba(143, 153, 209, 0.55)",
          lineHeight: "22px",
          textTransform: "uppercase",
        }}
      >
        <div>Numbers</div>
        <div>for a</div>
        <div>brighter</div>
        <div>tomorrow</div>
        <div>·</div>
      </div>

      <div
        className="absolute right-[30px] top-[130px] w-40 text-center pointer-events-none hidden md:block"
        style={{
          fontSize: "8px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          letterSpacing: "4.5px",
          color: "rgba(143, 153, 209, 0.55)",
          lineHeight: "22px",
          textTransform: "uppercase",
        }}
      >
        <div>Better</div>
        <div>jobs</div>
        <div>brighter</div>
        <div>futures</div>
        <div>·</div>
      </div>

      <div
        className="absolute right-[30px] bottom-[154px] w-40 text-center pointer-events-none hidden md:block"
        style={{
          fontSize: "8px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          letterSpacing: "4.5px",
          color: "rgba(143, 153, 209, 0.55)",
          lineHeight: "22px",
          textTransform: "uppercase",
        }}
      >
        <div>Same</div>
        <div>people</div>
        <div>brighter</div>
        <div>choices</div>
        <div>·</div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full px-4 py-1 flex flex-col gap-2 md:gap-4 overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 h-14 flex-wrap md:flex-nowrap">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src={logoMark}
              alt="ApproxMate"
              className="w-8 h-8"
              style={{ filter: "drop-shadow(0 2px 8px rgba(59,130,246,0.3))" }}
            />
            <span
              style={{
                fontSize: "22px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                color: "#090a12",
              }}
            >
              ApproxMate
            </span>
          </div>

          {/* Navigation */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              color: "#090a12",
            }}
          >
            <button className="hover:opacity-75 transition-opacity" onClick={() => navigate('/calculator')}>
              Calculator
            </button>
            <button className="hover:opacity-75 transition-opacity" onClick={() => navigate('/calculator')}>
              Job X-RAY
            </button>
            <button className="hover:opacity-75 transition-opacity" onClick={() => navigate('/compare')}>
              Compare Offers
            </button>
            <button className="hover:opacity-75 transition-opacity" onClick={() => navigate('/how-it-works')}>
              How it works
            </button>
            <button className="hover:opacity-75 transition-opacity" onClick={() => navigate('/about')}>
              About
            </button>
          </nav>

          {/* Header actions */}
          <div className="flex items-center gap-6">
            <span
              style={{
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                color: "#090a12",
              }}
            >
              PL
            </span>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-75 transition-opacity"
              style={{ background: "#090a12" }}
            >
              <img src={iconMoon} alt="Dark mode" className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Hero section */}
        <div className="text-center py-2 max-w-5xl mx-auto">
          <h1
            style={{
              fontSize: "clamp(32px, 8vw, 76px)",
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              color: "#090a12",
              lineHeight: "1.1",
              marginBottom: "8px",
            }}
          >
            Know what the offer
            <br />
            is really worth.
          </h1>
          <p
            style={{
              fontSize: "19px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              color: "#575e7a",
              lineHeight: "28px",
            }}
          >
            Enter your offer and instantly see what you'll really take home in
            Poland.
          </p>
        </div>

        {/* Calculator demo section */}
        <div className="flex justify-center py-1">
          <div className="w-full max-w-3xl px-2 flex flex-col gap-2 md:gap-3">
            {/* Amount display */}
            <div className="text-center">
              <div className="flex flex-col md:flex-row items-baseline justify-center gap-2 md:gap-4 mb-4 md:mb-6">
                <span
                  style={{
                    fontSize: "clamp(36px, 6vw, 68px)",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 800,
                    color: "#090a12",
                  }}
                >
                  {formatAmount(result.gross)}
                </span>
                <span
                  style={{
                    fontSize: "clamp(16px, 3vw, 28px)",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    color: "#575e7a",
                  }}
                >
                  PLN / month
                </span>
              </div>

              {/* Salary slider */}
              <div className="px-4 md:px-8 py-2">
                <SalarySlider
                  sliderValue={sliderValue}
                  onSliderChange={setSliderValue}
                  isMobile={isMobile}
                />
              </div>

              {/* Result section */}
              <div className="mt-2 space-y-1">
                <div className="flex flex-col md:flex-row items-baseline justify-center gap-2 md:gap-3 flex-wrap">
                  <span
                    style={{
                      fontSize: "clamp(24px, 4vw, 40px)",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      color: "#090a12",
                    }}
                  >
                    You keep
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(32px, 6vw, 56px)",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 800,
                      color: "#090a12",
                    }}
                  >
                    {formatAmount(result.netAfterCosts)}
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(18px, 3vw, 28px)",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      color: "#575e7a",
                    }}
                  >
                    PLN
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "16px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    color: "#575e7a",
                  }}
                >
                  after tax, ZUS and 1 000 PLN business costs
                </p>

                <p
                  style={{
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    color: "#8c96b2",
                  }}
                >
                  B2B · Ryczałt 12% · Poland · 2026
                </p>

                <button
                  className="inline-block mt-2 bg-none border-none cursor-pointer"
                  style={{
                    fontSize: "16px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    color: "#575e7a",
                    textDecoration: "underline",
                    textDecorationStyle: "dotted",
                    padding: 0,
                  }}
                  onClick={() => navigate('/calculator')}
                >
                  Calculate in detail →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job X-RAY section */}
        <div className="flex justify-center py-1">
          <div className="w-full max-w-3xl px-2">
            <label
              style={{
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                color: "#575e7a",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Have a job offer?
            </label>

            <div
              className="flex items-center justify-between gap-2 px-4 py-2 rounded-2xl border"
              style={{
                borderColor: "#dbe0ed",
                background: "#fff",
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <img src={iconLink} alt="" className="w-5.5 h-5.5" />
                <input
                  type="text"
                  value={jobOfferInput}
                  onChange={(e) => setJobOfferInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleJobOfferAnalyze()}
                  placeholder="Paste a vacancy link or job description"
                  style={{
                    fontSize: "15px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    color: "#8c96b2",
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    flex: 1,
                  }}
                />
              </div>

              <button
                className="px-6 py-2.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
                style={{
                  background: "#090a12",
                  fontSize: "15px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  boxShadow: "0px 4px 12px -4px rgba(0,0,0,0.12)",
                  cursor: "pointer",
                }}
                onClick={handleJobOfferAnalyze}
              >
                Analyze
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center py-2 px-4">
          <p
            style={{
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              color: "#8c96b2",
            }}
          >
            ApproxMate 2026
          </p>
          <button
            onClick={() => window.location.href = "mailto:si13n@yahoo.com"}
            style={{
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              color: "#8c96b2",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Send feedback ↗
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewHomePage;
