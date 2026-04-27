'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase'
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react'

const PAGE_SIZE = 10
const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
}

function BookingDetailModal({ booking, onClose, onUpdate }: { booking: any; onClose: () => void; onUpdate: () => void }) {
  const supabase = createClient()
  const [updating, setUpdating] = useState(false)

  const updateStatus = async (status: string) => {
    setUpdating(true)
    await supabase.from('bookings').update({ status }).eq('id', booking.id)
    setUpdating(false)
    onUpdate()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="font-bold text-lg">Booking Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <dl className="grid grid-cols-2 gap-3">
            <div><dt className="text-gray-500 font-medium">Booking ID</dt><dd className="font-mono text-xs mt-1 text-gray-800">{booking.id}</dd></div>
            <div><dt className="text-gray-500 font-medium">Status</dt><dd className="mt-1"><span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-700'}`}>{booking.status}</span></dd></div>
            <div><dt className="text-gray-500 font-medium">User</dt><dd className="font-semibold mt-1">{booking.profiles?.full_name || 'Guest'}</dd></div>
            <div><dt className="text-gray-500 font-medium">Tour</dt><dd className="font-semibold mt-1 truncate">{booking.tours?.title || '—'}</dd></div>
            <div><dt className="text-gray-500 font-medium">Travel Date</dt><dd className="mt-1">{booking.travel_date ? new Date(booking.travel_date).toLocaleDateString('en-IN') : '—'}</dd></div>
            <div><dt className="text-gray-500 font-medium">Travelers</dt><dd className="mt-1">{booking.traveler_count}</dd></div>
            <div><dt className="text-gray-500 font-medium">Total Paid</dt><dd className="font-bold text-green-700 mt-1 text-base">₹{Number(booking.total_price).toLocaleString('en-IN')}</dd></div>
            <div><dt className="text-gray-500 font-medium">Payment ID</dt><dd className="font-mono text-xs mt-1 text-gray-600 truncate">{booking.payment_id || '—'}</dd></div>
          </dl>
          {booking.special_requests && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-500 font-medium mb-1">Special Requests</p>
              <p className="text-gray-700">{booking.special_requests}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-5 border-t flex gap-3 flex-wrap">
          {['pending', 'confirmed', 'cancelled'].filter(s => s !== booking.status).map(status => (
            <button key={status} disabled={updating} onClick={() => updateStatus(status)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm capitalize transition disabled:opacity-50 ${status === 'confirmed' ? 'bg-green-600 text-white hover:bg-green-700' : status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'}`}
            >
              Mark {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminBookingsPage() {
  const supabase = createClient()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<any | null>(null)

  const load = async () => {
    setLoading(true)
    let query = supabase
      .from('bookings')
      .select('*, profiles(full_name, phone), tours(title)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (filter !== 'All') query = query.eq('status', filter.toLowerCase())
    const { data, count } = await query
    setBookings(data || [])
    setTotal(count || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter, page])

  const filtered = search
    ? bookings.filter(b =>
        b.id.includes(search) ||
        b.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
      )
    : bookings

  const pages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Bookings</h1>
        <p className="text-gray-500 mt-1">{total} total bookings</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or name…" className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex gap-2">
            {['All', 'Pending', 'Confirmed', 'Cancelled'].map(s => (
              <button key={s} onClick={() => { setFilter(s); setPage(0) }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === s ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >{s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Tour</th>
                <th className="px-6 py-3 text-left">Travel Date</th>
                <th className="px-6 py-3 text-left">Travelers</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
              ) : filtered.map(b => (
                <tr key={b.id} className="hover:bg-blue-50/30 cursor-pointer transition" onClick={() => setSelected(b)}>
                  <td className="px-6 py-4 font-semibold text-gray-900">{b.profiles?.full_name || 'Guest'}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-[160px] truncate">{b.tours?.title || '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{b.travel_date ? new Date(b.travel_date).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{b.traveler_count}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{Number(b.total_price).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-700'}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && <p className="text-center text-gray-400 py-12">No bookings match the current filters.</p>}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <span className="text-sm text-gray-500">Page {page + 1} of {pages}</span>
            <div className="flex gap-2">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {selected && <BookingDetailModal booking={selected} onClose={() => setSelected(null)} onUpdate={load} />}
    </div>
  )
}
