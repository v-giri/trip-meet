import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// POST /api/payments/create-order
router.post('/create-order', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tourId, travelersCount, travelDate, userId, specialRequests } = req.body;

    if (!tourId || !travelersCount || !travelDate) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Fetch tour price from Supabase
    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .select('id, title, price_per_person')
      .eq('id', tourId)
      .single();

    if (tourError || !tour) {
      res.status(404).json({ error: 'Tour not found' });
      return;
    }

    const totalPrice = tour.price_per_person * travelersCount;
    const amountInPaise = totalPrice * 100; // Razorpay uses paise

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        tourId,
        userId: userId || 'guest',
        travelDate,
      },
    });

    // Save pending booking to Supabase
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id: userId || null,
        tour_id: tourId,
        traveler_count: travelersCount,
        travel_date: travelDate,
        total_price: totalPrice,
        status: 'pending',
        razorpay_order_id: order.id,
        special_requests: specialRequests || null,
      }])
      .select()
      .single();

    if (bookingError || !booking) {
      res.status(500).json({ error: 'Failed to create booking record' });
      return;
    }

    res.json({
      razorpayOrderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      bookingId: booking.id,
      tourTitle: tour.title,
    });

  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /api/payments/verify
router.post('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !bookingId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Verify HMAC signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      // Signature mismatch — mark booking as failed
      await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      res.status(400).json({ success: false, error: 'Invalid payment signature' });
      return;
    }

    // Signature valid — confirm booking
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        payment_id: razorpayPaymentId,
      })
      .eq('id', bookingId);

    if (updateError) {
      res.status(500).json({ success: false, error: 'Failed to confirm booking' });
      return;
    }

    res.json({ success: true, bookingId });

  } catch (error: any) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
