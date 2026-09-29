"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useMotionTemplate,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";
import { Menu, X, Github, Linkedin, Zap } from "lucide-react";

/* ── nav links ─────────────────────────────────────────────── */
const NAV_LINKS = [
  { href: "/",            label: "Home"        },
  { href: "/projects",    label: "Projects"    },
  { href: "/cetificates", label: "Credentials" },
  { href: "/activity",    label: "Activity"    },
  { href: "/references",  label: "References"  },
  { href: "/resume",      label: "Résumé"      },
  { href: "/blog",        label: "Blog"        },
  { href: "/contact",     label: "Contact"     },
];

/* ── spring-smoothed scroll progress for the top bar ────────── */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-gradient-to-r from-primary via-emerald-400 to-teal-400 print:hidden"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
export default function NavBar() {
  const pathname    = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 48));

  return (
    <>
      <ScrollProgressBar />

      {/* ── main nav ── */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 print:hidden flex justify-center"
        style={{ paddingTop: scrolled ? 10 : 0, paddingLeft: scrolled ? 16 : 0, paddingRight: scrolled ? 16 : 0 }}
      >
        <motion.nav
          animate={scrolled ? "pill" : "bar"}
          variants={{
            bar: {
              borderRadius: 0,
              maxWidth: "100%",
              boxShadow: "none",
              backgroundColor: "transparent",
              backdropFilter: "blur(0px)",
              borderBottomWidth: "0px",
            },
            pill: {
              borderRadius: 20,
              maxWidth: 980,
              boxShadow: "0 8px 40px -8px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)",
              backgroundColor: "color-mix(in oklch, var(--background) 82%, transparent)",
              backdropFilter: "blur(20px)",
              borderBottomWidth: "1px",
            },
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full border-border/50 transition-colors"
        >
          {/* subtle top rim glow when pill */}
          <AnimatePresence>
            {scrolled && (
              <motion.div
                key="rim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-t-[20px] pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="group flex items-center gap-2.5 shrink-0">
              <div className="relative">
                {/* glow ring */}
                <motion.div
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-1 rounded-xl bg-primary/30 blur-md pointer-events-none"
                />
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-primary-foreground font-extrabold text-sm shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                  KA
                </div>
              </div>
              <span className="hidden sm:block font-bold text-foreground font-heading tracking-tight">
                Khalfan<span className="text-primary">.dev</span>
              </span>
            </Link>

            {/* ── Desktop links ── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 text-[13px] font-medium rounded-xl transition-colors duration-150 ${
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Sliding pill background */}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}

                    <span className="relative z-10">{link.label}</span>

                    {/* Active dot */}
                    {active && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Right actions ── */}
            <div className="hidden md:flex items-center gap-1.5 shrink-0">
              {/* GitHub */}
              <a
                href="https://github.com/AbuArwa001"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.05] transition-colors" />
                <Github className="h-4 w-4 relative" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/khalfaniathman"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.05] transition-colors" />
                <Linkedin className="h-4 w-4 relative" />
              </a>

              {/* Separator */}
              <div className="w-px h-5 bg-border/60 mx-1" />

              {/* Hire Me CTA */}
              <Link href="/contact" className="relative group">
                {/* outer glow */}
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-xl bg-primary/30 blur-md pointer-events-none"
                />
                <span className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground text-[13px] font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                  <Zap className="w-3.5 h-3.5" />
                  Hire Me
                </span>
              </Link>
            </div>

            {/* ── Mobile hamburger ── */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="md:hidden relative p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className="absolute inset-0 rounded-xl hover:bg-white/[0.05] transition-colors" />
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5 relative" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5 relative" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.nav>
      </motion.div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[70px] left-3 right-3 z-40 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-2xl shadow-2xl shadow-black/30 md:hidden overflow-hidden"
          >
            {/* Top gradient rim */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="p-3">
              {/* Nav links with stagger */}
              <div className="grid grid-cols-2 gap-1">
                {NAV_LINKS.map((link, i) => {
                  const active =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          active
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                        }`}
                      >
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        )}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom action row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
                className="mt-3 pt-3 border-t border-border/40 flex gap-2"
              >
                <a
                  href="https://github.com/AbuArwa001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/70 bg-background/60 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/khalfaniathman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/70 bg-background/60 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground text-sm font-bold shadow-md shadow-primary/20"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Hire Me
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
