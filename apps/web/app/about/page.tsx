import type { Metadata } from 'next'
import { MapPin, Heart, Sparkles, Users, Globe, Gem } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | TripMeet — AI-Powered Travel for India',
  description: 'Learn about TripMeet\'s mission to make travel planning magical for every Indian traveler.',
  openGraph: { title: 'About TripMeet', description: 'Our story, mission, and team.' },
}

const team = [
  { name: 'Arjun Sharma', role: 'Co-Founder & CEO', avatar: 'AS', color: 'bg-blue-100 text-blue-700' },
  { name: 'Priya Nair', role: 'Co-Founder & CTO', avatar: 'PN', color: 'bg-purple-100 text-purple-700' },
  { name: 'Rohan Gupta', role: 'Head of Product', avatar: 'RG', color: 'bg-teal-100 text-teal-700' },
  { name: 'Meera Iyer', role: 'Lead Designer', avatar: 'MI', color: 'bg-pink-100 text-pink-700' },
]

const benefits = [
  { icon: Sparkles, title: 'AI-Powered Planning', desc: 'Gemini 1.5 Pro crafts personalised day-wise itineraries in seconds, not hours.' },
  { icon: Gem, title: 'Hidden Gems Network', desc: 'Our community uncovers offbeat destinations that no travel agency ever shows you.' },
  { icon: Heart, title: 'Authentic Experiences', desc: 'We focus on local culture, real food, and experiences that create stories worth telling.' },
]

const stats = [
  { value: '500+', label: 'Destinations Covered' },
  { value: '10,000+', label: 'Happy Travelers' },
  { value: '1,200+', label: 'Hidden Gems Listed' },
  { value: '50+', label: 'Expert Itineraries' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-blue-300 font-semibold uppercase tracking-widest mb-4 text-sm">Our Mission</p>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Travel Smarter.<br />Discover Deeper.
          </h1>
          <p className="text-xl text-blue-100 font-light max-w-2xl mx-auto">
            TripMeet combines AI intelligence with community-sourced hidden gems to bring you the most authentic travel experiences across India and beyond.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold text-blue-700 mb-1">{s.value}</p>
              <p className="text-gray-500 font-medium text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>TripMeet was born out of frustration. Our founders — a group of passionate Indian travelers — were tired of cookie-cutter tour packages that missed the soul of every destination.</p>
              <p>In 2024, we set out to build something different: a platform that uses cutting-edge AI to craft personalised itineraries, while tapping into a community of local explorers to surface hidden gems that no travel agency would ever tell you about.</p>
              <p>Today, TripMeet is trusted by thousands of travelers who want authentic, meaningful experiences — not just checkmark tourism.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl" />
            <div className="h-48 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-3xl mt-8" />
            <div className="h-48 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-3xl -mt-4" />
            <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl mt-4" />
          </div>
        </div>
      </section>

      {/* Why TripMeet */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Why TripMeet?</h2>
          <p className="text-gray-500 text-lg">Everything you need to plan the perfect trip, in one place.</p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-gray-500 text-lg">Travelers who built the tool they always wished existed.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map(m => (
              <div key={m.name} className="text-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-extrabold text-2xl mx-auto mb-4 ${m.color}`}>{m.avatar}</div>
                <h3 className="font-bold text-gray-900">{m.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
