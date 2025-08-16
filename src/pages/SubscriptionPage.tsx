import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    id: "trial",
    name: "30-day Free Trial",
    price: "Free for 30 days",
    description: "Requires a valid payment method. Auto-renews unless canceled.",
    cta: "Start Free Trial",
    badge: "Best for getting started",
  },
  {
    id: "semiannual",
    name: "6 Months Plan",
    price: "₹12000 / 6 months",
    description: "Save more with a semi-annual plan.",
    cta: "Choose 6 Months",
    badge: "Popular",
  },
  {
    id: "annual",
    name: "Annual Plan",
    price: "₹24000 / year",
    description: "Best value for growing fleets.",
    cta: "Choose Annual",
    badge: "Best value",
  },
] as const;

const SubscriptionPage = () => {
  const { user, startTrial } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  

  useEffect(() => {
    document.title = "Choose Plan | MyFleet Subscription";
  }, []);

  const loadCashfreeScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).Cashfree) return resolve();
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/ui/2.0/cashfree.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
      document.body.appendChild(script);
    });
  };

  const handlePaidCheckout = async (plan: 'semiannual' | 'annual') => {
    try {
      setLoadingPlan(plan);
      const returnUrl = `${window.location.origin}/payment/success`;
      const { data, error } = await supabase.functions.invoke('cashfree-create-order', {
        body: {
          plan,
          returnUrl,
          customer: {
            name: user?.fullName || 'Customer',
            email: user?.email || undefined,
            phone: user?.phone || undefined,
          },
        },
      });
      if (error) throw error;
      if (data?.payment_session_id) {
        await loadCashfreeScript();
        const cashfree = new (window as any).Cashfree({ mode: data.mode || 'sandbox' });
        await cashfree.checkout({ paymentSessionId: data.payment_session_id, redirectTarget: '_self' });
      } else if (data?.payment_link) {
        window.location.href = data.payment_link;
      } else {
        toast({ title: 'Unable to start payment', description: 'Please try again.' });
      }
    } catch (err) {
      console.error('Cashfree checkout error', err);
      toast({ title: 'Payment gateway not configured', description: 'Please set Cashfree credentials.' });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCheckout = async (plan: typeof plans[number]['id']) => {
    if (plan === 'trial') {
      try {
        setLoadingPlan(plan);
        await startTrial();
        toast({ title: 'Trial started', description: 'Welcome! Redirecting to your dashboard...' });
        setTimeout(() => window.location.replace('/'), 400);
      } catch (e) {
        toast({ title: 'Could not start trial', description: 'Please try again.' });
      } finally {
        setLoadingPlan(null);
      }
    } else {
      await handlePaidCheckout(plan);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Choose your MyFleet plan</h1>
        <p className="text-muted-foreground mt-2">
          Access to the dashboard requires an active subscription. Start a 30-day free trial or
          pick a paid plan.
        </p>
      </header>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <CardHeader>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.badge}</div>
                <CardTitle className="mt-1">{p.name}</CardTitle>
                <CardDescription>{p.price}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="text-sm text-muted-foreground space-y-2">
                  {p.id === "trial" ? (
                    <>
                      <li>• Full access for 30 days</li>
                      <li>• Card on file required</li>
                      <li>• Auto-renews unless canceled</li>
                    </>
                  ) : p.id === "semiannual" ? (
                    <>
                      <li>• 6 months of access</li>
                      <li>• Priority support</li>
                      <li>• Save versus monthly</li>
                    </>
                  ) : (
                    <>
                      <li>• 12 months of access</li>
                      <li>• Best value</li>
                      <li>• Priority support</li>
                    </>
                  )}
                </ul>
                <Separator className="my-6" />
                <Button
                  onClick={() => handleCheckout(p.id)}
                  disabled={loadingPlan === p.id}
                  aria-label={p.cta}
                >
                  {loadingPlan === p.id ? "Preparing checkout..." : p.cta}
                </Button>
                <p className="text-xs text-muted-foreground mt-3">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

      </section>

      <section className="container mx-auto px-4 pb-16">
        <h2 className="sr-only">Subscription FAQs</h2>
        {/* Structured data could be added here if needed */}
      </section>
    </main>
  );
};

export default SubscriptionPage;
