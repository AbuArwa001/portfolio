// app/debug-login/page.tsx
"use client";

import { useState } from "react";

export default function DebugLogin() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testLogin = async (useUsername = false) => {
    setLoading(true);
    setResult("Testing...");

    try {
      const payload = useUsername
        ? { username: "test@example.com", password: "testpassword" }
        : { email: "test@example.com", password: "testpassword" };

      console.log("Sending payload:", payload);

      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }

      setResult(`
Status: ${response.status}
Headers: ${JSON.stringify(
        Object.fromEntries([...response.headers.entries()]),
        null,
        2
      )}
Response: ${JSON.stringify(responseData, null, 2)}
      `);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : String(error ?? "Unknown error");
      setResult(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Login</h1>
      <div className="space-y-4 mb-4">
        <button
          onClick={() => testLogin(false)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Test with Email
        </button>
        <button
          onClick={() => testLogin(true)}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 ml-4"
        >
          Test with Username
        </button>
      </div>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {result || "Click a button to test"}
      </pre>
    </div>
  );
}
