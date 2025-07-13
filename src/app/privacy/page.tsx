import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import AppConfig from '@/lib/app-config';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border shadow-sm p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
              <p className="text-lg text-muted-foreground">Last updated: July 13, 2025</p>
            </div>

            <div className="space-y-8">
              {/* Who We Are */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  1. Who We Are
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">{AppConfig.company.name}</strong> operates BG
                  Eraser, an AI-powered background removal service. We&apos;re based in{' '}
                  {AppConfig.company.location}, and committed to protecting your privacy.
                </p>

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Quick Facts:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏢</span>
                      <div>
                        <p className="font-semibold text-foreground">Company</p>
                        <p className="text-sm text-muted-foreground">{AppConfig.company.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📍</span>
                      <div>
                        <p className="font-semibold text-foreground">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {AppConfig.company.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎯</span>
                      <div>
                        <p className="font-semibold text-foreground">Service</p>
                        <p className="text-sm text-muted-foreground">AI background removal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎁</span>
                      <div>
                        <p className="font-semibold text-foreground">Free Trial</p>
                        <p className="text-sm text-muted-foreground">3 credits for new users</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Data We Collect */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  2. Data We Collect
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Personal Information
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">📧</span>
                        <div>
                          <p className="font-semibold text-foreground">Email</p>
                          <p className="text-sm">For account and communication</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">👤</span>
                        <div>
                          <p className="font-semibold text-foreground">Name</p>
                          <p className="text-sm">From OAuth providers (Google, GitHub)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">💳</span>
                        <div>
                          <p className="font-semibold text-foreground">Payment</p>
                          <p className="text-sm">Processed securely by Paddle</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">📊</span>
                        <div>
                          <p className="font-semibold text-foreground">Usage</p>
                          <p className="text-sm">Credit balance and processing history</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Image Data</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">📸</span>
                        <div>
                          <p className="font-semibold text-foreground">Temporary storage</p>
                          <p className="text-sm">During processing only</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">🗑️</span>
                        <div>
                          <p className="font-semibold text-foreground">Immediate deletion</p>
                          <p className="text-sm">After background removal</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">🚫</span>
                        <div>
                          <p className="font-semibold text-foreground">No permanent storage</p>
                          <p className="text-sm">Or backup</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">🔒</span>
                        <div>
                          <p className="font-semibold text-foreground">Secure processing</p>
                          <p className="text-sm">Via Replicate AI</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Your Data */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  3. How We Use Your Data
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-4 font-semibold text-foreground border-b border-border">
                          Purpose
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground border-b border-border">
                          Data Used
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground border-b border-border">
                          Legal Basis
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-4 text-muted-foreground font-medium">Service delivery</td>
                        <td className="p-4 text-muted-foreground">Images, account info</td>
                        <td className="p-4 text-muted-foreground">Contract</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-4 text-muted-foreground font-medium">
                          Payment processing
                        </td>
                        <td className="p-4 text-muted-foreground">Payment details</td>
                        <td className="p-4 text-muted-foreground">Contract</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-4 text-muted-foreground font-medium">Support</td>
                        <td className="p-4 text-muted-foreground">Email, usage data</td>
                        <td className="p-4 text-muted-foreground">Legitimate interest</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-muted-foreground font-medium">
                          Service improvement
                        </td>
                        <td className="p-4 text-muted-foreground">Anonymized usage</td>
                        <td className="p-4 text-muted-foreground">Legitimate interest</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  4. Data Security
                </h2>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3">Protection Measures:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">🔐</span>
                      <div>
                        <p className="font-semibold text-foreground">Encryption</p>
                        <p className="text-sm text-muted-foreground">In transit and at rest</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">🏢</span>
                      <div>
                        <p className="font-semibold text-foreground">Secure data centers</p>
                        <p className="text-sm text-muted-foreground">(AWS/Tigris)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">👥</span>
                      <div>
                        <p className="font-semibold text-foreground">Limited access</p>
                        <p className="text-sm text-muted-foreground">
                          To authorized personnel only
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">🔄</span>
                      <div>
                        <p className="font-semibold text-foreground">Regular security audits</p>
                        <p className="text-sm text-muted-foreground">And updates</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">⚡</span>
                      <div>
                        <p className="font-semibold text-foreground">Immediate image deletion</p>
                        <p className="text-sm text-muted-foreground">Post-processing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Third-Party Services */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  5. Third-Party Services
                </h2>

                <p className="text-muted-foreground mb-4">We work with trusted partners:</p>

                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-4 font-semibold text-foreground border-b border-border">
                          Service
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground border-b border-border">
                          Purpose
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground border-b border-border">
                          Data Shared
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-4 text-muted-foreground font-semibold">Paddle</td>
                        <td className="p-4 text-muted-foreground">Payment processing</td>
                        <td className="p-4 text-muted-foreground">Payment details</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-4 text-muted-foreground font-semibold">Replicate</td>
                        <td className="p-4 text-muted-foreground">AI processing</td>
                        <td className="p-4 text-muted-foreground">Images (temporarily)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-4 text-muted-foreground font-semibold">AWS/Tigris</td>
                        <td className="p-4 text-muted-foreground">Secure storage</td>
                        <td className="p-4 text-muted-foreground">Images (temporarily)</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-muted-foreground font-semibold">MongoDB</td>
                        <td className="p-4 text-muted-foreground">Database</td>
                        <td className="p-4 text-muted-foreground">Account information</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  6. Your Rights (India & Global)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">You can:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-green-500">✅</span>
                        <div>
                          <p className="font-semibold text-foreground">Access</p>
                          <p className="text-sm">Your personal data</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-blue-500">✏️</span>
                        <div>
                          <p className="font-semibold text-foreground">Correct</p>
                          <p className="text-sm">Incorrect information</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-red-500">🗑️</span>
                        <div>
                          <p className="font-semibold text-foreground">Delete</p>
                          <p className="text-sm">Your account and data</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-purple-500">📤</span>
                        <div>
                          <p className="font-semibold text-foreground">Export</p>
                          <p className="text-sm">Your data</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-orange-500">🛑</span>
                        <div>
                          <p className="font-semibold text-foreground">Object</p>
                          <p className="text-sm">To processing</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">📧</span>
                        <div>
                          <p className="font-semibold text-foreground">Contact us</p>
                          <p className="text-sm">At {AppConfig.contact.email}</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Data Retention:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">👤</span>
                        <div>
                          <p className="font-semibold text-foreground">Account data</p>
                          <p className="text-sm">Until deletion requested</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">💳</span>
                        <div>
                          <p className="font-semibold text-foreground">Payment records</p>
                          <p className="text-sm">7 years (legal requirement)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">📸</span>
                        <div>
                          <p className="font-semibold text-foreground">Images</p>
                          <p className="text-sm">Deleted immediately after processing</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">📊</span>
                        <div>
                          <p className="font-semibold text-foreground">Usage logs</p>
                          <p className="text-sm">1 year (anonymized)</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Contact Us */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  7. Contact Us
                </h2>
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {AppConfig.company.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">📧</span>
                      <div>
                        <p className="font-semibold text-foreground">Email</p>
                        <p className="text-muted-foreground">{AppConfig.contact.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">📍</span>
                      <div>
                        <p className="font-semibold text-foreground">Address</p>
                        <p className="text-muted-foreground">{AppConfig.company.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">🕒</span>
                      <div>
                        <p className="font-semibold text-foreground">Hours</p>
                        <p className="text-muted-foreground">9 AM - 6 PM IST (Mon-Fri)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">⚡</span>
                      <div>
                        <p className="font-semibold text-foreground">Response</p>
                        <p className="text-muted-foreground">Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Indian Privacy Compliance */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  8. Indian Privacy Compliance
                </h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <p className="text-muted-foreground mb-3">This policy complies with:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary">🇮🇳</span>
                      <strong className="text-foreground">Information Technology Act, 2000</strong>
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary">📋</span>
                      <strong className="text-foreground">IT Rules, 2011</strong>
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary">🌐</span>
                      <strong className="text-foreground">GDPR</strong> (for EU users)
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary">🔒</span>
                      <strong className="text-foreground">
                        Digital Personal Data Protection Act, 2023
                      </strong>
                    </li>
                  </ul>
                </div>
              </section>
            </div>

            <hr className="my-8 border-border" />

            <div className="text-center text-sm text-muted-foreground">
              <p>
                <em>
                  Your privacy matters to us. We&apos;re committed to transparent and secure data
                  practices.
                </em>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
