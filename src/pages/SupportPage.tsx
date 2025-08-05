import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MessageCircle, Clock, ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const supportFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  category: z.string().min(1, "Please select an issue category"),
  description: z.string().min(10, "Please provide at least 10 characters describing your issue"),
});

type SupportFormData = z.infer<typeof supportFormSchema>;

const SupportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      category: "",
      description: "",
    },
  });

  const onSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Support Request Submitted",
        description: "We'll get back to you within 24 hours. Check your email for a confirmation.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit support request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Get Support</h1>
          <p className="text-muted-foreground">
            We're here to help you with your fleet management needs. Choose the best way to reach us.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>Talk to our experts directly</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-semibold text-lg mb-2">+91-9900010964</p>
              <p className="text-sm text-muted-foreground">
                Monday - Friday: 9 AM - 6 PM<br />
                Saturday: 10 AM - 4 PM
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Send us a detailed message</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-semibold mb-1">support@paytap.co.in</p>
              <p className="text-sm text-muted-foreground mb-2">General inquiries</p>
              <p className="font-semibold mb-1">billing@paytap.co.in</p>
              <p className="text-sm text-muted-foreground">Billing & payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>WhatsApp Support</CardTitle>
              <CardDescription>Quick messaging support</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full mb-2">Chat on WhatsApp</Button>
              <p className="text-sm text-muted-foreground">
                Available during business hours<br />
                Average response: 5 minutes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Support Hours */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Support Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Regular Support</h4>
                <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                <p className="text-sm text-muted-foreground">Saturday: 10:00 AM - 4:00 PM IST</p>
                <p className="text-sm text-muted-foreground">Sunday: Closed</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Emergency Support</h4>
                <p className="text-sm text-muted-foreground">24/7 for critical fleet issues</p>
                <p className="text-sm text-muted-foreground">Call: +91-9900010964</p>
                <p className="text-sm text-muted-foreground">Email: emergency@paytap.co.in</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Support Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit Support Request</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an issue category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="billing">Billing & Payments</SelectItem>
                            <SelectItem value="account">Account Management</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="integration">Integration Support</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your issue in detail..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Please provide as much detail as possible to help us assist you better.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions about fleet management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I add a new vehicle to my fleet?</AccordionTrigger>
                  <AccordionContent>
                    Click the "Add Vehicle" button on your dashboard, then fill in the vehicle details including registration number, model, and driver information.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How can I track my vehicle's performance?</AccordionTrigger>
                  <AccordionContent>
                    Visit the Fleet Overview section to see real-time analytics, fuel efficiency, maintenance schedules, and driver performance metrics.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What should I do if I receive a challan notification?</AccordionTrigger>
                  <AccordionContent>
                    All challans are automatically tracked in your dashboard. You can view details, pay online, or dispute them through our integrated system.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I manage my subscription and billing?</AccordionTrigger>
                  <AccordionContent>
                    Go to Settings → Billing to view your current plan, payment history, and update your payment methods. You can upgrade or downgrade your plan anytime.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I export my fleet data for reporting?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Use the "Generate Report" feature to export your fleet data in various formats including PDF, Excel, and CSV for your records.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;