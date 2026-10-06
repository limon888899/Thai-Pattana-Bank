"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { addTransaction, BankUser, formatCurrency, getCurrentUser, getUsers, setUsers } from "@/lib/bank-demo";

export default function TransferPage() {
  const router = useRouter();
  const [user, setUser] = useState<BankUser | null>(null);
  const [amount, setAmount] = useState(2500);
  const [recipientNumber, setRecipientNumber] = useState("5001000002");
  const [note, setNote] = useState("Monthly support");
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
      setMessage("Enter a valid transfer amount.");
      return;
    }

    const users = getUsers();
    const recipient = users.find((item) => item.accountNumber === recipientNumber.trim());
    if (!recipient || recipient.id === user.id) {
      setMessage("Recipient account not found or cannot be the same account.");
      return;
    }

    if (value > user.balance) {
      setMessage("Insufficient balance for this transfer.");
      return;
    }

    const updatedSender = { ...user, balance: user.balance - value };
    const updatedRecipient = { ...recipient, balance: recipient.balance + value };
    const nextUsers = users.map((item) => {
      if (item.id === user.id) return updatedSender;
      if (item.id === recipient.id) return updatedRecipient;
      return item;
    });

    setUsers(nextUsers);
    setUser(updatedSender);

    addTransaction({
      id: `tx-${Date.now()}`,
      type: "Transfer",
      title: `Transfer to ${recipient.name}`,
      amount: value,
      currency: user.currency,
      method: "Internal transfer",
      status: "Completed",
      date: new Date().toISOString().slice(0, 10),
      accountNumber: recipient.accountNumber,
      counterparty: recipient.name,
    });

    setMessage(`Preview only: ${formatCurrency(value, user.currency)} was recorded in this browser for ${recipient.name}. No funds were transferred.`);
    setAmount(0);
    setNote("");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b38a2d]">Transfer</p>
            <h1 className="mt-3 font-display text-4xl text-[#0c2340]">Send money instantly</h1>
          </div>
          <Link href="/dashboard" className="group rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"><span aria-hidden="true" className="bank-icon mr-2">←</span>Back to dashboard</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] bg-slate-50 p-6 ring-1 ring-slate-200">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Recipient Account Number</label>
              <input
                type="text"
                value={recipientNumber}
                onChange={(event) => setRecipientNumber(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#0c2340]"
                required
              />
            </div>

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
              <label className="mb-2 block text-sm font-medium text-slate-700">Note</label>
              <input
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#0c2340]"
              />
            </div>

            <button type="submit" className="w-full rounded-full bg-[#0c2340] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#122d59]">
              <span aria-hidden="true" className="bank-icon mr-2">🔄</span>Confirm Transfer
            </button>

            {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          </form>

          <div className="rounded-[28px] bg-[#0c2340] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.22em] text-[#d7b56d]">Available Balance</div>
            <div className="mt-4 font-display text-4xl">{formatCurrency(user.balance, user.currency)}</div>
            <div className="mt-8 space-y-4 text-sm text-slate-200">
              <div className="rounded-2xl bg-white/5 p-4"><span aria-hidden="true" className="bank-icon mr-2">ℹ️</span>No bank transfer network is connected</div>
              <div className="rounded-2xl bg-white/5 p-4"><span aria-hidden="true" className="bank-icon mr-2">📱</span>No notification is sent to recipients</div>
              <div className="rounded-2xl bg-white/5 p-4"><span aria-hidden="true" className="bank-icon mr-2">⚠️</span>No real fees, limits, or payment processing apply</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
