import { getTransactions, getSummary, getCategories } from '../../lib/actions'
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

  const [transactions, summary, categories] = await Promise.all([
    getTransactions(),
    getSummary(),
    getCategories(),
  ])

  return <HomeClient transactions={transactions} summary={summary} categories={categories} />
}