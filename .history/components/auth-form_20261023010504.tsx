
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Phone,
} from "lucide-react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "register" | "login";

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(20),
  password: z.string().min(8, "Use at least 8 characters.").max(72),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Your passwords do not match.",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password.").max(72),
});

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const parsed = isRegister
      ? registerSchema.safeParse({
          fullName,
          email,
          phone,
          password,
          confirmPassword,
        })
      : loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your information.");
      return;
    }

    setBusy(true);

    try {
      const supabase = createClient();

      if (isRegister) {
        const result = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
            },
          },
        });

        if (result.error) {
          setError(result.error.message);
          return;
        }

        if (result.data.session) {
          setSuccess("Your account has been created successfully.");
          router.replace("/");
          router.refresh();
          return;
        }

        setSuccess(
          "Your registration was received. Check your email for the verification link before signing in."
        );
        return;
      }

      const result = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        setError("Unable to sign in with those details. Check your email and password.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError(
        "We couldn't connect to the authentication service. Check your connection and Supabase configuration."
      );
    } finally {
      setBusy(false);
    }
  }

  if (success && isRegister) {
    return (
      <section className="auth-success" aria-live="polite">
        <div className="success-icon">
          <CheckCircle2 size={32} />
        </div>
        <p className="auth-eyebrow">YOU'RE ON YOUR WAY</p>
        <h1>Check your <span>inbox.</span></h1>
        <p className="auth-description">{success}</p>
        <p className="verification-email">{email}</p>
        <Link href="/login" className="auth-primary">
          Continue to sign in <ArrowRight size={18} />
        </Link>
        <button
          type="button"
          className="auth-back"
          onClick={() => {
            setSuccess("");
            setPassword("");
            setConfirmPassword("");
          }}
        >
          <ArrowLeft size={15} /> Back to registration
        </button>
      </section>
    );
  }

  return (
    <section className="auth-card">
      <Link href="/" className="auth-mobile-brand" aria-label="DentX24 home">
        <span className="auth-logo"><Stethoscope size={22} /></span>
        <span>DentX<span>24</span></span>
      </Link>

      <Link href="/" className="auth-back auth-back-top">
        <ArrowLeft size={15} /> Back to home
      </Link>

      <div className="auth-heading">
        <span className="auth-eyebrow">
          {isRegister ? "YOUR JOURNEY STARTS HERE" : "WELCOME BACK"}
        </span>
        <h1>
          {isRegister ? (
            <>A healthier smile <span>starts here.</span></>
          ) : (
            <>Good to see <span>you again.</span></>
          )}
        </h1>
        <p className="auth-description">
          {isRegister
            ? "Create your DentX24 account and make taking care of your smile easier."
            : "Sign in to manage your dental appointments and connect with trusted professionals."}
        </p>
      </div>

      <div className="auth-security-note">
        <ShieldCheck size={18} />
        <span>Your account and personal information matter to us.</span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {isRegister && (
          <>
            <label htmlFor="fullName">Full name</label>
            <div className="auth-input-wrap">
              <UserRound size={18} />
              <input
                id="fullName"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <label htmlFor="phone">Phone number</label>
            <div className="auth-input-wrap">
              <Phone size={18} />
              <input
                id="phone"
                name="tel"
                type="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
                required
              />
            </div>
          </>
        )}

        <label htmlFor="email">Email address</label>
        <div className="auth-input-wrap">
          <Mail size={18} />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            required
          />
        </div>

        <div className="auth-label-row">
          <label htmlFor="password">Password</label>
          {!isRegister && (
            <Link href="/forgot-password" className="auth-inline-link">
              Forgot password?
            </Link>
          )}
        </div>
        <div className="auth-input-wrap">
          <LockKeyhole size={18} />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder={isRegister ? "At least 8 characters" : "Enter your password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={72}
            required
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {isRegister && (
          <>
            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="auth-input-wrap">
              <LockKeyhole size={18} />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={72}
                required
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showConfirm ? "Hide confirmation" : "Show confirmation"}
                onClick={() => setShowConfirm((value) => !value)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </>
        )}

        {error && (
          <p className="auth-error" role="alert">{error}</p>
        )}

        {success && (
          <p className="auth-success-message" role="status">{success}</p>
        )}

        <button className="auth-primary" type="submit" disabled={busy}>
          {busy
            ? "Please wait..."
            : isRegister
              ? "Create your account"
              : "Sign in to DentX24"}
          {!busy && <ArrowRight size={18} />}
        </button>
      </form>

      <p className="auth-switch">
        {isRegister ? "Already have an account?" : "New to DentX24?"}{" "}
        <Link href={isRegister ? "/login" : "/register"}>
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>

      <p className="auth-terms">
        By continuing, you agree to use DentX24 responsibly and keep your account details secure.
      </p>
    </section>
  );
}
