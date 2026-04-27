'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-20 text-center">
      <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Something went wrong</h1>
      <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
        We hit an unexpected snag. Our team has been notified and is looking into it.
      </p>
      {error?.digest && (
        <p className="text-xs font-mono text-gray-400 bg-gray-100 px-4 py-2 rounded-lg mb-8">Error ID: {error.digest}</p>
      )}
      <div className="flex flex-wrap gap-4 justify-center">
        <button onClick={reset} className="bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-700 transition shadow-md">
          Try Again
        </button>
        <Link href="/" className="bg-white text-gray-700 font-bold px-8 py-4 rounded-2xl border border-gray-200 hover:bg-gray-50 transition shadow-sm">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
