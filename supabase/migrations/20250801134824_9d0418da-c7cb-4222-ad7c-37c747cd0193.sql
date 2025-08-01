-- Fix function search path mutable security warning by updating the function properly
DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Create the function with proper security settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Recreate the trigger
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();