"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatCurrency, BankUser } from "@/lib/bank-demo";
import { supabase } from "@/lib/supabase";
import { loadSession } from "@/lib/api";

export default function CashOutPage() {
  const router = useRouter();
  const [user, setUser] = useState<BankUser | null>(null);
  const [amount, setAmount] = useState(2000);
  const [method, setMethod] = useState("bKash");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSession().then((activeUser) => {
      if (!activeUser) {
        router.push("/login");
        return;
      }
      setUser(activeUser);
    });
  }, [router]);

  if (!user) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      setMessage("Enter a valid withdrawal amount.");
      return;
    }

    if (value > user.balance) {
      setMessage("Insufficient balance for this cash-out request.");
      return;
    }

    const { error } = await supabase.rpc("demo_cash_out", {
      p_amount: value,
      p_method: method,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    const fresh = await loadSession();
    if (fresh) setUser(fresh);

    setMessage(`Preview only: ${formatCurrency(value, user.currency)} was deducted from the simulated balance. No withdrawal or payment occurred.`);
    setAmount(0);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b38a2d]">Cash Out</p>
            <h1 className="mt-3 font-display text-4xl text-[#0c2340]">Withdraw to wallet</h1>
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
              <label className="mb-2 block text-sm font-medium text-slate-700">Destination</label>
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
                <option>Bank Counter</option>
              </select>
            </div>

            <button type="submit" className="w-full rounded-full bg-[#0c2340] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#122d59]">
              <span aria-hidden="true" className="bank-icon mr-2">🏧</span>Process Cash Out
            </button>

            {message && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{message}</div>}
          </form>

          <div className="rounded-[28px] bg-[#0c2340] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.22em] text-[#d7b56d]">Account Balance</div>
            <div className="mt-4 font-display text-4xl">{formatCurrency(user.balance, user.currency)}</div>
            <div className="mt-8 space-y-4 text-sm text-slate-200">
              <div className="rounded-2xl bg-white/5 p-4"><span aria-hidden="true" className="bank-icon mr-2">ℹ️</span>No bank withdrawal or wallet is connected</div>
              <div className="rounded-2xl bg-white/5 p-4"><span aria-hidden="true" className="bank-icon mr-2">📋</span>No external approval or audit service is connected</div>
              <div className="rounded-2xl bg-white/5 p-4"><span aria-hidden="true" className="bank-icon mr-2">📱</span>No payment or SMS is sent</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
