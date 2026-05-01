'use server'

import { getSupabaseClient } from './supabase-server'
import { TransactionFormData, Transaction, Category } from './types'
import { revalidatePath } from 'next/cache'

export async function getCategories(): Promise<Category[]> {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    if (error) throw new Error(error.message)
    return data as Category[]
}

export async function createCategory(data: { name: string; icon: string; color: string }) {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.from('categories').insert(data)
    if (error) throw new Error(error.message)
    revalidatePath('/')
}

export async function deleteCategory(id: string) {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/')
}

export async function getTransactions(): Promise<Transaction[]> {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('transactions')
        .select('*, category:categories(*)')
        .order('transaction_date', { ascending: false })

    if (error) throw new Error(error.message)
    return data as Transaction[]
}

export async function createTransaction(formData: TransactionFormData) {
    const supabase = await getSupabaseClient()
    const dateTime = formData.date.includes('T') ? formData.date : `${formData.date}T${formData.time}:00`

    const { error } = await supabase.from('transactions').insert({
        title: formData.title,
        description: formData.description || null,
        amount: formData.amount,
        type: formData.type,
        transaction_date: dateTime,
        category_id: formData.category_id || null,
    })

    if (error) throw new Error(error.message)
    revalidatePath('/')
}

export async function updateTransaction(id: string, formData: TransactionFormData) {
    const supabase = await getSupabaseClient()
    const dateTime = formData.date.includes('T') ? formData.date : `${formData.date}T${formData.time}:00`

    const { error } = await supabase
        .from('transactions')
        .update({
            title: formData.title,
            description: formData.description || null,
            amount: formData.amount,
            type: formData.type,
            transaction_date: dateTime,
            category_id: formData.category_id || null,
        })
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
}

export async function deleteTransaction(id: string) {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
}

export async function getSummary() {
    const supabase = await getSupabaseClient()

    const { data: income } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'income')

    const { data: expense } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'expense')

    const totalIncome = income?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
    const totalExpense = expense?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

    return { totalIncome, totalExpense, balance: totalIncome - totalExpense }
}