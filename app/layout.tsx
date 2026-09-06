import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/context/ThemeContext'
import { WebsiteHelpAssistant } from '@/components/help/WebsiteHelpAssistant'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillLoop AI — Don\'t just use AI. Learn with it. Build with it.',
  description: 'AI-powered learning intelligence platform that measures what students understand, closes skill gaps, and connects learning to real-world projects.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen selection:bg-blue-600 selection:text-white transition-colors duration-200`}>
        <ThemeProvider>
          {children}
          <WebsiteHelpAssistant />
        </ThemeProvider>
      </body>
    </html>
  )
}
