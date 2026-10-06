"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BankUser,
  clearCurrentUser,
  formatCurrency,
  getCurrentUser,
  getUsers,
  setCurrentUser,
  submitUserUpdate,
} from "@/lib/bank-demo";

const adminFormDefault = {
  email: "admin@siamheritagebank.com",
  password: "admin123",
};

export default function AdminPage() {
  const [admin, setAdmin] = useState<BankUser | null>(null);
  const [users, setUsersState] = useState<BankUser[]>([]);
  const [form, setForm] = useState(adminFormDefault);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const current = getCurrentUser();
    if (current && current.role === "admin") {
      setAdmin(current);
      setUsersState(getUsers().filter((user) => user.role === "user"));
    }
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((user) =>
      user.name.toLowerCase().includes(q) ||
      user.accountNumber.toLowerCase().includes(q) ||
      user.country.toLowerCase().includes(q)
    );
  }, [users, search]);

  if (!admin) {
    const handleLogin = (event: React.FormEvent) => {
      event.preventDefault();
      setError("");

      const adminUser = getUsers().find(
        (user) => user.role === "admin" && user.email === form.email && user.password === form.password
      );

      if (!adminUser) {
        setError("Invalid admin credentials.");
        return;
      }

      setCurrentUser(adminUser.id);
      setAdmin(adminUser);
      setUsersState(getUsers().filter((user) => user.role === "user"));
    };

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
        <div className="w-full max-w-md rounded-[30px] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
          <div className="mb-6 flex justify-center">
            <img src="/logo.png" alt="Siam Heritage Bank" className="h-10 w-auto" />
          </div>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-[#b38a2d]">Administrative Access</p>
          <h1 className="mt-3 text-center font-display text-3xl text-[#0c2340]">Control Center</h1>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0c2340]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0c2340]"
                required
              />
            </div>

            <button type="submit" className="w-full rounded-full bg-[#0c2340] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#122d59]">
              Login to Admin Panel
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Demo admin: admin@siamheritagebank.com / admin123
          </div>
        </div>
      </main>
    );
  }

  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const activeUsers = users.filter((user) => user.status === "Active").length;
  const pendingUsers = users.filter((user) => user.status === "Pending").length;

  const refreshUsers = () => setUsersState(getUsers().filter((user) => user.role === "user"));

  const handleAction = (action: "approve" | "suspend" | "delete", userId: string) => {
    if (action === "approve") submitUserUpdate(userId, { status: "Active", kycStatus: "Verified" });
    if (action === "suspend") submitUserUpdate(userId, { status: "Suspended" });
    if (action === "delete") {
      const source = getUsers().filter((user) => user.id !== userId);
      const nextUsers = source.filter((user) => user.role === "user");
      const allUsers = getUsers().filter((user) => user.id !== userId);
      setUsersState(nextUsers);
      const storage = JSON.stringify(allUsers);
      localStorage.setItem("siam_heritage_users", storage);
      return;
    }
    refreshUsers();
  };

  const handleLogout = () => {
    clearCurrentUser();
    setAdmin(null);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="bg-[#0c2340] p-6 text-white">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Siam Heritage Bank" className="h-9 w-auto" />
            <div>
              <div className="font-display text-lg">Siam Heritage</div>
              <div className="text-[8px] uppercase tracking-[0.24em] text-slate-300">Admin Panel</div>
            </div>
          </div>

          <nav className="mt-10 space-y-2 text-sm text-slate-200">
            {['Overview', 'Members', 'Transactions', 'Approvals', 'Security', 'Reports'].map((item) => (
              <div key={item} className="rounded-xl bg-white/5 px-4 py-3">{item}</div>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Logged in</div>
            <div className="mt-3 font-medium">{admin.name}</div>
            <button onClick={handleLogout} className="mt-4 w-full rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Logout
            </button>
          </div>
        </aside>

        <section className="p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b38a2d]">Operations</p>
              <h1 className="mt-3 font-display text-4xl text-[#0c2340]">Banking control dashboard</h1>
            </div>
            <Link href="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">Website Home</Link>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            {[
              { label: "Total Deposits", value: formatCurrency(totalBalance, "BDT") },
              { label: "Active Members", value: String(activeUsers) },
              { label: "Pending Approvals", value: String(pendingUsers) },
              { label: "Risk Level", value: "Low" },
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
                          <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                          <div>
                            <div className="font-semibold text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.accountNumber}</div>
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
                          <button onClick={() => handleAction("approve", user.id)} className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">Approve</button>
                          <button onClick={() => handleAction("suspend", user.id)} className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-medium text-white">Suspend</button>
                          <button onClick={() => handleAction("delete", user.id)} className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
