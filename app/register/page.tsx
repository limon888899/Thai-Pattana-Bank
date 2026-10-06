"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addNewUser, BankUser, getUsers } from "@/lib/bank-demo";

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  country: "Bangladesh",
  password: "",
  confirmPassword: "",
  address: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    const users = getUsers();
    const conflict = users.find((user) => user.email === form.email || user.phone === form.phone);
    if (conflict) {
      setError("An account already exists with this email or phone number.");
      return;
    }

    setLoading(true);

    const accountNumber = `5001${String(users.length + 100000).padStart(7, "0")}`;
    const nextUser: BankUser = {
      id: `user-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      country: form.country,
      accountNumber,
      password: form.password,
      avatar: "👤",
      role: "user",
      status: "Pending",
      kycStatus: "In review",
      balance: 0,
      cardLast4: "0000",
      currency: form.country === "Bangladesh" ? "BDT" : "THB",
      address: form.address,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    addNewUser(nextUser);
    setLoading(false);
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-4xl rounded-[30px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200 md:p-10">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Thai Pattana Global Commercial Bank PCL" className="h-10 w-10" />
            <div>
              <div className="font-display text-lg text-[#0c2340]">Thai Pattana Global</div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">Commercial Bank PCL</div>
            </div>
          </div>
          <Link href="/login" className="group text-sm font-medium text-[#0c2340]"><span aria-hidden="true" className="bank-icon mr-2">🔐</span>Already member?</Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] bg-[#0c2340] p-7 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b56d]">Open account</p>
            <h1 className="mt-3 font-display text-4xl">Start your secure banking journey.</h1>
            <ul className="mt-8 space-y-4 text-sm text-slate-200">
              <li><span aria-hidden="true" className="bank-icon mr-2">🪪</span>Instant onboarding with KYC verification</li>
              <li><span aria-hidden="true" className="bank-icon mr-2">💳</span>Country-specific mobile wallet cash-in support</li>
              <li><span aria-hidden="true" className="bank-icon mr-2">🛡️</span>Secure account protection and digital access</li>
              <li><span aria-hidden="true" className="bank-icon mr-2">🤝</span>Dedicated relationship support</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="font-display text-3xl text-[#0c2340]">Application Form</h2>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0c2340]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0c2340]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0c2340]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
                <select
                  value={form.country}
                  onChange={(event) => handleChange("country", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0c2340]"
                >
                  <option>Bangladesh</option>
                  <option>Thailand</option>
                  <option>Singapore</option>
                  <option>United States</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0c2340]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => handleChange("confirmPassword", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0c2340]"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
                <textarea
                  value={form.address}
                  onChange={(event) => handleChange("address", event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0c2340]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#0c2340] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#122d59] disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? "Submitting application..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
