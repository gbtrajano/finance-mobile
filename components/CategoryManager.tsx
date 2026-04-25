'use client'

import { useState, useTransition } from 'react'
import { Category } from '../lib/types'
import { createCategory, deleteCategory } from '../lib/actions'
import { X, Plus, Trash2, Tag, Loader2 } from 'lucide-react'

interface Props {
    categories: Category[]
    onClose: () => void
}

const PRESET_COLORS = [
    '#f97316', '#ef4444', '#eab308', '#22c55e',
    '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
    '#a855f7', '#ec4899', '#64748b', '#78716c',
]

const PRESET_ICONS = [
    '🍔', '🚗', '💊', '🎮', '📚', '🏠', '💰', '📦',
    '✈️', '🛍️', '💡', '🎵', '🏋️', '☕', '🐶', '💻',
    '🎬', '💈', '🧴', '⚡', '🍕', '🧾', '🎁', '🏦',
]

export default function CategoryManager({ categories, onClose }: Props) {
    const [name, setName] = useState('')
    const [icon, setIcon] = useState('📦')
    const [color, setColor] = useState('#6366f1')
    const [isPending, startTransition] = useTransition()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        startTransition(async () => {
            try {
                await createCategory({ name: name.trim(), icon, color })
                setName('')
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Erro ao criar categoria')
            }
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Deletar esta categoria? As transações vinculadas ficarão sem categoria.')) return
        setDeletingId(id)
        try {
            await deleteCategory(id)
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Erro ao deletar')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#080c18] border border-white/10 rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <Tag size={20} className="text-indigo-400" />
                        Gerenciar Categorias
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Lista de categorias existentes */}
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                            Categorias ({categories.length})
                        </p>
                        <div className="space-y-2">
                            {categories.length === 0 && (
                                <p className="text-slate-600 text-sm text-center py-6">
                                    Nenhuma categoria ainda. Crie uma abaixo!
                                </p>
                            )}
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="flex items-center justify-between px-4 py-3 rounded-2xl border transition-all"
                                    style={{
                                        borderColor: cat.color + '30',
                                        backgroundColor: cat.color + '10',
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{cat.icon}</span>
                                        <div>
                                            <p className="font-bold text-sm" style={{ color: cat.color }}>
                                                {cat.name}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        disabled={deletingId === cat.id}
                                        className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/10 transition-all disabled:opacity-50"
                                        title="Deletar categoria"
                                    >
                                        {deletingId === cat.id
                                            ? <Loader2 size={14} className="animate-spin" />
                                            : <Trash2 size={14} />
                                        }
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divisor */}
                    <div className="border-t border-white/5" />

                    {/* Formulário de criação */}
                    <form onSubmit={handleCreate} className="space-y-4">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Nova Categoria
                        </p>

                        {/* Nome */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block">Nome</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Academia"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                            />
                        </div>

                        {/* Ícone */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block">Ícone</label>
                            <div className="grid grid-cols-8 gap-1.5">
                                {PRESET_ICONS.map((ic) => (
                                    <button
                                        key={ic}
                                        type="button"
                                        onClick={() => setIcon(ic)}
                                        className={`text-lg p-2 rounded-xl transition-all ${
                                            icon === ic
                                                ? 'bg-indigo-600/30 border border-indigo-500/50 scale-110'
                                                : 'bg-white/5 border border-white/5 hover:bg-white/10'
                                        }`}
                                    >
                                        {ic}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cor */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block">Cor</label>
                            <div className="grid grid-cols-6 gap-2">
                                {PRESET_COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`w-full aspect-square rounded-xl transition-all ${
                                            color === c
                                                ? 'scale-90 ring-2 ring-white/60 ring-offset-2 ring-offset-[#080c18]'
                                                : 'hover:scale-105 opacity-70 hover:opacity-100'
                                        }`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preview:</span>
                            <span
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border"
                                style={{
                                    backgroundColor: color + '22',
                                    color: color,
                                    borderColor: color + '44',
                                }}
                            >
                                {icon} {name || 'Categoria'}
                            </span>
                        </div>

                        {/* Botão */}
                        <button
                            type="submit"
                            disabled={isPending || !name.trim()}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-black text-sm uppercase tracking-widest disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
                        >
                            {isPending
                                ? <><Loader2 size={16} className="animate-spin" /> Criando...</>
                                : <><Plus size={16} /> Criar Categoria</>
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
