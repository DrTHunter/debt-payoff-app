import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: debts } = await supabase
    .from("debts")
    .select("*")
    .order("balance", { ascending: true });

  const { data: history } = await supabase
    .from("payment_history")
    .select("*")
    .order("paid_on", { ascending: false })
    .limit(50);

  return (
    <DashboardClient
      email={user.email ?? ""}
      initialDebts={debts ?? []}
      initialHistory={history ?? []}
    />
  );
}
