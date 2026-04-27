// Supabase Edge Function: send-booking-confirmation
// Deploy with: supabase functions deploy send-booking-confirmation
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const { bookingId } = await req.json()
    if (!bookingId) return new Response(JSON.stringify({ error: 'bookingId required' }), { status: 400 })

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch booking with tour and user details
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*, tours(title, destination, duration_days), profiles(full_name, phone)')
      .eq('id', bookingId)
      .single()

    if (error || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), { status: 404 })
    }

    // Get user email from auth
    const { data: { user } } = await supabase.auth.admin.getUserById(booking.user_id)
    if (!user?.email) {
      return new Response(JSON.stringify({ error: 'User email not found' }), { status: 404 })
    }

    const tourName = booking.tours?.title ?? 'Your Tour'
    const destination = booking.tours?.destination ?? ''
    const travelDate = new Date(booking.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    const totalPaid = `₹${Number(booking.total_price).toLocaleString('en-IN')}`
    const shortBookingId = bookingId.slice(-8).toUpperCase()

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1e3a5f; font-size: 28px; margin: 0;">TripMeet</h1>
          <p style="color: #64748b; margin: 4px 0 0;">Your journey awaits! ✈️</p>
        </div>

        <div style="background: white; border-radius: 12px; padding: 32px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
          <h2 style="color: #16a34a; font-size: 22px; margin: 0 0 16px;">🎉 Booking Confirmed!</h2>
          <p style="color: #374151; margin: 0 0 24px; font-size: 16px;">
            Hi <strong>${booking.profiles?.full_name || 'Traveler'}</strong>, your booking for <strong>${tourName}</strong> is confirmed!
          </p>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Booking ID</td>
              <td style="padding: 10px 0; font-weight: bold; color: #1e293b; text-align: right; font-family: monospace;">${shortBookingId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Tour</td>
              <td style="padding: 10px 0; font-weight: bold; color: #1e293b; text-align: right;">${tourName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Destination</td>
              <td style="padding: 10px 0; color: #1e293b; text-align: right;">${destination}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Travel Date</td>
              <td style="padding: 10px 0; color: #1e293b; text-align: right;">${travelDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Travelers</td>
              <td style="padding: 10px 0; color: #1e293b; text-align: right;">${booking.traveler_count}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-weight: bold; font-size: 15px;">Total Paid</td>
              <td style="padding: 10px 0; font-weight: bold; color: #16a34a; text-align: right; font-size: 18px;">${totalPaid}</td>
            </tr>
          </table>
        </div>

        <div style="background: #e0f2fe; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
          <p style="color: #0369a1; margin: 0; font-size: 14px; font-weight: bold;">Need help? Contact us on WhatsApp</p>
          <a href="https://wa.me/919876543210" style="display: inline-block; margin-top: 10px; background: #25D366; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            WhatsApp us 💬
          </a>
        </div>

        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} TripMeet. All rights reserved.
        </p>
      </div>
    `

    // Send via Resend (https://resend.com)
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TripMeet <bookings@yourdomain.com>',
        to: [user.email],
        subject: `🎉 Booking Confirmed — ${tourName}`,
        html,
      }),
    })

    if (!emailRes.ok) {
      const err = await emailRes.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: 'Email send failed' }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (err: any) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
