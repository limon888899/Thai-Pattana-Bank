"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapProfile } from "@/lib/profiles";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (signInError || !data.user) {
      setLoading(false);
      setError("Invalid email or password. Please try again.");
      return;
    }

    const { data: row } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
    setLoading(false);

    if (!row || row.role === "admin") {
      await supabase.auth.signOut();
      setError("Invalid email or password. Please try again.");
      return;
    }

    const profile = mapProfile(row);

    if (profile.status === "Suspended") {
      await supabase.auth.signOut();
      setError("This account is currently suspended. Please contact the branch.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
        <div className="mb-6 flex justify-center">
          <img src="/logo.svg" alt="Thai Pattana Global Commercial Bank PCL" className="h-10 w-10" />
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b38a2d]">Member Access</p>
          <h1 className="mt-3 font-display text-3xl text-[#0c2340]">Member Access</h1>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#0c2340] focus:bg-white"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#0c2340] focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0c2340] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#122d59] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span aria-hidden="true" className="bank-icon mr-2">🔐</span>{loading ? "Signing in..." : "Login to Account"}
          </button>
        </form>

        <div className="mt-6 grid gap-3 text-sm text-slate-600">
          <Link href="/register" className="group rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
            <span aria-hidden="true" className="bank-icon mr-2">📝</span>Open New Account
          </Link>
        </div>

      </div>
    </main>
  );
}
