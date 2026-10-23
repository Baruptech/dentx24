
import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/app/components/auth-form";

export const metadata: Metadata = {
  title: "Create Account | DentX24",
  description: "Create your DentX24 account and manage your dental care.",
};

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <div className="auth-layout">
        <aside className="auth-promo">
          <Link href="/" className="auth-brand">
            <span className="auth-logo">
              <span className="auth-tooth-mark">✦</span>
            </span>
            <span>
              DentX<span>24</span>
            </span>
          </Link>

          <div className="auth-promo-content">
            <span className="auth-promo-tag">
              DENTAL CARE, REIMAGINED
            </span>

            <h2>
              Your smile deserves <span>the best care.</span>
            </h2>

            <p>
              Discover trusted professionals, find the right dental services,
              and make your next appointment with confidence.
            </p>

            <div className="promo-stat">
              <span className="promo-stat-icon">✓</span>
              <div>
                <strong>Care that puts you first</strong>
                <small>Your dental journey, made simpler.</small>
              </div>
            </div>

            <div className="promo-stat">
              <span className="promo-stat-icon">♡</span>
              <div>
                <strong>Everything in one place</strong>
                <small>Appointments, doctors, and dental services.</small>
              </div>
            </div>
          </div>

          <p className="auth-promo-footer">
            A brighter smile starts with a single step.
          </p>
        </aside>

        <div className="auth-form-side">
          <AuthForm mode="register" />
        </div>
      </div>
    </main>
  );
}
