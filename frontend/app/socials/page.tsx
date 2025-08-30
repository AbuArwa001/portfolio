// app/social/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SocialPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const socialPlatforms = [
    {
      name: "GitHub",
      username: "AbuArwa001",
      url: "https://github.com/AbuArwa001",
      description: "Check out my projects and contributions",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
      color: "bg-gray-900 hover:bg-gray-800",
      textColor: "text-white",
    },
    {
      name: "LinkedIn",
      username: "khalfaniathman",
      url: "https://www.linkedin.com/in/khalfaniathman",
      description: "Connect with me professionally",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      color: "bg-blue-700 hover:bg-blue-600",
      textColor: "text-white",
    },
    {
      name: "Twitter",
      username: "@athman_khalfan",
      url: "https://twitter.com/athman_khalfan",
      description: "Follow me for tech insights and updates",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      color: "bg-blue-400 hover:bg-blue-300",
      textColor: "text-white",
    },
    {
      name: "Dev.to",
      username: "khalfanathman",
      url: "https://dev.to/abuarwa001",
      description: "Read my technical articles and tutorials",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.60-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
        </svg>
      ),
      color: "bg-gray-800 hover:bg-gray-700",
      textColor: "text-white",
    },
    {
      name: "Medium",
      username: "@khalfanathman",
      url: "https://medium.com/@khalfanathman",
      description: "Read my blog posts on various tech topics",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75S24 8.83 24 12z" />
        </svg>
      ),
      color: "bg-gray-700 hover:bg-gray-600",
      textColor: "text-white",
    },
    {
      name: "Email",
      username: "khalfan@khalfanathman.dev",
      url: "mailto:khalfan@khalfanathman.dev",
      description: "Send me an email directly",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "bg-red-600 hover:bg-red-500",
      textColor: "text-white",
    },
  ];

  const filteredPlatforms = socialPlatforms.filter((platform) =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    platform.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    platform.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          Let&apos;s Connect
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Find me on these platforms. I'm always open to discussing new
          projects, creative ideas, or opportunities to be part of your vision.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search platforms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlatforms.map((platform, index) => (
          <Card 
            key={index} 
            className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-3">
              <div
                className={`rounded-lg p-3 ${platform.color} ${platform.textColor} mr-4 transition-all duration-300 hover:scale-110`}
              >
                {platform.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{platform.name}</CardTitle>
                <div className="flex items-center mt-1">
                  <p className="text-sm text-muted-foreground">
                    {platform.username}
                  </p>
                  <button
                    onClick={() => copyToClipboard(platform.username, platform.name)}
                    className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                    title="Copy username"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                {platform.description}
              </p>
              <Button 
                asChild 
                className="w-full transition-all duration-300 hover:scale-[1.02]"
                variant={platform.name === "Email" ? "default" : "outline"}
              >
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  {platform.name === "Email" ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Email
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Connect on {platform.name}
                    </>
                  )}
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlatforms.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No platforms found</h3>
          <p className="text-muted-foreground">Try a different search term</p>
        </div>
      )}

      {/* Additional Call-to-Action */}
      <Card className="mt-12 text-center border-dashed hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Prefer to email directly?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Feel free to send me an email at{" "}
            <a
              href="mailto:khalfan@khalfanathman.dev"
              className="text-primary hover:underline font-medium"
            >
              khalfan@khalfanathman.dev
            </a>
          </p>
          <Button asChild size="lg" className="transition-all duration-300 hover:scale-[1.02]">
            <a href="mailto:khalfan@khalfanathman.dev" className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send an Email
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Copy notification */}
      {copiedPlatform && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-bottom-5">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Copied {copiedPlatform} username!
          </div>
        </div>
      )}
    </div>
  );
}