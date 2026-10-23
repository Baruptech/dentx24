
import type { Metadata } from "next";
import AuthForm from "@/app/components/auth-form";

export const metadata: Metadata = {
  title: "Sign In | DentX24",
  description: "Sign in to your DentX24 account.",
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <div className="auth-layout">
        <aside className="auth-promo">
          <a href="/" className="auth-brand">
            <span className="auth-logo">
              <span className="auth-tooth-mark">✦</span>
            </span>
            <span>DentX<span>24</span></span>
          </a>

          <div className="auth-promo-content">
            <span className="auth-promo-tag">YOUR SMILE. OUR PRIORITY.</span>
            <h2>
              Better dental care, <span>closer to you.</span>
            </h2>
            <p>
              Return to your personal dental space and keep your appointments
              and care journey organised.
            </p>

            <div className="promo-stat">
              <span className="promo-stat-icon">✓</span>
              <div>
                <strong>Your care, in one place</strong>
                <small>Access your account securely.</small>
              </div>
            </div>

            <div className="promo-stat">
              <span className="promo-stat-icon">♡</span>
              <div>
                <strong>Care on your terms</strong>
                <small>Stay connected with your dental journey.</small>
              </div>
            </div>
          </div>

          <p className="auth-promo-footer">
            Welcome back to a healthier smile.
          </p>
        </aside>

        <div className="auth-form-side">
          <AuthForm mode="login" />
        </div>
      </div>
    </main>
  );
}
