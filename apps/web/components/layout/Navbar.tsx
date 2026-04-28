'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'
import { User, LayoutDashboard, CalendarCheck, Heart, ShieldCheck, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, profile, loading, signOut, isAdmin } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tours', path: '/tours' },
    { name: 'AI Planner', path: '/ai-planner' },
    { name: 'Hidden Gems', path: '/hidden-gems' },
  ]

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 mt-1">
              <img src="/logo.png" alt="TripMeet Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-blue-600">TripMeet</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(link.path) 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!loading && (
              <>
                {user ? (
                  <div className="relative ml-3">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {profile?.avatar_url ? (
                        <img className="h-8 w-8 rounded-full" src={profile.avatar_url} alt="Avatar" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                      )}
                    </button>
                    
                    {dropdownOpen && (
                      <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none overflow-hidden">
                        {/* User info header */}
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-900 truncate">{profile?.full_name || 'Traveler'}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          {isAdmin ? (
                            <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-50">
                              <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                            </Link>
                          ) : (
                            <>
                              <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <LayoutDashboard className="w-4 h-4" /> My Dashboard
                              </Link>
                              <Link href="/dashboard?tab=bookings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <CalendarCheck className="w-4 h-4" /> My Bookings
                              </Link>
                              <Link href="/dashboard?tab=wishlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <Heart className="w-4 h-4" /> Wishlist
                              </Link>
                              <Link href="/dashboard?tab=profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <User className="w-4 h-4" /> Profile
                              </Link>
                            </>
                          )}
                        </div>
                        <div className="border-t border-gray-100 py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <LogOut className="w-4 h-4" /> Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <Link href="/auth/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                      Login
                    </Link>
                    <Link href="/auth/signup" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                      Sign up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                  isActive(link.path)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          {!loading && (
            <div className="border-t border-gray-200 pb-3 pt-4">
              {user ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{profile?.full_name || 'User'}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {isAdmin ? (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-base font-medium text-purple-700 hover:bg-purple-50 rounded">
                        <ShieldCheck className="w-5 h-5" /> Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                          <LayoutDashboard className="w-5 h-5" /> My Dashboard
                        </Link>
                        <Link href="/dashboard?tab=bookings" className="flex items-center gap-2 px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                          <CalendarCheck className="w-5 h-5" /> My Bookings
                        </Link>
                        <Link href="/dashboard?tab=wishlist" className="flex items-center gap-2 px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                          <Heart className="w-5 h-5" /> Wishlist
                        </Link>
                        <Link href="/dashboard?tab=profile" className="flex items-center gap-2 px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                          <User className="w-5 h-5" /> Profile
                        </Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 w-full text-left rounded">
                      <LogOut className="w-5 h-5" /> Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1 px-4">
                  <Link href="/auth/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 border rounded mb-2">
                    Login
                  </Link>
                  <Link href="/auth/signup" className="block px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
