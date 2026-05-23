// ============================================================
// PASTE THIS INTO: src/components/Portfolio.tsx
//
// If you have SkillsSection.tsx — you can DELETE that file.
// This single file replaces it and contains EVERYTHING.
//
// KEY DIFFERENCES FROM THE NEXT.JS VERSION:
//   ✅  No "use client" at top (React doesn't need it)
//   ✅  No "import Image from next/image" (use plain <img>)
//   ✅  Import path uses "../data/portfolio" not "@/data/portfolio"
//   ✅  All props typed with interfaces (fixes implicit any errors)
// ============================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// framer-motion must be installed first: npm install framer-motion

// Relative path — goes UP one folder (out of components) then INTO data
// VALUES (data you actually use at runtime)
import {
  PROFILE, SKILLS, QUALIFICATIONS, PROJECTS,
  NAV_ITEMS, CATEGORY_COLORS,
} from "../data/portfolio";

// TYPES (only exist at compile time — must use "import type")
// "import type" tells TS: these are purely for type checking,
// they get erased completely when the code compiles to JS
import type { Skill, Qualification, Project, NavItem } from "../data/portfolio";

// ============================================================
// TYPESCRIPT INTERFACES FOR COMPONENT PROPS
// Every component that receives props needs one of these.
// Without them → "binding element implicitly has any type" errors
// ============================================================

interface SkillBarProps {
  name: string;
  level: number;
  category: string;
  index: number; // controls stagger delay
}

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  image: string | null;
  link: string;
  featured: boolean;
  index: number;
}

interface QualCardProps {
  degree: string;
  school: string;
  year: string;
  description: string;
  index: number;
}

interface ContactRowProps {
  icon: string;
  label: string;
  value: string;
  href: string | null;
}

interface SectionHeaderProps {
  title: string;
  sub: string;
}

interface StatProps {
  n: number;
  l: string;
}

// ============================================================
// ANIMATION VARIANTS
// Defined once here, reused across all components.
// "variants" = named animation states Framer Motion switches between
// ============================================================

// fadeUp: starts invisible + 24px below, animates up into place
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 , transition: { duration: 0.5, ease: "easeOut" as const } },
};

// stagger: parent that plays children one after another (0.07s gap)
const stagger = {
  visible: { transition: { staggerChildren: 0.07 , ease :"easeOut" as const } },
};

// pageTransition: slide in from right, exit to left
const pageTransition = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.18, ease:"easeOut" as const } },
};

// ============================================================
// SMALL REUSABLE COMPONENTS
// ============================================================

// ── SkillBar ─────────────────────────────────────────────────
function SkillBar({ name, level, category, index }: SkillBarProps) {
  const percent = (level / 5) * 100;
  const color = CATEGORY_COLORS[category] ?? "#888";

  return (
    <motion.div variants={fadeUp} style={s.skillRow}>
      <div style={s.skillMeta}>
        <span style={s.skillName}>{name}</span>
        <span
          style={{
            ...s.badge,
            backgroundColor: color + "18",
            color,
            border: `1px solid ${color}33`,
          }}
        >
          {category}
        </span>
      </div>

      {/* Grey track */}
      <div style={s.barTrack}>
        {/* Animated fill — whileInView triggers when bar scrolls into view */}
        <motion.div
          style={{ ...s.barFill, backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.04, ease: "easeOut" }}
        />
      </div>

      <span style={s.levelLabel}>
        {level}
        <span style={s.levelTotal}>/5</span>
      </span>
    </motion.div>
  );
}

// ── ProjectCard ───────────────────────────────────────────────
function ProjectCard({
  title,
  description,
  tech,
  image,
  link,
  featured,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      style={{
        ...s.card,
        borderColor: hovered
          ? "rgba(129,140,248,0.4)"
          : "rgba(255,255,255,0.07)",
      }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ──────────────────────────────────────────────────────
          📸 PROJECT IMAGE SECTION
          
          To show a screenshot here:
            1. Put image in public/ folder  e.g. public/project1.png
            2. In portfolio.ts set:  image: "/project1.png"
          
          When image is null → shows a dark placeholder instead
          ────────────────────────────────────────────────────── */}
      <div style={s.cardImageWrap}>
        {image ? (
          // Plain <img> tag — works in React without any extra package
          // src="/project1.png" → React looks in the /public folder
          <img
            src={image}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={s.cardPlaceholder}>
            <span style={s.cardPlaceholderIcon}>◉</span>
          </div>
        )}
        {featured && <span style={s.featuredBadge}>Featured</span>}
      </div>

      <div style={s.cardBody}>
        <h3 style={s.cardTitle}>{title}</h3>
        <p style={s.cardDesc}>{description}</p>
        <div style={s.techList}>
          {tech.map((t: string) => (
            // t: string ← explicit type stops the implicit-any error
            <span key={t} style={s.techBadge}>
              {t}
            </span>
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
function QualCard({ degree, school, year, description, index }: QualCardProps) {
  return (
    <motion.div variants={fadeUp} style={s.qualCard}>
      {/* Animated accent bar on left edge */}
      <motion.div
        style={s.qualAccent}
        initial={{ height: 0 }}
        whileInView={{ height: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.12 }}
      />
      <div style={s.qualContent}>
        <div style={s.qualHeader}>
          <h3 style={s.qualDegree}>{degree}</h3>
          <span style={s.qualYear}>{year}</span>
        </div>
        <p style={s.qualSchool}>{school}</p>
        <p style={s.qualDesc}>{description}</p>
      </div>
    </motion.div>
  );
}

// ── ContactRow ────────────────────────────────────────────────
function ContactRow({ icon, label, value, href }: ContactRowProps) {
  return (
    <motion.div variants={fadeUp} style={s.contactRow}>
      <div style={s.contactIconWrap}>
        <span style={s.contactIcon}>{icon}</span>
      </div>
      <div>
        <p style={s.contactLabel}>{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={s.contactValue}
          >
            {value}
          </a>
        ) : (
          <p style={s.contactValue}>{value}</p>
        )}
      </div>
    </motion.div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────
function SectionHeader({ title, sub }: SectionHeaderProps) {
  return (
    <motion.div
      style={s.sectionHeader}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 style={s.sectionTitle}>{title}</h2>
      <p style={s.sectionSub}>{sub}</p>
      <motion.div
        style={s.accentLine}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </motion.div>
  );
}

// ── Stat (used on Profile page) ───────────────────────────────
function Stat({ n, l }: StatProps) {
  return (
    <motion.div variants={fadeUp} style={s.stat}>
      <span style={s.statNumber}>{n}</span>
      <span style={s.statLabel}>{l}</span>
    </motion.div>
  );
}

// ============================================================
// SECTION COMPONENTS
// Each one maps to a sidebar nav item.
// They wrap their content in motion.div with pageTransition
// so switching tabs feels smooth.
// ============================================================

// ── Profile ───────────────────────────────────────────────────
function ProfileSection() {
  // Build initials from name: "Your Full Name" → "YFN"
  const initials = PROFILE.name
    .split(" ")
    .map((w: string) => w[0]) // w: string — explicit type fixes implicit-any
    .join("");

  return (
    <motion.div
      key="profile"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={s.section}
    >
      {/* ──────────────────────────────────────────────────────
          📸 PROFILE PHOTO SECTION

          To add your photo:
            1. Copy photo to public/ folder  →  public/me.jpg
            2. In src/data/portfolio.ts change:
               avatar: null   →   avatar: "/me.jpg"

          When null → shows your initials in a gradient circle
          When set  → shows your actual photo in a circle
          ────────────────────────────────────────────────────── */}

      <motion.div
        style={s.avatarOuter}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
      >
        {/* Soft glow ring behind avatar */}
        <div style={s.avatarGlow} />

        {PROFILE.avatar ? (
          // ── YOUR PHOTO (when avatar is set in portfolio.ts) ──
          <img
            src={PROFILE.avatar} // e.g. "/me.jpg" from /public
            alt={PROFILE.name}
            style={s.avatarImg} // circle shape + border
          />
        ) : (
          // ── INITIALS FALLBACK (when avatar is null) ──
          <div style={s.avatarInitials}>{initials}</div>
        )}
      </motion.div>

      {/* Animated text entries */}
      <motion.h1
        style={s.profileName}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {PROFILE.name}
      </motion.h1>

      <motion.p
        style={s.profileTitle}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
      >
        {PROFILE.title}
        <span style={{ color: "#2e2e4a", margin: "0 6px" }}>·</span>
        {PROFILE.subtitle}
      </motion.p>

      <motion.p
        style={s.profileLocation}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        ◈ {PROFILE.location}
      </motion.p>

      <motion.p
        style={s.profileBio}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        {PROFILE.bio}
      </motion.p>

      {/* Stats row */}
      <motion.div
        style={s.statsRow}
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <Stat n={PROJECTS.length} l="Projects" />
        <Stat n={SKILLS.length} l="Skills" />
        <Stat n={QUALIFICATIONS.length} l="Qualifications" />
      </motion.div>
    </motion.div>
  );
}

// ── Skills ────────────────────────────────────────────────────
function SkillsSection() {
  // Get unique categories — Array.from(new Set(...)) removes duplicates
  const categories = Array.from(
    new Set(SKILLS.map((sk: Skill) => sk.category)),
  );
  let globalIndex = 0;

  return (
    <motion.div
      key="skills"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={s.section}
    >
      <SectionHeader title="Skills" sub="Technical abilities by area" />
      {categories.map((cat: string) => (
        <motion.div
          key={cat}
          style={s.skillGroup}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <h3 style={s.skillGroupTitle}>{cat}</h3>
          {SKILLS.filter((sk: Skill) => sk.category === cat).map(
            (skill: Skill) => {
              const idx = globalIndex++;
              return <SkillBar key={skill.name} {...skill} index={idx} />;
            },
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Qualifications ────────────────────────────────────────────
function QualificationsSection() {
  return (
    <motion.div
      key="qualifications"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={s.section}
    >
      <SectionHeader title="Education" sub="Degrees and certifications" />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {QUALIFICATIONS.map((q: Qualification, i: number) => (
          <QualCard key={i} {...q} index={i} />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ── Projects ──────────────────────────────────────────────────
function ProjectsSection() {
  return (
    <motion.div
      key="projects"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={s.section}
    >
      <SectionHeader title="Projects" sub="Things I've built" />
      <motion.div
        style={s.projectGrid}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {PROJECTS.map((p: Project, i: number) => (
          <ProjectCard key={i} {...p} index={i} />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ── Contact ───────────────────────────────────────────────────
function ContactSection() {
  return (
    <motion.div
      key="contact"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={s.section}
    >
      <SectionHeader title="Contact" sub="Let's connect" />
      <motion.div
        style={s.contactList}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <ContactRow
          icon="✉"
          label="Email"
          value={PROFILE.email}
          href={`mailto:${PROFILE.email}`}
        />
        <ContactRow
          icon="⌥"
          label="GitHub"
          value={PROFILE.github}
          href={PROFILE.github}
        />
        <ContactRow
          icon="◈"
          label="LinkedIn"
          value={PROFILE.linkedin}
          href={PROFILE.linkedin}
        />
        <ContactRow
          icon="◎"
          label="Location"
          value={PROFILE.location}
          href={null}
        />
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// ROOT COMPONENT — Layout: Sidebar + Main content
// ============================================================
export default function Portfolio() {
  const [active, setActive] = useState("profile");

  // Lookup table — typed as Record<string, React.ReactElement>
  // so TypeScript doesn't complain about indexing with a string
  const sections: Record<string, React.ReactElement> = {
    profile: <ProfileSection />,
    skills: <SkillsSection />,
    qualifications: <QualificationsSection />,
    projects: <ProjectsSection />,
    contact: <ContactSection />,
  };

  return (
    <div style={s.root}>
      {/* ── SIDEBAR ── */}
      <motion.aside
        style={s.sidebar}
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Brand row at top */}
        <div style={s.brand}>
          {/* Mini avatar: photo or initials */}
          <div style={s.brandAvatarWrap}>
            {PROFILE.avatar ? (
              <img src={PROFILE.avatar} alt="avatar" style={s.brandAvatarImg} />
            ) : (
              <span style={s.brandAvatarText}>
                {PROFILE.name
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")}
              </span>
            )}
          </div>
          <div>
            <p style={s.brandName}>{PROFILE.name.split(" ")[0]}</p>
            <p style={s.brandRole}>{PROFILE.title}</p>
          </div>
        </div>

        <div style={s.divider} />

        {/* Nav buttons */}
        <nav style={s.nav}>
          {NAV_ITEMS.map((item: NavItem) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{ ...s.navBtn, color: isActive ? "#fff" : "#3a3a5a" }}
              >
                {/* The animated pill that slides between active items */}
                {isActive && (
                  <motion.div
                    layoutId="pill"
                    // layoutId: Framer Motion smoothly moves this div
                    // between buttons — creates the sliding highlight effect
                    style={s.navPill}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  style={{
                    ...s.navIcon,
                    color: isActive ? "#818cf8" : "#252540",
                  }}
                >
                  {item.emoji}
                </span>
                <span style={{ position: "relative", zIndex: 1 }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <p style={s.sidebarFooter}>Cloud Computing · 2026</p>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <main style={s.main}>
        {/* AnimatePresence + mode="wait":
            waits for exit animation to finish before entering new section */}
        <AnimatePresence mode="wait">{sections[active]}</AnimatePresence>
      </main>
    </div>
  );
}

// ============================================================
// STYLES — typed as Record<string, React.CSSProperties>
// This single type annotation fixes ALL textAlign / flexWrap /
// objectFit / textTransform TypeScript errors at once.
// ============================================================
const s: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#07070f",
    color: "#e2e2f0",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },

  // Sidebar
  sidebar: {
    width: 220,
    minWidth: 220,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 18px 18px",
  },
  brandAvatarWrap: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#818cf8,#38bdf8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  brandAvatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  brandAvatarText: { fontSize: 13, fontWeight: 700, color: "#fff" },
  brandName: { margin: 0, fontSize: 13, fontWeight: 700, color: "#e2e2f0" },
  brandRole: { margin: 0, fontSize: 11, color: "#252540" },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.04)",
    margin: "0 0 10px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "0 10px",
    flex: 1,
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    background: "transparent",
    textAlign: "left" as const,
    width: "100%",
    position: "relative",
    transition: "color 0.18s",
  },
  navPill: {
    position: "absolute",
    inset: 0,
    borderRadius: 10,
    background: "rgba(129,140,248,0.12)",
    border: "1px solid rgba(129,140,248,0.2)",
  },
  navIcon: {
    fontSize: 13,
    position: "relative",
    zIndex: 1,
    transition: "color 0.18s",
  },
  sidebarFooter: {
    fontSize: 10,
    color: "#1a1a2e",
    textAlign: "center" as const,
    padding: "14px 0 0",
    borderTop: "1px solid rgba(255,255,255,0.03)",
    letterSpacing: "0.05em",
  },

  // Main
  main: { flex: 1, padding: "48px 52px", overflowY: "auto", maxWidth: 860 },
  section: { paddingBottom: 72 },

  // Section header
  sectionHeader: { marginBottom: 36 },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 800,
    color: "#e2e2f0",
    margin: "0 0 5px",
    letterSpacing: "-0.03em",
  },
  sectionSub: { fontSize: 14, color: "#2e2e4a", margin: "0 0 14px" },
  accentLine: {
    height: 2,
    width: 44,
    background: "linear-gradient(90deg,#818cf8,#38bdf8)",
    borderRadius: 99,
    transformOrigin: "left",
  },

  // Profile
  avatarOuter: {
    position: "relative",
    width: 110,
    height: 110,
    marginBottom: 24,
  },
  avatarGlow: {
    position: "absolute",
    inset: -10,
    borderRadius: "50%",
    background:
      "radial-gradient(circle,rgba(129,140,248,0.22),transparent 70%)",
  },
  avatarImg: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    objectFit: "cover" as const,
    border: "2px solid rgba(129,140,248,0.35)",
    position: "relative",
    zIndex: 1,
    display: "block",
  },
  avatarInitials: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#818cf8,#38bdf8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
    fontWeight: 800,
    color: "#fff",
    position: "relative",
    zIndex: 1,
    border: "2px solid rgba(129,140,248,0.3)",
  },
  profileName: {
    fontSize: 40,
    fontWeight: 800,
    color: "#e2e2f0",
    margin: "0 0 7px",
    letterSpacing: "-0.04em",
    lineHeight: 1.1,
  },
  profileTitle: {
    fontSize: 15,
    color: "#818cf8",
    margin: "0 0 5px",
    fontWeight: 500,
  },
  profileLocation: {
    fontSize: 12,
    color: "#252540",
    margin: "0 0 18px",
    letterSpacing: "0.02em",
  },
  profileBio: {
    fontSize: 14,
    color: "#4a4a6a",
    lineHeight: 1.75,
    maxWidth: 500,
    margin: "0 0 32px",
  },
  statsRow: { display: "flex", gap: 14, flexWrap: "wrap" as const },
  stat: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: "16px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 800,
    color: "#818cf8",
    lineHeight: 1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#252540",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },

  // Skills
  skillGroup: { marginBottom: 36 },
  skillGroupTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#252540",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    marginBottom: 14,
  },
  skillRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 13,
  },
  skillMeta: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    width: 185,
    flexShrink: 0,
  },
  skillName: { fontSize: 13, color: "#9090b0", fontWeight: 500 },
  badge: {
    fontSize: 9,
    padding: "2px 6px",
    borderRadius: 99,
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  barTrack: {
    flex: 1,
    height: 4,
    background: "rgba(255,255,255,0.04)",
    borderRadius: 99,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 99 },
  levelLabel: {
    fontSize: 11,
    color: "#252540",
    width: 28,
    textAlign: "right" as const,
    flexShrink: 0,
  },
  levelTotal: { color: "#1a1a2e" },

  // Qualifications
  qualCard: {
    display: "flex",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
  },
  qualAccent: {
    width: 3,
    background: "linear-gradient(180deg,#818cf8,#38bdf8)",
    flexShrink: 0,
  },
  qualContent: { padding: "18px 22px", flex: 1 },
  qualHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  qualDegree: { fontSize: 14, fontWeight: 700, color: "#c0c0d8", margin: 0 },
  qualYear: { fontSize: 11, color: "#818cf8", fontWeight: 600 },
  qualSchool: { fontSize: 13, color: "#2e2e4a", margin: "3px 0 7px" },
  qualDesc: { fontSize: 12, color: "#252540", lineHeight: 1.6, margin: 0 },

  // Projects
  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
    gap: 18,
  },
  card: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    overflow: "hidden",
    transition: "border-color 0.2s",
  },
  cardImageWrap: {
    height: 155,
    position: "relative",
    overflow: "hidden",
    background: "#0a0a18",
  },
  cardPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#0d0d20,#141428)",
  },
  cardPlaceholderIcon: { fontSize: 36, color: "rgba(129,140,248,0.18)" },
  featuredBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "rgba(129,140,248,0.88)",
    color: "#fff",
    fontSize: 9,
    padding: "3px 8px",
    borderRadius: 99,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
  cardBody: { padding: "18px" },
  cardTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#c0c0d8",
    margin: "0 0 7px",
  },
  cardDesc: {
    fontSize: 12,
    color: "#2e2e4a",
    lineHeight: 1.65,
    margin: "0 0 12px",
  },
  techList: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 5,
    marginBottom: 12,
  },
  techBadge: {
    fontSize: 10,
    padding: "3px 8px",
    borderRadius: 99,
    background: "rgba(129,140,248,0.08)",
    color: "#818cf8",
    border: "1px solid rgba(129,140,248,0.14)",
    fontWeight: 600,
  },
  cardLink: {
    fontSize: 12,
    color: "#818cf8",
    fontWeight: 600,
    textDecoration: "none" as const,
  },

  // Contact
  contactList: {
    display: "flex",
    flexDirection: "column",
    gap: 11,
    maxWidth: 420,
  },
  contactRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 13,
    padding: "14px 18px",
  },
  contactIconWrap: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "rgba(129,140,248,0.08)",
    border: "1px solid rgba(129,140,248,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contactIcon: { fontSize: 15, color: "#818cf8" },
  contactLabel: {
    fontSize: 10,
    color: "#252540",
    margin: "0 0 2px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  contactValue: {
    fontSize: 13,
    color: "#6060a0",
    margin: 0,
    textDecoration: "none" as const,
  },
};
