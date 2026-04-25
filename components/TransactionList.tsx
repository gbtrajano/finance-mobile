'use client'

import { Transaction, Category } from '../lib/types'
import { deleteTransaction } from '../lib/actions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2, Edit2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
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
            <div className="glass-card rounded-[2rem] p-16 text-center">
                <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                    <Trash2 className="text-slate-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sem registros ainda</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Comece a organizar sua vida financeira adicionando sua primeira transação.</p>
            </div>
        )
    }

    return (
        <div className="glass-card rounded-[2rem] overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold premium-gradient-text">Atividade Recente</h3>
                {/* Filtro por categoria na lista */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setFilterCategory('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${filterCategory === 'all'
                            ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                            : 'border-white/10 text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        Todas
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilterCategory(filterCategory === cat.id ? 'all' : cat.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border"
                            style={{
                                backgroundColor: filterCategory === cat.id ? cat.color + '22' : 'transparent',
                                borderColor: filterCategory === cat.id ? cat.color + '60' : 'rgba(255,255,255,0.08)',
                                color: filterCategory === cat.id ? cat.color : '#64748b',
                            }}
                        >
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-950/20">
                            <th className="text-left px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Detalhes</th>
                            <th className="text-left px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden md:table-cell">Categoria</th>
                            <th className="text-center px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tipo</th>
                            <th className="text-right px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Valor</th>
                            <th className="text-center px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.map((t) => (
                            <tr
                                key={t.id}
                                className="group hover:bg-white/[0.02] transition-all duration-300"
                            >
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">
                                            {t.title}
                                        </span>
                                        <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wider mt-1">
                                            {format(new Date(t.transaction_date), "dd MMM, HH:mm", { locale: ptBR })}
                                        </span>
                                        {/* Categoria visível apenas no mobile */}
                                        {t.category && (
                                            <span
                                                className="md:hidden mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold w-fit"
                                                style={{
                                                    backgroundColor: t.category.color + '22',
                                                    color: t.category.color,
                                                    border: `1px solid ${t.category.color}44`,
                                                }}
                                            >
                                                {t.category.icon} {t.category.name}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5 hidden md:table-cell">
                                    {t.category ? (
                                        <span
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                                            style={{
                                                backgroundColor: t.category.color + '22',
                                                color: t.category.color,
                                                border: `1px solid ${t.category.color}44`,
                                            }}
                                        >
                                            {t.category.icon} {t.category.name}
                                        </span>
                                    ) : (
                                        <span className="text-slate-600 text-xs italic">Sem categoria</span>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex justify-center">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${t.type === 'income'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                }`}
                                        >
                                            {t.type === 'income' ? <ArrowUpCircle size={12} /> : <ArrowDownCircle size={12} />}
                                            {t.type === 'income' ? 'Crédito' : 'Débito'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <span
                                        className={`font-black text-lg tracking-tighter ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                                            }`}
                                    >
                                        {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => onEdit(t)}
                                            className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/10 transition-all"
                                            title="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            disabled={deleting === t.id}
                                            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/10 transition-all disabled:opacity-50"
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-slate-500 text-sm">
                        Nenhuma transação encontrada para esta categoria.
                    </div>
                )}
            </div>
        </div>
    )
}