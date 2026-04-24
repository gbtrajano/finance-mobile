export type Transaction = {
    id: string
    title: string
    description: string | null
    amount: number
    type: 'income' | 'expense'
    transaction_date: string
    created_at: string
}

export type TransactionFormData = {
    title: string
    description: string
    amount: number
    type: 'income' | 'expense'
    date: string
    time: string
}