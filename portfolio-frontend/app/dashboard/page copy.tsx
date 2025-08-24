"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import NavBar from "../NavBar";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {session?.user ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    {session.user.name?.charAt(0) ||
                      session.user.email?.charAt(0) ||
                      "U"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Welcome, {session.user.name || session.user.email}!
                  </h2>
                  <p className="text-gray-600">{session.user.email}</p>
                </div>
              </div>

              {/* Display session data for debugging */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Session Data
                </h3>
                <div className="bg-gray-100 rounded-md p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-700">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-4">
                Please sign in to access the dashboard.
              </p>
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
