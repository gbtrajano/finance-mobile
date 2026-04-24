import { getTransactions, getSummary } from '../../lib/actions'
import HomeClient from './home-client'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0

export default async function Home() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth_token");

  if (!authCookie) {
    redirect("/login");
  }

  const [transactions, summary] = await Promise.all([
    getTransactions(),
    getSummary(),
  ])

  return <HomeClient transactions={transactions} summary={summary} />
}