import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | TripMeet',
  description: 'Learn how TripMeet collects, uses, and protects your personal information.',
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

const toc = [
  { id: 'collect', title: 'Information We Collect' },
  { id: 'use', title: 'How We Use Your Information' },
  { id: 'sharing', title: 'Information Sharing' },
  { id: 'cookies', title: 'Cookies and Tracking' },
  { id: 'security', title: 'Security' },
  { id: 'rights', title: 'Your Rights' },
  { id: 'children', title: 'Children\'s Privacy' },
  { id: 'changes', title: 'Changes to This Policy' },
  { id: 'contact', title: 'Contact Us' },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Contents</p>
            <nav className="space-y-2">
              {toc.map(t => (
                <a key={t.id} href={`#${t.id}`} className="block text-sm text-gray-500 hover:text-blue-600 hover:underline transition py-0.5">{t.title}</a>
              ))}
            </nav>
          </div>
        </aside>
        <main className="lg:col-span-3">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Privacy Policy</h1>
            <p className="text-sm text-gray-400">Last updated: April 27, 2026</p>
          </div>

          <Section id="collect" title="1. Information We Collect">
            <p><strong>Account Information:</strong> Name, email address, phone number, and profile photo when you register.</p>
            <p><strong>Booking Information:</strong> Travel dates, number of travelers, special requests, and payment details (processed securely via Razorpay).</p>
            <p><strong>Usage Data:</strong> Pages visited, features used, search queries, and preferences to personalize your experience.</p>
            <p><strong>User Content:</strong> Hidden gem submissions, photos, and any other content you post on the platform.</p>
          </Section>

          <Section id="use" title="2. How We Use Your Information">
            <p>We use your information to process bookings and payments, send booking confirmations and updates, generate personalized AI travel itineraries, improve our platform, and communicate promotional offers (with your consent).</p>
          </Section>

          <Section id="sharing" title="3. Information Sharing">
            <p>We do not sell your personal data. We may share information with tour operators to fulfill your booking, payment processors (Razorpay), analytics providers, and law enforcement when required by law.</p>
          </Section>

          <Section id="cookies" title="4. Cookies and Tracking">
            <p>We use essential cookies for authentication and session management, analytics cookies to understand platform usage, and preference cookies to remember your settings. You can manage cookie preferences via your browser settings.</p>
          </Section>

          <Section id="security" title="5. Security">
            <p>We use industry-standard encryption (TLS/SSL) and security measures, including Supabase's Row Level Security policies, to protect your data. No method of transmission is 100% secure, and we cannot guarantee absolute security.</p>
          </Section>

          <Section id="rights" title="6. Your Rights">
            <p>Under applicable Indian data protection laws, you have the right to access, correct, or delete your personal data. You may exercise these rights by contacting us at privacy@tripmeet.in or through your Dashboard profile settings.</p>
          </Section>

          <Section id="children" title="7. Children's Privacy">
            <p>TripMeet is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with their data, please contact us immediately.</p>
          </Section>

          <Section id="changes" title="8. Changes to This Policy">
            <p>We may update this Privacy Policy periodically. We will notify you of significant changes by email or by posting a prominent notice on our website. Continued use of TripMeet after changes constitutes your acceptance.</p>
          </Section>

          <Section id="contact" title="9. Contact Us">
            <p>For any privacy-related questions or requests, contact us at <a href="mailto:privacy@tripmeet.in" className="text-blue-600 underline">privacy@tripmeet.in</a>.</p>
          </Section>
        </main>
      </div>
    </div>
  )
}
