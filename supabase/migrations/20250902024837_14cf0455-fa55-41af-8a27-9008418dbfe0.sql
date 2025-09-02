-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  is_service_provider BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service providers table
CREATE TABLE public.service_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  service_category TEXT NOT NULL,
  description TEXT,
  hourly_rate DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  years_experience INTEGER,
  languages TEXT[],
  specialties TEXT[],
  background_checked BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  response_time_minutes INTEGER DEFAULT 60,
  location_address TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  service_description TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_duration_hours DECIMAL(4,2),
  total_amount DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  customer_address TEXT NOT NULL,
  customer_lat DECIMAL(10,8),
  customer_lng DECIMAL(11,8),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for service_providers
CREATE POLICY "Everyone can view service providers" 
ON public.service_providers FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their service provider profile" 
ON public.service_providers FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = customer_id OR auth.uid() IN (
  SELECT user_id FROM public.service_providers WHERE id = provider_id
));

CREATE POLICY "Customers can create bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers and providers can update bookings" 
ON public.bookings FOR UPDATE 
USING (auth.uid() = customer_id OR auth.uid() IN (
  SELECT user_id FROM public.service_providers WHERE id = provider_id
));

-- RLS Policies for reviews
CREATE POLICY "Everyone can view reviews" 
ON public.reviews FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews for their bookings" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() = reviewer_id AND EXISTS (
  SELECT 1 FROM public.bookings WHERE id = booking_id AND customer_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_providers_updated_at
  BEFORE UPDATE ON public.service_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample service providers
INSERT INTO public.service_providers (user_id, business_name, service_category, description, hourly_rate, rating, review_count, years_experience, languages, specialties, background_checked, location_address) VALUES
('00000000-0000-0000-0000-000000000001', 'Trevor T. Landscaping', 'Landscaping', 'Hello, I''m Trevor! With 7 years of landscaping expertise, I focus on sustainable and beautiful landscape solutions, from native plant gardens to efficient irrigation systems.', 60.00, 5.0, 12, 7, ARRAY['English'], ARRAY['Lawn Repair', 'Soil Amendment', 'Garden Design'], true, 'Poway, CA'),
('00000000-0000-0000-0000-000000000002', 'Mark Y. Electrical', 'Electrical', 'I''m Mark, with 10 years in the field, I specialize in residential and commercial electrical services, focusing on reliability and customer satisfaction.', 110.00, 5.0, 35, 10, ARRAY['English', 'Spanish'], ARRAY['Repairs', 'Inspections', 'Installations'], true, 'San Diego, CA'),
('00000000-0000-0000-0000-000000000003', 'Ryan B. Plumbing', 'Plumbing', 'Professional plumber with 8+ years experience. Available for emergency repairs, installations, and maintenance work.', 85.00, 4.8, 28, 8, ARRAY['English'], ARRAY['Emergency Repair', 'Installation', 'Maintenance'], true, 'Temecula, CA'),
('00000000-0000-0000-0000-000000000004', 'Amanda N. Pet Care', 'Pet Care', 'Loving pet sitter with experience caring for dogs of all sizes. Your furry friend will be in great hands!', 25.00, 4.9, 42, 3, ARRAY['English'], ARRAY['Pet Care', 'Walking', 'Overnight Care'], true, 'El Ranch, CA');