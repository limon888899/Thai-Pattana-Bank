"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BankUser, getCurrentUser, getUsers, setUsers } from "@/lib/bank-demo";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<BankUser | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", country: "", address: "" });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const activeUser = getCurrentUser();
    if (!activeUser) {
      router.push("/login");
      return;
    }

    setUser(activeUser);
    setForm({
      name: activeUser.name,
      phone: activeUser.phone,
      country: activeUser.country,
      address: activeUser.address,
    });
  }, [router]);

  if (!user) return null;

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const users = getUsers();
    const nextUsers = users.map((item) => (item.id === user.id ? { ...item, ...form } : item));
    setUsers(nextUsers);
    setUser({ ...user, ...form });
    setMessage("Profile updated successfully.");
  };

  const handlePasswordChange = (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    const users = getUsers();
    const nextUsers = users.map((item) => (item.id === user.id ? { ...item, password } : item));
    setUsers(nextUsers);
    setUser({ ...user, password });
    setMessage("Password updated successfully.");
    setPassword("");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b38a2d]">Profile</p>
            <h1 className="mt-3 font-display text-4xl text-[#0c2340]">Member profile & security</h1>
          </div>
          <Link href="/dashboard" className="group rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"><span aria-hidden="true" className="bank-icon mr-2">←</span>Back to dashboard</Link>
        </div>

        {message && <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={handleSave} className="space-y-5 rounded-[28px] bg-slate-50 p-6 ring-1 ring-slate-200">
            <div className="flex items-center gap-4">
              <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#d7b56d]/20 text-3xl">{user.avatar}</div>
              <div>
                <div className="font-display text-2xl text-[#0c2340]">{user.name}</div>
                <div className="text-sm text-slate-500">{user.accountNumber}</div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#0c2340]" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#0c2340]" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
              <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#0c2340]" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
              <textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#0c2340]" required />
            </div>

            <button type="submit" className="w-full rounded-full bg-[#0c2340] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#122d59]">
              <span aria-hidden="true" className="bank-icon mr-2">💾</span>Save Profile
            </button>
          </form>

          <form onSubmit={handlePasswordChange} className="space-y-5 rounded-[28px] bg-slate-50 p-6 ring-1 ring-slate-200">
            <h2 className="font-display text-2xl text-[#0c2340]">Change password</h2>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#0c2340]" required />
            </div>

            <button type="submit" className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
              <span aria-hidden="true" className="bank-icon mr-2">🔑</span>Update Password
            </button>

            <div className="rounded-2xl bg-[#0c2340] p-4 text-sm text-slate-200">
              <span aria-hidden="true" className="bank-icon mr-2">🛡️</span>Device verification, encrypted session handling, and fraud alerts are active for this account.
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
