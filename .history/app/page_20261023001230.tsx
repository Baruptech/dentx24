
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

const slides = [
  {
    eyebrow: "A HEALTHIER SMILE STARTS HERE",
    title: "Your smile,\nour priority.",
    description:
      "Connect with trusted dental professionals and discover care that fits your life.",
    action: "Get Started",
    icon: "tooth",
  },
  {
    eyebrow: "CARE THAT FITS YOUR LIFE",
    title: "Meet your\nperfect dentist.",
    description:
      "Explore dental specialists, compare their expertise, and find the right professional for you.",
    action: "Continue",
    icon: "doctor",
  },
  {
    eyebrow: "YOUR NEXT VISIT, MADE EASY",
    title: "Book care.\nFeel confident.",
    description:
      "Choose a convenient appointment time and take the next step toward a healthier smile.",
    action: "Explore DentX24",
    icon: "calendar",
  },
];

function ToothIllustration() {
  return (
    <svg
      className="tooth-art"
      viewBox="0 0 360 360"
      role="img"
      aria-label="Illustration of a healthy white tooth surrounded by a blue orbit"
    >
      <defs>
        <linearGradient id="toothBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="48%" stopColor="#E7F5FA" />
          <stop offset="100%" stopColor="#A7CFDF" />
        </linearGradient>
        <linearGradient id="toothShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B6D7E4" />
          <stop offset="35%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#C5E2ED" />
        </linearGradient>
        <linearGradient id="orbitColor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#80F2F1" />
          <stop offset="48%" stopColor="#16BFD0" />
          <stop offset="100%" stopColor="#388BFF" />
        </linearGradient>
        <filter id="toothShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <ellipse
        cx="180"
        cy="298"
        rx="85"
        ry="16"
        fill="#020E19"
        opacity=".38"
        filter="url(#toothShadow)"
      />

      <circle cx="180" cy="175" r="132" fill="#22B8C8" opacity=".035" />
      <circle
        cx="180"
        cy="175"
        r="116"
        fill="none"
        stroke="#7BDDEB"
        strokeWidth="1"
        opacity=".12"
      />

      <path
        d="M100 81 C76 91 67 119 77 147 L101 220 C110 249 125 286 142 287 C162 288 160 238 180 238 C200 238 199 288 219 287 C239 285 252 247 262 216 L283 148 C294 114 278 88 254 80 C228 70 207 87 180 91 C152 94 126 69 100 81Z"
        fill="#72D7E7"
        opacity=".12"
        transform="translate(0 9)"
      />

      <path
        d="M100 75 C76 86 67 113 77 143 L101 217 C110 246 125 280 142 281 C162 282 160 233 180 233 C200 233 199 282 219 281 C239 279 252 244 262 213 L283 144 C294 110 278 83 254 75 C228 65 207 82 180 86 C152 89 126 63 100 75Z"
        fill="url(#toothBody)"
        stroke="#E6F8FC"
        strokeWidth="2"
      />

      <path
        d="M104 88 C89 100 86 118 94 144 L118 211 C128 244 136 257 145 261 C150 240 155 218 180 218 C205 218 211 240 216 261 C227 254 236 230 246 202 L267 136 C275 110 263 89 244 84 C222 78 202 99 180 99 C154 100 129 75 104 88Z"
        fill="url(#toothShade)"
        opacity=".8"
      />

      <path
        d="M111 93 C132 81 151 108 180 108 C206 108 227 83 246 91"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="round"
        opacity=".85"
      />

      <path
        d="M91 128 C115 167 245 174 274 119"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        opacity=".35"
      />

      <ellipse
        cx="180"
        cy="175"
        rx="145"
        ry="45"
        transform="rotate(-19 180 175)"
        fill="none"
        stroke="#4DC8E8"
        strokeWidth="13"
        opacity=".17"
      />

      <ellipse
        cx="180"
        cy="175"
        rx="145"
        ry="45"
        transform="rotate(-19 180 175)"
        fill="none"
        stroke="url(#orbitColor)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="690 230"
      />

      <path
        d="M49 205 C70 222 100 230 126 232"
        fill="none"
        stroke="#82F2F2"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle cx="79" cy="103" r="3" fill="#FFFFFF" />
      <circle cx="72" cy="94" r="1.5" fill="#B4F8FF" />
      <circle cx="286" cy="111" r="3" fill="#71E4F4" />
      <circle cx="295" cy="231" r="2" fill="#FFFFFF" opacity=".8" />
    </svg>
  );
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [started, setStarted] = useState(false);
  const slide = slides[activeSlide];

  function nextSlide() {
    if (activeSlide < slides.length - 1) {
      setActiveSlide((current) => current + 1);
    } else {
      setStarted(true);
    }
  }

  function previousSlide() {
    if (started) {
      setStarted(false);
      setActiveSlide(slides.length - 1);
      return;
    }

    setActiveSlide((current) => Math.max(0, current - 1));
  }

  return (
    <main className="onboarding">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="onboarding-header">
        <a className="brand" href="/" aria-label="DentX24 home">
          <span className="brand-symbol">
            <Stethoscope size={23} strokeWidth={2.1} />
          </span>
          <span className="brand-name">
            Dent<span>X24</span>
          </span>
        </a>

        <span className="header-label">YOUR DENTAL CARE, REIMAGINED</span>

        <button
          className="skip-button"
          onClick={() => setStarted(true)}
          type="button"
        >
          Skip intro <ArrowRight size={15} />
        </button>
      </header>

      <section className="onboarding-content" aria-live="polite">
        <div className="visual-column">
          <div className="visual-orbit orbit-large" />
          <div className="visual-orbit orbit-small" />
          <div className="visual-glow" />

          {activeSlide === 0 && !started ? (
            <ToothIllustration />
          ) : (
            <div className="feature-illustration">
              <div className="feature-ring">
                {started ? (
                  <ShieldCheck size={92} strokeWidth={1.15} />
                ) : activeSlide === 1 ? (
                  <Stethoscope size={92} strokeWidth={1.15} />
                ) : (
                  <CalendarCheck size={92} strokeWidth={1.15} />
                )}
              </div>
              <Sparkles className="feature-sparkle sparkle-a" size={24} />
              <Sparkles className="feature-sparkle sparkle-b" size={17} />
            </div>
          )}

          <div className="floating-note note-top">
            <span className="note-icon">
              <ShieldCheck size={17} />
            </span>
            <span>
              <strong>Care you can trust</strong>
              <small>Quality comes first</small>
            </span>
          </div>

          <div className="floating-note note-bottom">
            <span className="online-dot" />
            <span>
              <strong>Care, on your time</strong>
              <small>Your journey starts here</small>
            </span>
          </div>

          <span className="visual-caption">A better smile begins with you.</span>
        </div>

        <div className="copy-column">
          {!started ? (
            <>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                {slide.eyebrow}
              </div>

              <h1>
                {slide.title.split("\n").map((line, index) => (
                  <span key={line} className={index === 1 ? "accent-line" : ""}>
                    {line}
                  </span>
                ))}
              </h1>

              <p className="intro-description">{slide.description}</p>

              <div className="trust-points">
                <div>
                  <span className="trust-icon">
                    <ShieldCheck size={18} />
                  </span>
                  <span>Trusted professionals</span>
                </div>
                <div>
                  <span className="trust-icon">
                    <CalendarCheck size={18} />
                  </span>
                  <span>Simple appointment booking</span>
                </div>
              </div>

              <div className="onboarding-controls">
                <button
                  className="primary-button"
                  onClick={nextSlide}
                  type="button"
                >
                  {slide.action}
                  <span className="button-arrow">
                    <ArrowRight size={19} />
                  </span>
                </button>

                <div className="slide-controls">
                  <button
                    className="back-button"
                    onClick={previousSlide}
                    disabled={activeSlide === 0}
                    aria-label="Previous introduction screen"
                    type="button"
                  >
                    <ArrowLeft size={17} />
                  </button>

                  <div className="slide-dots" aria-label={`Screen ${activeSlide + 1} of ${slides.length}`}>
                    {slides.map((item, index) => (
                      <button
                        key={item.eyebrow}
                        type="button"
                        aria-label={`Go to screen ${index + 1}`}
                        aria-current={activeSlide === index ? "step" : undefined}
                        className={`slide-dot ${activeSlide === index ? "active" : ""}`}
                        onClick={() => setActiveSlide(index)}
                      />
                    ))}
                  </div>

                  <span className="slide-count">
                    0{activeSlide + 1} <span>/ 0{slides.length}</span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="welcome-panel">
              <div className="eyebrow">
                <span className="eyebrow-line" />
                WELCOME TO DENTX24
              </div>

              <h1>
                Your journey to a
                <span className="accent-line">healthier smile.</span>
              </h1>

              <p className="intro-description">
                You’re one step closer to better dental care. Choose how you’d
                like to continue.
              </p>

              <a className="primary-button link-button" href="/doctors">
                Find a dentist
                <span className="button-arrow">
                  <ArrowRight size={19} />
                </span>
              </a>

              <a className="secondary-button" href="/register">
                Create your account
              </a>

              <p className="existing-account">
                Already have an account? <a href="/login">Sign in</a>
              </p>

              <button
                className="restart-button"
                onClick={() => {
                  setStarted(false);
                  setActiveSlide(0);
                }}
                type="button"
              >
                <ArrowLeft size={14} /> Replay introduction
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="onboarding-footer">
        <span>© {new Date().getFullYear()} DentX24</span>
        <span className="footer-message">
          <span className="footer-dot" /> YOUR SMILE. OUR PRIORITY.
        </span>
        <span className="footer-location">Thoughtfully designed for you.</span>
      </footer>
    </main>
  );
}
