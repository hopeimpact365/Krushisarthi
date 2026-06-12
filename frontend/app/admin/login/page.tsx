"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Mock verification
    setTimeout(() => {
      if (email === "admin@krushisarthi.com" && password === "admin123") {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid email address or password. Please try again.");
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl shadow-black/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center mb-3">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage Krushisarthi platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <input
              type="email"
              required
              className="px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm text-foreground"
              placeholder="e.g. admin@krushisarthi.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              required
              className="px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm text-foreground"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-sm hover:bg-amber-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/10"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Mock Credentials Hint */}
        <div className="mt-6 text-xs text-center text-muted-foreground border-t border-border pt-4">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Email: <code className="bg-secondary px-1 py-0.5 rounded font-mono">admin@krushisarthi.com</code></p>
          <p className="mt-0.5">Password: <code className="bg-secondary px-1 py-0.5 rounded font-mono">admin123</code></p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/10 text-destructive text-sm rounded-lg animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
