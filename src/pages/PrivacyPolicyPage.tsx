import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicyPage = () => {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Effective Date: January 1, 2025</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <div className="bg-card p-6 rounded-lg border mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <a href="#data-controller" className="text-primary hover:underline">• Data Controller</a>
              <a href="#information-collection" className="text-primary hover:underline">• Information Collection</a>
              <a href="#legal-basis" className="text-primary hover:underline">• Legal Basis</a>
              <a href="#purpose-of-use" className="text-primary hover:underline">• Purpose of Use</a>
              <a href="#data-sharing" className="text-primary hover:underline">• Data Sharing</a>
              <a href="#security" className="text-primary hover:underline">• Security</a>
              <a href="#user-rights" className="text-primary hover:underline">• User Rights</a>
              <a href="#grievance" className="text-primary hover:underline">• Grievance Contact</a>
            </div>
          </div>

          <p className="text-lg mb-8">
            At MyFleet AI, your privacy is a priority. This Privacy Policy explains how DriveTap Innovation India Pvt. Ltd. 
            (hereinafter "MyFleet AI", "we", "our", or "us") collects, uses, discloses, and safeguards your information when you use our services.
          </p>

          <p className="mb-8">
            By accessing or using MyFleet AI, you agree to the practices described in this Privacy Policy.
          </p>

          <section id="data-controller" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Data Controller and Ownership</h2>
            <p>
              DriveTap Innovation India Pvt. Ltd. is the data controller for all personal information collected through our platform. 
              We are committed to protecting your privacy and handling your data in accordance with applicable laws.
            </p>
          </section>

          <section id="information-collection" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium mb-2">Personal Information:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Name, email address, phone number</li>
              <li>PAN (Permanent Account Number) for verification</li>
              <li>Company information and business details</li>
              <li>Vehicle registration details and documentation</li>
              <li>Driver information and licenses</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2">Usage Data:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Vehicle tracking and GPS location data</li>
              <li>Fuel consumption and maintenance records</li>
              <li>Transaction history and financial data</li>
              <li>Platform usage analytics and preferences</li>
              <li>Device information and IP addresses</li>
            </ul>
          </section>

          <section id="legal-basis" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Legal Basis for Collection</h2>
            <p>We collect and process your data based on:</p>
            <ul className="list-disc pl-6">
              <li>Your consent for marketing communications and optional features</li>
              <li>Contractual necessity to provide our fleet management services</li>
              <li>Legal obligations under Indian regulations and tax laws</li>
              <li>Legitimate business interests in improving our services</li>
            </ul>
          </section>

          <section id="purpose-of-use" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Purpose of Use</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6">
              <li>Provide fleet management and tracking services</li>
              <li>Process payments and maintain financial records</li>
              <li>Verify identity and prevent fraud</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Improve our platform and develop new features</li>
              <li>Communicate important updates and support</li>
              <li>Generate analytics and business insights</li>
            </ul>
          </section>

          <section id="data-sharing" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6">
              <li><strong>Service Providers:</strong> Trusted partners who assist in platform operations</li>
              <li><strong>Financial Partners:</strong> Banks and payment processors for transactions</li>
              <li><strong>Government Authorities:</strong> When required by law or regulation</li>
              <li><strong>Business Partners:</strong> Fleet service providers and maintenance vendors</li>
            </ul>
            <p className="mt-4">We never sell your personal data to third parties for marketing purposes.</p>
          </section>

          <section id="security" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Security Measures</h2>
            <p>We implement industry-standard security measures including:</p>
            <ul className="list-disc pl-6">
              <li>End-to-end encryption for sensitive data transmission</li>
              <li>Secure cloud storage with regular backups</li>
              <li>Multi-factor authentication for account access</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Employee training on data protection protocols</li>
            </ul>
          </section>

          <section id="user-rights" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Access and User Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6">
              <li>Access and review your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in a portable format</li>
              <li>Withdraw consent for optional data processing</li>
              <li>File complaints with data protection authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p>
              We retain your data for as long as necessary to provide services and comply with legal obligations. 
              Typically, personal data is retained for 7 years after account closure for regulatory compliance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance user experience, analyze platform usage, 
              and provide personalized features. You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect 
              personal information from children without proper parental consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Policy Updates</h2>
            <p>
              We may update this Privacy Policy periodically. Material changes will be communicated through 
              email notifications and platform announcements. Continued use constitutes acceptance of updates.
            </p>
          </section>

          <section id="grievance" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Grievance Redressal Contact</h2>
            <div className="bg-card p-6 rounded-lg border">
              <p className="mb-2"><strong>Privacy Officer:</strong> Data Protection Team</p>
              <p className="mb-2"><strong>Email:</strong> privacy@myfleetai.com</p>
              <p className="mb-2"><strong>Address:</strong> DriveTap Innovation India Pvt. Ltd., Bangalore, India</p>
              <p><strong>Response Time:</strong> Within 30 days of receipt</p>
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

export default PrivacyPolicyPage;