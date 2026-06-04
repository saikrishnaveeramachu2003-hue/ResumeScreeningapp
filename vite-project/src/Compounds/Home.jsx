import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

import styles from './Home.module.css';




const theme = {
  primary: '#3525cd',
  secondary: '#712ae2',
  tertiary: '#684000',
  onPrimary: '#ffffff',
  onBackground: '#191c1e',
  onSurface: '#191c1e',
  onSurfaceVariant: '#464555',
  onPrimaryContainer: '#dad7ff',
  primaryContainer10: 'rgba(79, 70, 229, 0.1)',
  primary20: 'rgba(79, 70, 229, 0.2)',
  secondary10: 'rgba(113, 42, 226, 0.1)',
  tertiary10: 'rgba(104, 64, 0, 0.1)',
  surfaceContainerLow: '#f2f4f6',
  surfaceContainerLow50: 'rgba(242, 244, 246, 0.5)',
  surfaceContainer: '#eceef0',
  outline20: 'rgba(199, 196, 216, 0.2)',
  outline30: 'rgba(199, 196, 216, 0.3)',
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.homePage}>
      {/* Top Navigation Bar */}
      <header
        className="fixed top-0 right-0 w-full z-50 bg-white/80 backdrop-blur-md h-20"
        style={{ borderBottom: `1px solid ${theme.outline20}` }}
      >
        <div className="flex justify-between items-center px-10 h-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-headline-lg text-headline-lg font-black" style={{ color: theme.primary }}>
              TalentMatch AI
            </span>
          </div>
        { /* <nav className="hidden md:flex items-center gap-8">
            <Link className={`font-bold font-label-md text-label-md text-decoration-none ${styles.textPrimary}`} to="#">
              Dashboard
            </Link>
            <Link className={`font-label-md text-label-md text-decoration-none ${styles.textOnSurfaceVariant} ${styles.hoverTextPrimary}`} to="#">
              Candidates
            </Link>
            <Link className={`font-label-md text-label-md text-decoration-none ${styles.textOnSurfaceVariant} ${styles.hoverTextPrimary}`} to="#">
              AI Screening
            </Link>
            <Link className={`font-label-md text-label-md text-decoration-none ${styles.textOnSurfaceVariant} ${styles.hoverTextPrimary}`} to="#">
              Pricing
            </Link>
          </nav>*/}
          <div className="flex items-center gap-6">
             <button
      onClick={() => navigate("/login")}
      className="hidden lg:block text-gray-600 hover:text-blue-600 font-medium"
    >
      Sign In
    </button>
            <button
              onClick={() => navigate("/login")}
              className={`${styles.indigoGradientBg} ${styles.textOnPrimary} px-6 py-3 rounded-xl font-label-md text-label-md font-bold transition-all ${styles.indigoGlow}`}
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </header>

      <main className="mt-20">
        {/* Hero Section */}
        <section className="relative min-h-[795px] flex flex-col items-center justify-center px-6 md:px-margin-desktop overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 -left-20 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ backgroundColor: 'rgba(53, 37, 205, 0.1)' }}></div>
            <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ backgroundColor: 'rgba(113, 42, 226, 0.1)' }}></div>
          </div>
          <div className="relative z-10 max-w-[900px] text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-label-sm text-label-sm mb-8 ${styles.textPrimary} ${styles.bgPrimaryContainer10}`} style={{ borderColor: theme.primary20 }}>
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              NEW: ADVANCED ATS SCORING 2.0
            </div>
            <h2 className="font-display-lg text-display-lg text-[36px] md:text-[48px] leading-tight mb-6 tracking-tight" style={{ color: theme.onBackground }}>
              Hire Smarter with{' '}
              <span style={{ color: theme.primary }}>AI-Powered</span> Resume Screening
            </h2>
            <p className="font-body-lg text-body-lg mb-10 max-w-[700px] mx-auto" style={{ color: theme.onSurfaceVariant }}>
              Transform your recruitment pipeline with high-precision ATS
              scoring and automated candidate ranking. Experience the future of
              executive talent acquisition.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
              onClick={() => navigate("/login")}
              className={`${styles.indigoGradientBg} ${styles.textOnPrimary} px-6 py-3 rounded-xl font-label-md text-label-md font-bold transition-all ${styles.indigoGlow}`}
            >
                   
              Start Free Trial
                <span className="material-symbols-outlined">arrow_forward</span> 
            </button>
         
              
              <button className="bg-white border px-10 py-5 rounded-2xl font-headline-md text-headline-md flex items-center gap-3 transition-all" style={{ borderColor: theme.outline30, color: theme.onSurface }}>
                Watch Demo
                <span className="material-symbols-outlined" data-weight="fill">play_circle</span>
              </button>
            </div>
          </div>
          <div className="relative z-10 mt-20 w-full max-w-[1100px] rounded-[32px] overflow-hidden glass-card p-4">
            <img
              alt="TalentMatch AI Dashboard Overview"
              className="w-full rounded-[24px] shadow-2xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpxr2psfOUKggTsxFDAoNh0Z6KNFaSo8Gh6TrKx6NvV3eSy20VjpegPcMaZ0pfJSjinT3OvP0BU3Fe9Aze1xGqpoxI0hrdNadnjDi8e33phyLaiuawQrCAgRXIzUhARwvKJ0-0eBAdlpVrn4Dq63ee22x3Y2sRR5jKBf-2-FrOp9gYYgKJ3MM55xzVFv0Vt6rACctDfAZogRITzdZhZkEYqjZRWQ9N5PgU5pluZhTyMGcuyrux8VEy9VNAI_-NTS9zwuB0cVi489s"
            />
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-32 px-6 md:px-margin-desktop max-w-[1440px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-display-sm text-display-sm mb-4" style={{ color: theme.onSurface }}>
              Precision Intelligence
            </h2>
            <p className="font-body-lg text-body-lg" style={{ color: theme.onSurfaceVariant }}>
              Tools designed for the world's most demanding talent acquisition
              teams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 glass-card rounded-[32px] p-12 relative overflow-hidden group">
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${styles.bgPrimary10}`}>
                  <span className={`material-symbols-outlined text-[32px] ${styles.textPrimary}`}>filter_alt</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg mb-4" style={{ color: theme.onSurface }}>
                  Deep Semantic Screening
                </h3>
                <p className="font-body-lg text-body-lg max-w-[400px]" style={{ color: theme.onSurfaceVariant }}>
                  Our AI doesn't just look for keywords; it understands context,
                  experience levels, and potential fit within your unique company
                  culture.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-50 group-hover:opacity-100 transition-opacity">
                <img
                  alt="Semantic Screening Visualization"
                  className="object-cover h-full w-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwYbujrJuzqKlUsc0rZiYe0IU7WpHizV9tDN-w0pXOgvdkc1BJ5I9Ve_k0V3hFw44PNYAr6mO3MI6uWruN5H3JjbIfVUSu9sWeSN75pcO-uysRGxSBqFtAWQ_d3fK-UvrHMUZxw5mgbwDiqVSx7I4vNLYho2aSy76IkNUA7fW8aG1771394m5wzy3v8r2QFMhu9eQazGiOfZe3BIf9F4V8XxCJJARDjMKZobcu4hFjjSAt2WltADOruIdgoRohclDvKA6-HlblwWA"
                />
              </div>
            </div>
            <div className="md:col-span-4 glass-card rounded-[32px] p-10 flex flex-col justify-between">
              <div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${styles.bgSecondary10}`}>
                  <span className={`material-symbols-outlined text-[32px] ${styles.textSecondary}`}>insights</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg mb-4" style={{ color: theme.onSurface }}>
                  Bias-Free Ranking
                </h3>
                <p className="font-body-md text-body-md" style={{ color: theme.onSurfaceVariant }}>
                  Proprietary algorithms designed to eliminate unconscious bias,
                  focusing purely on skill and merit.
                </p>
              </div>
              <div className="mt-10 p-4 rounded-2xl border" style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderColor: theme.outlineVariant }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-label-sm font-label-sm uppercase">Audit Passed</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[98%]"></div>
                </div>
              </div>
            </div>
            <div className="md:col-span-4 glass-card rounded-[32px] p-10">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${styles.bgTertiary10}`}>
                <span className={`material-symbols-outlined text-[32px] ${styles.textTertiary}`}>speed</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg mb-4" style={{ color: theme.onSurface }}>
                Instant Pipeline
              </h3>
              <p className="font-body-md text-body-md" style={{ color: theme.onSurfaceVariant }}>
                Screen thousands of applications in seconds. Move from job
                posting to first interview in record time.
              </p>
            </div>
            <div className="md:col-span-8 glass-card rounded-[32px] p-12 flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1">
                <h3 className="font-headline-lg text-headline-lg mb-4" style={{ color: theme.onSurface }}>
                  Seamless Integration
                </h3>
                <p className="font-body-md text-body-md mb-6" style={{ color: theme.onSurfaceVariant }}>
                  Works out of the box with Workday, Greenhouse, and Lever. No
                  complex setup required.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <div className="px-4 py-2 rounded-xl border font-label-md" style={{ backgroundColor: '#ffffff', borderColor: theme.outline30 }}>
                    Workday
                  </div>
                  <div className="px-4 py-2 rounded-xl border font-label-md" style={{ backgroundColor: '#ffffff', borderColor: theme.outline30 }}>
                    Greenhouse
                  </div>
                  <div className="px-4 py-2 rounded-xl border font-label-md" style={{ backgroundColor: '#ffffff', borderColor: theme.outline30 }}>
                    Lever
                  </div>
                </div>
              </div>
              <div className={`flex-1 rounded-3xl p-8 aspect-square flex items-center justify-center ${styles.bgSurfaceContainerLow}`}>
                <span className={`material-symbols-outlined text-[120px]`} style={{ color: theme.primary }}>hub</span>
              </div>
            </div>
          </div>
        </section>
        <section className="py-32" style={{ backgroundColor: theme.surfaceContainerLow50 }}>
          <div className="max-w-[1440px] mx-auto px-6 md:px-margin-desktop">
            <div className="text-center mb-15">
              <h2 className="font-display-sm text-display-sm mb-4" style={{ color: theme.onSurface }}>
                How It Works
              </h2>
              <p className="font-body-lg text-body-lg" style={{ color: theme.onSurfaceVariant }}>
                A streamlined three-step process to elite hiring.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px border-t-2 border-dashed" style={{ borderColor: 'rgba(199, 196, 216, 0.4)' }}></div>
              <div className="text-center relative">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md border relative z-10" style={{ borderColor: theme.outline20 }}>
                  <span className={`font-headline-lg`} style={{ color: theme.primary }}>1</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-4" style={{ color: theme.onSurface }}>
                  Import Data
                </h4>
                <p style={{ color: theme.onSurfaceVariant }}>
                  Connect your ATS or upload a batch of PDFs directly into the
                  secure portal.
                </p>
              </div>
              <div className="text-center relative">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md border relative z-10" style={{ borderColor: theme.outline20 }}>
                  <span className={`font-headline-lg`} style={{ color: theme.primary }}>2</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-4" style={{ color: theme.onSurface }}>
                  AI Analysis
                </h4>
                <p style={{ color: theme.onSurfaceVariant }}>
                  Our models process experience, skill density, and achievements
                  to generate a Match Score.
                </p>
              </div>
              <div className="text-center relative">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md border relative z-10" style={{ borderColor: theme.outline20 }}>
                  <span className={`font-headline-lg`} style={{ color: theme.primary }}>3</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-4" style={{ color: theme.onSurface }}>
                  Shortlist
                </h4>
                <p style={{ color: theme.onSurfaceVariant }}>
                  Review high-potential candidates and trigger interview invites
                  with a single click.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-32 px-6 md:px-margin-desktop max-w-[1440px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-display-sm text-display-sm mb-4" style={{ color: theme.onSurface }}>
              Simple, Scalable Pricing
            </h2>
            <p className="font-body-lg text-body-lg" style={{ color: theme.onSurfaceVariant }}>
              Choose the plan that fits your recruitment velocity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-[32px] p-10 flex flex-col border-transparent transition-all" style={{ borderColor: 'transparent' }}>
              <h3 className="font-headline-md text-headline-md mb-2" style={{ color: theme.onSurface }}>
                Starter
              </h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-[40px] font-bold" style={{ color: theme.onSurface }}>$49</span>
                <span style={{ color: theme.onSurfaceVariant }}>/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow" style={{ color: theme.onSurfaceVariant }}>
                <li className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${styles.textPrimary}`}>check_circle</span>
                  100 Screenings /mo
                </li>
                <li className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${styles.textPrimary}`}>check_circle</span>
                  Basic ATS Scoring
                </li>
                <li className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${styles.textPrimary}`}>check_circle</span>
                  PDF/Docx Support
                </li>
                <li className="flex items-center gap-3 opacity-50">
                  <span className="material-symbols-outlined">cancel</span>
                  No API Access
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl border font-bold transition-colors" style={{ borderColor: theme.outline20, color: theme.onSurface }}>
                Get Started
              </button>
            </div>
            <div className="relative bg-white rounded-[32px] p-10 flex flex-col border-2 shadow-2xl scale-105 z-10" style={{ borderColor: theme.primary }}>
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${styles.indigoGradientBg} ${styles.textOnPrimary} px-4 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-widest`}>
                Most Popular
              </div>
              <h3 className="font-headline-md text-headline-md mb-2" style={{ color: theme.onSurface }}>
                Professional
              </h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-[40px] font-bold" style={{ color: theme.primary }}>$199</span>
                <span style={{ color: theme.onSurfaceVariant }}>/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow font-medium" style={{ color: theme.onSurfaceVariant }}>
                <li className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${styles.textPrimary}`}>check_circle</span>
                  Unlimited Screenings
                </li>
                <li className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${styles.textPrimary}`}>check_circle</span>
                  Advanced Semantic Search
                </li>
                <li className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${styles.textPrimary}`}>check_circle</span>
                  Bias-Elimination Audit
                </li>
                <li className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${styles.textPrimary}`}>check_circle</span>
                  Full ATS Integration
                </li>
              </ul>
              <button className={`${styles.indigoGradientBg} ${styles.textOnPrimary} w-full py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95`}>
                Upgrade to Pro
              </button>
            </div>
            <div className="glass-card rounded-[32px] p-10 flex flex-col border-transparent transition-all" style={{ borderColor: 'transparent' }}>
              <h3 className="font-headline-md text-headline-md mb-2" style={{ color: theme.onSurface }}>
                Enterprise
              </h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-[40px] font-bold" style={{ color: theme.onSurface }}>
                  Custom
                </span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow" style={{ color: theme.onSurfaceVariant }}>
                <li className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${styles.textPrimary}`}>check_circle</span>
                  Dedicated AI Model Training
                </li>
                <li className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${styles.textPrimary}`}>check_circle</span>
                  Custom Data Retention
                </li>
                <li className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${styles.textPrimary}`}>check_circle</span>
                  24/7 Dedicated Support
                </li>
                <li className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${styles.textPrimary}`}>check_circle</span>
                  On-Premise Options
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl border font-bold transition-colors" style={{ borderColor: theme.outline20, color: theme.onSurface }}>
                Contact Sales
              </button>
            </div>
          </div>
        </section>
        <section className="py-32 px-6">
          <div className={`max-w-[1200px] mx-auto rounded-[40px] p-16 text-center relative overflow-hidden ${styles.indigoGradientBg}`}>
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="url(#grid)"></path>
                <defs>
                  <pattern height="10" id="grid" patternUnits="userSpaceOnUse" width="10">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"></path>
                  </pattern>
                </defs>
              </svg>
            </div>
            <div className="relative z-10">
              <h2 className="font-display-lg text-display-lg mb-6" style={{ color: theme.onPrimary }}>
                Ready to find your next star?
              </h2>
              <p className="font-body-lg text-body-lg max-w-[600px] mx-auto mb-12" style={{ color: theme.onPrimaryContainer }}>
                Join 500+ leading enterprises transforming their hiring process
                with TalentMatch AI.
              </p>
              <button className="bg-white px-12 py-5 rounded-2xl font-display-sm text-display-sm transition-all hover:scale-105 shadow-2xl" style={{ color: theme.primary }}>
                Get Started for Free
              </button>
              <p className="mt-8 font-label-md opacity-80" style={{ color: theme.onPrimaryContainer }}>
                No credit card required. 14-day full feature trial.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-20" style={{ backgroundColor: theme.surface, borderTop: `1px solid ${theme.outline20}` }}>
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div>
              <span className="font-headline-sm text-headline-sm font-bold mb-6 block" style={{ color: theme.primary }}>
                TalentMatch AI
              </span>
              <p className="font-body-md" style={{ color: theme.onSurfaceVariant }}>
                Empowering world-class recruitment teams with cutting-edge
                intelligence and precision screening tools.
              </p>
            </div>
            <div>
              <h5 className="font-label-sm text-label-sm uppercase tracking-widest mb-8" style={{ color: theme.primary }}>
                Platform
              </h5>
              <ul className="space-y-4">
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    Screening AI
                  </Link>
                </li>
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    Candidate CRM
                  </Link>
                </li>
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-sm text-label-sm uppercase tracking-widest mb-8" style={{ color: theme.primary }}>
                Resources
              </h5>
              <ul className="space-y-4">
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    Recruitment Blog
                  </Link>
                </li>
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-sm text-label-sm uppercase tracking-widest mb-8" style={{ color: theme.primary }}>
                Legal
              </h5>
              <ul className="space-y-4">
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    Security
                  </Link>
                </li>
                <li>
                  <Link className={`font-body-md ${styles.textOnSurfaceVariant} ${styles.hoverSecondary} text-decoration-none`} to="#">
                    Cookie Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-10" style={{ borderTop: `1px solid ${theme.outline20}` }}>
            <p className="font-label-sm text-label-sm uppercase tracking-widest mb-4 md:mb-0" style={{ color: theme.onSurfaceVariant }}>
              © 2024 TalentAI Enterprise. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link className={styles.textOnSurfaceVariant} to="#" style={{ transition: 'color 0.2s' }}>
                <span className="material-symbols-outlined">public</span>
              </Link>
              <Link className={styles.textOnSurfaceVariant} to="#" style={{ transition: 'color 0.2s' }}>
                <span className="material-symbols-outlined">alternate_email</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
