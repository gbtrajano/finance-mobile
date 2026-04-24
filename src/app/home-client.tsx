'use client'

import { useState } from 'react'
import { Wallet, Bell, Search, User, LayoutDashboard, Settings, LogOut, ChevronRight } from 'lucide-react'
import { Transaction } from '../../lib/types'
import TransactionForm from '../../components/TransactionForm'
import TransactionList from '../../components/TransactionList'
import FinanceChart from '../../components/FinanceChart'
import SummaryCards from '../../components/SummaryCards'

interface HomeClientProps {
  transactions: Transaction[]
  summary: { balance: number; totalIncome: number; totalExpense: number }
}

export default function HomeClient({ transactions, summary }: HomeClientProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

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

        <button className="p-3 rounded-2xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all mt-auto">
          <LogOut size={24} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black premium-gradient-text tracking-tighter">
              Olá, Investidor
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold mt-1">
              <span>Dashboard</span>
              <ChevronRight size={14} />
              <span className="text-slate-400">Visão Geral</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 px-5 py-3 bg-slate-950/50 rounded-2xl border border-white/5 w-80 group focus-within:border-blue-500/30 transition-all">
              <Search size={18} className="text-slate-500 group-focus-within:text-blue-400" />
              <input 
                type="text" 
                placeholder="Pesquisar transações..." 
                className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder-slate-600 w-full"
              />
            </div>
            
            <button className="relative p-3 rounded-2xl bg-slate-950/50 border border-white/5 text-slate-400 hover:text-white transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617]" />
            </button>

            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-0.5 flex items-center justify-center cursor-pointer hover:scale-105 transition-all">
              <div className="h-full w-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                <User size={20} className="text-blue-400" />
              </div>
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
            
            {/* Promo/Card Visual Only */}
            <div className="mt-8 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
              <h4 className="text-white font-black text-xl mb-2 relative">Upgrade Pro</h4>
              <p className="text-indigo-100 text-sm mb-6 relative">Acesse análises avançadas e relatórios de exportação.</p>
              <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-all relative">
                Saber Mais
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
