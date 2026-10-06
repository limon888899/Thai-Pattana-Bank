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

export default function AdminPage() {
  const [admin, setAdmin] = useState<BankUser | null>(null);
  const [users, setUsersState] = useState<BankUser[]>([]);
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
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
        <div className="w-full max-w-md rounded-[30px] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
          <div className="mb-6 flex justify-center">
            <img src="/logo.svg" alt="Thai Pattana Global Commercial Bank PCL" className="h-10 w-10" />
          </div>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-[#b38a2d]">Administrative Access</p>
          <h1 className="mt-3 text-center font-display text-3xl text-[#0c2340]">Control Center unavailable</h1>
          <p className="mt-4 text-center text-sm leading-7 text-slate-600">
            Administrator controls require secure server-side authentication and role permissions. They are not enabled in this public website preview.
          </p>
          <Link href="/" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#0c2340] px-5 py-3 text-sm font-semibold text-white">
            Return to website
          </Link>
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
            <img src="/logo.svg" alt="Thai Pattana Global Commercial Bank PCL" className="h-9 w-9" />
            <div>
              <div className="font-display text-base">Thai Pattana Global</div>
              <div className="text-[8px] uppercase tracking-[0.12em] text-slate-300">Commercial Bank PCL · Admin</div>
            </div>
          </div>

          <nav className="mt-10 space-y-2 text-sm text-slate-200">
            {['Overview', 'Members', 'Transactions', 'Approvals', 'Security', 'Reports'].map((item, index) => (
              <div key={item} className="group rounded-xl bg-white/5 px-4 py-3"><span aria-hidden="true" className="bank-icon mr-2">{["🏠", "👥", "💸", "✅", "🛡️", "📊"][index]}</span>{item}</div>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Logged in</div>
            <div className="mt-3 font-medium">{admin.name}</div>
            <button onClick={handleLogout} className="mt-4 w-full rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              <span aria-hidden="true" className="bank-icon mr-2">↪️</span>Logout
            </button>
          </div>
        </aside>

        <section className="p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b38a2d]">Operations</p>
              <h1 className="mt-3 font-display text-4xl text-[#0c2340]">Banking control dashboard</h1>
            </div>
            <Link href="/" className="group rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"><span aria-hidden="true" className="bank-icon mr-2">🏠</span>Website Home</Link>
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
                          <div aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d7b56d]/20 text-xl">{user.avatar}</div>
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
                          <button onClick={() => handleAction("approve", user.id)} className="group rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"><span aria-hidden="true" className="bank-icon mr-1">✓</span>Approve</button>
                          <button onClick={() => handleAction("suspend", user.id)} className="group rounded-full bg-amber-500 px-3 py-1.5 text-xs font-medium text-white"><span aria-hidden="true" className="bank-icon mr-1">⏸️</span>Suspend</button>
                          <button onClick={() => handleAction("delete", user.id)} className="group rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white"><span aria-hidden="true" className="bank-icon mr-1">🗑️</span>Delete</button>
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
