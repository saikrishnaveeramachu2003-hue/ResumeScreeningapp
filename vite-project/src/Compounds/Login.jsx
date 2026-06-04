import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, API_BASE } from "../config/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    companyName: "",
    hrName: "",
    email: "",
    phone: "",
    website: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    role: "ROLE_HR",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.termsAccepted) {
      setError("You must accept the terms and privacy policy.");
      return;
    }

    setSubmitting(true);

    const signupData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      companyName: formData.companyName,
      hrName: formData.hrName,
      phone: formData.phone,
      website: formData.website,
      company_name: formData.companyName,
      hr_name: formData.hrName,
      companyname: formData.companyName,
      hrname: formData.hrName,
    };

    console.log('Signup payload', signupData);

    try {
      const response = await axios.post(
        apiUrl("/api/auth/signup"),
        signupData,
        { withCredentials: true }
      );

      setSuccess("Account created successfully.");
      setFormData({
        username: "",
        companyName: "",
        hrName: "",
        email: "",
        phone: "",
        website: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
        role: "ROLE_HR",
      });

      if (response.status === 201 || response.status === 200) {
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.response?.data || err.response?.statusText;
      const statusCode = err.response?.status;
      setError(
        `Signup failed${statusCode ? ` (${statusCode})` : ''}: ${serverMessage || err.message || 'Unable to create account. Please try again.'}`
      );
      console.error('Signup error:', err.response || err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = (provider) => {
    const width = 600, height = 700;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    const url = `${API_BASE}/auth/${provider}`;
    const popup = window.open(url, `${provider}-oauth`, `width=${width},height=${height},left=${left},top=${top}`);
    if (!popup) {
      alert('Popup blocked. Please allow popups for this site.');
      return;
    }
    const handleMessage = (ev) => {
      try {
        if (ev.origin !== new URL(apiBase).origin) return;
      } catch (err) {
        return;
      }
      const data = ev.data;
      if (data?.type === 'oauth-success' && data?.provider === provider) {
        console.log('OAuth success', data);
        window.removeEventListener('message', handleMessage);
        try { popup.close(); } catch (e) {}
        navigate('/');
      }
    };
    window.addEventListener('message', handleMessage);
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-surface text-on-background">
      <header className="w-full py-6 px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-primary text-headline-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            psychology
          </span>
          <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">
            Sentient Talent
          </span>
        </div>
        <Link
          to="/"
          className="font-label-md text-label-md text-primary hover:underline transition-all text-decoration-none"
        >
          Back
        </Link>
      </header>

      <main className="flex-grow flex flex-col md:flex-row items-center justify-center px-6 py-10 md:px-16 md:py-14 max-w-[1400px] mx-auto gap-10">
        <section className="w-full md:w-1/2 flex flex-col gap-6 text-center md:text-left">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-tight">
            Hire Faster with <span className="text-primary">AI Resume Screening</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto md:mx-0">
            Create your company account and start screening resumes automatically with Expert Intelligence.
          </p>

          <div className="relative mt-6 group">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl group-hover:bg-primary/10 transition-all"></div>
            <img
              alt="AI Resume Screening Dashboard"
              className="relative rounded-3xl shadow-lg border border-outline-variant/30 w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJg-sy25sSll6_hpXaF-ZcRiH0oLAPb-TcKFcx3yI4i-M854AGG1n7hhUI5lYv9MD4V-KhmaF1Q1suVde7DZ9_u3ks7U8-QEPrSlpazJ565QqLnDMevzbaKAkB0nciDc8dkdw8dMbtFIf-z_4PIMX6dzcMNNqrOzJLjaaF4itG9oaM-8L2tZgFrhBzi-GTgKS_3L1Mf0LmwImetJBHruinPXQzumgE1AfcbK4Y3NQlga741lxrcmFMSC9L_Anbs04NnKhd9_ZWvmHd"
            />
            <div className="absolute -bottom-5 -right-5 glass-card px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-primary/20 animate-bounce transition-all duration-1000">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Match Accuracy</p>
                <p className="font-headline-sm text-headline-sm text-primary">98.4%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/2 max-w-[520px]">
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-[28px] shadow-[0_4px_12px_rgba(15,23,42,0.04)] border border-outline-variant/20">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="mb-4">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                  Create your company account
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Sign up and start automating your resume screening in minutes.
                </p>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="saikrishna"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="companyName">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="TCS"
                    type="text"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="hrName">
                    HR Name
                  </label>
                  <input
                    id="hrName"
                    name="hrName"
                    value={formData.hrName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="Sai Krishna"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">
                    Work Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="vsaikrishna2003@gmail.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="website">
                    Company Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="https://abctech.com"
                    type="url"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                  type="checkbox"
                />
                <span className="font-body-md text-body-md text-on-surface-variant select-none">
                  I agree to the <Link className="text-primary hover:underline" to="/terms">Terms</Link> and{' '}
                  <Link className="text-primary hover:underline" to="/privacy">Privacy Policy</Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl font-label-md text-label-md uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating account..." : "Create Company Account"}
              </button>

              <div className="flex items-center gap-3 py-3">
                <div className="h-px grow bg-outline-variant/30"></div>
                <span className="font-label-md text-label-md text-on-surface-variant/60 uppercase">Or sign up with</span>
                <div className="h-px grow bg-outline-variant/30"></div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors active:scale-[0.98]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span className="font-label-md text-label-md text-on-surface">Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuth('github')}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors active:scale-[0.98]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.931 0-1.31.468-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.98-.399 3-.405 1.02.006 2.043.139 3 .405 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.803 5.628-5.475 5.922.43.371.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .319.218.694.825.576C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297z"/>
                  </svg>
                  <span className="font-label-md text-label-md text-on-surface">Continue with GitHub</span>
                </button>
              </div>

              <p className="text-center font-body-md text-body-md text-on-surface-variant mt-3">
                Already have an account?{' '}
                <Link className="text-primary font-bold hover:underline" to="/login">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>

      
    </div>
  );
  }