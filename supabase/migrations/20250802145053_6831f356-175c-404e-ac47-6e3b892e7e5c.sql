-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  number TEXT NOT NULL,
  model TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicles
CREATE POLICY "Owners can view their vehicles" 
ON public.vehicles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Owners can create vehicles" 
ON public.vehicles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their vehicles" 
ON public.vehicles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their vehicles" 
ON public.vehicles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Drivers can view vehicles assigned to them
CREATE POLICY "Drivers can view assigned vehicles" 
ON public.vehicles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.drivers 
    WHERE drivers.user_id = auth.uid() 
    AND vehicles.id::text = ANY(drivers.assigned_vehicles)
  )
);

-- Add company_name and pan_number to profiles table
ALTER TABLE public.profiles ADD COLUMN company_name TEXT;
ALTER TABLE public.profiles ADD COLUMN pan_number TEXT;
ALTER TABLE public.profiles ADD COLUMN is_onboarded BOOLEAN DEFAULT false;

-- Update drivers table to include full_name
ALTER TABLE public.drivers ADD COLUMN full_name TEXT NOT NULL DEFAULT '';

-- Create trigger for vehicles updated_at
CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for drivers updated_at
CREATE TRIGGER update_drivers_updated_at
BEFORE UPDATE ON public.drivers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();