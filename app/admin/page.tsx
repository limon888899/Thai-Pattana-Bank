"use client";

import { useEffect, useMemo, useState } from "react";
import { BankUser, formatCurrency } from "@/lib/bank-demo";
import { supabase } from "@/lib/supabase";
import { mapProfile } from "@/lib/profiles";

const STAFF_DOMAIN = "staff.thaipattana.example";

export default function AdminPage() {
  const [admin, setAdmin] = useState<BankUser | null>(null);
  const [users, setUsersState] = useState<BankUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "user")
      .order("created_at", { ascending: false });
    setUsersState((data ?? []).map(mapProfile));
  };

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (me && me.role === "admin") {
          setAdmin(mapProfile(me));
          await loadUsers();
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: `${username.trim().toLowerCase()}@${STAFF_DOMAIN}`,
      password,
    });

    if (signInError || !data.user) {
      setSubmitting(false);
      setError("Invalid username or password.");
      return;
    }

    const { data: me } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();

    if (!me || me.role !== "admin") {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError("Invalid username or password.");
      return;
    }

    setAdmin(mapProfile(me));
    await loadUsers();
    setPassword("");
    setSubmitting(false);
  };

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.accountNumber.toLowerCase().includes(q) ||
        user.country.toLowerCase().includes(q)
    );
  }, [users, search]);

  if (loading) return null;

  if (!admin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
        <div className="w-full max-w-md rounded-[30px] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
          <div className="mb-6 flex justify-center">
            <img src="/logo.svg" alt="Thai Pattana Global Commercial Bank PCL" className="h-10 w-10" />
          </div>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-[#b38a2d]">Administrative Access</p>
          <h1 className="mt-3 text-center font-display text-3xl text-[#0c2340]">Control Center</h1>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#0c2340] focus:bg-white"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#0c2340] focus:bg-white"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[#0c2340] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#122d59] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span aria-hidden="true" className="bank-icon mr-2">🔐</span>{submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const activeUsers = users.filter((user) => user.status === "Active").length;
  const pendingUsers = users.filter((user) => user.status === "Pending").length;

  const handleAction = async (action: "approve" | "suspend", userId: string) => {
    const patch =
      action === "approve"
        ? { status: "Active", kyc_status: "Verified" }
        : { status: "Suspended" };
    await supabase.from("profiles").update(patch).eq("id", userId);
    await loadUsers();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    setUsersState([]);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="bg-[#0c2340] p-6 text-white">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Thai Pattana Global Commercial Bank PCL" className="h-9 w-9" />
            <div>
              <div className="font-display text-base">Thai Pattana Global</div>
              <div className="text-[8px] uppercase tracking-[0.12em] text-slate-300">Commercial Bank PCL · Admin</div>
            </div>
          </div>

          <nav className="mt-10 space-y-2 text-sm text-slate-200">
            {["Overview", "Members", "Transactions", "Approvals", "Security", "Reports"].map((item, index) => (
              <div key={item} className="group rounded-xl bg-white/5 px-4 py-3"><span aria-hidden="true" className="bank-icon mr-2">{["🏠", "👥", "💸", "✅", "🛡️", "📊"][index]}</span>{item}</div>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Logged in</div>
            <div className="mt-3 font-medium">{admin.name || admin.email}</div>
            <button onClick={handleLogout} className="mt-4 w-full rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              <span aria-hidden="true" className="bank-icon mr-2">↪️</span>Logout
            </button>
          </div>
        </aside>

        <section className="p-6 md:p-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b38a2d]">Operations</p>
            <h1 className="mt-3 font-display text-4xl text-[#0c2340]">Banking control dashboard</h1>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            {[
              { label: "Total Deposits", value: formatCurrency(totalBalance, "BDT") },
              { label: "Active Members", value: String(activeUsers) },
              { label: "Pending Approvals", value: String(pendingUsers) },
              { label: "Total Members", value: String(users.length) },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                <div className="mt-4 font-display text-3xl text-[#0c2340]">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="font-display text-2xl text-[#0c2340]">Member management</h2>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search members"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0c2340] md:max-w-xs"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="pb-3">Member</th>
                    <th className="pb-3">Country</th>
                    <th className="pb-3">Balance</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-slate-200 text-sm text-slate-700">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d7b56d]/20 text-xl">{user.avatar}</div>
                          <div>
                            <div className="font-semibold text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.accountNumber}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">{user.country}</td>
                      <td className="py-4">{formatCurrency(user.balance, user.currency)}</td>
                      <td className="py-4">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${user.status === "Active" ? "bg-emerald-100 text-emerald-700" : user.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => handleAction("approve", user.id)} className="group rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"><span aria-hidden="true" className="bank-icon mr-1">✓</span>Approve</button>
                          <button onClick={() => handleAction("suspend", user.id)} className="group rounded-full bg-amber-500 px-3 py-1.5 text-xs font-medium text-white"><span aria-hidden="true" className="bank-icon mr-1">⏸️</span>Suspend</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">No members found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
