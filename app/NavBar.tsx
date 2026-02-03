"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
      <div className="text-xl font-bold">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          My Portfolio
        </Link>
      </div>

      <div className="flex space-x-6">
        <Link
          href="/"
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/projects"
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          Projects
        </Link>
        <Link
          href="/blog"
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          Blog
        </Link>
        <Link
          href="/contact"
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          Contact
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {status === "loading" ? (
          <div className="w-20 h-10 bg-gray-200 animate-pulse rounded"></div>
        ) : session ? (
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => signIn()}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Sign In
            </button>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
