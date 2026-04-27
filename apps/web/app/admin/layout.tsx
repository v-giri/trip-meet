'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { LayoutDashboard, Globe, CalendarCheck, Gem, Users, ChevronLeft, ChevronRight, LogOut, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/tours', label: 'Tours', icon: Globe },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/gems', label: 'Hidden Gems', icon: Gem },
  { href: '/admin/users', label: 'Users', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, loading, isAdmin, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace('/')
    }
  }, [loading, user, isAdmin, router])

  if (loading) {
    return <div className="min-h-screen bg-gray-900 animate-pulse" />
  }

  if (!user || !isAdmin) return null

  const handleSignOut = async () => { await signOut(); router.push('/') }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`bg-gray-900 text-gray-100 flex flex-col h-full transition-all duration-300 ${mobile ? 'w-72' : collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-800">
        {(!collapsed || mobile) && (
          <span className="text-xl font-extrabold text-white tracking-tight">TripMeet <span className="text-blue-400 text-sm font-semibold">Admin</span></span>
        )}
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition ml-auto">
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Admin Info */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-gray-800 ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-white text-sm">
          {profile?.full_name?.charAt(0) || 'A'}
        </div>
        {(!collapsed || mobile) && (
          <div className="overflow-hidden">
            <p className="font-semibold text-white text-sm truncate">{profile?.full_name || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition group ${active ? 'bg-blue-700 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'} ${collapsed && !mobile ? 'justify-center' : ''}`}
              title={collapsed && !mobile ? label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
              {(!collapsed || mobile) && label}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleSignOut}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-gray-800 text-sm font-medium transition ${collapsed && !mobile ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || mobile) && 'Sign Out'}
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-gray-900">TripMeet Admin</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
