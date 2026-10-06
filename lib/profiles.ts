import { BankUser } from "./bank-demo";

export function mapProfile(r: any): BankUser {
  return {
    id: r.id,
    name: r.name ?? "",
    email: r.email ?? "",
    phone: r.phone ?? "",
    country: r.country ?? "",
    accountNumber: r.account_number ?? "",
    password: "",
    avatar: "👤",
    role: r.role,
    status: r.status,
    kycStatus: r.kyc_status,
    balance: Number(r.balance),
    cardLast4: "0000",
    currency: r.currency,
    address: r.address ?? "",
    createdAt: r.created_at,
    lastLogin: new Date().toISOString(),
  };
}
