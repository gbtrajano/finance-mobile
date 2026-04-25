"use client";

import { useState, useMemo } from "react";
import { Transaction, Category } from "../lib/types";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
    format, startOfWeek, endOfWeek, eachDayOfInterval, subDays,
    startOfMonth, endOfMonth, eachMonthOfInterval, subMonths,
    isWithinInterval, parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingDown, Trophy, CalendarDays, BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface Props {
    transactions: Transaction[];
    categories: Category[];
}

type PeriodFilter = "week" | "month" | "custom";

const PIE_COLORS = ["#10b981", "#f43f5e"];

export default function AnalyticsView({ transactions, categories }: Props) {
    const [period, setPeriod] = useState<PeriodFilter>("month");
    const [chartType, setChartType] = useState<"bar" | "pie">("bar");
    const [customStart, setCustomStart] = useState<string>(
        format(subDays(new Date(), 30), "yyyy-MM-dd")
    );
    const [customEnd, setCustomEnd] = useState<string>(
        format(new Date(), "yyyy-MM-dd")
    );

    const now = new Date();

    // --- Intervalo de datas baseado no filtro ---
    const { rangeStart, rangeEnd } = useMemo(() => {
        if (period === "week") {
            return { rangeStart: startOfWeek(now, { weekStartsOn: 0 }), rangeEnd: endOfWeek(now, { weekStartsOn: 0 }) };
        }
        if (period === "month") {
            return { rangeStart: startOfMonth(now), rangeEnd: endOfMonth(now) };
        }
        // custom
        return {
            rangeStart: parseISO(customStart),
            rangeEnd: parseISO(customEnd),
        };
    }, [period, customStart, customEnd]);

    // Transações dentro do intervalo
    const filteredTx = useMemo(() =>
        transactions.filter((t) => {
            const d = new Date(t.transaction_date);
            return d >= rangeStart && d <= rangeEnd;
        }),
        [transactions, rangeStart, rangeEnd]
    );

    const expenses = filteredTx.filter((t) => t.type === "expense");
    const totalExpenseInPeriod = expenses.reduce((s, t) => s + Number(t.amount), 0);

    // --- Categorias mais gastas ---
    const categoryRanking = useMemo(() => {
        const map = new Map<string, { name: string; icon: string; total: number }>();
        expenses.forEach((t) => {
            const key = t.category_id || "__none__";
            const name = t.category?.name ?? "Sem categoria";
            const icon = t.category?.icon ?? "📦";
            const prev = map.get(key) ?? { name, icon, total: 0 };
            map.set(key, { ...prev, total: prev.total + Number(t.amount) });
        });
        return Array.from(map.values())
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [expenses]);

    const maxCategory = categoryRanking[0]?.total ?? 1;

    // --- Maiores gastos individuais ---
    const topExpenses = useMemo(() =>
        [...expenses]
            .sort((a, b) => Number(b.amount) - Number(a.amount))
            .slice(0, 10),
        [expenses]
    );

    // --- Dados do gráfico ---
    const barData = useMemo(() => {
        if (period === "week") {
            const days = eachDayOfInterval({ start: subDays(now, 6), end: now });
            return days.map((day) => {
                const s = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
                const e = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);
                const inRange = transactions.filter((t) =>
                    isWithinInterval(new Date(t.transaction_date), { start: s, end: e })
                );
                return {
                    name: format(day, "EEE", { locale: ptBR }).replace(".", "").toUpperCase(),
                    receitas: inRange.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
                    despesas: inRange.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
                };
            });
        }
        if (period === "month") {
            const months = eachMonthOfInterval({ start: subMonths(now, 5), end: now });
            return months.map((month) => {
                const s = startOfMonth(month);
                const e = endOfMonth(month);
                const inRange = transactions.filter((t) =>
                    isWithinInterval(new Date(t.transaction_date), { start: s, end: e })
                );
                return {
                    name: format(month, "MMM", { locale: ptBR }).replace(".", "").toUpperCase(),
                    receitas: inRange.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
                    despesas: inRange.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
                };
            });
        }
        // custom — daily breakdown
        const start = rangeStart;
        const end = rangeEnd;
        const days = eachDayOfInterval({ start, end }).slice(0, 60);
        return days.map((day) => {
            const s = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
            const e = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);
            const inRange = transactions.filter((t) =>
                isWithinInterval(new Date(t.transaction_date), { start: s, end: e })
            );
            return {
                name: format(day, "dd/MM"),
                receitas: inRange.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
                despesas: inRange.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
            };
        });
    }, [period, transactions, rangeStart, rangeEnd]);

    const totalIncome = filteredTx.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const pieData = [
        { name: "Receitas", value: totalIncome },
        { name: "Despesas", value: totalExpenseInPeriod },
    ];

    const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return (
        <div className="space-y-6 pb-8">
            {/* Filtro de período - Centered or full width */}
            <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-1">
                    <CalendarDays size={20} className="text-[#8e8e93]" />
                    <h2 className="text-lg font-bold text-[#f2f2f7]">Filtro de período</h2>
                </div>
                <p className="text-sm text-[#8e8e93] mb-5">Escolha como visualizar seus dados</p>

                <div className="flex flex-wrap gap-2">
                    {(["week", "month", "custom"] as PeriodFilter[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border ${period === p
                                ? "bg-[#2c2c31] border-white/15 text-[#f2f2f7]"
                                : "border-white/5 text-[#636366] hover:text-[#aeaeb2]"
                                }`}
                        >
                            {p === "week" ? "Semanal" : p === "month" ? "Mensal" : "Personalizado"}
                        </button>
                    ))}
                </div>

                {period === "custom" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8e8e93] block mb-2 px-1">
                                Data início
                            </label>
                            <input
                                type="date"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                className="glass-input w-full px-4 py-3 rounded-2xl text-sm [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8e8e93] block mb-2 px-1">
                                Data fim
                            </label>
                            <input
                                type="date"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                className="glass-input w-full px-4 py-3 rounded-2xl text-sm [color-scheme:dark]"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Gráfico - Main area on desktop */}
                <div className="lg:col-span-8 glass-card rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-[#f2f2f7]">Fluxo de Caixa</h2>
                        <div className="flex gap-1 p-1 bg-[#2c2c31] rounded-2xl">
                            <button
                                onClick={() => setChartType("bar")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${chartType === "bar" ? "bg-[#3a3a3f] text-white" : "text-[#636366]"}`}
                            >
                                <BarChart3 size={13} /> Barras
                            </button>
                            <button
                                onClick={() => setChartType("pie")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${chartType === "pie" ? "bg-[#3a3a3f] text-white" : "text-[#636366]"}`}
                            >
                                <PieChartIcon size={13} /> Pizza
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-[320px]">
                        {chartType === "bar" ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="name" stroke="#636366" fontSize={10} tickLine={false} axisLine={false} dy={8} fontWeight={700} />
                                    <YAxis stroke="#636366" fontSize={10} tickFormatter={(v) => `R$${v}`} tickLine={false} axisLine={false} fontWeight={700} />
                                    <Tooltip
                                        cursor={{ fill: "#ffffff05" }}
                                        contentStyle={{ backgroundColor: "#1c1c1f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "10px 14px" }}
                                        itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                                        labelStyle={{ color: "#8e8e93", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}
                                        formatter={(value: any) => [`R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, ""]}
                                    />
                                    <Bar dataKey="receitas" fill="#10b981" radius={[6, 6, 0, 0]} name="Receitas" barSize={22} />
                                    <Bar dataKey="despesas" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Despesas" barSize={22} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="relative flex items-center justify-center h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={120} innerRadius={85} dataKey="value" stroke="none" paddingAngle={2}>
                                            {pieData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "#1c1c1f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px" }}
                                            formatter={(value: any) => [`R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <p className="text-[#8e8e93] text-[10px] font-black uppercase tracking-widest">Total</p>
                                    <p className="text-white text-xl font-black tracking-tight">
                                        {fmt(totalIncome + totalExpenseInPeriod)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Categorias que mais gastou - Sidebar on desktop */}
                <div className="lg:col-span-4 glass-card rounded-3xl p-6 h-full">
                    <div className="flex items-start gap-3 mb-2">
                        <TrendingDown size={22} className="text-rose-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h2 className="text-lg font-bold text-[#f2f2f7] leading-tight">Categorias</h2>
                            <p className="text-sm text-[#8e8e93] mt-0.5">Ranking de gastos</p>
                        </div>
                    </div>

                    {categoryRanking.length === 0 ? (
                        <p className="text-[#636366] text-sm text-center py-10">Nenhuma despesa</p>
                    ) : (
                        <div className="space-y-4 mt-6">
                            {categoryRanking.map((cat, i) => (
                                <div key={i} className="bg-[#2c2c31] rounded-2xl p-4 transition-all hover:bg-[#34343a]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-[#f2f2f7] truncate mr-2">
                                            #{i + 1} {cat.icon} {cat.name}
                                        </span>
                                        <span className="text-sm font-black text-rose-400 flex-shrink-0">{fmt(cat.total)}</span>
                                    </div>
                                    <div className="progress-bar-track mt-2.5">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${(cat.total / maxCategory) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Maiores gastos - Full width on desktop or bottom grid */}
                <div className="lg:col-span-12 glass-card rounded-3xl p-6">
                    <div className="flex items-start gap-3 mb-6">
                        <Trophy size={22} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h2 className="text-lg font-bold text-[#f2f2f7] leading-tight">Maiores gastos (maior para menor)</h2>
                            <p className="text-sm text-[#8e8e93] mt-0.5">Top 10 registros do período</p>
                        </div>
                    </div>

                    {topExpenses.length === 0 ? (
                        <p className="text-[#636366] text-sm text-center py-10">Nenhum registro</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {topExpenses.map((t, i) => (
                                <div key={t.id} className="bg-[#2c2c31] rounded-2xl p-4 transition-all hover:bg-[#34343a]">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold text-[#f2f2f7] truncate mr-2">#{i + 1} {t.title}</span>
                                        <span className="text-sm font-black text-rose-400 flex-shrink-0">{fmt(Number(t.amount))}</span>
                                    </div>
                                    <p className="text-xs text-[#8e8e93]">
                                        {t.category?.name ?? "Sem categoria"} · {format(new Date(t.transaction_date), "dd/MM/yyyy", { locale: ptBR })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
