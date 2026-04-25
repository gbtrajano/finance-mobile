export type Category = {
    id: string
    name: string
    color: string
    icon: string
    created_at: string
}

export type Transaction = {
    id: string
    title: string
    description: string | null
    amount: number
    type: 'income' | 'expense'
    transaction_date: string
    created_at: string
    category_id: string | null
    category?: Category | null
}

export type TransactionFormData = {
    title: string
    description: string
    amount: number
    type: 'income' | 'expense'
    date: string
    time: string
    category_id: string | null
}