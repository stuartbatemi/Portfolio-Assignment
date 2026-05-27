// ============================================================
// src/components/Portfolio.tsx — PREMIUM CINEMATIC VERSION
//
// PHOTO PLACEMENT GUIDE:
//   public/
//     images/
//       hero.jpg          ← your main portrait (hero section)
//       project1.jpg      ← project screenshot 1
//       project2.jpg      ← project screenshot 2
//       project3.jpg      ← project screenshot 3
//
// HOW TO ADD YOUR PHOTO:
//   1. Create folder: public/images/
//   2. Copy your photo there as hero.jpg
//   3. The hero section shows it automatically
//   If no photo → shows your initials in a gradient circle
//
// NEW IN THIS VERSION:
//   ✅ Full-screen cinematic hero with geometric photo overlay
//   ✅ Cursor glow that follows your mouse
//   ✅ Top navbar (replaces sidebar) — transparent → solid on scroll
//   ✅ Manifesto section (big scroll-reveal text)
//   ✅ Asymmetric project grid with hover reveals
//   ✅ Interactive skills matrix
//   ✅ Vertical timeline (education + milestones)
//   ✅ Cinematic footer with giant CTA
//   ✅ Framer Motion scroll-triggered animations throughout
//   ✅ Electric neon green accent (#00ff87)
//   ✅ Premium Space Grotesk + Inter typography
// ============================================================

import { useState, useEffect, useRef } from "react";

import { motion, AnimatePresence, type Variants } from "framer-motion";

import { PROFILE, SKILLS, QUALIFICATIONS, PROJECTS } from "../data/portfolio";
import type { Skill, Qualification, Project } from "../data/portfolio";

// ============================================================
// DESIGN SYSTEM — one place to change everything
// ============================================================
const A = "#00ff87"; // neon accent (electric mint)
const A2 = "#0099ff"; // secondary accent (electric cyan)
const BG = "#e2d3d3e8"; // near-black
const BG2 = "#0a0a0a";
const BG3 = "#111111";
const TEXT = "#383333"; // primary text — bright
const TEXT2 = "#868484"; // secondary text
const TEXT3 = "#444444"; // dim text
const BORDER = `rgba(0,255,135,0.12)`;
const FONT_HEAD = "'Space Grotesk', 'Segoe UI', system-ui, sans-serif";
const FONT_BODY = "'Inter', 'Segoe UI', system-ui, sans-serif";

// ============================================================
// GLOBAL STYLES + FONT INJECTION
// ============================================================
function GlobalStyles() {
  useEffect(() => {
    // Inject Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(link);

    // Inject CSS
    const style = document.createElement("style");
    style.innerHTML = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: ${BG}; color: ${TEXT}; font-family: ${FONT_BODY}; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
      ::selection { background: ${A}22; color: ${A}; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: ${BG}; }
      ::-webkit-scrollbar-thumb { background: ${A}40; border-radius: 99px; }
      ::-webkit-scrollbar-thumb:hover { background: ${A}80; }
      a { color: inherit; text-decoration: none; }
      
      /* Hide iOS video play button overlay */
      video::-webkit-media-controls { display: none !important; }
      video::-webkit-media-controls-start-playback-button { display: none !important; }
      video::--webkit-media-controls-overlay-play-button { display: none !important; }

/* Prevent iOS from treating video as interactive */
video { -webkit-touch-callout: none; }


      /* Subtle background grain */
      body::after {
        content: '';
        position: fixed; inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        opacity: 0.025; pointer-events: none; z-index: 9999;
      }

      /* Section base */
      section { position: relative; z-index: 1; }

      /* Gradient text */
      .g-name  { background: linear-gradient(135deg,#fff 0%,${A} 50%,${A2} 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      .g-accent{ background: linear-gradient(90deg,${A},${A2}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      @keyframes spin  { to { transform: rotate(360deg); } }
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);
  return null;
}

// ============================================================
// CURSOR GLOW — follows mouse with a soft neon glow
// ============================================================
function CursorGlow() {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  useEffect(() => {
    const fn = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        left: pos.x - 200,
        top: pos.y - 200,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(0,255,135,0.05), transparent 70%)`,
        pointerEvents: "none",
        zIndex: 998,
        transition: "left 0.12s ease, top 0.12s ease",
      }}
    />
  );
}

// ============================================================
// HOOKS
// ============================================================
function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};
const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

// ============================================================
// NAVBAR — transparent on hero, solid on scroll
// ============================================================
function Navbar() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ww = useWindowWidth();
  const isMobile = ww < 768;

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Work", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Timeline", href: "#timeline" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 20px" : "0 52px",
          height: 64,
          backgroundColor: solid ? "rgba(5,5,5,0.92)" : "transparent",
          borderBottom: solid ? `1px solid ${BORDER}` : "none",
          backdropFilter: solid ? "blur(20px)" : "none",
          transition: "all 0.3s ease",
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <a
          href="#hero"
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "-0.04em",
          }}
        >
          <span className="g-name">{PROFILE.name.split(" ")[0]}</span>
          <span style={{ color: A, marginLeft: 2 }}>.</span>
        </a>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: 13,
                  color: TEXT2,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = A)}
                onMouseLeave={(e) => (e.currentTarget.style.color = TEXT2)}
              >
                {l.label}
              </a>
            ))}
            <a
              href={`mailto:${PROFILE.email}`}
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 18px",
                border: `1px solid ${A}`,
                borderRadius: 6,
                color: A,
                letterSpacing: "0.04em",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = A;
                (e.currentTarget as HTMLElement).style.color = BG;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color = A;
              }}
            >
              Hire Me
            </a>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              padding: 4,
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: A,
                  borderRadius: 99,
                }}
                animate={{
                  rotate:
                    menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                  y: menuOpen && i === 0 ? 7 : menuOpen && i === 2 ? -7 : 0,
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        )}
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "rgba(5,5,5,0.98)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: "clamp(28px,8vw,48px)",
                  fontFamily: FONT_HEAD,
                  fontWeight: 800,
                  color: TEXT,
                  letterSpacing: "-0.03em",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = A)}
                onMouseLeave={(e) => (e.currentTarget.style.color = TEXT)}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================
// HERO SECTION — full screen, portrait + animated text
// ============================================================
// Add this line with the other useState lines at the top of HeroSection:

function HeroSection() {
  const [photoHovered, setPhotoHovered] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  const ww = useWindowWidth();
  const isMobile = ww < 768;
  const isTablet = ww >= 768 && ww < 1024;
  const isTV = ww >= 1920;

  const initials = PROFILE.name
    .split(" ")
    .map((w: string) => w[0])
    .join("");

  const videoRef = useRef<HTMLVideoElement>(null);

  // Add this useEffect right after it:
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true; // ensure muted (some browsers reset this)
      v.play().catch(() => {}); // force play silently
    }
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        // More top padding on mobile (navbar takes 64px)
        padding: isMobile ? "100px 20px 60px" : isTV ? "0 120px" : "0 52px",
        position: "relative",
        overflow: "hidden", // prevents horizontal scroll
        maxWidth: "100vw",
      }}
    >
      {/* Background video slot */}
      {/* Background video — auto-plays on all devices including iPhone */}
      <video
  ref={videoRef}
  autoPlay
  muted
  loop
  playsInline
  preload="auto"          // ← tells browser to load video immediately
  style={{
    position:  "absolute",
    inset:     0,
    width:     "100%",
    height:    "100%",
    objectFit: "cover",
    zIndex:    0,
    opacity:   0.28,
  }}
  src="/images/hero-bg.mp4"  // ← put src directly on video, not in <source>
/>

      {/* Background grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(0,255,135,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,255,135,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content wrapper */}
      <div
        style={{
          display: "flex",
          // Stack vertically on mobile, side by side on desktop
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: isTV ? 1600 : 1200,
          margin: "0 auto",
          gap: isMobile ? 32 : isTablet ? 40 : 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ══════════════════════════════════════════════
            MOBILE PROFILE CIRCLE
            Only visible on phones — sits above the name
            Shows your photo in a circle like a profile pic
        ══════════════════════════════════════════════ */}
        {isMobile && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "backOut" as const }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 8,
            }}
          >
            {/* Circle photo */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid rgba(0,255,135,0.5)",
                flexShrink: 0,
                position: "relative",
                background: "#0a0a0a",
                boxShadow: "0 0 20px rgba(0,255,135,0.2)",
              }}
            >
              {!photoError && (
                <img
                  src={PROFILE.avatar ?? "/images/hero.jpg"}
                  alt={PROFILE.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover" as const,
                    opacity: photoLoaded ? 1 : 0,
                    transition: "opacity 0.4s",
                  }}
                  onLoad={() => setPhotoLoaded(true)}
                  onError={() => setPhotoError(true)}
                />
              )}
              {/* Initials fallback */}
              {(photoError || !photoLoaded) && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg,#00ff87,#00e5ff)",
                    fontSize: 70,
                    fontWeight: 800,
                    color: "#050505",
                    fontFamily: FONT_HEAD,
                  }}
                >
                  {initials}
                </div>
              )}
            </div>

            {/* Name next to circle on mobile */}
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#033b1a",
                  fontFamily: FONT_HEAD,
                }}
              >
                {PROFILE.title}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: A,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                {PROFILE.subtitle}
              </p>
            </div>
          </motion.div>
        )}

        {/* LEFT — text content */}
        <motion.div
          style={{
            flex: 1,
            maxWidth: isTV ? 700 : 600,
          }}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Available label */}
          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <motion.span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: A,
                display: "block",
              }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span
              style={{
                fontSize: isMobile ? 10 : 12,
                color: A,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
              }}
            >
              Active
            </span>
          </motion.div>

          {/* NAME */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: FONT_HEAD,
              // clamp scales from 36px on phone to 88px on TV
              fontSize: isMobile
                ? "clamp(36px, 10vw, 52px)"
                : isTV
                  ? "clamp(64px, 5vw, 100px)"
                  : "clamp(44px, 9vw, 88px)",
              fontWeight: 80,
              lineHeight: 1.0,
              letterSpacing: "-0.05em",
              margin: "0 0 16px",
            }}
          >
            <span className="g-name">{PROFILE.name.split(" ")[0]}</span>
            <br />
            <span style={{ color: "#0e0d0d" }}>
              {PROFILE.name.split(" ").slice(1).join(" ")}
            </span>
          </motion.h1>

          {/* Bio */}
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: isMobile ? 14 : isTV ? 20 : "clamp(15px, 2vw, 18px)",
              color: "#888",
              lineHeight: 1.7,
              maxWidth: 480,
              margin: "0 0 32px",
            }}
          >
            {PROFILE.bio}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}
          >
            <motion.a
              href="#projects"
              style={{
                padding: isMobile ? "12px 24px" : "14px 32px",
                background: A,
                color: "#050505",
                borderRadius: 20,
                fontWeight: 700,
                fontSize: isMobile ? 13 : 14,
                fontFamily: FONT_HEAD,
                display: "inline-block",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: `0 0 30px rgba(0,255,135,0.4)`,
              }}
              whileTap={{ scale: 0.97 }}
            >
              View My Work
            </motion.a>

            <motion.a
              href={`mailto:${PROFILE.email}`}
              style={{
                padding: isMobile ? "12px 24px" : "14px 32px",
                border: "1px solid rgba(0,255,135,0.5)",
                color: "#888",
                borderRadius: 20,
                fontWeight: 500,
                fontSize: isMobile ? 13 : 14,
                display: "inline-block",
              }}
              whileHover={{ borderColor: A, color: A }}
              whileTap={{ scale: 0.97 }}
            >
              Get in Touch
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              gap: isMobile ? 20 : 32,
              marginTop: isMobile ? 36 : 56,
              paddingTop: isMobile ? 24 : 32,
              borderTop: "1px solid rgba(0,255,135,0.1)",
            }}
          >
            {[
              { n: `${PROJECTS.length}+`, l: "Projects" },
              { n: `${SKILLS.length}+`, l: "Skills" },
              { n: `${QUALIFICATIONS.length}+`, l: "Degrees" },
            ].map(({ n, l }) => (
              <div key={l}>
                <p
                  style={{
                    fontFamily: FONT_HEAD,
                    fontSize: isMobile ? 22 : 28,
                    fontWeight: 800,
                    color: A,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {n}
                </p>
                <p
                  style={{
                    fontSize: isMobile ? 9 : 11,
                    color: "#444",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {l}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — big portrait (desktop only) */}
        {!isMobile && (
          <motion.div
            style={{
              position: "relative",
              width: isTablet ? 300 : isTV ? 480 : 380,
              flexShrink: 0,
            }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div
              style={{
                position: "relative",
                width: isTablet ? 260 : isTV ? 420 : 340,
                height: isTablet ? 360 : isTV ? 560 : 440,
              }}
              onMouseEnter={() => setPhotoHovered(true)}
              onMouseLeave={() => setPhotoHovered(false)}
            >
              {/* Animated glow border */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: -2,
                  borderRadius: 40,
                  zIndex: 0,
                }}
                animate={{
                  background: [
                    "linear-gradient(135deg,rgba(0,255,135,0.6),rgba(0,229,255,0.3))",
                    "linear-gradient(225deg,rgba(0,229,255,0.6),rgba(0,255,135,0.3))",
                    "linear-gradient(135deg,rgba(0,255,135,0.6),rgba(0,229,255,0.3))",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: 38,
                  overflow: "hidden",
                  zIndex: 1,
                  background: "#0a0a0a",
                }}
              >
                {!photoError && (
                  <img
                    src={PROFILE.avatar ?? "/images/hero.jpg"}
                    alt={PROFILE.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover" as const,
                      opacity: photoLoaded ? 1 : 0,
                      transition: "opacity 0.5s",
                      display: "block",
                    }}
                    onLoad={() => setPhotoLoaded(true)}
                    onError={() => setPhotoError(true)}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg,#0a1a0e,#0d2018)",
                    zIndex: photoLoaded && !photoError ? -1 : 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_HEAD,
                      fontSize: 72,
                      fontWeight: 800,
                      color: "rgba(0,255,135,0.2)",
                    }}
                  >
                    {initials}
                  </span>
                </div>

                {/* Hover grid overlay */}
                <motion.div
                  style={{ position: "absolute", inset: 0, zIndex: 2 }}
                  animate={{ opacity: photoHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", inset: 0 }}
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.line
                        key={`v${i}`}
                        x1={`${(i * 100) / 6}%`}
                        y1="0"
                        x2={`${(i * 100) / 6}%`}
                        y2="100%"
                        stroke={A}
                        strokeWidth="0.6"
                        strokeOpacity="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: photoHovered ? 1 : 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      />
                    ))}
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <motion.line
                        key={`h${i}`}
                        x1="0"
                        y1={`${(i * 100) / 8}%`}
                        x2="100%"
                        y2={`${(i * 100) / 8}%`}
                        stroke={A}
                        strokeWidth="0.6"
                        strokeOpacity="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: photoHovered ? 1 : 0 }}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                      />
                    ))}
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.35)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 20,
                      left: 20,
                      fontSize: 11,
                      color: A,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {PROFILE.title}
                  </div>
                </motion.div>

                {/* Scan line */}
                <motion.div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg,transparent,${A}60,transparent)`,
                    zIndex: 4,
                  }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Floating cards */}
              <motion.div
                style={{
                  position: "absolute",
                  top: -16,
                  right: -20,
                  background: "rgba(10,10,10,0.95)",
                  border: "1px solid rgba(0,255,135,0.2)",
                  borderRadius: 10,
                  padding: "10px 16px",
                  zIndex: 10,
                  backdropFilter: "blur(10px)",
                }}
                animate={{ y: [0, -7, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: A,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  AVAILABLE FOR
                </p>
                <p style={{ fontSize: 12, color: "#f0f0f0", fontWeight: 600 }}>
                  Internships &amp; Projects
                </p>
              </motion.div>

              <motion.div
                style={{
                  position: "absolute",
                  bottom: -16,
                  left: -20,
                  background: "rgba(10,10,10,0.95)",
                  border: "1px solid rgba(0,229,255,0.2)",
                  borderRadius: 10,
                  padding: "10px 16px",
                  zIndex: 10,
                  backdropFilter: "blur(10px)",
                }}
                animate={{ y: [0, 7, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: A2,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  LOCATION
                </p>
                <p style={{ fontSize: 12, color: "#f0f0f0", fontWeight: 600 }}>
                  📍 {PROFILE.location}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          gap: 6,
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span style={{ fontSize: 9, color: "#444", letterSpacing: "0.1em" }}>
          SCROLL
        </span>
        <div
          style={{
            width: 1,
            height: 32,
            background: `linear-gradient(${A},transparent)`,
          }}
        />
      </motion.div>
    </section>
  );
}

// ============================================================
// MANIFESTO SECTION — large scroll-reveal typography
// ============================================================
function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const ww = useWindowWidth();
  const isMobile = ww < 768;

  const words: { text: string; isAccent: boolean }[] = [
    { text: "Building", isAccent: false },
    { text: "tomorrow's", isAccent: false },
    { text: "cloud", isAccent: true },
    { text: "infrastructure,", isAccent: true },
    { text: "one", isAccent: false },
    { text: "deploy", isAccent: false },
    { text: "at", isAccent: false },
    { text: "a", isAccent: false },
    { text: "time", isAccent: false },
    { text: "—", isAccent: false },
    { text: "bridging", isAccent: false },
    { text: "the", isAccent: false },
    { text: "gap", isAccent: false },
    { text: "between", isAccent: false },
    { text: "technical", isAccent: true },
    { text: "precision", isAccent: true },
    { text: "and", isAccent: false },
    { text: "real‑world", isAccent: false },
    { text: "impact.", isAccent: false },
  ];

  // On mobile: small values so words don't fly off screen
  // On desktop: big dramatic values for full cinematic effect
  const getStart = (i: number) => {
    const range = isMobile ? 60 : 350; // ← KEY: small range on phone
    const directions = [
      { x: -range, y: -range / 4, rotate: -8 },
      { x: range, y: range / 4, rotate: 8 },
      { x: -range * 0.7, y: -range / 2, rotate: -5 },
      { x: range * 0.7, y: range / 2, rotate: 5 },
      { x: 0, y: -range, rotate: -3 },
      { x: 0, y: range, rotate: 3 },
      { x: -range, y: range / 3, rotate: -6 },
      { x: range, y: -range / 3, rotate: 6 },
    ];
    return directions[i % directions.length];
  };

  return (
    <section
      ref={ref}
      style={{
        minHeight: isMobile ? "auto" : "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "60px 20px" : "80px 32px",
        background: "#0a0a0a",
        borderTop: "1px solid rgba(0,255,135,0.1)",
        borderBottom: "1px solid rgba(0,255,135,0.1)",
        overflow: "hidden", // ← stops horizontal scroll
        position: "relative",
      }}
    >
      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: 12,
          color: A,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          marginBottom: 28,
        }}
      >
        My Mission
      </motion.p>

      {/* Words */}
      <div
        style={{
          maxWidth: isMobile ? "100%" : 900,
          textAlign: "center" as const,
          lineHeight: 1.4,
          fontFamily: FONT_HEAD,
          fontSize: isMobile
            ? "clamp(20px,5.5vw,28px)"
            : "clamp(26px,4vw,58px)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          padding: isMobile ? "0 4px" : 0,
        }}
      >
        {words.map((word, i) => {
          const start = getStart(i);
          return (
            <motion.span
              key={i}
              initial={{
                opacity: 0,
                x: start.x,
                y: start.y,
                rotate: start.rotate,
                filter: "blur(4px)",
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0,
                filter: "blur(0px)",
              }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                stiffness: isMobile ? 150 : 120,
                damping: isMobile ? 15 : 11,
                delay: i * 0.055,
                opacity: { duration: 0.2, delay: i * 0.055 },
                filter: { duration: 0.25, delay: i * 0.055 },
              }}
              style={{
                display: "inline-block",
                marginRight: "0.25em",
                ...(word.isAccent
                  ? {
                      background: `linear-gradient(90deg,${A},${A2})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }
                  : {
                      color: "#f0f0f0",
                    }),
              }}
            >
              {word.text}
            </motion.span>
          );
        })}
      </div>

      {/* Accent line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: words.length * 0.055 + 0.2 }}
        style={{
          marginTop: 40,
          height: 2,
          width: 60,
          background: `linear-gradient(90deg,${A},${A2})`,
          borderRadius: 99,
          transformOrigin: "center",
        }}
      />
    </section>
  );
}

// ============================================================
// PROJECTS SECTION — asymmetric grid
// ============================================================
function ProjectsSection() {
  const [filter, setFilter] = useState("All");
  const filters = [
    "All",
    ...Array.from(new Set(PROJECTS.map((p: Project) => p.tech[0]))),
  ];
  const filtered =
    filter === "All"
      ? PROJECTS
      : PROJECTS.filter((p: Project) => p.tech.includes(filter));

  return (
    <section
      id="projects"
      style={{ padding: "120px 52px", maxWidth: 1200, margin: "0 auto" }}
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 48,
            flexWrap: "wrap" as const,
            gap: 20,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                color: A,
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: 8,
                textTransform: "uppercase" as const,
              }}
            >
              Selected Work
            </p>
            <h2
              style={{
                fontFamily: FONT_HEAD,
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: TEXT,
              }}
            >
              Projects
            </h2>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {filters.slice(0, 5).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: `1px solid ${filter === f ? A : BORDER}`,
                  background: filter === f ? `${A}15` : "transparent",
                  color: filter === f ? A : TEXT2,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project grid */}
        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
          layout
        >
          {filtered.map((p: Project, i: number) => (
            <ProjectCard key={p.title} project={p} featured={i === 0} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function ProjectCard({
  project,
  featured,
}: {
  project: Project;
  featured: boolean;
}) {
  const [hov, setHov] = useState(false);
  const ww = useWindowWidth();
  const isMobile = ww < 768;
  const { title, description, tech, image, link } = project;

  // GitHub link — uses the main github profile + project title as slug
  // Update each project's link in portfolio.ts to the actual repo URL
  const githubLink = link !== "#" ? link : PROFILE.github;

  return (
    <motion.div
      layout
      variants={fadeUp}
      style={{
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${hov ? "rgba(0,255,135,0.45)" : "rgba(0,255,135,0.12)"}`,
        background: hov ? "rgba(0,255,135,0.04)" : "#0a0a0a",
        // On mobile, span full width. Featured spans 2 cols on desktop only
        gridColumn: featured && !isMobile ? "span 2" : "span 1",
        transition: "all 0.25s",
        boxShadow: hov ? "0 0 40px rgba(0,255,135,0.08)" : "none",
      }}
      whileHover={isMobile ? {} : { y: -5 }} // no hover lift on mobile
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Project image */}
      <div
        style={{
          height: featured && !isMobile ? 260 : 180,
          position: "relative",
          overflow: "hidden",
          background: "#111",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover" as const,
              transition: "transform 0.4s",
              transform: hov ? "scale(1.04)" : "scale(1)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#0a0a0a,#111)",
            }}
          >
            <span
              style={{
                fontFamily: FONT_HEAD,
                fontSize: 40,
                color: "rgba(0,255,135,0.15)",
              }}
            >
              ◉
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column" as const,
            justifyContent: "flex-end",
            padding: 18,
          }}
          animate={{ opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap" as const,
              marginBottom: 10,
            }}
          >
            {tech.map((t: string) => (
              <span
                key={t}
                style={{
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 4,
                  background: "rgba(0,255,135,0.15)",
                  color: A,
                  fontWeight: 600,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {/* GitHub link on hover */}
          <a
            href={githubLink}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 12,
              color: A,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            View on GitHub →
          </a>
        </motion.div>

        {featured && (
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontSize: 10,
              padding: "4px 10px",
              borderRadius: 4,
              background: A,
              color: "#050505",
              fontWeight: 800,
              letterSpacing: "0.06em",
            }}
          >
            FEATURED
          </span>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: isMobile ? "14px 16px" : "20px 22px" }}>
        <h3
          style={{
            fontFamily: FONT_HEAD,
            fontSize: isMobile ? 15 : 17,
            fontWeight: 700,
            color: "#f0f0f0",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: isMobile ? 12 : 13,
            color: "#666",
            lineHeight: 1.65,
            margin: "0 0 14px",
          }}
        >
          {description}
        </p>

        {/* Tech badges */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap" as const,
            gap: 5,
            marginBottom: 14,
          }}
        >
          {tech.map((t: string) => (
            <span
              key={t}
              style={{
                fontSize: 10,
                padding: "3px 8px",
                borderRadius: 99,
                background: "rgba(0,255,135,0.08)",
                color: A,
                border: "1px solid rgba(0,255,135,0.15)",
                fontWeight: 600,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* GitHub button — always visible */}
        <a
          href={githubLink}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: A,
            fontWeight: 700,
            padding: "7px 14px",
            border: "1px solid rgba(0,255,135,0.25)",
            borderRadius: 6,
          }}
        >
          ⌥ View on GitHub
        </a>
      </div>
    </motion.div>
  );
}
// ============================================================
// SKILLS MATRIX — interactive hover grid
// ============================================================
function SkillsMatrix() {
  const [active, setActive] = useState<Skill | null>(null);
  const categories = Array.from(new Set(SKILLS.map((s: Skill) => s.category)));
  const colors: Record<string, string> = {
    Frontend: A,
    Backend: A2,
    Tools: "#f59e0b",
    Cloud: "#a78bfa",
  };

  return (
    <section
      id="skills"
      style={{
        padding: "120px 52px",
        background: BG2,
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} style={{ marginBottom: 64 }}>
            <p
              style={{
                fontSize: 11,
                color: A,
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: 8,
                textTransform: "uppercase" as const,
              }}
            >
              What I work with
            </p>
            <h2
              style={{
                fontFamily: FONT_HEAD,
                fontSize: "clamp(32px,5vw,52px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: TEXT,
              }}
            >
              Skills &amp; Tools
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              alignItems: "start",
            }}
          >
            {/* Left: skill grid */}
            <div>
              {categories.map((cat: string) => {
                const col = colors[cat] ?? A;
                return (
                  <motion.div
                    key={cat}
                    variants={fadeUp}
                    style={{ marginBottom: 36 }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        color: col,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        marginBottom: 12,
                      }}
                    >
                      {cat}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap" as const,
                        gap: 8,
                      }}
                    >
                      {SKILLS.filter((s: Skill) => s.category === cat).map(
                        (skill: Skill) => (
                          <motion.button
                            key={skill.name}
                            onMouseEnter={() => setActive(skill)}
                            onMouseLeave={() => setActive(null)}
                            style={{
                              padding: "8px 14px",
                              borderRadius: 8,
                              border: `1px solid ${active?.name === skill.name ? col : BORDER}`,
                              background:
                                active?.name === skill.name
                                  ? `${col}12`
                                  : "transparent",
                              color: active?.name === skill.name ? col : TEXT2,
                              fontSize: 13,
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {skill.name}
                          </motion.button>
                        ),
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right: active skill display */}
            <motion.div
              style={{
                position: "sticky",
                top: 80,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: "36px 40px",
                background: BG3,
                minHeight: 260,
              }}
              layout
            >
              <AnimatePresence mode="wait">
                {active ? (
                  <motion.div
                    key={active.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: colors[active.category] ?? A,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        marginBottom: 10,
                      }}
                    >
                      {active.category}
                    </p>
                    <h3
                      style={{
                        fontFamily: FONT_HEAD,
                        fontSize: 36,
                        fontWeight: 800,
                        color: TEXT,
                        letterSpacing: "-0.04em",
                        marginBottom: 16,
                      }}
                    >
                      {active.name}
                    </h3>
                    {/* Skill level bar */}
                    <p style={{ fontSize: 12, color: TEXT2, marginBottom: 10 }}>
                      Proficiency
                    </p>
                    <div
                      style={{
                        height: 4,
                        background: BORDER,
                        borderRadius: 99,
                        marginBottom: 20,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        style={{
                          height: "100%",
                          background: `linear-gradient(90deg, ${colors[active.category] ?? A}, ${A2})`,
                          borderRadius: 99,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(active.level / 5) * 100}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" as const }}
                      />
                    </div>
                    <p style={{ fontSize: 13, color: TEXT3 }}>
                      {active.level}/5 —{" "}
                      {
                        [
                          "",
                          "Beginner",
                          "Elementary",
                          "Intermediate",
                          "Advanced",
                          "Expert",
                        ][active.level]
                      }
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center" as const,
                    }}
                  >
                    <div
                      style={{ fontSize: 40, marginBottom: 14, opacity: 0.2 }}
                    >
                      ◎
                    </div>
                    <p style={{ color: TEXT3, fontSize: 14 }}>
                      Hover over a skill
                      <br />
                      to see details
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
// ============================================================
// PARTICLEFIELD SECTION
// ============================================================

function ParticleField({
  color = "#00ff87",
  opacity = 0.6,
}: {
  color?: string;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
    }));

    let animId: number;

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.globalAlpha = opacity * 0.7;
        ctx!.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = color;
            ctx!.globalAlpha = (1 - dist / 120) * opacity * 0.25;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      ctx!.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [color, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ============================================================
// TIMELINE SECTION
// ============================================================
function TimelineSection() {
  const milestones = [
    ...QUALIFICATIONS.map((q: Qualification) => ({
      year: q.year.split("–")[0].trim(),
      title: q.degree,
      sub: q.school,
      desc: q.description,
      type: "Education",
      color: A,
    })),
    ...PROJECTS.map((p: Project) => ({
      year: "2024",
      title: p.title,
      sub: p.tech.join(" · "),
      desc: p.description,
      type: "Project",
      color: A2,
    })),
  ];

  return (
    <section
      id="timeline"
      style={{
        padding: "120px 52px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Moving particle background */}
      <ParticleField color="#00ff87" opacity={0.5} />

      {/* Your background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 0.75, // ← adjust for how visible you want it
        }}
      >
        <source src="/images/timeline-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay so text stays readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(5,5,5,0.8)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Content sits on top */}
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} style={{ marginBottom: 64 }}>
            <p
              style={{
                fontSize: 11,
                color: A,
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: 8,
                textTransform: "uppercase" as const,
              }}
            >
              The journey
            </p>
            <h2
              style={{
                fontFamily: FONT_HEAD,
                fontSize: "clamp(32px,5vw,52px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "#f0f0f0",
              }}
            >
              Timeline
            </h2>
          </motion.div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 20,
                top: 0,
                bottom: 0,
                width: 1,
                background: "rgba(0,255,135,0.2)",
              }}
            />

            {milestones.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                style={{
                  display: "flex",
                  gap: 32,
                  marginBottom: 48,
                  paddingLeft: 56,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 6,
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    background: m.color,
                    boxShadow: `0 0 16px ${m.color}, 0 0 32px ${m.color}40`,
                    border: `2px solid #050505`,
                  }}
                />

                <div
                  style={{
                    flex: 1,
                    background: "rgba(10,10,10,0.85)",
                    border: `1px solid ${m.color}25`,
                    borderRadius: 12,
                    padding: "20px 24px",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: FONT_HEAD,
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#f0f0f0",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {m.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexShrink: 0,
                        marginLeft: 12,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: `${m.color}15`,
                          color: m.color,
                          fontWeight: 700,
                        }}
                      >
                        {m.type}
                      </span>
                      <span
                        style={{ fontSize: 12, color: "#444", fontWeight: 500 }}
                      >
                        {m.year}
                      </span>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: m.color,
                      fontWeight: 500,
                      marginBottom: 8,
                    }}
                  >
                    {m.sub}
                  </p>
                  <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
// ============================================================
// CONTACT FOOTER — cinematic full-screen CTA
// ============================================================
function ContactFooter() {
  const [emailHov, setEmailHov] = useState(false);

  return (
    <footer
      id="contact"
      style={{
        background: BG2,
        borderTop: `1px solid ${BORDER}`,
        padding: "120px 52px 60px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Giant CTA text */}
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: FONT_HEAD,
              fontSize: "clamp(40px,8vw,96px)",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 0.95,
              color: TEXT,
              marginBottom: 48,
            }}
          >
            Let's <span className="g-accent">collaborate</span>.
          </motion.h2>

          {/* Email link */}
          <motion.a
            variants={fadeUp}
            href={`mailto:${PROFILE.email}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              fontSize: "clamp(16px,3vw,24px)",
              color: emailHov ? A : TEXT2,
              fontWeight: 500,
              marginBottom: 72,
              transition: "color 0.2s",
            }}
            onMouseEnter={() => setEmailHov(true)}
            onMouseLeave={() => setEmailHov(false)}
          >
            <span>{PROFILE.email}</span>
            <motion.span
              animate={{ x: emailHov ? 6 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              →
            </motion.span>
          </motion.a>

          {/* Divider */}
          <motion.div
            variants={fadeIn}
            style={{ height: 1, background: BORDER, marginBottom: 40 }}
          />

          {/* Bottom row */}
          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap" as const,
              gap: 20,
            }}
          >
            <p
              style={{
                fontFamily: FONT_HEAD,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              <span className="g-name">{PROFILE.name.split(" ")[0]}</span>
              <span style={{ color: A }}>.</span>
            </p>

            {/* Social links */}
            <div style={{ display: "flex", gap: 20 }}>
              {[
                { label: "GitHub", href: PROFILE.github },
                { label: "LinkedIn", href: PROFILE.linkedin },
                { label: "Email", href: `mailto:${PROFILE.email}` },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 13,
                    color: TEXT3,
                    fontWeight: 500,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = A)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = TEXT3)}
                >
                  {l.label}
                </a>
              ))}
            </div>

            <p style={{ fontSize: 12, color: TEXT3 }}>
              © {new Date().getFullYear()} — Cloud Computing Portfolio
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

// ============================================================
// ROOT — assembles all sections
// ============================================================
export default function Portfolio() {
  return (
    <>
      <GlobalStyles />
      <CursorGlow />
      <Navbar />
      <main>
        <HeroSection />
        <ManifestoSection />
        <ProjectsSection />
        <SkillsMatrix />
        <TimelineSection />
      </main>
      <ContactFooter />
    </>
  );
}
