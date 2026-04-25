import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface Props {
    balance: number
    totalIncome: number
    totalExpense: number
}

export default function SummaryCards({ balance, totalIncome, totalExpense }: Props) {
    const formatCurrency = (value: number) =>
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    return (
        <div className="grid grid-cols-3 gap-3">
            {/* Saldo Total */}
            <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-[120px] relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-blue-500/10 blur-xl" />
                <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mb-3">
                        <Wallet size={15} className={balance >= 0 ? 'text-blue-400' : 'text-red-400'} />
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] leading-none mb-1.5">Saldo Total</p>
                    <p className={`text-[13px] sm:text-base font-black tracking-tighter leading-tight truncate ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                        {formatCurrency(balance)}
                    </p>
                </div>
            </div>

            {/* Total Receitas */}
            <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-[120px] relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-emerald-500/10 blur-xl" />
                <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-3">
                        <TrendingUp size={15} className="text-emerald-400" />
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] leading-none mb-1.5">Receitas</p>
                    <p className="text-[13px] sm:text-base font-black tracking-tighter leading-tight truncate text-emerald-400">
                        {formatCurrency(totalIncome)}
                    </p>
                </div>
            </div>

            {/* Total Despesas */}
            <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-[120px] relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-rose-500/10 blur-xl" />
                <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center mb-3">
                        <TrendingDown size={15} className="text-rose-400" />
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] leading-none mb-1.5">Despesas</p>
                    <p className="text-[13px] sm:text-base font-black tracking-tighter leading-tight truncate text-rose-400">
                        {formatCurrency(totalExpense)}
                    </p>
                </div>
            </div>
        </div>
    )
}