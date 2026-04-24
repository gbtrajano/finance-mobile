import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface Props {
    balance: number
    totalIncome: number
    totalExpense: number
}

export default function SummaryCards({ balance, totalIncome, totalExpense }: Props) {
    const formatCurrency = (value: number) =>
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const cards = [
        {
            label: 'Saldo Total',
            value: formatCurrency(balance),
            color: balance >= 0 ? 'text-blue-400' : 'text-red-400',
            icon: <Wallet className={balance >= 0 ? 'text-blue-400' : 'text-red-400'} size={24} />,
            gradient: balance >= 0 ? 'from-blue-500/20' : 'from-red-500/20',
        },
        {
            label: 'Total Receitas',
            value: formatCurrency(totalIncome),
            color: 'text-emerald-400',
            icon: <TrendingUp className="text-emerald-400" size={24} />,
            gradient: 'from-emerald-500/20',
        },
        {
            label: 'Total Despesas',
            value: formatCurrency(totalExpense),
            color: 'text-rose-400',
            icon: <TrendingDown className="text-rose-400" size={24} />,
            gradient: 'from-rose-500/20',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className="glass-card group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] hover:bg-slate-900/60"
                >
                    <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${card.gradient} to-transparent opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40`} />
                    
                    <div className="relative flex flex-col gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">{card.label}</p>
                            <p className={`text-3xl font-extrabold tracking-tight mt-1 ${card.color}`}>
                                {card.value}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}