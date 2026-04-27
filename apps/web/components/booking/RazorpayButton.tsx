'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayOptions {
  razorpayOrderId: string
  amount: number
  currency: string
  bookingId: string
  tourTitle: string
  userName?: string
  userEmail?: string
  userPhone?: string
  onSuccess: (data: { razorpayPaymentId: string; razorpayOrderId: string; razorpaySignature: string }) => void
  onFailure: (error: any) => void
}

export function useRazorpay(options: RazorpayOptions) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  const openCheckout = () => {
    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: options.amount,
      currency: options.currency,
      name: 'TripMeet',
      description: `Booking: ${options.tourTitle}`,
      order_id: options.razorpayOrderId,
      prefill: {
        name: options.userName || '',
        email: options.userEmail || '',
        contact: options.userPhone || '',
      },
      theme: { color: '#2563eb' },
      handler: (response: any) => {
        options.onSuccess({
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        })
      },
      modal: {
        ondismiss: () => options.onFailure({ message: 'Payment cancelled by user' }),
      },
    })
    rzp.open()
  }

  return { openCheckout }
}

interface RazorpayButtonProps extends RazorpayOptions {
  disabled?: boolean
  loading?: boolean
}

export default function RazorpayButton({ disabled, loading, ...hookOptions }: RazorpayButtonProps) {
  const { openCheckout } = useRazorpay(hookOptions)

  return (
    <button
      onClick={openCheckout}
      disabled={disabled || loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xl py-5 rounded-2xl shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-3"
    >
      {loading ? (
        <span>Processing…</span>
      ) : (
        <>
          <span>Pay ₹{(hookOptions.amount / 100).toLocaleString('en-IN')}</span>
          <span className="text-blue-200 text-base font-medium">via Razorpay</span>
        </>
      )}
    </button>
  )
}
