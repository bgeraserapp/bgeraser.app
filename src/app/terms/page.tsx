import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import AppConfig from '@/lib/app-config';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border shadow-sm p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
              <p className="text-lg text-muted-foreground">Last updated: July 13, 2025</p>
            </div>

            <div className="space-y-8">
              {/* Agreement */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  1. Agreement
                </h2>
                <p className="text-muted-foreground">
                  By using BG Eraser, you agree to these terms. If you don&apos;t agree, please
                  service.
                </p>
              </section>

              {/* Our Service */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  2. Our Service
                </h2>
                <p className="text-muted-foreground mb-4">
                  BG Eraser is an AI-powered background removal service operated by{' '}
                  <strong className="text-foreground">{AppConfig.company.name}</strong>, a company
                  based in India. We help you remove backgrounds from images using advanced AI
                  technology.
                </p>

                <h3 className="text-lg font-semibold text-foreground mb-3">Service Features:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-green-500">✅</span>
                    <span>AI-powered background removal</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-green-500">✅</span>
                    <span>Support for PNG, JPEG, GIF, WebP (max 10MB)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-green-500">✅</span>
                    <span>Credit-based pricing system</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-green-500">✅</span>
                    <span>Instant processing and download</span>
                  </div>
                </div>
              </section>

              {/* Pricing & Credits */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  3. Pricing & Credits
                </h2>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full border border-border rounded-lg">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-4 font-semibold text-foreground border-b border-border">
                          Package
                        </th>
                        <th className="text-center p-4 font-semibold text-foreground border-b border-border">
                          Credits
                        </th>
                        <th className="text-center p-4 font-semibold text-foreground border-b border-border">
                          Price
                        </th>
                        <th className="text-center p-4 font-semibold text-foreground border-b border-border">
                          Per Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-4 text-muted-foreground font-medium">Starter</td>
                        <td className="p-4 text-center text-muted-foreground">50</td>
                        <td className="p-4 text-center text-muted-foreground">$4.99</td>
                        <td className="p-4 text-center text-muted-foreground">$0.10</td>
                      </tr>
                      <tr className="border-b border-border bg-primary/5">
                        <td className="p-4 text-muted-foreground font-medium">Popular</td>
                        <td className="p-4 text-center text-muted-foreground">100</td>
                        <td className="p-4 text-center text-muted-foreground">$9.99</td>
                        <td className="p-4 text-center text-muted-foreground">$0.10</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-muted-foreground font-medium">Pro</td>
                        <td className="p-4 text-center text-muted-foreground">250</td>
                        <td className="p-4 text-center text-muted-foreground">$19.99</td>
                        <td className="p-4 text-center text-muted-foreground">$0.08</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3">Important:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-xl">🎁</span>
                      <strong className="text-foreground">New users get 3 free credits</strong>
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-xl">💳</span>
                      <strong className="text-foreground">1 credit = 1 background removal</strong>
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-xl">⏰</span>
                      <strong className="text-foreground">Credits never expire</strong>
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-xl">🚫</span>
                      <strong className="text-destructive">NO REFUNDS - All sales final</strong>
                    </li>
                  </ul>
                </div>
              </section>

              {/* No Refund Policy */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  4. No Refund Policy
                </h2>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-destructive text-xl">⚠️</span>
                    <h3 className="text-lg font-bold text-destructive">
                      IMPORTANT: ALL PURCHASES ARE FINAL
                    </h3>
                  </div>
                  <p className="text-foreground mb-4">
                    We do not provide refunds for any reason including:
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Dissatisfaction with results</li>
                    <li>• Unused credits</li>
                    <li>• Technical issues</li>
                    <li>• Change of mind</li>
                  </ul>
                  <p className="text-foreground font-medium mt-4">
                    <strong>Try our 3 free credits before purchasing!</strong>
                  </p>
                </div>
              </section>

              {/* Usage Rules */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  5. Usage Rules
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                      <span>✅</span> Allowed:
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Personal and commercial use</li>
                      <li>• Images you own or have permission to use</li>
                      <li>• Standard image formats under 10MB</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                      <span>❌</span> Prohibited:
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Illegal or harmful content</li>
                      <li>• Copyright infringement</li>
                      <li>• Images of minors without authorization</li>
                      <li>• Abuse or exploitation of service</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Privacy & Data */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  6. Privacy & Data
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <span className="text-xl">🔒</span>
                    <div>
                      <p className="font-semibold text-foreground">
                        Your images are deleted immediately after processing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <span className="text-xl">🚫</span>
                    <div>
                      <p className="font-semibold text-foreground">
                        We don&apos;t store or use your images for training
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <span className="text-xl">📧</span>
                    <div>
                      <p className="font-semibold text-foreground">
                        We only collect necessary account information
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <span className="text-xl">🔐</span>
                    <div>
                      <p className="font-semibold text-foreground">
                        Payments processed securely by Paddle
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Service Availability */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  7. Service Availability
                </h2>
                <p className="text-muted-foreground mb-3">
                  We strive for 99% uptime but cannot guarantee uninterrupted service due to:
                </p>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• Maintenance windows</li>
                  <li>• Technical issues</li>
                  <li>• External dependencies</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  8. Limitation of Liability
                </h2>
                <p className="text-muted-foreground">
                  BG Eraser and {AppConfig.company.name} are not liable for any indirect damages or
                  losses arising from service use.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  9. Governing Law
                </h2>
                <p className="text-muted-foreground">
                  These terms are governed by{' '}
                  <strong className="text-foreground">Indian law</strong> and disputes will be
                  resolved in <strong className="text-foreground">Kolkata, India</strong>.
                </p>
              </section>

              {/* Contact Us */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  10. Contact Us
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
                        <p className="font-semibold text-foreground">Support Hours</p>
                        <p className="text-muted-foreground">9 AM - 6 PM IST (Monday-Friday)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <hr className="my-8 border-border" />

            <div className="text-center text-sm text-muted-foreground">
              <p>
                <em>This agreement is effective as of July 13, 2025</em>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
