
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const storageKey = "dentx24-splash-shown";

    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, "true");
    } catch {
      // Continue normally if browser storage is unavailable.
    }

    setVisible(true);

    const finishTimer = window.setTimeout(() => {
      setLeaving(true);
    }, 1800);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, 2300);

    return () => {
      window.clearTimeout(finishTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`splash-screen ${leaving ? "splash-screen--leaving" : ""}`}
      role="status"
      aria-label="Loading DentX24"
    >
      <div className="splash-content">
        <div className="splash-logo">
          <Image
            src="/dentx24-logo.png"
            alt="DentX24"
            width={420}
            height={420}
            priority
            className="splash-logo-image"
          />
        </div>

        <p className="splash-tagline">
          Your smile, our priority.
        </p>

        <div className="splash-loader" aria-hidden="true">
          <span className="splash-loader-ring" />
          <span className="splash-loader-dot" />
        </div>

        <p className="splash-loading-text">
          Preparing your experience
          <span className="splash-ellipsis">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>

      <div className="splash-footer">
        <span className="splash-footer-dot" />
        <span>CARE. COMFORT. CONFIDENCE.</span>
      </div>
    </div>
  );
}
