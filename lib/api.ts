import { supabase } from "./supabase";
import { BankUser, Transaction } from "./bank-demo";
import { mapProfile } from "./profiles";

export async function loadSession(): Promise<BankUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data ? mapProfile(data) : null;
}

export async function loadTransactions(): Promise<Transaction[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("transactions").select("*").eq("user_id", user.id)
    .order("created_at", { ascending: false }).limit(20);
  return (data ?? []).map((t: any) => ({
    id: t.id,
    type: t.type,
    title: t.title,
    amount: Number(t.amount),
    currency: t.currency,
    method: t.method ?? "",
    status: t.status,
    date: String(t.created_at).slice(0, 10),
    counterparty: t.counterparty ?? undefined,
  }));
}

export async function logout() {
  await supabase.auth.signOut();
}
