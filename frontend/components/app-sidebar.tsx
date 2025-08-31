"use client";
import { SearchButton } from "@/components/search-button";
import * as React from "react";
import { searchData } from "@/data";
import {
  IconActivity,
  IconBriefcase,
  IconCertificate,
  IconFileDescription,
  IconInnerShadowTop,
  IconListDetails,
  IconMail,
  IconReport,
  IconSearch,
  IconSettings,
  IconUser,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { QuickCreateModal } from "@/components/quick-create-modal"; // Import the new modal

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const login = () => {
    localStorage.setItem("authToken", "mock-token");
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return { isLoggedIn, isLoading, login, logout };
};

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: IconActivity,
      description: "Dashboard and main metrics",
    },
    {
      title: "Profile",
      url: "/profile",
      icon: IconUser,
      description: "Personal information and bio",
    },
    {
      title: "Projects",
      url: "/projects",
      icon: IconBriefcase,
      description: "Portfolio and work samples",
    },
    {
      title: "Skills & Tech",
      url: "/skills",
      icon: IconListDetails,
      description: "Technical skills and expertise",
    },
    {
      title: "Resume",
      url: "/resume",
      icon: IconFileDescription,
      description: "Professional resume and experience",
    },
    {
      title: "Contact",
      url: "/contact",
      icon: IconMail,
      description: "Get in touch with me",
    },
    {
      title: "Socials",
      url: "/socials",
      icon: IconMail,
      description: "Get in touch with me",
    },
  ],
  // Documents that should only be visible when logged in
  documents: (isLoggedIn: boolean) => [
    {
      name: "Resume Download",
      url: "/Khalfan_Athman_MSA_PDF.pdf",
      icon: IconReport,
      description: "Download my latest resume",
    },
    // Only show certificates if logged in
    ...(isLoggedIn
      ? [
          {
            name: "Certificates",
            url: "/certificates",
            icon: IconCertificate,
            description: "View my certifications and achievements",
          },
        ]
      : []),
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isLoggedIn, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleQuickCreate = () => {
    setShowCreateModal(true);
  };

  const handleInbox = () => {
    // Redirect to messages/contact management
    window.location.href = "/admin/messages";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-16 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5 group"
              >
                <a href="#" className="flex items-center gap-2">
                  <div className="relative">
                    <IconInnerShadowTop className="!size-5 transition-transform group-hover:scale-110" />
                    <div className="absolute -inset-1 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-base font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Khalfan Athman
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavDocuments items={data.documents(isLoggedIn)} />

          {/* Theme Toggle */}
          <div className="px-4 py-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full p-2 rounded-lg text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {mounted ? (
                theme === "dark" ? (
                  <IconSun className="h-4 w-4" />
                ) : (
                  <IconMoon className="h-4 w-4" />
                )
              ) : (
                <div className="h-4 w-4 bg-muted rounded"></div>
              )}
              <span>
                {mounted
                  ? theme === "dark"
                    ? "Light Mode"
                    : "Dark Mode"
                  : "Loading..."}
              </span>
            </button>
          </div>

          {/* Auth Toggle - Only show if portfolio owner */}
        </SidebarContent>
        <SidebarFooter>
          {isLoggedIn && (
            <div className="px-4 py-2 text-xs text-muted-foreground text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse inline-block mr-2"></div>
              Online
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* Quick Create Modal */}
      <QuickCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
}
