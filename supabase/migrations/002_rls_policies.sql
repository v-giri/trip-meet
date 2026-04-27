-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hidden_gems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_tour_requests ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (is_admin());

-- Tours Policies
CREATE POLICY "Everyone can read active tours" ON public.tours FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can read all tours" ON public.tours FOR SELECT USING (is_admin());
CREATE POLICY "Admins can create tours" ON public.tours FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update tours" ON public.tours FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete tours" ON public.tours FOR DELETE USING (is_admin());

-- Bookings Policies
CREATE POLICY "Users can read their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all bookings" ON public.bookings FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all bookings" ON public.bookings FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete all bookings" ON public.bookings FOR DELETE USING (is_admin());

-- Hidden Gems Policies
CREATE POLICY "Everyone can read approved gems" ON public.hidden_gems FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can read their own pending/rejected gems" ON public.hidden_gems FOR SELECT USING (auth.uid() = submitted_by);
CREATE POLICY "Users can submit gems" ON public.hidden_gems FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins can manage all gems" ON public.hidden_gems FOR ALL USING (is_admin());

-- Wishlists Policies
CREATE POLICY "Users can manage their own wishlists" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- Custom Tour Requests Policies
CREATE POLICY "Users can manage their own custom tour requests" ON public.custom_tour_requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all custom tour requests" ON public.custom_tour_requests FOR ALL USING (is_admin());
CREATE POLICY "Anyone can create custom tour requests" ON public.custom_tour_requests FOR INSERT WITH CHECK (true);
