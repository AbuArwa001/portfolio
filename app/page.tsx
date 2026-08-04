"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Terminal,
  Database,
  Server,
  Network,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/30">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 dark:opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-blue-500/50 blur-[100px] rounded-full mix-blend-screen animate-pulse-glow" />
      </div>
      {/* Floating orb accent */}
      <div className="absolute top-40 right-10 lg:right-32 w-64 h-64 opacity-10 dark:opacity-15 pointer-events-none animate-float hidden lg:block">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-blue-600 blur-2xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
              <Network className="w-4 h-4" />
              <span>Network Engineer & Full-Stack Developer</span>
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-6">
              Architecting{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                Robust Infrastructure
              </span>
              <br /> & Scalable Web Apps
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              I bring 6+ years of network engineering discipline to full-stack development. 
              Specializing in Django REST Framework and high-performance Next.js frontends, 
              I build solutions that don't just look premium—they scale flawlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/projects">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                  View Case Studies <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-background/50 backdrop-blur-sm border-border">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Bento */}
      <section className="py-20 border-y border-border/50 bg-muted/30 relative">
        <div className="container px-4 mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-8"
          >
            Core Technology Stack
          </motion.p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { icon: <Terminal className="h-8 w-8 text-primary" />, label: "Next.js & React", sub: "Frontend" },
              { icon: <Database className="h-8 w-8 text-blue-500" />, label: "Django & DRF", sub: "Backend API" },
              { icon: <Server className="h-8 w-8 text-emerald-500" />, label: "Linux & C", sub: "Systems" },
              { icon: <Network className="h-8 w-8 text-purple-400" />, label: "Networking", sub: "Infrastructure" },
            ].map((t) => (
              <motion.div
                key={t.label}
                variants={item}
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex flex-col items-center justify-center p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/50 hover:shadow-[0_0_24px_-8px] hover:shadow-primary/30 transition-all duration-300 cursor-default"
              >
                <div className="mb-3">{t.icon}</div>
                <span className="font-bold text-foreground text-sm">{t.label}</span>
                <span className="text-xs text-muted-foreground mt-1">{t.sub}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Teaser */}
      <section className="py-32 relative">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
              Proven Engineering
            </h2>
            <p className="text-lg text-muted-foreground">
              From high-traffic portals to complex admin dashboards, I deliver production-ready 
              systems designed for real-world impact.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Project 1 - In Progress */}
            <motion.div variants={item} className="group relative rounded-3xl border border-border/50 bg-card overflow-hidden hover:border-primary/50 transition-colors shadow-sm">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <Image 
                  src="/jamiaGive_admin_dashboard/dashboard.png" 
                  alt="jamiaGive Admin Dashboard" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full border border-yellow-500/20 backdrop-blur-sm">
                    In Progress
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex gap-2 mb-4">
                  <span className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">Next.js</span>
                  <span className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">DRF</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">jamiaGive Admin Dashboard</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">
                  Building a robust administrative dashboard for managing donations and accounts. Features real-time tracking, structured categories, and secure transfers via a decoupled DRF backend.
                </p>
                <Link href="/projects" className="inline-flex items-center text-primary font-medium hover:underline">
                  Read Case Study <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Project 2 */}
            <motion.div variants={item} className="group relative rounded-3xl border border-border/50 bg-card overflow-hidden hover:border-primary/50 transition-colors shadow-sm">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <Image 
                  src="/SUPKEM/Home_hero.png" 
                  alt="SUPKEM Platform" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-green-500/20 text-green-500 rounded-full border border-green-500/20 backdrop-blur-sm">
                    Live
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex gap-2 mb-4">
                  <span className="text-xs font-mono px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md border border-blue-500/20">Next.js</span>
                  <span className="text-xs font-mono px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md border border-blue-500/20">PostgreSQL</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">SUPKEM News & Admin</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">
                  Developed a comprehensive digital presence for SUPKEM featuring a dynamic news engine and a secure administrative dashboard for nationwide event management.
                </p>
                <Link href="/projects" className="inline-flex items-center text-blue-500 font-medium hover:underline">
                  Read Case Study <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
          
          <div className="mt-12 text-center">
             <Link href="/projects">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  View All Work
                </Button>
             </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/3 to-transparent pointer-events-none" />
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm flex items-center justify-center">
                KA
              </div>
              <div>
                <p className="font-bold text-foreground font-heading">Khalfan Athman</p>
                <p className="text-xs text-muted-foreground">Network Engineer · Full-Stack Developer</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="https://github.com/AbuArwa001" target="_blank" className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://www.linkedin.com/in/khalfaniathman" target="_blank" className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="mailto:khalfan@khalfanathman.dev" className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} · Built with Next.js & Django
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
