-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscribed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMP WITH TIME ZONE;

-- Make full_name nullable since it's not required during initial signup
ALTER TABLE public.profiles ALTER COLUMN full_name DROP NOT NULL;