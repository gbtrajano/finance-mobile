"use client";
import { logoutAction } from "./login/actions";
import { useState } from "react";
import {
  Wallet,
  Bell,
  Search,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Transaction } from "../../lib/types";
import TransactionForm from "../../components/TransactionForm";
import TransactionList from "../../components/TransactionList";
import FinanceChart from "../../components/FinanceChart";
import SummaryCards from "../../components/SummaryCards";

interface HomeClientProps {
  transactions: Transaction[];
  summary: { balance: number; totalIncome: number; totalExpense: number };
}

export default function HomeClient({ transactions, summary }: HomeClientProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020617]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-24 flex-col items-center py-8 border-r border-white/5 bg-slate-950/20 backdrop-blur-3xl sticky top-0 h-screen">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-12">
          <Wallet size={24} className="text-white" />
        </div>

        <nav className="flex-1 flex flex-col gap-8">
          <button className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <LayoutDashboard size={24} />
          </button>
          <button className="p-3 rounded-2xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
            <Settings size={24} />
          </button>
        </nav>

        <button 
          onClick={() => logoutAction()}
          className="p-3 rounded-2xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all mt-auto"
        >
          <LogOut size={24} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black premium-gradient-text tracking-tighter">
              Olá, Gabriel Trajano
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold mt-1">
              <span>Dashboard</span>
              <ChevronRight size={14} />
              <span className="text-slate-400">Visão Geral</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 px-5 py-3 bg-slate-950/50 rounded-2xl border border-white/5 w-80 group focus-within:border-blue-500/30 transition-all">
              <Search
                size={18}
                className="text-slate-500 group-focus-within:text-blue-400"
              />
              <input
                type="text"
                placeholder="Pesquisar transações..."
                className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder-slate-600 w-full"
              />
            </div>
          </div>
        </header>

        <SummaryCards
          balance={summary.balance}
          totalIncome={summary.totalIncome}
          totalExpense={summary.totalExpense}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            <FinanceChart transactions={transactions} />
            <TransactionList
              transactions={transactions}
              onEdit={(t) => setEditingTransaction(t)}
            />
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <TransactionForm
              editingTransaction={editingTransaction}
              onCancelEdit={() => setEditingTransaction(null)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
