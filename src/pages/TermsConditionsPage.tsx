import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsConditionsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms & Conditions</h1>
          <p className="text-muted-foreground">Effective Date: January 1, 2025</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <div className="bg-card p-6 rounded-lg border mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <a href="#agreement" className="text-primary hover:underline">• Agreement</a>
              <a href="#services" className="text-primary hover:underline">• Services</a>
              <a href="#accounts" className="text-primary hover:underline">• User Accounts</a>
              <a href="#acceptable-use" className="text-primary hover:underline">• Acceptable Use</a>
              <a href="#payment" className="text-primary hover:underline">• Payment Terms</a>
              <a href="#intellectual-property" className="text-primary hover:underline">• Intellectual Property</a>
              <a href="#limitation" className="text-primary hover:underline">• Limitations</a>
              <a href="#termination" className="text-primary hover:underline">• Termination</a>
            </div>
          </div>

          <p className="text-lg mb-8">
            Welcome to MyFleet AI. These Terms and Conditions ("Terms") govern your use of our fleet management platform 
            operated by DriveTap Innovation India Pvt. Ltd. ("Company", "we", "our", or "us").
          </p>

          <section id="agreement" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement and Acceptance</h2>
            <p>
              By accessing or using MyFleet AI, you agree to be bound by these Terms. If you disagree with any part of these terms, 
              you may not access our service. These Terms apply to all visitors, users, and customers of our platform.
            </p>
            <p className="mt-4">
              You must be at least 18 years old and legally capable of entering into binding contracts to use our services.
            </p>
          </section>

          <section id="services" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p>MyFleet AI provides comprehensive fleet management solutions including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Vehicle tracking and monitoring systems</li>
              <li>Driver management and assignment tools</li>
              <li>Fuel consumption and expense tracking</li>
              <li>Maintenance scheduling and reminders</li>
              <li>Financial reporting and analytics</li>
              <li>Integration with payment processing systems</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of our service at any time with appropriate notice.
            </p>
          </section>

          <section id="accounts" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
            <p>To access our services, you must:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update any changes to your information</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
            <p>
              You are solely responsible for maintaining the confidentiality of your account and password.
            </p>
          </section>

          <section id="acceptable-use" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the service for any unlawful purpose or in violation of applicable laws</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Interfere with or disrupt the integrity or performance of our platform</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Reverse engineer, decompile, or attempt to extract source code</li>
              <li>Use automated systems to access our services without permission</li>
              <li>Share false, misleading, or fraudulent information</li>
            </ul>
          </section>

          <section id="payment" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Payment and Billing Terms</h2>
            <h3 className="text-lg font-medium mb-2">Subscription Fees:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Fees are charged in advance for each billing cycle</li>
              <li>Payment is due immediately upon invoice generation</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>Price changes will be communicated 30 days in advance</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2">Payment Methods:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>We accept major credit cards, UPI, and net banking</li>
              <li>Automatic billing is available for recurring subscriptions</li>
              <li>Failed payments may result in service suspension</li>
            </ul>
          </section>

          <section id="intellectual-property" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property Rights</h2>
            <p>
              The MyFleet AI platform, including all software, content, trademarks, and proprietary technology, 
              is owned by DriveTap Innovation India Pvt. Ltd. and protected by intellectual property laws.
            </p>
            <p className="mt-4">
              You retain ownership of your data but grant us a license to use it for providing and improving our services. 
              You may not copy, modify, distribute, or create derivative works from our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Protection and Privacy</h2>
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed by our 
              <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>, 
              which is incorporated into these Terms by reference.
            </p>
          </section>

          <section id="limitation" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimers and Limitation of Liability</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
              <p className="font-medium">IMPORTANT LEGAL NOTICE:</p>
            </div>
            <p>
              Our services are provided "as is" without warranties of any kind. We do not guarantee uninterrupted access 
              or error-free operation. To the maximum extent permitted by law, we shall not be liable for any indirect, 
              incidental, special, or consequential damages.
            </p>
            <p className="mt-4">
              Our total liability for any claims shall not exceed the amount paid by you for our services in the 12 months 
              preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless DriveTap Innovation India Pvt. Ltd. from any claims, damages, 
              or expenses arising from your use of our services, violation of these Terms, or infringement of any rights.
            </p>
          </section>

          <section id="termination" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p>Either party may terminate this agreement:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>At any time with 30 days written notice</li>
              <li>Immediately for material breach of these Terms</li>
              <li>Immediately if required by law or regulation</li>
            </ul>
            <p>
              Upon termination, you will lose access to our services, but data export options may be available 
              for a limited time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes will be resolved through binding arbitration 
              in Bangalore, Karnataka, in accordance with the Arbitration and Conciliation Act, 2015.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be communicated via email 
              and platform notifications. Your continued use after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <div className="bg-card p-6 rounded-lg border">
              <p className="mb-2"><strong>Legal Department:</strong> DriveTap Innovation India Pvt. Ltd.</p>
              <p className="mb-2"><strong>Email:</strong> legal@myfleetai.com</p>
              <p className="mb-2"><strong>Address:</strong> Bangalore, Karnataka, India</p>
              <p><strong>Customer Support:</strong> support@myfleetai.com</p>
            </div>
          </section>

          <div className="border-t pt-8 mt-8">
            <p className="text-center text-muted-foreground">
              Last updated: January 1, 2025 | MyFleet AI by DriveTap Innovation India Pvt. Ltd.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;