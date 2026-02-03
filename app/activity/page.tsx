// app/activity/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const ActivityPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper function to add cache busting parameter
  const addCacheBuster = (url: string) => {
    return `${url}${url.includes("?") ? "&" : "?"}cb=${Date.now()}`;
  };

  // Stats data
  const stats = [
    { label: "Public Repositories", value: "24", color: "text-blue-400" },
    { label: "Stars Earned", value: "128", color: "text-yellow-400" },
    { label: "Contributions (2023)", value: "1,024", color: "text-green-400" },
  ];

  // Card data
  const cards = [
    {
      id: "github-stats",
      title: "GitHub Stats",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      imageUrl: addCacheBuster(
        "https://github-readme-stats.vercel.app/api?username=AbuArwa001&show_icons=true&theme=dark&count_private=true&hide_border=true&bg_color=0f172a&title_color=38bdf8&text_color=94a3b8&icon_color=38bdf8"
      ),
    },
    {
      id: "top-languages",
      title: "Top Languages",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm8.925-4.218a.5.5 0 00-.85.525l.001.002.002.004.004.007.015.027a6.913 6.913 0 01.384.722c.243.487.535 1.126.763 1.807.228.68.353 1.223.353 1.547v.02h1.402v-.02c0-.324.125-.866.353-1.547.228-.68.52-1.32.763-1.807a6.94 6.94 0 01.384-.722l.015-.027.004-.007.001-.003a.5.5 0 00-.85-.525l-.003.005-.01.018-.037.066a5.915 5.915 0 00-.327.614c-.21.421-.474.99-.677 1.59a6.782 6.782 0 00-.302 1.645h-1.79a6.782 6.782 0 00-.302-1.645c-.203-.6-.467-1.169-.677-1.59a5.915 5.915 0 00-.327-.614l-.01-.018-.003-.005zM12 16.5a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      imageUrl: addCacheBuster(
        "https://github-readme-stats.vercel.app/api/top-langs/?username=AbuArwa001&layout=compact&theme=dark&hide_border=true&bg_color=0f172a&title_color=38bdf8&text_color=94a3b8&langs_count=8"
      ),
    },
    {
      id: "github-streak",
      title: "GitHub Streak",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5.39-2.59-10.2-6.5-13.33zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
        </svg>
      ),
      imageUrl: addCacheBuster(
        "https://github-readme-streak-stats.herokuapp.com/?user=AbuArwa001&theme=dark&hide_border=true&background=0F172A&stroke=1F2937&ring=38BDF8&fire=38BDF8&currStreakLabel=38BDF8"
      ),
    },
    {
      id: "github-trophies",
      title: "GitHub Achievements",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.827h2v1z" />
        </svg>
      ),
      imageUrl: addCacheBuster(
        "https://github-profile-trophy.vercel.app/?username=AbuArwa001&theme=dark&no-frame=true&margin-w=5&margin-h=5&row=2&column=4"
      ),
    },
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Developer Activity
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Real-time GitHub statistics and coding activity metrics
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`rounded-xl bg-slate-800 border border-slate-700 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-500/30 hover:-translate-y-1 ${
                activeCard === card.id ? "ring-2 ring-blue-500/50" : ""
              }`}
              onMouseEnter={() => setActiveCard(card.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                {card.icon}
                {card.title}
              </h2>
              <div className="relative h-40">
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  className="object-contain transition-transform duration-300 hover:scale-105"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>

        {/* GitHub Snake Animation */}
        <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 shadow-lg mt-8 transition-all duration-300 hover:shadow-xl hover:border-blue-500/30">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm-2-17h4v10h-4v-10zm4 12h-4v2h4v-2z" />
            </svg>
            Coding Snake
          </h2>
          <div className="relative w-full h-40 md:h-48 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
            <picture>
              <source
                media="(prefers-color-scheme: dark)"
                srcSet="https://raw.githubusercontent.com/AbuArwa001/AbuArwa001/output/github-snake-dark.svg"
              />
              <source
                media="(prefers-color-scheme: light)"
                srcSet="https://raw.githubusercontent.com/AbuArwa001/AbuArwa001/output/github-snake.svg"
              />
              <Image
                src="https://raw.githubusercontent.com/AbuArwa001/AbuArwa001/output/github-snake-dark.svg"
                alt="GitHub Snake Animation"
                fill
                className="object-contain"
                unoptimized
              />
            </picture>
          </div>
        </div>

        <div className="mt-8 md:mt-12 p-6 bg-slate-800 rounded-xl border border-slate-700 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">
            About These Stats
          </h2>
          <p className="text-slate-300 mb-6 text-center md:text-left">
            These statistics are generated using the GitHub Readme Stats API.
            They provide insights into coding activity, language preferences,
            and contribution patterns.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-4 bg-slate-700 rounded-lg transition-all duration-300 hover:bg-slate-600 hover:scale-105"
              >
                <h3 className="font-medium mb-2 text-slate-300">
                  {stat.label}
                </h3>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed (Placeholder) */}
        <div className="mt-8 p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="relative flex h-3 w-3 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-4 bg-slate-700 rounded-lg border-l-4 border-blue-500 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-600 rounded w-1/4"></div>
                </div>
                <div className="h-3 bg-slate-600 rounded w-1/2 mt-2"></div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-300 text-slate-300">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
