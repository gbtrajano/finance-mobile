"use client";
import { logoutAction } from "./login/actions";
import { useState } from "react";
import { LogOut, Settings, ChevronRight } from "lucide-react";
import { Transaction, Category } from "../../lib/types";
import TransactionForm from "../../components/TransactionForm";
import TransactionList from "../../components/TransactionList";
import SummaryCards from "../../components/SummaryCards";
import CategoryManager from "../../components/CategoryManager";
import AnalyticsView from "../../components/AnalyticsView";

interface HomeClientProps {
    transactions: Transaction[];
    summary: { balance: number; totalIncome: number; totalExpense: number };
    categories: Category[];
}

export default function HomeClient({ transactions, summary, categories }: HomeClientProps) {
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [activeTab, setActiveTab] = useState<"dashboard" | "analytics">("dashboard");

    return (
        <div className="min-h-screen bg-[#111114]">
            {/* Responsive layout wrapper */}
            <div className="w-full max-w-md md:max-w-5xl lg:max-w-7xl mx-auto px-4 pt-8 pb-24 transition-all duration-500">

                {/* Header */}
                <header className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-[#f2f2f7] tracking-tighter">
                            Olá, Gabriel Trajano
                        </h1>
                        <div className="flex items-center gap-1 text-[#8e8e93] text-sm font-semibold mt-1">
                            <span>Dashboard</span>
                            <ChevronRight size={14} className="opacity-50" />
                            <span className="text-[#aeaeb2]">
                                {activeTab === "dashboard" ? "Visão Geral" : "Análise"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowCategoryManager(true)}
                            className="w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center bg-[#1c1c1f] border border-white/5 active:scale-95 transition-all hover:bg-[#2c2c31]"
                            title="Categorias"
                        >
                            <Settings size={20} className="text-[#8e8e93]" />
                        </button>
                        <button
                            onClick={() => logoutAction()}
                            className="w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center bg-[#1c1c1f] border border-white/5 active:scale-95 transition-all hover:bg-[#2c2c31]"
                            title="Sair"
                        >
                            <LogOut size={20} className="text-[#8e8e93]" />
                        </button>
                    </div>
                </header>

                {/* Tab Bar / Switcher - Centered on desktop */}
                <div className="flex justify-center md:justify-start mb-8">
                    <div className="flex w-full md:w-auto gap-2 p-1.5 rounded-[1.25rem] bg-[#1c1c1f] border border-white/5 shadow-inner">
                        <button
                            onClick={() => setActiveTab("dashboard")}
                            className={`flex-1 md:flex-none md:min-w-[140px] py-3 px-6 rounded-[0.9rem] text-sm font-black transition-all duration-300 ${activeTab === "dashboard"
                                ? "bg-[#2c2c31] text-white shadow-lg"
                                : "text-[#636366] hover:text-[#aeaeb2]"
                                }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab("analytics")}
                            className={`flex-1 md:flex-none md:min-w-[140px] py-3 px-6 rounded-[0.9rem] text-sm font-black transition-all duration-300 ${activeTab === "analytics"
                                ? "bg-[#2c2c31] text-white shadow-lg"
                                : "text-[#636366] hover:text-[#aeaeb2]"
                                }`}
                        >
                            Análise
                        </button>
                    </div>
                </div>

                {/* Summary Cards — Responsive Grid */}
                <div className="mb-8">
                    <SummaryCards
                        balance={summary.balance}
                        totalIncome={summary.totalIncome}
                        totalExpense={summary.totalExpense}
                    />
                </div>

                {/* Dashboard View */}
                {activeTab === "dashboard" && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Transaction List - Main area on desktop */}
                        <div className="order-2 md:order-1 md:col-span-7 lg:col-span-8">
                            <TransactionList
                                transactions={transactions}
                                onEdit={(t) => setEditingTransaction(t)}
                                categories={categories}
                            />
                        </div>

                        {/* Transaction Form - Sidebar on desktop */}
                        <div className="order-1 md:order-2 md:col-span-5 lg:col-span-4 md:sticky md:top-8">
                            <TransactionForm
                                editingTransaction={editingTransaction}
                                onCancelEdit={() => setEditingTransaction(null)}
                                categories={categories}
                                onManageCategories={() => setShowCategoryManager(true)}
                            />
                        </div>
                    </div>
                )}

                {/* Analytics View */}
                {activeTab === "analytics" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <AnalyticsView
                            transactions={transactions}
                            categories={categories}
                        />
                    </div>
                )}
            </div>

            {/* Modal de categorias */}
            {showCategoryManager && (
                <CategoryManager
                    categories={categories}
                    onClose={() => setShowCategoryManager(false)}
                />
            )}
        </div>
    );
}
