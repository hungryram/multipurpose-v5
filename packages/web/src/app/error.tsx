'use client'

import {useEffect} from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">500</h1>
        <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Something Went Wrong</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border-2 border-black text-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
