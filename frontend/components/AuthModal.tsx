"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Mail, Lock, User as UserIcon, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGithub } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setError(error.message);
        } else {
          onClose();
        }
      } else {
        const { error } = await signUpWithEmail(email, password, name);
        if (error) {
          setError(error.message);
        } else {
          setSuccessMsg(
            "Account created! If email confirmation is enabled, please check your inbox.",
          );
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) setError(error.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await signInWithGithub();
      if (error) setError(error.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Github sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-[#1f2537] bg-[#0f121a] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1b202e] bg-[#141824] px-6 py-4">
          <h2 className="text-sm font-semibold text-white">
            {mode === "signin" ? "Sign In to Magnetio" : "Create an Account"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#737c92] transition-colors hover:bg-[#1f2639] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#1b202e] bg-[#111520]">
          <button
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              mode === "signin"
                ? "border-b-2 border-red-500 bg-[#151a28] text-white"
                : "text-[#7a849b] hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              mode === "signup"
                ? "border-b-2 border-red-500 bg-[#151a28] text-white"
                : "text-[#7a849b] hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 p-6">
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#232a3d] bg-[#141824] py-2.5 text-xs font-medium text-white transition-colors hover:border-[#303950] hover:bg-[#1a2030] disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGithubSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#232a3d] bg-[#141824] py-2.5 text-xs font-medium text-white transition-colors hover:border-[#303950] hover:bg-[#1a2030] disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.95.58.1.79-.25.79-.56v-2.17c-3.22.7-3.9-1.37-3.9-1.37-.53-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.57-.29-5.27-1.29-5.27-5.72 0-1.26.45-2.3 1.19-3.11-.12-.29-.52-1.47.11-3.07 0 0 .97-.31 3.17 1.19a11 11 0 0 1 5.77 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.6.23 2.78.11 3.07.74.81 1.19 1.85 1.19 3.11 0 4.44-2.7 5.43-5.28 5.72.41.36.77 1.06.77 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
              />
            </svg>
            Continue with Github
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#1b202e]" />
            <span className="absolute bg-[#0f121a] px-2 text-[10px] tracking-wider text-[#5f687d] uppercase">
              or with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-[#8e97ab]">Name</label>
                <div className="relative">
                  <UserIcon className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#5f687d]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-lg border border-[#22283a] bg-[#131722] py-2 pr-3 pl-9 text-xs text-white placeholder-[#5a6378] focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-[#8e97ab]">Email Address</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#5f687d]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-[#22283a] bg-[#131722] py-2 pr-3 pl-9 text-xs text-white placeholder-[#5a6378] focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#8e97ab]">Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#5f687d]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#22283a] bg-[#131722] py-2 pr-3 pl-9 text-xs text-white placeholder-[#5a6378] focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
