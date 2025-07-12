import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import AppConfig from '@/lib/app-config';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">Last updated: January 1, 2024</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              BG Eraser (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy
              and is committed to protecting your personal data. This privacy policy explains how we
              collect, use, and safeguard your information when you use our background removal
              service.
            </p>

            <h2>2. Information We Collect</h2>

            <h3>Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul>
              <li>Email address (for account creation and communication)</li>
              <li>Name (if provided during registration)</li>
              <li>Payment information (processed by third-party payment providers)</li>
              <li>Usage data and service interactions</li>
            </ul>

            <h3>Image Data</h3>
            <p>When you use our service:</p>
            <ul>
              <li>We temporarily store uploaded images to process background removal</li>
              <li>Original and processed images are automatically deleted after 24 hours</li>
              <li>We do not permanently store or use your images for any other purpose</li>
              <li>Images are not used to train our AI models without explicit consent</li>
            </ul>

            <h3>Technical Information</h3>
            <p>We automatically collect certain technical information:</p>
            <ul>
              <li>IP address and general location data</li>
              <li>Browser type and version</li>
              <li>Device information and operating system</li>
              <li>Usage patterns and service performance metrics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for:</p>
            <ul>
              <li>Providing and improving our background removal service</li>
              <li>Processing payments and managing your account</li>
              <li>Communicating with you about your account and service updates</li>
              <li>Analyzing usage patterns to improve service performance</li>
              <li>Detecting and preventing fraud or abuse</li>
              <li>Complying with legal obligations</li>
            </ul>

            <h2>4. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal information. We may share data only in these situations:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> With trusted third-party vendors who help us
                operate our service (payment processing, cloud hosting, analytics)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, court order, or to
                protect our rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or
                sale of assets
              </li>
              <li>
                <strong>Consent:</strong> With your explicit permission for specific purposes
              </li>
            </ul>

            <h2>5. Data Security</h2>
            <p>We implement appropriate security measures to protect your information:</p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure data centers with physical and digital access controls</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data on a need-to-know basis</li>
              <li>Automatic deletion of processed images within 24 hours</li>
            </ul>

            <h2>6. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal data
              </li>
              <li>
                <strong>Portability:</strong> Receive your data in a portable format
              </li>
              <li>
                <strong>Objection:</strong> Object to certain data processing activities
              </li>
              <li>
                <strong>Withdraw Consent:</strong> Withdraw consent for data processing where
                applicable
              </li>
            </ul>

            <h2>7. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Analyze service usage and performance</li>
              <li>Provide personalized experiences</li>
              <li>Detect and prevent fraud</li>
            </ul>
            <p>You can control cookie settings through your browser preferences.</p>

            <h2>8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your data during
              international transfers, including:
            </p>
            <ul>
              <li>Adequate data protection laws in the destination country</li>
              <li>Standard contractual clauses approved by relevant authorities</li>
              <li>Other appropriate transfer mechanisms as required by law</li>
            </ul>

            <h2>9. Data Retention</h2>
            <p>We retain your information for different periods depending on the type of data:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> Until you delete your account or request
                deletion
              </li>
              <li>
                <strong>Payment Records:</strong> As required by law and for fraud prevention
              </li>
              <li>
                <strong>Usage Data:</strong> Aggregated and anonymized for service improvement
              </li>
              <li>
                <strong>Images:</strong> Automatically deleted within 24 hours of processing
              </li>
            </ul>

            <h2>10. Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If we become aware that we have
              collected such information, we will take steps to delete it promptly.
            </p>

            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              material changes by posting the new policy on this page with an updated revision date.
              Your continued use of the service after such changes constitutes acceptance of the
              updated policy.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or our data practices, please contact
              us:
            </p>
            <ul>
              <li>Email: {AppConfig.contact.email}</li>
              <li>Data Protection Officer: {AppConfig.contact.email}</li>
              <li>Address: {AppConfig.contact.address}</li>
            </ul>

            <h2>13. Regional Specific Rights</h2>

            <h3>For EU/UK Residents (GDPR)</h3>
            <p>
              Under GDPR, you have additional rights including the right to lodge a complaint with
              your local data protection authority.
            </p>

            <h3>For California Residents (CCPA)</h3>
            <p>
              California residents have specific rights under the California Consumer Privacy Act,
              including the right to know what personal information is collected and the right to
              delete personal information.
            </p>

            <div className="bg-muted/30 rounded-lg p-6 mt-12">
              <p className="text-sm text-muted-foreground mb-0">
                <strong>Note:</strong> This is a template Privacy Policy. Please consult with legal
                counsel to ensure this policy complies with applicable privacy laws in your
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
