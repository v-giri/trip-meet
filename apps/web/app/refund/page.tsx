import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | TripMeet',
  description: 'Understand TripMeet\'s cancellation and refund process.',
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
  { id: 'overview', title: 'Overview' },
  { id: 'cancellation-by-user', title: 'Cancellation by User' },
  { id: 'cancellation-by-us', title: 'Cancellation by TripMeet' },
  { id: 'refund-process', title: 'Refund Process' },
  { id: 'non-refundable', title: 'Non-Refundable Items' },
  { id: 'contact', title: 'Contact for Disputes' },
]

export default function RefundPage() {
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
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Refund & Cancellation Policy</h1>
            <p className="text-sm text-gray-400">Last updated: April 27, 2026</p>
          </div>

          <Section id="overview" title="1. Overview">
            <p>At TripMeet, we understand that plans can change. This policy outlines the conditions under which cancellations and refunds are processed. Please read this carefully before making a booking.</p>
          </Section>

          <Section id="cancellation-by-user" title="2. Cancellation by User">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Cancellation Timeline</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Refund Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-200 px-4 py-3">More than 30 days before travel</td><td className="border border-gray-200 px-4 py-3 text-green-700 font-semibold">100% refund</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-4 py-3">15–30 days before travel</td><td className="border border-gray-200 px-4 py-3 text-yellow-600 font-semibold">75% refund</td></tr>
                  <tr><td className="border border-gray-200 px-4 py-3">7–14 days before travel</td><td className="border border-gray-200 px-4 py-3 text-orange-600 font-semibold">50% refund</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-4 py-3">Less than 7 days before travel</td><td className="border border-gray-200 px-4 py-3 text-red-600 font-semibold">No refund</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-3">* Cancellations must be submitted through your Dashboard or by emailing bookings@tripmeet.in.</p>
          </Section>

          <Section id="cancellation-by-us" title="3. Cancellation by TripMeet">
            <p>In rare circumstances (natural disasters, operator issues, force majeure), TripMeet may need to cancel a confirmed booking. In such cases, you will receive a full 100% refund to your original payment method within 5–7 business days.</p>
          </Section>

          <Section id="refund-process" title="4. Refund Process">
            <p>All approved refunds are processed to your original payment method (credit/debit card or UPI) via Razorpay. Processing time is typically <strong>5–7 business days</strong>, though your bank may take an additional 2–3 days to reflect the credit.</p>
          </Section>

          <Section id="non-refundable" title="5. Non-Refundable Items">
            <p>The following are not eligible for refunds: convenience fees charged by Razorpay, fees for special add-ons once services have been rendered, and bookings marked as non-refundable at the time of purchase.</p>
          </Section>

          <Section id="contact" title="6. Contact for Disputes">
            <p>If you have any concerns about a refund, please reach out to us at <a href="mailto:bookings@tripmeet.in" className="text-blue-600 underline">bookings@tripmeet.in</a> or WhatsApp +91 98765 43210. We are committed to resolving disputes within 48 hours.</p>
          </Section>
        </main>
      </div>
    </div>
  )
}
