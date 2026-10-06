"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BankUser,
  clearCurrentUser,
  formatCurrency,
  getCurrentUser,
  getTransactions,
  getUsers,
  getWalletOptions,
  setUsers,
  Transaction,
} from "@/lib/bank-demo";

const quickStats = [
  { label: "Available Balance", icon: "💰" },
  { label: "Monthly Spend", icon: "📈" },
  { label: "Transfers", icon: "🔁" },
  { label: "Saved Goals", icon: "🎯" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<BankUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const activeUser = getCurrentUser();
    if (!activeUser) {
      router.push("/login");
      return;
    }

    setUser(activeUser);
    setTransactions(getTransactions());
  }, [router]);

  const walletOptions = useMemo(() => getWalletOptions(user?.country ?? "Bangladesh"), [user]);

  if (!user) return null;

  const handleLogout = () => {
    clearCurrentUser();
    router.push("/");
  };

  const updateUserState = (updates: Partial<BankUser>) => {
    const users = getUsers();
    const updatedUser = users.find((item) => item.id === user.id);
    if (!updatedUser) return;

    const merged = { ...updatedUser, ...updates };
    const nextUsers = users.map((item) => (item.id === user.id ? merged : item));
    setUsers(nextUsers);
    setUser(merged);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Thai Pattana Global Commercial Bank PCL" className="h-9 w-9" />
            <div>
              <div className="font-display text-base text-[#0c2340]">Thai Pattana Global</div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">Commercial Bank PCL</div>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link href="/dashboard" className="group"><span aria-hidden="true" className="bank-icon mr-1">🏠</span>Overview</Link>
            <Link href="/transfer" className="group"><span aria-hidden="true" className="bank-icon mr-1">🔄</span>Transfer</Link>
            <Link href="/cash-in" className="group"><span aria-hidden="true" className="bank-icon mr-1">💳</span>Cash In</Link>
            <Link href="/cash-out" className="group"><span aria-hidden="true" className="bank-icon mr-1">🏧</span>Cash Out</Link>
            <Link href="/profile" className="group"><span aria-hidden="true" className="bank-icon mr-1">👤</span>Profile</Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:block">
              {user.country}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              <span aria-hidden="true" className="bank-icon mr-2">↪️</span>Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-[30px] bg-[#0c2340] p-6 text-white shadow-[0_24px_60px_rgba(12,35,64,0.24)] md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/70 bg-white/10 text-3xl">{user.avatar}</div>
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-[#d7b56d]">Account holder</div>
                  <h1 className="mt-2 font-display text-3xl">{user.name}</h1>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-300">Account Number</div>
                <div className="mt-2 font-display text-2xl">{user.accountNumber}</div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Available Balance</div>
                <div className="mt-3 font-display text-4xl">{formatCurrency(user.balance, user.currency)}</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-300">KYC Status</div>
                <div className="mt-3 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-200">
                  {user.kycStatus}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b38a2d]">Profile snapshot</div>
              <div className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                {user.status}
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between border-b border-slate-200 pb-2"><span>Country</span><span className="font-medium text-slate-900">{user.country}</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-2"><span>Phone</span><span className="font-medium text-slate-900">{user.phone}</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-2"><span>Email</span><span className="font-medium text-slate-900">{user.email}</span></div>
              <div className="flex justify-between"><span>Card</span><span className="font-medium text-slate-900">•••• {user.cardLast4}</span></div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {quickStats.map((item) => (
            <div key={item.label} className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div aria-hidden="true" className="bank-icon text-2xl">{item.icon}</div>
              <div className="mt-4 text-sm text-slate-500">{item.label}</div>
              <div className="mt-2 font-display text-2xl text-[#0c2340]">
                {item.label === "Available Balance" ? formatCurrency(user.balance, user.currency) : item.label === "Monthly Spend" ? formatCurrency(0, user.currency) : "0"}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Cash In", href: "/cash-in", icon: "💳" },
            { title: "Cash Out", href: "/cash-out", icon: "🏧" },
            { title: "Transfer", href: "/transfer", icon: "🔄" },
            { title: "Profile & Security", href: "/profile", icon: "🛡️" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
              <div aria-hidden="true" className="bank-icon text-3xl">{item.icon}</div>
              <div className="mt-4 font-display text-2xl text-[#0c2340]">{item.title}</div>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl text-[#0c2340]">Recent Activity</h2>
              <div className="text-sm text-slate-500">Browser preview</div>
            </div>

            <div className="space-y-4">
              {transactions.length === 0 && (
                <p className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
                  No activity has been recorded in this browser.
                </p>
              )}
              {transactions.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <div className="font-medium text-slate-800">{item.title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{item.method} • {item.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${item.type === "Cash Out" || item.type === "Bill" ? "text-red-600" : "text-emerald-600"}`}>
                      {item.type === "Cash Out" || item.type === "Bill" ? "-" : "+"}
                      {formatCurrency(item.amount, item.currency)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div>
              <h2 className="font-display text-2xl text-[#0c2340]">Country Wallets</h2>
              <p className="mt-2 text-sm text-slate-500">Network names are informational only and are not connected to this website.</p>
            </div>

            <div className="space-y-3">
              {walletOptions.map((option) => (
                <div key={option.code} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <div className="font-medium text-slate-800"><span aria-hidden="true" className="bank-icon mr-2">💸</span>{option.name}</div>
                    <div className="text-xs uppercase tracking-[0.14em] text-slate-500">{option.code}</div>
                  </div>
                  <div className="rounded-full bg-[#d7b56d]/15 px-3 py-1 text-xs font-semibold text-[#0c2340]">{option.fee}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { title: "Saved Goals", value: "0 goals", detail: "Goal tracking is not connected to a banking service." },
            { title: "Cards", value: "Not available", detail: "This website cannot issue or manage payment cards." },
            { title: "Security", value: "Not connected", detail: "No bank security or identity verification service is connected." },
          ].map((item) => (
            <div key={item.title} className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="text-xs uppercase tracking-[0.2em] text-[#b38a2d]">{item.title}</div>
              <div className="mt-4 font-display text-3xl text-[#0c2340]">{item.value}</div>
              <div className="mt-2 text-sm text-slate-600">{item.detail}</div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
