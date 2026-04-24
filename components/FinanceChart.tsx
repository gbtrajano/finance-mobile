'use client'

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
} from 'recharts'
import { Transaction } from '../lib/types'
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react'

interface Props {
    transactions: Transaction[]
}

const COLORS = ['#10b981', '#f43f5e']

export default function FinanceChart({ transactions }: Props) {
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar')

    const now = new Date()
    const months = eachMonthOfInterval({
        start: subMonths(now, 5),
        end: now,
    })

    const chartData = months.map((month) => {
        const monthStart = startOfMonth(month)
        const monthEnd = endOfMonth(month)

        const filtered = transactions.filter((t) =>
            isWithinInterval(new Date(t.transaction_date), { start: monthStart, end: monthEnd })
        )

        const income = filtered
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0)

        const expense = filtered
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0)

        return {
            name: format(month, 'MMM', { locale: ptBR }).replace('.', '').toUpperCase(),
            receitas: income,
            despesas: expense,
        }
    })

    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const pieData = [
        { name: 'Receitas', value: totalIncome },
        { name: 'Despesas', value: totalExpense },
    ]

    return (
        <div className="glass-card rounded-[2rem] p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold premium-gradient-text flex items-center gap-3">
                        Análise de Fluxo
                    </h2>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Visão detalhada do seu patrimônio</p>
                </div>
                <div className="flex gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                    <button
                        onClick={() => setChartType('bar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${chartType === 'bar' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <BarChart3 size={14} /> BARRAS
                    </button>
                    <button
                        onClick={() => setChartType('pie')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${chartType === 'pie' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <PieChartIcon size={14} /> PIZZA
                    </button>
                </div>
            </div>

            <div className="w-full h-[350px]">
                {chartType === 'bar' ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
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
                                cursor={{ fill: '#ffffff05' }}
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    padding: '12px 16px',
                                }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                            />
                            <Legend 
                                verticalAlign="top" 
                                align="right" 
                                iconType="circle"
                                wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            />
                            <Bar dataKey="receitas" fill="#10b981" radius={[8, 8, 0, 0]} name="Receitas" barSize={32} />
                            <Bar dataKey="despesas" fill="#f43f5e" radius={[8, 8, 0, 0]} name="Despesas" barSize={32} />
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
                                    outerRadius={120}
                                    innerRadius={80}
                                    dataKey="value"
                                    stroke="none"
                                    paddingAngle={8}
                                >
                                    {pieData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total</p>
                            <p className="text-white text-xl font-black tracking-tighter">
                                R$ {(totalIncome + totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}