'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'
import { Users, CalendarCheck, Wallet, Gem, TrendingUp } from 'lucide-react'

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, bookings: 0, revenue: 0, pendingGems: 0 })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [pendingGems, setPendingGems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [
        { count: users },
        { count: bookings },
        { data: bookingsData },
        { count: pendingGemsCount },
        { data: recentBookingsData },
        { data: pendingGemsData },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('total_price').eq('status', 'confirmed'),
        supabase.from('hidden_gems').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('bookings').select('id, travel_date, traveler_count, total_price, status, profiles(full_name), tours(title)').order('created_at', { ascending: false }).limit(10),
        supabase.from('hidden_gems').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
      ])

      const revenue = bookingsData?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0
      setStats({ users: users || 0, bookings: bookings || 0, revenue, pendingGems: pendingGemsCount || 0 })
      setRecentBookings(recentBookingsData || [])
      setPendingGems(pendingGemsData || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}</div>
      <div className="h-80 bg-gray-200 rounded-2xl" />
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of TripMeet platform activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={stats.users} icon={Users} color="bg-blue-100 text-blue-600" />
        <StatCard label="Total Bookings" value={stats.bookings} icon={CalendarCheck} color="bg-purple-100 text-purple-600" />
        <StatCard label="Revenue (Confirmed)" value={`₹${stats.revenue.toLocaleString('en-IN')}`} icon={Wallet} color="bg-green-100 text-green-600" />
        <StatCard label="Pending Gems" value={stats.pendingGems} icon={Gem} color="bg-orange-100 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-gray-900">Recent Bookings</h2>
            <a href="/admin/bookings" className="text-sm text-blue-600 hover:underline font-medium">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Tour</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{b.profiles?.full_name || 'Guest'}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-[140px]">{b.tours?.title || '—'}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{Number(b.total_price).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-700'}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentBookings.length === 0 && <p className="text-center text-gray-400 py-8">No bookings yet.</p>}
          </div>
        </div>

        {/* Pending Gems */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-gray-900">Pending Gems</h2>
            <a href="/admin/gems" className="text-sm text-blue-600 hover:underline font-medium">Review →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingGems.map(g => (
              <div key={g.id} className="px-6 py-4 flex items-center gap-3">
                {g.images?.[0] ? (
                  <img src={g.images[0]} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400"><Gem className="w-5 h-5"/></div>
                )}
                <div className="overflow-hidden">
                  <p className="font-medium text-gray-900 truncate">{g.name}</p>
                  <p className="text-xs text-gray-500">{g.nearest_city} · {g.category}</p>
                </div>
              </div>
            ))}
            {pendingGems.length === 0 && <p className="text-center text-gray-400 py-8">All clear! No pending submissions.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
