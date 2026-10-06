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

export const demoUsers: BankUser[] = [];

export const demoTransactions: Transaction[] = [];

export function getUsers(): BankUser[] {
  if (typeof window === "undefined") return demoUsers;

  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as BankUser[];
      if (Array.isArray(parsed)) {
        const migrated = parsed.filter((user) => !["user-001", "user-002", "admin-001"].includes(user.id) && user.role !== "admin").map((user) => ({
          ...user,
          email: user.email.replace(/@siamheritagebank\.com$/i, "@thaipattana.example"),
        })).filter((user) => user.role !== "admin");

        if (JSON.stringify(migrated) !== JSON.stringify(parsed)) {
          window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(migrated));
        }

        return migrated;
      }
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
      if (Array.isArray(parsed)) {
        const sampleTransactionIds = ["tx-101", "tx-102", "tx-103", "tx-104"];
        const cleaned = parsed.filter((transaction) => !sampleTransactionIds.includes(transaction.id));
        if (cleaned.length !== parsed.length) {
          window.localStorage.setItem(TRANSACTION_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      }
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
      { name: "bKash", code: "BK", fee: "Not connected" },
      { name: "Nagad", code: "NG", fee: "Not connected" },
      { name: "Rocket", code: "RK", fee: "Not connected" },
      { name: "Upay", code: "UP", fee: "Not connected" },
    ],
    Thailand: [
      { name: "PromptPay", code: "PP", fee: "Not connected" },
      { name: "TrueMoney", code: "TM", fee: "Not connected" },
      { name: "KBank", code: "KB", fee: "Not connected" },
      { name: "SCB", code: "SC", fee: "Not connected" },
    ],
    Singapore: [
      { name: "PayNow", code: "PN", fee: "Not connected" },
      { name: "Bank Transfer", code: "BT", fee: "Not connected" },
      { name: "GrabPay", code: "GP", fee: "Not connected" },
    ],
    default: [
      { name: "Bank Transfer", code: "BT", fee: "Not connected" },
      { name: "Wallet Transfer", code: "WT", fee: "Not connected" },
      { name: "Cash Deposit", code: "CD", fee: "Not connected" },
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
