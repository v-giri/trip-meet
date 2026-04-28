import Link from 'next/link'
import { MapPin, Mail, MessageCircle, ArrowUpRight } from 'lucide-react'

const footerLinks = {
  'Explore': [
    { label: 'All Tours', href: '/tours' },
    { label: 'AI Trip Planner', href: '/ai-planner' },
    { label: 'Khazana Map', href: '/hidden-gems' },
    { label: 'Submit a Gem', href: '/hidden-gems/submit' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  'Legal': [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Refund Policy', href: '/refund' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="TripMeet Logo" className="h-12 w-auto bg-white p-1 rounded-xl shadow-sm" />
              <span className="font-extrabold text-white text-2xl tracking-tight">TripMeet</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              AI-powered travel planning for authentic Indian experiences. Plan smarter, discover deeper.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition font-medium">
                <MessageCircle className="w-4 h-4" /> +91 1234567890
              </a>
              <a href="mailto:[EMAIL_ADDRESS]" className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition">
                <Mail className="w-4 h-4" /> [EMAIL_ADDRESS]
              </a>
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">{group}</h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-gray-400 hover:text-white transition">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} TripMeet Private Limited. All rights reserved.</p>
          <p className="text-xs text-gray-600">Made with ❤️ in India  </p>
        </div>
      </div>
    </footer>
  )
}
