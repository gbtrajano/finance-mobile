import { getTransactions, getSummary } from '../../lib/actions'
import HomeClient from './home-client'

export const revalidate = 0

export default async function Home() {
    const [transactions, summary] = await Promise.all([
        getTransactions(),
        getSummary(),
    ])

    return <HomeClient transactions={transactions} summary={summary} />
}