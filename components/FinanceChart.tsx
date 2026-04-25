"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Transaction, Category } from "../lib/types";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

const PIE_COLORS = ["#10b981", "#f43f5e"];

type PeriodFilter = "month" | "week";

export default function FinanceChart({ transactions, categories }: Props) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [period, setPeriod] = useState<PeriodFilter>("month");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const now = new Date();

  // Filtrar por categoria
  const filteredByCategory =
    selectedCategory === "all"
      ? transactions
      : transactions.filter((t) => t.category_id === selectedCategory);

  // --- Dados do Gráfico de Barras ---
  let barData: { name: string; receitas: number; despesas: number }[] = [];

  if (period === "month") {
    const months = eachMonthOfInterval({ start: subMonths(now, 5), end: now });
    barData = months.map((month) => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      const inRange = filteredByCategory.filter((t) =>
        isWithinInterval(new Date(t.transaction_date), { start, end })
      );
      return {
        name: format(month, "MMM", { locale: ptBR }).replace(".", "").toUpperCase(),
        receitas: inRange.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
        despesas: inRange.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
      };
    });
  } else {
    // Semana: últimos 7 dias, um ponto por dia
    const days = eachDayOfInterval({ start: subDays(now, 6), end: now });
    barData = days.map((day) => {
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
      const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);
      const inRange = filteredByCategory.filter((t) =>
        isWithinInterval(new Date(t.transaction_date), { start, end })
      );
      return {
        name: format(day, "EEE", { locale: ptBR }).replace(".", "").toUpperCase(),
        receitas: inRange.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
        despesas: inRange.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
      };
    });
  }

  // --- Dados do Gráfico de Pizza ---
  const totalIncome = filteredByCategory
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = filteredByCategory
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const pieData = [
    { name: "Receitas", value: totalIncome },
    { name: "Despesas", value: totalExpense },
  ];

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="glass-card rounded-[2rem] p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold premium-gradient-text">Análise de Fluxo</h2>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">
            Visão detalhada do seu patrimônio
          </p>
        </div>
        {/* Seletor de tipo de gráfico */}
        <div className="flex gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 shadow-inner">
          <button
            onClick={() => setChartType("bar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              chartType === "bar"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <BarChart3 size={14} /> BARRAS
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              chartType === "pie"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <PieChartIcon size={14} /> PIZZA
          </button>
        </div>
      </div>

      {/* Filtros de período e categoria */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Período */}
        <div className="flex gap-2 p-1 bg-slate-950/40 rounded-xl border border-white/5">
          <button
            onClick={() => setPeriod("month")}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
              period === "month"
                ? "bg-indigo-600 text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setPeriod("week")}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
              period === "week"
                ? "bg-indigo-600 text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Semana
          </button>
        </div>

        {/* Categoria */}
        <div className="relative flex-1">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 appearance-none cursor-pointer"
            style={{ paddingLeft: selectedCategoryObj ? "2.5rem" : undefined }}
          >
            <option value="all">📊 Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          {selectedCategoryObj && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">
              {selectedCategoryObj.icon}
            </span>
          )}
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full h-[300px]">
        {chartType === "bar" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
                fontWeight={700}
              />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                tickFormatter={(v) => `R$${v}`}
                tickLine={false}
                axisLine={false}
                fontWeight={700}
              />
              <Tooltip
                cursor={{ fill: "#ffffff05" }}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  padding: "12px 16px",
                }}
                itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                labelStyle={{
                  color: "#94a3b8",
                  marginBottom: "8px",
                  fontSize: "10px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
                formatter={(value: any) => [
                  `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                  "",
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{
                  paddingBottom: "20px",
                  fontSize: "10px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              />
              <Bar dataKey="receitas" fill="#10b981" radius={[8, 8, 0, 0]} name="Receitas" barSize={28} />
              <Bar dataKey="despesas" fill="#f43f5e" radius={[8, 8, 0, 0]} name="Despesas" barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={75}
                  dataKey="value"
                  stroke="none"
                  paddingAngle={1}
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                  formatter={(value: any) => [
                    `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total</p>
              <p className="text-white text-xl font-black tracking-tighter">
                R$ {(totalIncome + totalExpense).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
