import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import AppConfig from '@/lib/app-config';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border shadow-sm p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Refund Policy</h1>
              <p className="text-lg text-muted-foreground">Last updated: July 13, 2025</p>
            </div>

            <div className="space-y-8">
              {/* No Refund Policy */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  1. No Refunds Policy
                </h2>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-destructive text-xl">🚫</span>
                    <h3 className="text-xl font-bold text-destructive">STRICT NO REFUND POLICY</h3>
                  </div>
                  <p className="text-foreground font-medium">
                    <strong>{AppConfig.company.name}</strong> operates a{' '}
                    <strong>100% NO REFUND</strong> policy for BG Eraser. All credit purchases are
                    final and non-refundable.
                  </p>
                </div>
              </section>

              {/* Why No Refunds */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  2. Why No Refunds?
                </h2>
                <h3 className="text-lg font-semibold text-foreground mb-3">Simple Reasons:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <span className="text-xl">🎁</span>
                    <div>
                      <p className="font-semibold text-foreground">Free trial available</p>
                      <p className="text-sm text-muted-foreground">3 credits for new users</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <span className="text-xl">⚡</span>
                    <div>
                      <p className="font-semibold text-foreground">Instant service</p>
                      <p className="text-sm text-muted-foreground">Credits used immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <span className="text-xl">💰</span>
                    <div>
                      <p className="font-semibold text-foreground">Low cost</p>
                      <p className="text-sm text-muted-foreground">
                        Starting from $0.08 per credit
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <span className="text-xl">🔧</span>
                    <div>
                      <p className="font-semibold text-foreground">AI processing costs</p>
                      <p className="text-sm text-muted-foreground">Real costs incurred per use</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* What's NOT Refundable */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  3. What&apos;s NOT Refundable
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-4 font-semibold text-foreground border-b border-border">
                          Situation
                        </th>
                        <th className="text-center p-4 font-semibold text-foreground border-b border-border">
                          Refund
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground border-b border-border">
                          Explanation
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          icon: '😞',
                          situation: 'Unsatisfied with results',
                          refund: '❌',
                          explanation: 'Try free credits first',
                        },
                        {
                          icon: '🐛',
                          situation: 'Technical issues',
                          refund: '❌',
                          explanation: 'We provide support instead',
                        },
                        {
                          icon: '💳',
                          situation: 'Unused credits',
                          refund: '❌',
                          explanation: 'Credits never expire',
                        },
                        {
                          icon: '🤔',
                          situation: 'Changed mind',
                          refund: '❌',
                          explanation: 'All sales are final',
                        },
                        {
                          icon: '⏸️',
                          situation: 'Service downtime',
                          refund: '❌',
                          explanation: 'Temporary issues happen',
                        },
                        {
                          icon: '🔒',
                          situation: 'Account suspended',
                          refund: '❌',
                          explanation: 'Due to terms violation',
                        },
                      ].map((row, index) => (
                        <tr key={index} className="border-b border-border last:border-b-0">
                          <td className="p-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span>{row.icon}</span>
                              <strong className="text-foreground">{row.situation}</strong>
                            </div>
                          </td>
                          <td className="p-4 text-center text-lg">{row.refund}</td>
                          <td className="p-4 text-muted-foreground">{row.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Try Before You Buy */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  4. Try Before You Buy
                </h2>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🎯</span>
                    <h3 className="text-lg font-semibold text-foreground">We Encourage Testing:</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-primary">🆓</span>
                      <strong className="text-foreground">3 free credits</strong> for all new users
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-primary">📸</span>
                      <strong className="text-foreground">Test with your images</strong> before
                      purchasing
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-primary">✅</span>
                      <strong className="text-foreground">Check quality</strong> and processing
                      speed
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-primary">💪</span>
                      <strong className="text-foreground">Verify satisfaction</strong> before buying
                      credits
                    </li>
                  </ul>
                </div>
              </section>

              {/* Billing Disputes */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  5. Billing Disputes
                </h2>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3">Only Exception - Fraud:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-red-500">🚨</span>
                      <strong className="text-foreground">Unauthorized transactions only</strong>
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-blue-500">📧</span>
                      <strong className="text-foreground">Email us immediately:</strong>{' '}
                      {AppConfig.contact.email}
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-green-500">🕵️</span>
                      <strong className="text-foreground">We investigate</strong> genuine fraud
                      cases
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-purple-500">⚡</span>
                      <strong className="text-foreground">Quick resolution</strong> within 3-5
                      business days
                    </li>
                  </ul>
                </div>
              </section>

              {/* Legal Framework */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  6. Legal Framework
                </h2>
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3">Indian Consumer Laws:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary">📜</span>
                      <strong className="text-foreground">
                        Consumer Protection Act, 2019:
                      </strong>{' '}
                      Digital services exemption
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary">🏛️</span>
                      <strong className="text-foreground">Jurisdiction:</strong> Kolkata, West
                      Bengal courts
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary">⚖️</span>
                      <strong className="text-foreground">Governing law:</strong> Indian law applies
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary">🤝</span>
                      <strong className="text-foreground">Arbitration:</strong> Preferred dispute
                      resolution
                    </li>
                  </ul>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                  7. Contact Information
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
                        <p className="text-muted-foreground">9 AM - 6 PM IST (Mon-Fri)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">⚡</span>
                      <div>
                        <p className="font-semibold text-foreground">Response Time</p>
                        <p className="text-muted-foreground">Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Important Reminders */}
              <section>
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">💡</span>
                    <h3 className="text-lg font-semibold text-foreground">Before You Purchase:</h3>
                  </div>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li className="text-muted-foreground">
                      <span className="text-primary">✅</span>{' '}
                      <strong className="text-foreground">Use your 3 free credits</strong>
                    </li>
                    <li className="text-muted-foreground">
                      <span className="text-primary">📸</span>{' '}
                      <strong className="text-foreground">Test with your actual images</strong>
                    </li>
                    <li className="text-muted-foreground">
                      <span className="text-primary">✅</span>{' '}
                      <strong className="text-foreground">
                        Verify the quality meets your needs
                      </strong>
                    </li>
                    <li className="text-muted-foreground">
                      <span className="text-primary">💳</span>{' '}
                      <strong className="text-foreground">Only then purchase credits</strong>
                    </li>
                  </ol>
                  <div className="mt-4 p-3 bg-destructive/10 rounded border border-destructive/20">
                    <p className="text-center font-bold text-destructive">
                      Remember: ALL SALES ARE FINAL!
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <hr className="my-8 border-border" />

            <div className="text-center text-sm text-muted-foreground">
              <p>
                This policy complies with Indian consumer protection laws and digital service
                regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
