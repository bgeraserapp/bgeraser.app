import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">Last updated: January 1, 2024</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using BG Eraser (&quot;the Service&quot;), you accept and agree to be
              bound by the terms and provision of this agreement. If you do not agree to abide by
              the above, please do not use this service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              BG Eraser is an AI-powered background removal service that allows users to remove
              backgrounds from images. The service is provided on a credit-based system where users
              purchase credits to process images.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the Service, you may be required to create an account.
              You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Promptly updating your account information when necessary</li>
            </ul>

            <h2>4. Credit System and Payments</h2>
            <p>Our service operates on a credit-based system:</p>
            <ul>
              <li>Credits are purchased in advance and used to process images</li>
              <li>Each background removal typically consumes one credit</li>
              <li>Credits do not expire but are non-refundable once purchased</li>
              <li>Payment processing is handled by secure third-party providers</li>
              <li>All sales are final unless otherwise specified</li>
            </ul>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Upload images that contain illegal, harmful, or inappropriate content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others, including intellectual property rights</li>
              <li>Upload images depicting minors without proper authorization</li>
              <li>Attempt to reverse engineer or copy our AI models</li>
              <li>Use the service for any commercial purposes that violate our fair use policy</li>
            </ul>

            <h2>6. Content and Privacy</h2>
            <p>Regarding the images you upload:</p>
            <ul>
              <li>You retain all rights to your original images</li>
              <li>Images are automatically deleted from our servers after 24 hours</li>
              <li>We do not claim ownership of your content</li>
              <li>We do not use your images to train our AI models without explicit consent</li>
              <li>
                You are responsible for ensuring you have the right to upload and process the images
              </li>
            </ul>

            <h2>7. Service Availability</h2>
            <p>
              We strive to maintain high service availability, but we do not guarantee uninterrupted
              access. The Service may be temporarily unavailable due to:
            </p>
            <ul>
              <li>Scheduled maintenance</li>
              <li>Technical difficulties</li>
              <li>Force majeure events</li>
              <li>Third-party service dependencies</li>
            </ul>

            <h2>8. Limitation of Liability</h2>
            <p>
              BG Eraser shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages, including without limitation, loss of profits, data, use, goodwill,
              or other intangible losses, resulting from your use of the Service.
            </p>

            <h2>9. Disclaimer of Warranties</h2>
            <p>
              The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We
              make no representations or warranties of any kind, express or implied, regarding the
              Service, including but not limited to accuracy, reliability, or availability.
            </p>

            <h2>10. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain
              the exclusive property of BG Eraser and its licensors. The Service is protected by
              copyright, trademark, and other laws.
            </p>

            <h2>11. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately,
              without prior notice or liability, for any reason whatsoever, including breach of
              these Terms.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which
              BG Eraser operates, without regard to its conflict of law provisions.
            </p>

            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of
              significant changes by posting the new Terms of Service on this page with an updated
              revision date.
            </p>

            <h2>14. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us at:</p>
            <ul>
              <li>Email: legal@bgeraser.com</li>
              <li>Address: [Company Address]</li>
            </ul>

            <div className="bg-muted/30 rounded-lg p-6 mt-12">
              <p className="text-sm text-muted-foreground mb-0">
                <strong>Note:</strong> This is a template Terms of Service. Please consult with
                legal counsel to ensure these terms are appropriate for your specific business and
                jurisdiction.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
