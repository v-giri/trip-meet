'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase'
import { useAuth } from '../../../hooks/useAuth'
import RazorpayButton from '../../../components/booking/RazorpayButton'
import { MapPin, Clock, Users, Calendar, CheckCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'

type BookingStep = 'form' | 'payment' | 'confirmed'

export default function BookingPage() {
  const params = useParams()
  const tourId = params.tourId as string
  const router = useRouter()
  const supabase = createClient()
  const { user, profile, loading: authLoading } = useAuth()

  const [tour, setTour] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<BookingStep>('form')
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  // Form state
  const [travelDate, setTravelDate] = useState('')
  const [travelers, setTravelers] = useState(2)
  const [specialRequests, setSpecialRequests] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  // Order state (populated after creating Razorpay order)
  const [orderDetails, setOrderDetails] = useState<{
    razorpayOrderId: string
    amount: number
    currency: string
    bookingId: string
    tourTitle: string
  } | null>(null)

  // Confirmed booking
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadTour() {
      const { data } = await supabase.from('tours').select('*').eq('id', tourId).single()
      setTour(data)
      setLoading(false)
    }
    loadTour()
  }, [tourId])

  // Pre-fill contact details from profile
  useEffect(() => {
    if (profile) {
      setContactName(profile.full_name || '')
      setContactPhone(profile.phone || '')
    }
    if (user) {
      setContactEmail(user.email || '')
    }
  }, [profile, user])

  // Redirect to login if not authenticated (after auth state resolves)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/booking/${tourId}`)
    }
  }, [authLoading, user, tourId, router])

  const totalPrice = tour ? (tour.price_per_person || 0) * travelers : 0

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setProcessing(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId,
          travelersCount: travelers,
          travelDate,
          userId: user?.id,
          specialRequests,
        }),
      })

      if (!res.ok) throw new Error('Failed to create order. Please try again.')
      const data = await res.json()
      setOrderDetails(data)
      setStep('payment')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const handlePaymentSuccess = async ({ razorpayPaymentId, razorpayOrderId, razorpaySignature }: {
    razorpayPaymentId: string; razorpayOrderId: string; razorpaySignature: string
  }) => {
    setProcessing(true)
    setError(null)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${API_URL}/api/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          bookingId: orderDetails?.bookingId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setConfirmedBookingId(data.bookingId)
        setStep('confirmed')
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const handlePaymentFailure = (err: any) => {
    setError(err?.message || 'Payment failed. Please try again.')
  }

  // Loading skeleton
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[600px] bg-gray-200 rounded-3xl"></div>
            <div className="h-80 bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Tour not found</h1>
        <Link href="/tours" className="text-blue-600 hover:underline">Browse all tours</Link>
      </div>
    )
  }

  // ---- STEP 3: CONFIRMATION ----
  if (step === 'confirmed' && confirmedBookingId) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Booking Confirmed! 🎉</h1>
          <p className="text-gray-500 text-lg mb-8">
            Your trip to <strong>{tour.title}</strong> is booked. We can't wait to see you on the road!
          </p>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-left mb-8 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Booking ID</span>
              <span className="font-bold text-gray-900 font-mono">{confirmedBookingId.slice(-12).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Tour</span>
              <span className="font-bold text-gray-900 text-right max-w-[200px] line-clamp-1">{tour.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Travel Date</span>
              <span className="font-bold text-gray-900">{new Date(travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Travelers</span>
              <span className="font-bold text-gray-900">{travelers}</span>
            </div>
            <div className="pt-3 border-t flex justify-between text-base">
              <span className="text-gray-600 font-semibold">Total Paid</span>
              <span className="font-extrabold text-green-700 text-xl">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-center hover:bg-blue-700 transition shadow-md">
              View My Bookings
            </Link>
            <a
              href={`https://wa.me/919876543210?text=I just booked the ${tour.title} trip! Booking ID: ${confirmedBookingId.slice(-8).toUpperCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl text-center hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href={`/tours/${tour.id}`} className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-medium">
            ← Back to {tour.title}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: Form / Payment */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
              {step === 'form' ? 'Complete your Booking' : 'Review & Pay'}
            </h1>

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-sm font-medium">
                {error}
                {step === 'payment' && (
                  <button onClick={() => setStep('form')} className="ml-4 underline font-bold">Go back</button>
                )}
              </div>
            )}

            {/* ---- STEP 1: FORM ---- */}
            {step === 'form' && (
              <form onSubmit={handleProceedToPayment} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Travel Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={travelDate}
                      onChange={e => setTravelDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Number of Travelers *</label>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xl transition">−</button>
                    <span className="text-2xl font-extrabold w-12 text-center text-gray-900">{travelers}</span>
                    <button type="button" onClick={() => setTravelers(Math.min(30, travelers + 1))} className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold flex items-center justify-center text-xl transition">+</button>
                    <span className="text-gray-500 text-sm ml-2">× ₹{tour.price_per_person?.toLocaleString('en-IN')}/person</span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-base font-bold text-gray-700 mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Full Name *</label>
                      <input required value={contactName} onChange={e => setContactName(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email *</label>
                      <input required type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@email.com" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                      <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 9876543210" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Special Requests</label>
                  <textarea rows={3} value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Any dietary requirements, accessibility needs, or special occasions?" />
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xl py-5 rounded-2xl shadow-xl transition transform hover:-translate-y-1"
                >
                  {processing ? 'Creating order...' : `Proceed to Pay ₹${totalPrice.toLocaleString('en-IN')}`}
                </button>
              </form>
            )}

            {/* ---- STEP 2: PAYMENT ---- */}
            {step === 'payment' && orderDetails && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between"><span>Order ID</span><span className="font-mono text-xs">{orderDetails.razorpayOrderId}</span></div>
                    <div className="flex justify-between"><span>Tour</span><span className="font-bold">{orderDetails.tourTitle}</span></div>
                    <div className="flex justify-between"><span>Date</span><span>{new Date(travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                    <div className="flex justify-between"><span>Travelers</span><span>{travelers}</span></div>
                    <div className="flex justify-between pt-2 border-t border-blue-100 font-bold text-base text-gray-900">
                      <span>Total</span><span>₹{(orderDetails.amount / 100).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <RazorpayButton
                  {...orderDetails}
                  userName={contactName}
                  userEmail={contactEmail}
                  userPhone={contactPhone}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                  loading={processing}
                />

                <button onClick={() => setStep('form')} className="w-full text-gray-500 hover:text-gray-700 py-3 font-medium transition text-sm">
                  ← Go back and edit details
                </button>
              </div>
            )}
          </div>

          {/* Right: Tour Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              {tour.images?.[0] && (
                <img src={tour.images[0]} alt={tour.title} className="w-full h-44 object-cover" />
              )}
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-xl text-gray-900 leading-tight">{tour.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {tour.destination}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> {tour.duration_days} Days</div>
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> {travelers} Traveler{travelers > 1 ? 's' : ''}</div>
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>₹{tour.price_per_person?.toLocaleString('en-IN')} × {travelers}</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-gray-900 text-base pt-1 border-t">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
