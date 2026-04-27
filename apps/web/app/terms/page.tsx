import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | TripMeet',
  description: 'Read TripMeet\'s Terms of Service.',
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

const toc = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'services', title: 'Description of Services' },
  { id: 'accounts', title: 'User Accounts' },
  { id: 'bookings', title: 'Bookings and Payments' },
  { id: 'conduct', title: 'User Conduct' },
  { id: 'intellectual', title: 'Intellectual Property' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'termination', title: 'Termination' },
  { id: 'governing', title: 'Governing Law' },
  { id: 'contact', title: 'Contact Us' },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* TOC */}
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

        {/* Content */}
        <main className="lg:col-span-3">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Terms of Service</h1>
            <p className="text-sm text-gray-400">Last updated: April 27, 2026</p>
          </div>

          <Section id="acceptance" title="1. Acceptance of Terms">
            <p>By accessing or using TripMeet's website, mobile application, or any related services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </Section>

          <Section id="services" title="2. Description of Services">
            <p>TripMeet provides an AI-powered travel planning platform that includes personalized itinerary generation, curated tour packages, a hidden gems discovery network, and an online booking service. All services are provided "as is" and may be updated at any time.</p>
          </Section>

          <Section id="accounts" title="3. User Accounts">
            <p>You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your password and for all activity under your account. Notify us immediately at legal@tripmeet.in if you suspect unauthorized access.</p>
          </Section>

          <Section id="bookings" title="4. Bookings and Payments">
            <p>All bookings are subject to availability and confirmation. Prices are displayed in Indian Rupees (₹) and include applicable taxes. Payment is processed securely through Razorpay. Your booking is confirmed only when you receive a confirmation email from TripMeet.</p>
          </Section>

          <Section id="conduct" title="5. User Conduct">
            <p>You agree not to use TripMeet for any unlawful purpose, submit false or misleading hidden gem submissions, impersonate any person or entity, or interfere with the proper operation of the platform.</p>
          </Section>

          <Section id="intellectual" title="6. Intellectual Property">
            <p>All content on TripMeet, including text, graphics, logos, and AI-generated itineraries, is the property of TripMeet Private Limited and is protected under applicable Indian copyright laws.</p>
          </Section>

          <Section id="liability" title="7. Limitation of Liability">
            <p>To the maximum extent permitted by law, TripMeet shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid by you for the booking in question.</p>
          </Section>

          <Section id="termination" title="8. Termination">
            <p>We reserve the right to suspend or terminate your account at our discretion, particularly if you violate these Terms. You may delete your account at any time from your Dashboard settings.</p>
          </Section>

          <Section id="governing" title="9. Governing Law">
            <p>These Terms shall be governed by and interpreted under the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.</p>
          </Section>

          <Section id="contact" title="10. Contact Us">
            <p>For any questions regarding these Terms, please contact us at <a href="mailto:legal@tripmeet.in" className="text-blue-600 underline">legal@tripmeet.in</a> or via WhatsApp at +91 98765 43210.</p>
          </Section>
        </main>
      </div>
    </div>
  )
}
