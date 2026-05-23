// ============================================================
// src/components/Portfolio.tsx — BEAUTIFUL COLOR UPGRADE
//
// COLOR SYSTEM:
//   Text is now bright and readable everywhere.
//   Uses a full spectrum: indigo · violet · cyan · emerald · rose
//   Gradient text on headings, glowing borders, vibrant accents.
// ============================================================

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import {
  PROFILE, SKILLS, QUALIFICATIONS, PROJECTS, NAV_ITEMS, CATEGORY_COLORS,
} from "../data/portfolio";
import type { Skill, Qualification, Project, NavItem } from "../data/portfolio";

// ============================================================
// COLOUR PALETTE — single source of truth
// Change any colour here → updates everywhere automatically
// ============================================================
const C = {
  // Backgrounds
  bg:        "#060612",
  bg2:       "#0c0c1e",
  bg3:       "#10102a",
  bgCard:    "rgba(255,255,255,0.03)",
  border:    "rgba(255,255,255,0.09)",
  borderHov: "rgba(129,140,248,0.55)",

  // Text — ALL much brighter than before
  textPrimary:  "#f0f0ff",   // near white with a cool blue tint — headings
  textBody:     "#b0b0d0",   // light lavender-grey — body text (was dark #4a4a6a)
  textMuted:    "#6868a0",   // medium purple-grey — secondary info
  textDim:      "#404068",   // dim — labels, footers

  // Accent colours — the full spectrum
  indigo:   "#818cf8",
  violet:   "#c084fc",
  cyan:     "#22d3ee",
  emerald:  "#34d399",
  rose:     "#f472b6",
  amber:    "#fbbf24",
  sky:      "#38bdf8",

  // Gradients
  gradName:    "linear-gradient(135deg, #ffffff 0%, #818cf8 45%, #c084fc 100%)",
  gradTitle:   "linear-gradient(90deg, #818cf8, #22d3ee)",
  gradAccent:  "linear-gradient(90deg, #818cf8, #c084fc, #22d3ee)",
  gradSidebar: "linear-gradient(180deg, rgba(129,140,248,0.06) 0%, rgba(34,211,238,0.03) 100%)",
  gradCard:    "linear-gradient(135deg, rgba(129,140,248,0.06), rgba(192,132,252,0.04))",
};

// ============================================================
// INJECT GLOBAL STYLES (background orbs + scrollbar + body)
// Using a style tag because React inline styles can't do ::before
// ============================================================
function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.innerHTML = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background: ${C.bg};
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }
      /* Custom scrollbar */
      ::-webkit-scrollbar       { width: 4px; }
      ::-webkit-scrollbar-track { background: ${C.bg}; }
      ::-webkit-scrollbar-thumb { background: rgba(129,140,248,0.25); border-radius: 99px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(129,140,248,0.5); }

      /* Animated background orbs */
      body::before, body::after {
        content: '';
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        filter: blur(110px);
        animation: drift 22s ease-in-out infinite alternate;
      }
      body::before {
        width: 700px; height: 700px;
        background: radial-gradient(circle, rgba(129,140,248,0.14), transparent 65%);
        top: -250px; left: -150px;
      }
      body::after {
        width: 600px; height: 600px;
        background: radial-gradient(circle, rgba(34,211,238,0.10), transparent 65%);
        bottom: -200px; right: -100px;
        animation-delay: -11s;
      }
      @keyframes drift {
        0%   { transform: translate(0,0) scale(1); }
        100% { transform: translate(50px, 35px) scale(1.08); }
      }

      /* Gradient text utility — used on name and section titles */
      .grad-text {
        background: ${C.gradName};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .grad-title {
        background: ${C.gradTitle};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    `;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);
  return null;
}

// ============================================================
// RESPONSIVE HOOK
// ============================================================
function useWindowWidth(): number {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

// ============================================================
// INTERFACES
// ============================================================
interface SkillBarProps     { name: string; level: number; category: string; index: number; }
interface ProjectCardProps  { title: string; description: string; tech: string[]; image: string | null; link: string; featured: boolean; index: number; }
interface QualCardProps     { degree: string; school: string; year: string; description: string; index: number; }
interface ContactRowProps   { icon: string; label: string; value: string; href: string | null; iconColor: string; }
interface SectionHeaderProps{ title: string; sub: string; }
interface StatProps         { n: number; l: string; color: string; }

// ============================================================
// ANIMATION VARIANTS
// ============================================================
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0  },
};
const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.065 } },
};
const page: Variants = {
  hidden:  { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0,   transition: { duration: 0.3, ease: "easeOut" as const } },
  exit:    { opacity: 0, x: -18, transition: { duration: 0.18, ease: "easeIn" as const  } },
};

// ============================================================
// SMALL COMPONENTS
// ============================================================

// ── SkillBar ─────────────────────────────────────────────────
function SkillBar({ name, level, category, index }: SkillBarProps) {
  const pct   = (level / 5) * 100;
  const color = CATEGORY_COLORS[category] ?? C.indigo;
  return (
    <motion.div variants={fadeUp} style={s.skillRow}>
      <div style={s.skillMeta}>
        <span style={{ ...s.skillName, color: C.textBody }}>{name}</span>
        <span style={{
          ...s.badge,
          backgroundColor: color + "18",
          color,
          border: `1px solid ${color}35`,
        }}>{category}</span>
      </div>
      <div style={s.barTrack}>
        <motion.div
          style={{ ...s.barFill, background: `linear-gradient(90deg, ${color}, ${color}99)` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.04, ease: "easeOut" as const }}
        />
      </div>
      <span style={{ ...s.levelLabel, color: C.textMuted }}>
        {level}<span style={{ color: C.textDim }}>/5</span>
      </span>
    </motion.div>
  );
}

// ── ProjectCard ───────────────────────────────────────────────
function ProjectCard({ title, description, tech, image, link, featured }: ProjectCardProps) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      style={{
        ...s.card,
        borderColor: hov ? C.borderHov : C.border,
        boxShadow:   hov ? `0 0 0 1px rgba(129,140,248,0.3), 0 12px 40px rgba(129,140,248,0.12)` : "none",
        background:  hov ? C.gradCard : C.bgCard,
      }}
      whileHover={{ y: -7 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={s.cardImg}>
        {image
          ? <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" as const }} />
          : <div style={s.cardImgPlaceholder}><span style={{ fontSize: 30, color: "rgba(129,140,248,0.2)" }}>◉</span></div>
        }
        {featured && <span style={s.featuredBadge}>✦ Featured</span>}
      </div>
      <div style={s.cardBody}>
        <h3 style={{ ...s.cardTitle, color: C.textPrimary }}>{title}</h3>
        <p  style={{ ...s.cardDesc,  color: C.textBody   }}>{description}</p>
        <div style={s.techList}>
          {tech.map((t: string) => (
            <span key={t} style={s.techBadge}>{t}</span>
          ))}
        </div>
        {link && link !== "#" && (
          <a href={link} target="_blank" rel="noreferrer" style={s.cardLink}>
            View Live →
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ── QualCard ──────────────────────────────────────────────────
// Each qualification gets a different accent colour for variety
const QUAL_COLORS = [C.indigo, C.violet, C.cyan, C.emerald];

function QualCard({ degree, school, year, description, index }: QualCardProps) {
  const color = QUAL_COLORS[index % QUAL_COLORS.length];
  return (
    <motion.div variants={fadeUp} style={s.qualCard}>
      <motion.div
        style={{ ...s.qualAccent, background: `linear-gradient(180deg, ${color}, ${color}44)` }}
        initial={{ height: 0 }} whileInView={{ height: "100%" }} viewport={{ once: true }}
        transition={{ duration: 0.55, delay: index * 0.1 }}
      />
      <div style={s.qualContent}>
        <div style={s.qualHeader}>
          <h3 style={{ ...s.qualDegree, color: C.textPrimary }}>{degree}</h3>
          <span style={{ ...s.qualYear, color }}>{year}</span>
        </div>
        <p style={{ ...s.qualSchool, color: C.textMuted }}>{school}</p>
        <p style={{ ...s.qualDesc,   color: C.textBody  }}>{description}</p>
      </div>
    </motion.div>
  );
}

// ── ContactRow ────────────────────────────────────────────────
function ContactRow({ icon, label, value, href, iconColor }: ContactRowProps) {
  return (
    <motion.div variants={fadeUp} style={s.contactRow}>
      <div style={{ ...s.contactIconWrap, background: iconColor + "15", border: `1px solid ${iconColor}25` }}>
        <span style={{ fontSize: 15, color: iconColor }}>{icon}</span>
      </div>
      <div>
        <p style={{ ...s.contactLabel, color: C.textDim }}>{label}</p>
        {href
          ? <a href={href} target="_blank" rel="noreferrer" style={{ ...s.contactValue, color: C.textBody }}>{value}</a>
          : <p style={{ ...s.contactValue, color: C.textBody }}>{value}</p>
        }
      </div>
    </motion.div>
  );
}

// ── Stat ─────────────────────────────────────────────────────
function Stat({ n, l, color }: StatProps) {
  return (
    <motion.div
      variants={fadeUp}
      style={{ ...s.stat, border: `1px solid ${color}22`, background: `${color}08` }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span style={{ ...s.statNumber, color }}>{n}</span>
      <span style={{ ...s.statLabel,  color: C.textDim }}>{l}</span>
    </motion.div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────
function SectionHeader({ title, sub }: SectionHeaderProps) {
  return (
    <motion.div style={s.sectionHeader}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36 }}>
      {/* Gradient text title using the injected CSS class */}
      <h2 className="grad-title" style={s.sectionTitle}>{title}</h2>
      <p style={{ ...s.sectionSub, color: C.textMuted }}>{sub}</p>
      <motion.div style={s.accentLine}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" as const }} />
    </motion.div>
  );
}

// ============================================================
// SECTIONS
// ============================================================

function ProfileSection() {
  const initials = PROFILE.name.split(" ").map((w: string) => w[0]).join("");
  return (
    <motion.div key="profile" variants={page} initial="hidden" animate="visible" exit="exit" style={s.section}>
      {/* Avatar with glow */}
      <motion.div style={s.avatarOuter}
        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: "backOut" as const }}>
        <div style={s.avatarGlow} />
        {PROFILE.avatar
          ? <img src={PROFILE.avatar} alt={PROFILE.name} style={s.avatarImg} />
          : <div style={s.avatarInitials}>{initials}</div>
        }
      </motion.div>

      {/* NAME — gradient text, very large and beautiful */}
      <motion.h1 className="grad-text" style={s.profileName}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        {PROFILE.name}
      </motion.h1>

      {/* Title with cyan accent */}
      <motion.p style={{ ...s.profileTitle, color: C.cyan }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {PROFILE.title}
        <span style={{ color: C.textDim, margin: "0 8px" }}>·</span>
        <span style={{ color: C.violet }}>{PROFILE.subtitle}</span>
      </motion.p>

      {/* Location */}
      <motion.p style={{ ...s.profileLocation, color: C.textMuted }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.27 }}>
        ◈ {PROFILE.location}
      </motion.p>

      {/* Bio — now much more readable */}
      <motion.p style={{ ...s.profileBio, color: C.textBody }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
        {PROFILE.bio}
      </motion.p>

      {/* Stats — each a different accent colour */}
      <motion.div style={s.statsRow} variants={stagger} initial="hidden" animate="visible">
        <Stat n={PROJECTS.length}       l="Projects"       color={C.indigo}  />
        <Stat n={SKILLS.length}         l="Skills"         color={C.violet}  />
        <Stat n={QUALIFICATIONS.length} l="Qualifications" color={C.cyan}    />
      </motion.div>
    </motion.div>
  );
}

function SkillsSection() {
  const categories = Array.from(new Set(SKILLS.map((sk: Skill) => sk.category)));
  let gi = 0;
  return (
    <motion.div key="skills" variants={page} initial="hidden" animate="visible" exit="exit" style={s.section}>
      <SectionHeader title="Skills" sub="Technical abilities by area" />
      {categories.map((cat: string) => (
        <motion.div key={cat} style={s.skillGroup}
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }}>
          <h3 style={{ ...s.skillGroupTitle, color: C.textDim }}>{cat}</h3>
          {SKILLS.filter((sk: Skill) => sk.category === cat).map((skill: Skill) => {
            const idx = gi++;
            return <SkillBar key={skill.name} {...skill} index={idx} />;
          })}
        </motion.div>
      ))}
    </motion.div>
  );
}

function QualificationsSection() {
  return (
    <motion.div key="qualifications" variants={page} initial="hidden" animate="visible" exit="exit" style={s.section}>
      <SectionHeader title="Education" sub="Degrees and certifications" />
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {QUALIFICATIONS.map((q: Qualification, i: number) => <QualCard key={i} {...q} index={i} />)}
      </motion.div>
    </motion.div>
  );
}

function ProjectsSection() {
  return (
    <motion.div key="projects" variants={page} initial="hidden" animate="visible" exit="exit" style={s.section}>
      <SectionHeader title="Projects" sub="Things I've built" />
      <motion.div style={s.projectGrid} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {PROJECTS.map((p: Project, i: number) => <ProjectCard key={i} {...p} index={i} />)}
      </motion.div>
    </motion.div>
  );
}

function ContactSection() {
  // Each row has its own icon colour
  const rows = [
    { icon: "✉",  label: "Email",    value: PROFILE.email,    href: `mailto:${PROFILE.email}`, iconColor: C.rose    },
    { icon: "⌥",  label: "GitHub",   value: "View my GitHub", href: PROFILE.github,            iconColor: C.violet  },
    { icon: "◈",  label: "LinkedIn", value: "View LinkedIn",  href: PROFILE.linkedin,          iconColor: C.indigo  },
    { icon: "◎",  label: "Location", value: PROFILE.location, href: null,                      iconColor: C.cyan    },
  ];
  return (
    <motion.div key="contact" variants={page} initial="hidden" animate="visible" exit="exit" style={s.section}>
      <SectionHeader title="Contact" sub="Let's connect" />
      <motion.div style={s.contactList} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {rows.map((r) => <ContactRow key={r.label} {...r} />)}
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// ROOT COMPONENT — layout + responsive sidebar
// ============================================================
export default function Portfolio() {
  const ww       = useWindowWidth();
  const isMobile = ww < 768;
  const [active,      setActive]      = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);



  useEffect(() => {
    document.body.style.overflow = (isMobile && sidebarOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, sidebarOpen]);

  function handleNav(id: string) {
    setActive(id);
    if (isMobile) setSidebarOpen(false);
  }

  const sections: Record<string, React.ReactElement> = {
    profile:        <ProfileSection />,
    skills:         <SkillsSection />,
    qualifications: <QualificationsSection />,
    projects:       <ProjectsSection />,
    contact:        <ContactSection />,
  };

  const initials = PROFILE.name.split(" ").map((w: string) => w[0]).join("");

  // Nav icon colours — each item gets its own accent
  const navColors: Record<string, string> = {
    profile:        C.indigo,
    skills:         C.violet,
    qualifications: C.cyan,
    projects:       C.emerald,
    contact:        C.rose,
  };

  return (
    <>
      <GlobalStyles />
      <div style={s.root}>

        {/* ── Mobile top bar ── */}
        {isMobile && (
          <div style={s.topbar}>
            <button style={s.hamburger} onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <span style={s.hLine} />
              <span style={s.hLine} />
              <span style={s.hLine} />
            </button>
            <span className="grad-text" style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.02em" }}>
              {PROFILE.name.split(" ")[0]}
            </span>
            <div style={{ width: 44 }} />
          </div>
        )}

        <div style={{ display: "flex", flex: 1, position: "relative" }}>

          {/* Overlay */}
          <AnimatePresence>
            {isMobile && sidebarOpen && (
              <motion.div style={s.overlay}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)} />
            )}
          </AnimatePresence>

          {/* ── Sidebar ── */}
          <AnimatePresence>
            {(!isMobile || sidebarOpen) && (
              <motion.aside
                style={{
                  ...s.sidebar,
                  position: isMobile ? "fixed" : "sticky",
                  top: 0, left: 0, height: "100vh",
                  zIndex: isMobile ? 200 : 10,
                }}
                initial={isMobile ? { x: -260 } : false}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Close button on mobile */}
                {isMobile && (
                  <button style={s.closeBtn} onClick={() => setSidebarOpen(false)}>✕</button>
                )}

                {/* Brand */}
                <div style={s.brand}>
                  <div style={s.brandAvatar}>
                    {PROFILE.avatar
                      ? <img src={PROFILE.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" as const }} />
                      : <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{initials}</span>
                    }
                  </div>
                  <div>
                    <p className="grad-text" style={{ ...s.brandName }}>{PROFILE.name.split(" ")[0]}</p>
                    <p style={{ ...s.brandRole, color: C.textMuted }}>{PROFILE.title}</p>
                  </div>
                </div>

                <div style={s.divider} />

                {/* Nav */}
                <nav style={s.nav}>
                  {NAV_ITEMS.map((item: NavItem) => {
                    const isActive = active === item.id;
                    const col = navColors[item.id] ?? C.indigo;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        style={{
                          ...s.navBtn,
                          color: isActive ? C.textPrimary : C.textDim,
                        }}
                      >
                        {isActive && (
                          <motion.div layoutId="pill"
                            style={{ ...s.navPill, background: `${col}14`, border: `1px solid ${col}30` }}
                            transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                        )}
                        <span style={{ ...s.navIcon, color: isActive ? col : C.textDim + "88" }}>
                          {item.emoji}
                        </span>
                        <span style={{ position: "relative", zIndex: 1, fontSize: 13, fontWeight: isActive ? 600 : 400 }}>
                          {item.label}
                        </span>
                        {/* Active dot on right */}
                        {isActive && (
                          <motion.div
                            style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: col, position: "relative", zIndex: 1, boxShadow: `0 0 6px ${col}` }}
                            layoutId="dot"
                          />
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Footer */}
                <p style={{ ...s.sidebarFooter, color: C.textDim }}>Cloud Computing · 2026</p>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ── Main content ── */}
          <main style={{
            ...s.main,
            padding: isMobile ? "24px 20px 60px" : "52px 56px 80px",
          }}>
            <AnimatePresence mode="wait">
              {sections[active]}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}

// ============================================================
// STYLES
// ============================================================
const s: Record<string, React.CSSProperties> = {
  root:    { display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", zIndex: 1, fontFamily: "'Segoe UI', system-ui, sans-serif" },

  // Mobile topbar
  topbar:  { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 56, backgroundColor: "rgba(6,6,18,0.95)", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(16px)" },
  hamburger: { width: 44, height: 44, background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, padding: 0, borderRadius: 10 },
  hLine:   { display: "block", width: 22, height: 2, backgroundColor: C.indigo, borderRadius: 99 },
  closeBtn:{ position: "absolute", top: 16, right: 16, width: 30, height: 30, background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, borderRadius: "50%", color: C.textMuted, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", zIndex: 150, backdropFilter: "blur(3px)" },

  // Sidebar
  sidebar: { width: 230, minWidth: 230, background: `linear-gradient(180deg, rgba(12,12,30,0.99) 0%, rgba(8,8,20,0.99) 100%)`, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "26px 0 20px", overflowY: "auto" },
  brand:   { display: "flex", alignItems: "center", gap: 10, padding: "0 18px 20px" },
  brandAvatar: { width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" },
  brandName: { margin: 0, fontSize: 14, fontWeight: 800, letterSpacing: "-0.02em" },
  brandRole: { margin: 0, fontSize: 11 },
  divider: { height: 1, background: C.border, margin: "0 0 10px" },
  nav:     { display: "flex", flexDirection: "column", gap: 3, padding: "0 10px", flex: 1 },
  navBtn:  { display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: "transparent", textAlign: "left" as const, width: "100%", position: "relative", transition: "color 0.15s" },
  navPill: { position: "absolute", inset: 0, borderRadius: 10 },
  navIcon: { fontSize: 13, position: "relative", zIndex: 1, transition: "color 0.15s" },
  sidebarFooter: { fontSize: 10, textAlign: "center" as const, padding: "14px 0 0", borderTop: `1px solid ${C.border}`, letterSpacing: "0.05em" },

  // Main
  main:    { flex: 1, overflowY: "auto", maxWidth: 900, width: "100%" },
  section: { paddingBottom: 64 },

  // Section header
  sectionHeader: { marginBottom: 32 },
  sectionTitle:  { fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, margin: "0 0 5px", letterSpacing: "-0.03em" },
  sectionSub:    { fontSize: 13, margin: "0 0 14px" },
  accentLine:    { height: 2, width: 44, background: C.gradAccent, borderRadius: 99, transformOrigin: "left" },

  // Profile
  avatarOuter:    { position: "relative", width: 108, height: 108, marginBottom: 24 },
  avatarGlow:     { position: "absolute", inset: -14, borderRadius: "50%", background: `radial-gradient(circle, rgba(129,140,248,0.24) 0%, rgba(192,132,252,0.1) 50%, transparent 70%)` },
  avatarImg:      { width: 108, height: 108, borderRadius: "50%", objectFit: "cover" as const, border: `2px solid rgba(129,140,248,0.4)`, position: "relative", zIndex: 1, display: "block" },
  avatarInitials: { width: 108, height: 108, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo}, ${C.violet}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800, color: "#fff", position: "relative", zIndex: 1, border: `2px solid rgba(129,140,248,0.35)` },
  profileName:    { fontSize: "clamp(30px, 7vw, 48px)", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.04em", lineHeight: 1.08 },
  profileTitle:   { fontSize: "clamp(13px, 2vw, 15px)", margin: "0 0 6px", fontWeight: 500 },
  profileLocation:{ fontSize: 12, margin: "0 0 18px" },
  profileBio:     { fontSize: "clamp(13px, 1.8vw, 15px)", lineHeight: 1.8, maxWidth: 500, margin: "0 0 30px" },
  statsRow:       { display: "flex", gap: 12, flexWrap: "wrap" as const },
  stat:           { borderRadius: 14, padding: "15px 22px", display: "flex", flexDirection: "column", alignItems: "center", cursor: "default" },
  statNumber:     { fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 800, lineHeight: 1, marginBottom: 5 },
  statLabel:      { fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" as const },

  // Skills
  skillGroup:      { marginBottom: 34 },
  skillGroupTitle: { fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 14 },
  skillRow:        { display: "flex", alignItems: "center", gap: 10, marginBottom: 13 },
  skillMeta:       { display: "flex", alignItems: "center", gap: 6, width: 175, flexShrink: 0 },
  skillName:       { fontSize: 13, fontWeight: 500 },
  badge:           { fontSize: 9, padding: "2px 7px", borderRadius: 99, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const },
  barTrack:        { flex: 1, height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" },
  barFill:         { height: "100%", borderRadius: 99 },
  levelLabel:      { fontSize: 10, width: 28, textAlign: "right" as const, flexShrink: 0 },

  // Qualifications
  qualCard:    { display: "flex", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 14, overflow: "hidden", transition: "border-color 0.2s" },
  qualAccent:  { width: 3, flexShrink: 0 },
  qualContent: { padding: "18px 20px", flex: 1 },
  qualHeader:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, gap: 8 },
  qualDegree:  { fontSize: "clamp(13px, 2vw, 15px)", fontWeight: 700, margin: 0 },
  qualYear:    { fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" as const },
  qualSchool:  { fontSize: 13, margin: "3px 0 7px" },
  qualDesc:    { fontSize: 12, lineHeight: 1.65, margin: 0 },

  // Projects
  projectGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(255px,1fr))", gap: 16 },
  card:           { borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s" },
  cardImg:        { height: 150, position: "relative", overflow: "hidden" },
  cardImgPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${C.bg2}, ${C.bg3})` },
  featuredBadge:  { position: "absolute", top: 10, right: 10, background: `linear-gradient(90deg, ${C.violet}, ${C.indigo})`, color: "#fff", fontSize: 9, padding: "3px 9px", borderRadius: 99, fontWeight: 700, letterSpacing: "0.06em" },
  cardBody:       { padding: "16px" },
  cardTitle:      { fontSize: 14, fontWeight: 700, margin: "0 0 6px" },
  cardDesc:       { fontSize: 12, lineHeight: 1.65, margin: "0 0 12px" },
  techList:       { display: "flex", flexWrap: "wrap" as const, gap: 5, marginBottom: 12 },
  techBadge:      { fontSize: 10, padding: "3px 8px", borderRadius: 99, background: `${C.indigo}12`, color: C.indigo, border: `1px solid ${C.indigo}20`, fontWeight: 600 },
  cardLink:       { fontSize: 12, color: C.cyan, fontWeight: 600, textDecoration: "none" as const },

  // Contact
  contactList:    { display: "flex", flexDirection: "column", gap: 11, maxWidth: 440 },
  contactRow:     { display: "flex", alignItems: "center", gap: 14, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px 18px" },
  contactIconWrap:{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  contactLabel:   { fontSize: 10, margin: "0 0 2px", letterSpacing: "0.08em", textTransform: "uppercase" as const },
  contactValue:   { fontSize: 13, margin: 0, textDecoration: "none" as const },
};