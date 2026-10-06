export type UserRole = "user" | "admin";
export type UserStatus = "Active" | "Pending" | "Suspended";
export type KycStatus = "Verified" | "In review" | "Needs update";

export type BankUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  accountNumber: string;
  password: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  kycStatus: KycStatus;
  balance: number;
  cardLast4: string;
  currency: string;
  address: string;
  createdAt: string;
  lastLogin: string;
};

export type Transaction = {
  id: string;
  type: "Cash In" | "Cash Out" | "Transfer" | "Bill" | "Top Up" | "Mobile Wallet";
  title: string;
  amount: number;
  currency: string;
  method: string;
  status: "Completed" | "Pending" | "Rejected";
  date: string;
  accountNumber?: string;
  counterparty?: string;
};

const USER_STORAGE_KEY = "siam_heritage_users";
const CURRENT_USER_KEY = "siam_heritage_current_user";
const TRANSACTION_KEY = "siam_heritage_transactions";

export const demoUsers: BankUser[] = [
  {
    id: "user-001",
    name: "Nadia Rahman",
    email: "nadia.rahman@siamheritagebank.com",
    phone: "+8801700000001",
    country: "Bangladesh",
    accountNumber: "5001000001",
    password: "demo123",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    role: "user",
    status: "Active",
    kycStatus: "Verified",
    balance: 168450,
    cardLast4: "4876",
    currency: "BDT",
    address: "Dhaka, Bangladesh",
    createdAt: "2024-02-11",
    lastLogin: "2026-10-06",
  },
  {
    id: "user-002",
    name: "Arun Wongsawat",
    email: "arun.wongsawat@siamheritagebank.com",
    phone: "+66810000002",
    country: "Thailand",
    accountNumber: "5001000002",
    password: "demo123",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    role: "user",
    status: "Active",
    kycStatus: "Verified",
    balance: 980000,
    cardLast4: "2019",
    currency: "THB",
    address: "Bangkok, Thailand",
    createdAt: "2024-03-08",
    lastLogin: "2026-10-06",
  },
  {
    id: "admin-001",
    name: "Admin Director",
    email: "admin@siamheritagebank.com",
    phone: "+6625550199",
    country: "Thailand",
    accountNumber: "ADMIN-001",
    password: "admin123",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
    role: "admin",
    status: "Active",
    kycStatus: "Verified",
    balance: 0,
    cardLast4: "0000",
    currency: "THB",
    address: "Bangkok, Thailand",
    createdAt: "2024-01-02",
    lastLogin: "2026-10-06",
  },
];

export const demoTransactions: Transaction[] = [
  {
    id: "tx-101",
    type: "Cash In",
    title: "bKash cash-in",
    amount: 5000,
    currency: "BDT",
    method: "bKash",
    status: "Completed",
    date: "2026-10-05",
    counterparty: "Nadia Rahman",
  },
  {
    id: "tx-102",
    type: "Transfer",
    title: "Salary deposit",
    amount: 25000,
    currency: "BDT",
    method: "Bank transfer",
    status: "Completed",
    date: "2026-10-04",
    counterparty: "Siam Heritage Payroll",
  },
  {
    id: "tx-103",
    type: "Cash Out",
    title: "Cash-out to Nagad",
    amount: 7000,
    currency: "BDT",
    method: "Nagad",
    status: "Completed",
    date: "2026-10-03",
    counterparty: "Nagad",
  },
  {
    id: "tx-104",
    type: "Bill",
    title: "Utility payment",
    amount: 1200,
    currency: "THB",
    method: "Electricity bill",
    status: "Pending",
    date: "2026-10-02",
    counterparty: "Bangkok Electricity",
  },
];

export function getUsers(): BankUser[] {
  if (typeof window === "undefined") return demoUsers;

  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as BankUser[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore invalid storage
    }
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUsers));
  return demoUsers;
}

export function setUsers(users: BankUser[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

export function getCurrentUser(): BankUser | null {
  if (typeof window === "undefined") return null;

  const userId = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!userId) return null;

  const users = getUsers();
  return users.find((user) => user.id === userId) ?? null;
}

export function setCurrentUser(userId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CURRENT_USER_KEY, userId);
}

export function clearCurrentUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
}

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return demoTransactions;

  const raw = window.localStorage.getItem(TRANSACTION_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Transaction[];
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore invalid storage
    }
  }

  window.localStorage.setItem(TRANSACTION_KEY, JSON.stringify(demoTransactions));
  return demoTransactions;
}

export function setTransactions(transactions: Transaction[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TRANSACTION_KEY, JSON.stringify(transactions));
}

export function addTransaction(transaction: Transaction) {
  const current = getTransactions();
  const updated = [transaction, ...current].slice(0, 20);
  setTransactions(updated);
}

export function formatCurrency(value: number, currency = "BDT") {
  const symbols: Record<string, string> = {
    BDT: "৳",
    THB: "฿",
    USD: "$",
    SGD: "S$",
  };

  const symbol = symbols[currency] ?? currency;
  return `${symbol}${new Intl.NumberFormat("en-US").format(value)}`;
}

export function getWalletOptions(country: string) {
  const map: Record<string, { name: string; code: string; fee: string }[]> = {
    Bangladesh: [
      { name: "bKash", code: "BK", fee: "1.5%" },
      { name: "Nagad", code: "NG", fee: "1.5%" },
      { name: "Rocket", code: "RK", fee: "1.8%" },
      { name: "Upay", code: "UP", fee: "1.4%" },
    ],
    Thailand: [
      { name: "PromptPay", code: "PP", fee: "0.5%" },
      { name: "TrueMoney", code: "TM", fee: "0.8%" },
      { name: "KBank", code: "KB", fee: "1.0%" },
      { name: "SCB", code: "SC", fee: "0.6%" },
    ],
    Singapore: [
      { name: "PayNow", code: "PN", fee: "0.8%" },
      { name: "Bank Transfer", code: "BT", fee: "0.7%" },
      { name: "GrabPay", code: "GP", fee: "1.2%" },
    ],
    default: [
      { name: "Bank Transfer", code: "BT", fee: "0.9%" },
      { name: "Wallet Transfer", code: "WT", fee: "1.1%" },
      { name: "Cash Deposit", code: "CD", fee: "0.0%" },
    ],
  };

  return map[country] ?? map.default;
}

export function submitUserUpdate(userId: string, updates: Partial<BankUser>) {
  const users = getUsers();
  const updated = users.map((user) => (user.id === userId ? { ...user, ...updates } : user));
  setUsers(updated);
  return updated.find((user) => user.id === userId) ?? null;
}

export function addNewUser(user: BankUser) {
  const users = getUsers();
  const nextUsers = [user, ...users];
  setUsers(nextUsers);
  return user;
}

export function getAdminAccess() {
  if (typeof window === "undefined") return false;
  const adminUser = getCurrentUser();
  return !!adminUser && adminUser.role === "admin";
}
