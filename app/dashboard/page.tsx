"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BankUser, formatCurrency, getWalletOptions, Transaction } from "@/lib/bank-demo";
import { loadSession, loadTransactions, logout } from "@/lib/api";

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
    (async () => {
      const activeUser = await loadSession();
      if (!activeUser) {
        router.push("/login");
        return;
      }
      setUser(activeUser);
      setTransactions(await loadTransactions());
    })();
  }, [router]);

  const walletOptions = useMemo(() => getWalletOptions(user?.country ?? "Bangladesh"), [user]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const transferCount = transactions.filter((item) => item.type === "Transfer").length;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Thai Pattana Global Commercial Bank PCL" className="h-9 w-9" />
            <div>
              <div className="font-display text-base text-[#0c2340]">
