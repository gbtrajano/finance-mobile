'use client'

import { Transaction, Category } from '../lib/types'
import { deleteTransaction } from '../lib/actions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2, Edit2, ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react'
import { useState } from 'react'

interface Props {
    transactions: Transaction[]
    onEdit: (t: Transaction) => void
    categories: Category[]
}

export default function TransactionList({ transactions, onEdit, categories }: Props) {
    const [deleting, setDeleting] = useState<string | null>(null)
    const [filterCategory, setFilterCategory] = useState<string>('all')

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return
        setDeleting(id)
        try {
            await deleteTransaction(id)
        } catch {
            alert('Erro ao excluir')
        } finally {
            setDeleting(null)
        }
    }

    const filtered = filterCategory === 'all'
        ? transactions
        : transactions.filter(t => t.category_id === filterCategory)

    if (transactions.length === 0) {
        return (
            <div className="glass-card rounded-[2rem] p-12 text-center">
                <div className="mx-auto w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-5 border border-white/10">
                    <Search className="text-[#636366]" size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sem registros</h3>
                <p className="text-[#8e8e93] text-sm max-w-[200px] mx-auto">Adicione transações para ver sua atividade aqui.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-bold text-[#f2f2f7]">Atividade Recente</h3>
            </div>

            {/* Filtro por categoria Horizontal scrollable */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setFilterCategory('all')}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${filterCategory === 'all'
                        ? 'bg-[#2c2c31] border-white/15 text-[#f2f2f7]'
                        : 'border-white/5 text-[#636366] hover:text-[#aeaeb2]'
                        }`}
                >
                    Todas
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setFilterCategory(filterCategory === cat.id ? 'all' : cat.id)}
                        className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border"
                        style={{
                            backgroundColor: filterCategory === cat.id ? cat.color + '22' : 'transparent',
                            borderColor: filterCategory === cat.id ? cat.color + '60' : 'rgba(255,255,255,0.05)',
                            color: filterCategory === cat.id ? cat.color : '#636366',
                        }}
                    >
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filtered.map((t) => (
                    <div
                        key={t.id}
                        className="glass-card rounded-2xl p-4 group transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            {/* Icon Container */}
                            <div className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center border ${t.type === 'income' 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                {t.type === 'income' ? <ArrowUpCircle size={22} /> : <ArrowDownCircle size={22} />}
                            </div>

                            {/* Middle Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-[#f2f2f7] truncate">{t.title}</h4>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                                    <span className="text-[10px] font-medium text-[#8e8e93] uppercase tracking-wider whitespace-nowrap">
                                        {format(new Date(t.transaction_date), "dd MMM, HH:mm", { locale: ptBR })}
                                    </span>
                                    {t.category && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border" 
                                            style={{ 
                                                backgroundColor: t.category.color + '15', 
                                                color: t.category.color,
                                                borderColor: t.category.color + '30'
                                            }}>
                                            {t.category.icon} {t.category.name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Amount & Actions */}
                            <div className="flex flex-col items-end gap-1 ml-2">
                                <span className={`text-sm sm:text-base font-black tracking-tight whitespace-nowrap ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                
                                <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(t)}
                                        className="p-1.5 rounded-lg bg-white/5 md:bg-transparent hover:bg-white/10 text-[#8e8e93] hover:text-white transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        disabled={deleting === t.id}
                                        className="p-1.5 rounded-lg bg-white/5 md:bg-transparent hover:bg-rose-500/10 text-[#8e8e93] hover:text-rose-400 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-8 text-[#636366] text-xs font-medium">
                    Nenhuma transação nesta categoria.
                </div>
            )}
        </div>
    )
}