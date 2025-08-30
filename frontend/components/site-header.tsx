"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { useSession } from "next-auth/react";
import {
  Bell,
  Mail,
  Search,
  User,
  Settings,
  LogOut,
  Github,
  Linkedin,
  Twitter,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SiteHeader() {
  const { data: session, status } = useSession();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showHiddenItems, setShowHiddenItems] = useState(false);

  // // Check if user is the portfolio owner (you)
  // const isPortfolioOwner = session?.user?.email === "your-email@example.com";

  // Enable admin mode with a secret key sequence (press 'A' three times)
  useEffect(() => {
    let keyPressCount = 0;
    let timer: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") {
        clearTimeout(timer);
        keyPressCount++;

        if (keyPressCount === 3) {
          setIsAdminMode((prev) => !prev);
          setShowHiddenItems(true);
          keyPressCount = 0;

          // Auto-hide after 10 seconds
          setTimeout(() => setShowHiddenItems(false), 10000);
        }

        timer = setTimeout(() => {
          keyPressCount = 0;
        }, 1000);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Search Bar with animation */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="relative hidden md:flex items-center w-full max-w-sm"
        >
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search portfolio..."
            className="pl-8"
          />
        </motion.div>

        <div className="ml-auto flex items-center gap-2">
          {/* Theme Toggle */}
          <ModeToggle />

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />

          {/* Social Media Icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="hidden md:flex items-center gap-1"
          >
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <a
                href="https://github.com/AbuArwa001"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <a
                href="https://twitter.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />

          {/* Notification Bell - only show when logged in or in admin mode */}
          {(status === "authenticated" || isAdminMode) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </motion.div>
          )}

          {/* Messages - only show when logged in or in admin mode */}
          {(status === "authenticated" || isAdminMode) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="icon" className="relative">
                <Mail className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center">
                  1
                </Badge>
              </Button>
            </motion.div>
          )}

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />

          {/* User Profile or Auth Buttons */}
          {status === "authenticated" && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || ""}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AnimatePresence>
              {/* Show auth buttons only in admin mode or when explicitly revealed */}
              {(isAdminMode || showHiddenItems) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2"
                >
                  <Button variant="outline" size="sm" asChild>
                    <a href="/auth/signin">Sign In</a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href="/auth/signup">Sign Up</a>
                  </Button>
                </motion.div>
              )}

              {/* Show subtle hint for admin access when not authenticated */}
              {!isAdminMode &&
                !showHiddenItems &&
                status !== "authenticated" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowHiddenItems(true);
                        setTimeout(() => setShowHiddenItems(false), 5000);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.header>
  );
}
