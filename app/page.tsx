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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-blue-500/50 blur-[100px] rounded-full mix-blend-screen" />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/50 transition-colors shadow-sm">
              <Terminal className="h-8 w-8 text-primary mb-3" />
              <span className="font-bold text-foreground">Next.js & React</span>
              <span className="text-sm text-muted-foreground mt-1">Frontend</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/50 transition-colors shadow-sm">
              <Database className="h-8 w-8 text-blue-500 mb-3" />
              <span className="font-bold text-foreground">Django & DRF</span>
              <span className="text-sm text-muted-foreground mt-1">Backend API</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/50 transition-colors shadow-sm">
              <Server className="h-8 w-8 text-green-500 mb-3" />
              <span className="font-bold text-foreground">Linux & C</span>
              <span className="text-sm text-muted-foreground mt-1">Systems</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/50 transition-colors shadow-sm">
              <Network className="h-8 w-8 text-purple-500 mb-3" />
              <span className="font-bold text-foreground">Networking</span>
              <span className="text-sm text-muted-foreground mt-1">Infrastructure</span>
            </div>
          </div>
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

      {/* Footer minimal */}
      <footer className="py-12 border-t border-border/50 bg-card text-muted-foreground text-center">
        <div className="container px-4 mx-auto flex flex-col items-center">
          <div className="flex gap-6 mb-6">
            <Link href="https://github.com/AbuArwa001" target="_blank" className="hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
            </Link>
            <Link href="https://www.linkedin.com/in/khalfaniathman" target="_blank" className="hover:text-primary transition-colors">
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link href="mailto:khalfan@khalfanathman.dev" className="hover:text-primary transition-colors">
              <Mail className="h-6 w-6" />
            </Link>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Khalfan Athman. Built with Next.js & Django.
          </p>
        </div>
      </footer>
    </div>
  );
}
