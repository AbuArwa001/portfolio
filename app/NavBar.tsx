"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, Github, Linkedin, Network } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/cetificates", label: "Credentials" },
  { href: "/activity", label: "Activity" },
  { href: "/references", label: "References" },
  { href: "/resume", label: "Résumé" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-[0_0_20px_-5px] shadow-primary/60 group-hover:shadow-primary/80 transition-shadow">
              KA
            </div>
            <span className="hidden sm:block font-bold text-foreground font-heading">
              Khalfan<span className="text-primary">.Dev</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://github.com/AbuArwa001"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/khalfaniathman"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            {session ? (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium px-4 py-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/contact"
                className="ml-2 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-[0_0_20px_-8px] shadow-primary/50"
              >
                Hire Me
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-xl md:hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 mt-2 border-t border-border/40 flex gap-3">
                <a
                  href="https://github.com/AbuArwa001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                >
                  Hire Me
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
