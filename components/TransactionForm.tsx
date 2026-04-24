'use client'

import { useState, useEffect } from 'react'
import { createTransaction, updateTransaction } from '../lib/actions'
import { Transaction, TransactionFormData } from '../lib/types'
import { Plus, Save, X, Calendar, Clock, FileText, DollarSign } from 'lucide-react'

interface Props {
    editingTransaction?: Transaction | null
    onCancelEdit: () => void
}

const defaultState: TransactionFormData = {
    title: '',
    description: '',
    amount: 0,
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
}

export default function TransactionForm({ editingTransaction, onCancelEdit }: Props) {
    const [form, setForm] = useState<TransactionFormData>(defaultState)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (editingTransaction) {
            const d = new Date(editingTransaction.transaction_date)
            setForm({
                title: editingTransaction.title,
                description: editingTransaction.description || '',
                amount: Number(editingTransaction.amount),
                type: editingTransaction.type,
                date: d.toISOString().split('T')[0],
                time: d.toTimeString().slice(0, 5),
            })
        } else {
            setForm(defaultState)
        }
    }, [editingTransaction])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title || form.amount <= 0) return

        setLoading(true)
        try {
            if (editingTransaction) {
                await updateTransaction(editingTransaction.id, form)
            } else {
                await createTransaction(form)
            }
            setForm(defaultState)
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Erro ao salvar')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[100px] rounded-full -mr-16 -mt-16" />
            
            <div className="flex items-center justify-between mb-8 relative">
                <div>
                    <h2 className="text-2xl font-black premium-gradient-text flex items-center gap-3">
                        {editingTransaction ? <Save size={24} className="text-emerald-400" /> : <Plus size={24} className="text-blue-400" />}
                        {editingTransaction ? 'Editar Registro' : 'Novo Registro'}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Gerencie suas finanças com precisão</p>
                </div>
                {editingTransaction && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/5"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className="space-y-6 relative">
                <div className="flex gap-4 p-1.5 bg-slate-950/50 rounded-[1.25rem] border border-white/5">
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, type: 'income' })}
                        className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${form.type === 'income'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-100'
                            : 'text-slate-500 hover:text-slate-300 scale-[0.98]'
                            }`}
                    >
                        Receita
                    </button>
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, type: 'expense' })}
                        className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${form.type === 'expense'
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-100'
                            : 'text-slate-500 hover:text-slate-300 scale-[0.98]'
                            }`}
                    >
                        Despesa
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    <div className="group">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                            <FileText size={14} /> Título
                        </label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Ex: Salário Mensal"
                            className="glass-input w-full px-5 py-4 rounded-2xl text-white placeholder-slate-600"
                        />
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                            <DollarSign size={14} /> Valor (R$)
                        </label>
                        <input
                            type="number"
                            required
                            min="0.01"
                            step="0.01"
                            value={form.amount || ''}
                            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                            placeholder="0,00"
                            className="glass-input w-full px-5 py-4 rounded-2xl text-white placeholder-slate-600 font-mono text-lg"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                                <Calendar size={14} /> Data
                            </label>
                            <input
                                type="date"
                                required
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="glass-input w-full px-5 py-4 rounded-2xl text-white [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                                <Clock size={14} /> Hora
                            </label>
                            <input
                                type="time"
                                required
                                value={form.time}
                                onChange={(e) => setForm({ ...form, time: e.target.value })}
                                className="glass-input w-full px-5 py-4 rounded-2xl text-white [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                            Descrição (Opcional)
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Adicione detalhes extras..."
                            rows={3}
                            className="glass-input w-full px-5 py-4 rounded-2xl text-white placeholder-slate-600 resize-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`premium-button w-full py-5 rounded-[1.25rem] font-black text-white tracking-widest uppercase text-sm shadow-2xl transition-all ${form.type === 'income'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-emerald-500/20'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-500 shadow-blue-500/20'
                        } disabled:opacity-50`}
                >
                    {loading ? 'Processando...' : editingTransaction ? 'Salvar Alterações' : 'Confirmar Transação'}
                </button>
            </div>
        </form>
    )
}