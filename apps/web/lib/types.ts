export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Tour {
  id: string
  title: string
  slug: string | null
  category: 'family' | 'honeymoon' | 'group' | 'student' | null
  description: string | null
  short_description: string | null
  price_per_person: number | null
  duration_days: number | null
  destination: string | null
  inclusions: string[] | null
  exclusions: string[] | null
  itinerary: any | null
  images: string[] | null
  is_domestic: boolean | null
  is_featured: boolean | null
  is_active: boolean | null
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string | null
  tour_id: string | null
  traveler_count: number | null
  travel_date: string | null
  total_price: number | null
  status: 'pending' | 'confirmed' | 'cancelled' | null
  payment_id: string | null
  razorpay_order_id: string | null
  special_requests: string | null
  created_at: string
  updated_at: string
}

export interface HiddenGem {
  id: string
  name: string
  description: string | null
  category: 'adventure' | 'peaceful' | 'budget' | 'couple' | null
  lat: number | null
  lng: number | null
  nearest_city: string | null
  estimated_cost: string | null
  best_time_to_visit: string | null
  images: string[] | null
  submitted_by: string | null
  status: 'pending' | 'approved' | 'rejected' | null
  is_manual: boolean | null
  created_at: string
  updated_at: string
}

export interface Wishlist {
  id: string
  user_id: string | null
  tour_id: string | null
  created_at: string
}
