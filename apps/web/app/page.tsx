import Link from 'next/link'
import { Suspense } from 'react'
import { createServerSupabaseClient } from '../lib/supabase-server'
import { MapPin, Calendar, Users, Search, Compass, Heart, Map, Sparkles, Star, ChevronRight } from 'lucide-react'

// --- SKELETONS --- //
function TourCardSkeleton() {
  return (
    <div className="border rounded-xl shadow-sm bg-white overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex justify-between pt-2">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  )
}

function GemCardSkeleton() {
  return (
    <div className="border rounded-xl shadow-sm bg-white overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  )
}

function GridSkeleton({ count = 3, type = 'tour' }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        type === 'tour' ? <TourCardSkeleton key={i} /> : <GemCardSkeleton key={i} />
      ))}
    </div>
  )
}

// --- DATA FETCHING COMPONENTS --- //
async function FeaturedTours() {
  const supabase = createServerSupabaseClient()
  const { data: tours, error } = await supabase
    .from('tours')
    .select('*')
    .eq('is_featured', true)
    .limit(3)

  if (error || !tours || tours.length === 0) {
    return <div className="text-gray-500 text-center py-8">No featured tours available right now. Check back later!</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour: any) => (
        <div key={tour.id} className="border rounded-xl shadow-sm bg-white overflow-hidden flex flex-col hover:shadow-md transition">
          <div className="h-48 w-full bg-gray-200 relative">
            {tour.images && tour.images.length > 0 ? (
              <img src={tour.images[0]} alt={tour.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
            )}
            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-blue-600">
              ₹{tour.price_per_person?.toLocaleString('en-IN')}
            </div>
            <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> {tour.destination}
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg leading-tight line-clamp-1">{tour.title}</h3>
                <div className="flex items-center text-yellow-500 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-current mr-1" /> 4.8
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                {tour.duration_days} Days • {tour.category}
              </p>
            </div>
            <Link href={`/tours/${tour.id}`} className="block w-full text-center bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-100 transition">
              Book Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

async function HiddenGems() {
  const supabase = createServerSupabaseClient()
  const { data: gems, error } = await supabase
    .from('hidden_gems')
    .select('*')
    .eq('status', 'approved')
    .limit(3)

  if (error || !gems || gems.length === 0) {
    return <div className="text-gray-500 text-center py-8">More hidden gems are being discovered! Check back soon.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gems.map((gem: any) => (
        <div key={gem.id} className="border border-green-100 rounded-xl overflow-hidden hover:shadow-lg transition group block bg-white">
          <div className="h-40 bg-gray-200 overflow-hidden relative">
            {gem.images && gem.images.length > 0 ? (
              <img src={gem.images[0]} alt={gem.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-600"><MapPin /></div>
            )}
            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
              {gem.category || 'Gem'}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 group-hover:text-green-700 transition">{gem.name}</h3>
            <div className="text-sm text-gray-500 flex items-center mb-2">
              <MapPin className="w-3 h-3 mr-1" /> {gem.nearest_city}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">{gem.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// --- MAIN PAGE LAYOUT --- //
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-teal-500 -z-10" />
        <div className="absolute inset-0 opacity-10 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-md">
            Meet Your Next Journey with TripMeet
          </h1>
          <p className="text-lg md:text-xl lg:text-3xl text-blue-100 max-w-3xl mx-auto mb-10 font-light drop-shadow">
            AI-powered itineraries, hidden gems, and unforgettable experiences curated just for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/ai-planner" className="bg-white text-blue-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-50 hover:shadow-xl transition flex items-center justify-center transform hover:-translate-y-1">
              <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
              Plan My Trip with AI
            </Link>
            <Link href="/tours" className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition flex items-center justify-center transform hover:-translate-y-1">
              <Compass className="w-5 h-5 mr-2" />
              Explore Tours
            </Link>
          </div>
        </div>
        
        {/* Curved Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full text-white fill-current block" preserveAspectRatio="none">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. SEARCH BAR (Overlapping Hero) */}
      <section className="max-w-5xl mx-auto px-4 -mt-20 relative z-20 mb-16">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" placeholder="Where to?" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Dates</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" placeholder="Add dates" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Travelers</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="number" min="1" placeholder="Guests" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
              </div>
            </div>
            <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center transition shadow-md w-full">
              <Search className="w-5 h-5 mr-2" />
              Search Tours
            </button>
          </form>
        </div>
      </section>

      {/* 3. TOUR CATEGORIES */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Family', tours: '120+', icon: Users, color: 'text-orange-500', bg: 'bg-orange-100' },
              { title: 'Honeymoon', tours: '85+', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100' },
              { title: 'Group', tours: '150+', icon: Compass, color: 'text-blue-500', bg: 'bg-blue-100' },
              { title: 'Student Budget', tours: '200+', icon: Map, color: 'text-green-500', bg: 'bg-green-100' },
            ].map((cat, i) => (
              <Link key={i} href={`/tours?category=${cat.title.toLowerCase()}`} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition text-center border border-gray-100 group">
                <div className={`${cat.bg} ${cat.color} w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{cat.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{cat.tours} Tours</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED TOURS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Featured Tours</h2>
            <p className="text-gray-600 text-lg">Handpicked experiences for your next adventure.</p>
          </div>
          <Link href="/tours" className="hidden sm:flex text-blue-600 font-semibold hover:text-blue-800 items-center">
            See all <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {/* Suspense Boundary for Data Fetching */}
        <Suspense fallback={<GridSkeleton count={3} type="tour" />}>
          <FeaturedTours />
        </Suspense>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/tours" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center">
            View all tours <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* 5. AI PLANNER CTA SECTION */}
      <section className="py-24 bg-gradient-to-r from-indigo-900 to-blue-900 text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-20 transform translate-x-1/3 -translate-y-1/4 pointer-events-none">
          <svg width="600" height="600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-blue-800 text-blue-200 font-semibold px-4 py-1.5 rounded-full text-sm mb-6 border border-blue-700 shadow-sm">
              Powered by Gemini 1.5 Pro
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Don't know where to start? Let AI build it.</h2>
            <p className="text-blue-100 text-xl md:text-2xl mb-10 font-light drop-shadow">
              Tell us your vibe, budget, and dates. Our AI Travel Planner constructs a day-by-day itinerary complete with hidden gems, must-see spots, and realistic timelines in seconds.
            </p>
            <Link href="/ai-planner" className="bg-white text-blue-900 font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-gray-100 transition inline-flex items-center text-lg transform hover:-translate-y-1">
              <Sparkles className="w-5 h-5 mr-3 text-blue-600" /> Generate My Itinerary
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl relative text-gray-800 transform rotate-1 hover:rotate-0 transition-transform">
            <div className="absolute -left-6 top-6 bg-teal-500 text-white text-sm font-bold px-4 py-1.5 rounded shadow-xl">Example Output</div>
            <div className="bg-white p-6 rounded-2xl shadow-inner">
              <h4 className="font-bold text-2xl mb-6 text-gray-900 border-b pb-4">Day 1: Cultural Immersion in Jaipur</h4>
              <div className="space-y-6">
                <div className="flex">
                  <div className="w-20 font-bold text-blue-600 text-lg">09:00</div>
                  <div className="flex-1 border-l-2 border-blue-200 pl-6 pb-6 relative">
                    <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1.5 border-2 border-white"></div>
                    <h5 className="font-bold text-lg text-gray-900">Amber Fort Exploration</h5>
                    <p className="text-base text-gray-600 mt-1">Start early to beat the crowds. Cost: ₹500/person. Take an elephant ride or walk up.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-20 font-bold text-teal-600 text-lg">13:30</div>
                  <div className="flex-1 border-l-2 border-teal-200 pl-6 relative pb-2">
                    <div className="absolute w-4 h-4 bg-teal-500 rounded-full -left-[9px] top-1.5 border-2 border-white"></div>
                    <h5 className="font-bold text-lg text-gray-900">Lunch at Chokhi Dhani</h5>
                    <p className="text-base text-gray-600 mt-1">Authentic Rajasthani thali experience with cultural performances.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HIDDEN GEMS TEASER */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">The Khazana Map</h2>
          <p className="text-xl text-gray-600 font-light">Discover off-the-beaten-path locations and hidden gems submitted by our community of passionate travelers.</p>
        </div>

        <Suspense fallback={<GridSkeleton count={3} type="gem" />}>
          <HiddenGems />
        </Suspense>

        <div className="text-center mt-16">
          <Link href="/hidden-gems" className="bg-green-600 text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:bg-green-700 transition inline-flex items-center text-lg transform hover:-translate-y-1">
            <Compass className="w-6 h-6 mr-3" /> Explore All Hidden Gems
          </Link>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="py-24 bg-gray-50 border-y border-gray-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-16">How TripMeet Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center relative">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-white z-10">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-2xl mb-4 text-gray-900">1. Search & Filter</h3>
              <p className="text-gray-600 text-lg px-4">Find curated group tours or build custom requests based on your unique travel style.</p>
              <div className="hidden md:block absolute top-12 left-[60%] w-full border-t-2 border-dashed border-gray-300 -z-10 mt-1"></div>
            </div>
            <div className="flex flex-col items-center relative">
              <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-white z-10">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-2xl mb-4 text-gray-900">2. Let AI Plan It</h3>
              <p className="text-gray-600 text-lg px-4">Use our advanced AI planner to instantly generate a personalized day-by-day itinerary.</p>
              <div className="hidden md:block absolute top-12 left-[60%] w-full border-t-2 border-dashed border-gray-300 -z-10 mt-1"></div>
            </div>
            <div className="flex flex-col items-center relative">
              <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-white z-10">
                <Compass className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-2xl mb-4 text-gray-900">3. You Travel safely</h3>
              <p className="text-gray-600 text-lg px-4">Book with ease, manage itineraries on your dashboard, and enjoy your unforgettable trip.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Traveler Stories</h2>
          <p className="text-xl text-gray-600 font-light">What our community is saying about TripMeet</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Priya S.", loc: "Mumbai", text: "The AI planner saved me hours of research! Our family trip to Kerala was perfectly planned down to the hour." },
            { name: "Rahul D.", loc: "Delhi", text: "Found an incredible hidden gem cafe in Manali through the Khazana Map. This platform is a game-changer." },
            { name: "Ananya & Rohan", loc: "Bangalore", text: "Booked our honeymoon through TripMeet. The seamless booking and clear itinerary gave us peace of mind." }
          ].map((t, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-100 p-8 rounded-2xl shadow-sm text-left hover:shadow-md transition">
              <div className="flex text-yellow-400 mb-6">
                <Star className="fill-current w-5 h-5"/>
                <Star className="fill-current w-5 h-5"/>
                <Star className="fill-current w-5 h-5"/>
                <Star className="fill-current w-5 h-5"/>
                <Star className="fill-current w-5 h-5"/>
              </div>
              <p className="text-gray-700 italic mb-8 text-lg leading-relaxed">"{t.text}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex justify-center items-center text-white font-bold text-xl mr-4 shadow-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
