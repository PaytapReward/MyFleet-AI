
-- Subscribers table to securely track subscription state per user
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  status TEXT, -- e.g. 'active', 'trialing', 'canceled', etc.
  subscription_tier TEXT, -- e.g. 'Semi-Annual', 'Yearly'
  trial_end TIMESTAMPTZ, -- if in trial
  subscription_end TIMESTAMPTZ, -- current period end if active
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Users can only view their own subscription row
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Intentionally no INSERT/UPDATE/DELETE policies for normal users.
-- Edge functions will use the Service Role key (bypasses RLS) to upsert this table.

-- Helpful index for lookups by user_id
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);
