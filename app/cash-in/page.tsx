"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { addTransaction, formatCurrency, getCurrentUser, getUsers, setUsers, BankUser } from "@/lib/bank-demo";

export default function CashInPage() {
  const router = useRouter();
  const [user, setUser] = useState<BankUser | null>(null);
  const [amount, setAmount] = useState(5000);
  const [method, setMethod] = useState("bKash");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const activeUser = getCurrentUser();
    if (!activeUser) {
      router.push("/login");
      return;
    }
    setUser(activeUser);
  }, [router]);

  if (!user) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    const users = getUsers();
    const updatedUser = { ...user, balance: user.balance + value };
    const nextUsers = users.map((item) => (item.id === user.id ? updatedUser : item));
    setUsers(nextUsers);
    setUser(updatedUser);

    addTransaction({
      id: `tx-${Date.now()}`,
      type: "Cash In",
      title: `Cash in via ${method}`,
      amount: value,
      currency: user.currency,
      method,
      status: "Completed",
      date: new Date().toISOString().slice(0, 10),
      counterparty: reference || method,
    });

    setMessage(`Preview only: ${formatCurrency(value, user.currency)} was recorded in this browser. No funds were deposited.`);
    setAmount(0);
    setReference("");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b38a2d]">Cash In</p>
            <h1 className="mt-3 font-display text-4xl text-[#0c2340]">Add funds securely</h1>
          </div>
          <Link href="/dashboard" className="group rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"><span aria-hidden="true" className="bank-icon mr-2">←</span>Back to dashboard</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] bg-slate-50 p-6 ring-1 ring-slate-200">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#0c2340]"
                min="1"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Source Method</label>
              <select
                value={method}
                onChange={(event) => setMethod(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#0c2340]"
              >
                <option>bKash</option>
                <option>Nagad</option>
                <option>Rocket</option>
                <option>Upay</option>
                <option>PromptPay</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Reference / Mobile Number</label>
              <input
                type="text"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#0c2340]"
                placeholder="01812-345678"
              />
            </div>

            <button type="submit" className="w-full rounded-full bg-[#0c2340] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#122d59]">
              <span aria-hidden="true" className="bank-icon mr-2">💳</span>Confirm Cash In
            </button>

            {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          </form>

          <div className="rounded-[28px] bg-[#0c2340] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.22em] text-[#d7b56d]">Current Balance</div>
            <div className="mt-4 font-display text-4xl">{formatCurrency(user.balance, user.currency)}</div>
            <div className="mt-8 space-y-4 text-sm text-slate-200">
              <div className="rounded-2xl bg-white/5 p-4"><span aria-hidden="true" className="bank-icon mr-2">ℹ️</span>No bank transfer or deposit is connected</div>
              <div className="rounded-2xl bg-white/5 p-4"><span aria-hidden="true" className="bank-icon mr-2">📱</span>No SMS or phone notification is sent</div>
              <div className="rounded-2xl bg-white/5 p-4"><span aria-hidden="true" className="bank-icon mr-2">⚠️</span>Amounts only change the local browser preview</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
