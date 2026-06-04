import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";
import { AuthContext } from "../auth/AuthProvider";
import { apiUrl, API_BASE } from "../config/api";


export default function SignIn() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const cardRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [simStage, setSimStage] = useState(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState("credentials"); // credentials | otp
  const [otp, setOtp] = useState("");
  const [tempAuth, setTempAuth] = useState(null); // store token & user until OTP verified
  const [otpInfo, setOtpInfo] = useState("");

  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.innerWidth <= 768) return;

    const handleMouseMove = (e) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 100;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 100;
      card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (card) card.style.transform = "none";
    };
  }, []);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const simulateVisual = async () => {
    setSimStage("spin");
    await sleep(1500);
    setSimStage("welcome");
    await sleep(1000);
    setSimStage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      await simulateVisual();

      // Call signin - backend validates credentials and sends OTP
      const res = await axios.post(apiUrl("/api/auth/signin"), { username: email, password });
      if (res.status === 200) {
        // If backend returned a token immediately (demo user), log in
        if (res.data?.token) {
      localStorage.setItem(
  "hrName",
  res.data.hrName
);
          auth?.login({ token: res.data.token, user: { username: res.data.username || email, email: res.data.email }, roles: res.data.roles });
          navigate('/dashboard');
          return;
        }

        // Otherwise fall back to OTP flow
        setTempAuth({ username: email, password });
        setStep("otp");
        const info = res.data?.message || "OTP sent to your email";
        setOtpInfo(info);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp || !tempAuth) {
      setError("Enter the OTP sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const usernameOrEmail = tempAuth.username;
      const res = await axios.post(apiUrl("/api/auth/verify-login-otp"), { usernameOrEmail, otp });
      // OTP verified: persist JWT token and navigate
      const token = res.data?.jwt || res.data?.token;
      const roles = res.data?.roles || res.data?.user?.roles;
      if (token) {
          localStorage.setItem(
    "hrName",
    usernameOrEmail
  );
        auth?.login({ token, user: { username: usernameOrEmail }, roles });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const getButtonContent = () => {
    if (simStage === "spin") return <span className={`material-symbols-outlined ${styles.spinner}`} data-icon="progress_activity">progress_activity</span>;
    if (simStage === "welcome") return <span>Welcome Back</span>;
    return (
      <>
        <span>Sign In</span>
        <span className={`material-symbols-outlined ${styles.icon}`} data-icon="login">login</span>
      </>
    );
  };

  return (
    <div className={styles.root}>
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.brandBadge}>
            <span className="material-symbols-outlined text-white" data-icon="clinical_notes">clinical_notes</span>
          </div>
          <h1 className={styles.title}>Telement AI</h1>
          <p className={styles.subtitle}>Precision Resume Screening</p>
        </header>

        <div className={styles.card}>
          <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
            ← Back
          </button>
          <form className={styles.form} id="loginForm" onSubmit={step === "credentials" ? handleSubmit : handleVerifyOtp}>
            {error && <div className={styles.error}>{error}</div>}

            {step === "credentials" && (
              <>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.fieldRow}>
                    <label className={styles.label} htmlFor="password">Password</label>
                    <button type="button" className={styles.linkButton}>Forgot Password?</button>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.checkboxGroup}>
                  <input className={styles.checkboxInput} id="remember" name="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  <label className={styles.checkboxLabel} htmlFor="remember">Keep me logged in</label>
                </div>

                <button
                  className={styles.primaryButton}
                  type="submit"
                  disabled={loading || simStage === "spin"}
                >
                  {getButtonContent()}
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <p className={styles.subtitle}>An OTP has been sent to your registered email. Enter it below to complete login.</p>
                {otpInfo && <p className={styles.otpInfo}>{otpInfo}</p>}
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="otp">OTP</label>
                  <input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={styles.input}
                    placeholder="123456"
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.primaryButton}>Verify OTP</button>
                  <button type="button" className={styles.secondaryButton} onClick={() => { setStep('credentials'); setTempAuth(null); }}>Cancel</button>
                  <button type="button" className={styles.secondaryButton} onClick={async () => {
                    try {
                      setLoading(true);
                      const r = await axios.post(apiUrl("/api/auth/signin"), { username: tempAuth.username, password: tempAuth.password });
                      const info = r.data?.message || 'OTP resent to your email';
                      setOtpInfo(info);
                    } catch (err) {
                      setError(err.response?.data?.message || 'Failed to resend OTP');
                    } finally { setLoading(false); }
                  }}>Resend OTP</button>
                </div>
              </>
            )}
          </form>
        </div>

        <div ref={cardRef} className={styles.heroCard}>
          <img className={styles.heroImage} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw4iwN5P7kNC1k_rZPOz8LETNW_7HsIwusPSNpoqQKisB-VmuEgkSnEo3JOrBmYluSO3MQGTGDliSg5QXlDH1wmNBbQsAwtF4ry406Coh8PoROW-1qk3So0RypB6TPa0iInhebK7Qxk5FSejFIdwnlosIW9tKd38sAS8XYhLN_FMVCp--CYxFiXoxszaylfvQf85TUOT2y9WaNfbzOELLteHM9H7hI0u2IyrO7Gfsh-1b0atEgadfwVP_91IydInoO-82dsBjtJsk" alt="Professional workspace with analytics dashboard" />
          <div className={styles.heroOverlay}>
            <p className={styles.heroText}>Trusted by 500+ talent acquisition teams globally for automated screening.</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <span>New to Telement AI?</span>
          <a className={styles.footerLink} href="/signup">Create an Account</a>
        </div>
        <div className={styles.footerLinks}>
          <a className={styles.footerLink} href="/terms">Terms of Service</a>
          <a className={styles.footerLink} href="/privacy">Privacy Policy</a>
          <a className={styles.footerLink} href="/help">Help Center</a>
        </div>
        <p className={styles.footerNote}>© 2024 Telement AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
