import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Finanças Pessoais do Gabriel',
  description: 'Finanças Pessoais do Gabriel',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-950 text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}