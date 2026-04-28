'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import TourCard from '../../components/tours/TourCard'
import {
  CalendarCheck, Heart, Gem, User, MapPin, Clock, Users,
  CheckCircle, X, AlertCircle, Camera, Download, Eye, ChevronRight
} from 'lucide-react'

type Tab = 'bookings' | 'wishlist' | 'gems' | 'profile'

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: any }> = {
  confirmed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle },
  cancelled: { bg: 'bg-red-100', text: 'text-red-600', icon: X },
}
const GEM_STATUS_STYLES: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending:  'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-600',
}

// ─── Booking Detail Modal ────────────────────────────────────────────────────
function BookingModal({ booking, onClose }: { booking: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="font-bold text-lg text-gray-900">Booking Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-3 text-sm">
          <dl className="grid grid-cols-2 gap-3">
            <div><dt className="text-gray-500">Booking ID</dt><dd className="font-mono text-xs font-bold mt-0.5 text-gray-800">{booking.id.slice(-12).toUpperCase()}</dd></div>
            <div><dt className="text-gray-500">Status</dt>
              <dd className="mt-0.5"><span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLES[booking.status]?.bg} ${STATUS_STYLES[booking.status]?.text}`}>{booking.status}</span></dd>
            </div>
            <div><dt className="text-gray-500">Tour</dt><dd className="font-semibold mt-0.5 text-gray-800">{booking.tours?.title || '—'}</dd></div>
            <div><dt className="text-gray-500">Destination</dt><dd className="mt-0.5 text-gray-700">{booking.tours?.destination || '—'}</dd></div>
            <div><dt className="text-gray-500">Travel Date</dt><dd className="mt-0.5 text-gray-700">{booking.travel_date ? new Date(booking.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</dd></div>
            <div><dt className="text-gray-500">Travelers</dt><dd className="mt-0.5 text-gray-700">{booking.traveler_count}</dd></div>
            <div className="col-span-2 pt-2 border-t">
              <dt className="text-gray-500">Total Paid</dt>
              <dd className="font-extrabold text-green-700 text-xl mt-0.5">₹{Number(booking.total_price).toLocaleString('en-IN')}</dd>
            </div>
          </dl>
          {booking.special_requests && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-500 text-xs mb-1 font-medium">Special Requests</p>
              <p className="text-gray-700">{booking.special_requests}</p>
            </div>
          )}
        </div>
        <div className="px-6 pb-6">
          <button onClick={onClose} className="w-full border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition">Close</button>
        </div>
      </div>
    </div>
  )
}

// ─── TABS ────────────────────────────────────────────────────────────────────
function BookingsTab({ userId }: { userId: string }) {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('bookings').select('*, tours(title, destination, images, duration_days)').eq('user_id', userId).order('created_at', { ascending: false })
      .then(({ data }) => { setBookings(data || []); setLoading(false) })
  }, [userId])

  const cancelBooking = async (id: string) => {
    if (!confirm('Cancel this booking?')) return
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
  }

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

  if (bookings.length === 0) return (
    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <CalendarCheck className="w-14 h-14 text-gray-300 mx-auto mb-4" />
      <p className="text-xl font-bold text-gray-700 mb-2">No bookings yet</p>
      <Link href="/tours" className="text-blue-600 hover:underline font-medium flex items-center justify-center gap-1">Explore Tours <ChevronRight className="w-4 h-4" /></Link>
    </div>
  )

  return (
    <>
      <div className="space-y-4">
        {bookings.map(b => {
          const s = STATUS_STYLES[b.status] || STATUS_STYLES.pending
          const SIcon = s.icon
          return (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-40 h-32 sm:h-auto bg-gray-100 flex-shrink-0 overflow-hidden">
                {b.tours?.images?.[0]
                  ? <img src={b.tours.images[0]} className="w-full h-full object-cover" alt="" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-300"><MapPin className="w-8 h-8" /></div>
                }
              </div>
              <div className="p-5 flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 space-y-1.5">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{b.tours?.title || 'Tour'}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{b.tours?.destination || '—'}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{b.travel_date ? new Date(b.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{b.traveler_count} travelers</span>
                  </div>
                  <p className="font-extrabold text-gray-900 text-lg">₹{Number(b.total_price).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex flex-col gap-2 items-start sm:items-end">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize ${s.bg} ${s.text}`}>
                    <SIcon className="w-3.5 h-3.5" /> {b.status}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setSelected(b)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                    {b.status === 'confirmed' && (
                      <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                        <Download className="w-3.5 h-3.5" /> Confirm
                      </button>
                    )}
                    {b.status === 'pending' && (
                      <button onClick={() => cancelBooking(b.id)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {selected && <BookingModal booking={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function WishlistTab({ userId }: { userId: string }) {
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('wishlists').select('*, tours(*)').eq('user_id', userId)
      .then(({ data }) => { setWishlist(data || []); setLoading(false) })
  }, [userId])

  const remove = async (wishlistId: string) => {
    await supabase.from('wishlists').delete().eq('id', wishlistId)
    setWishlist(prev => prev.filter(w => w.id !== wishlistId))
  }

  if (loading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

  if (wishlist.length === 0) return (
    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <Heart className="w-14 h-14 text-gray-300 mx-auto mb-4" />
      <p className="text-xl font-bold text-gray-700 mb-2">No saved tours yet</p>
      <Link href="/tours" className="text-blue-600 hover:underline font-medium flex items-center justify-center gap-1">Browse Tours <ChevronRight className="w-4 h-4" /></Link>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist.map(w => (
        <div key={w.id} className="relative">
          <TourCard tour={w.tours} />
          <button onClick={() => remove(w.id)} className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur rounded-full p-2 shadow hover:bg-red-50 hover:text-red-500 transition" title="Remove from wishlist">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          </button>
        </div>
      ))}
    </div>
  )
}

function GemsTab({ userId }: { userId: string }) {
  const [gems, setGems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('hidden_gems').select('id, name, category, nearest_city, status, created_at').eq('submitted_by', userId).order('created_at', { ascending: false })
      .then(({ data }) => { setGems(data || []); setLoading(false) })
  }, [userId])

  if (loading) return <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>

  if (gems.length === 0) return (
    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <Gem className="w-14 h-14 text-gray-300 mx-auto mb-4" />
      <p className="text-xl font-bold text-gray-700 mb-2">Haven't submitted a gem yet?</p>
      <Link href="/hidden-gems/submit" className="text-green-600 hover:underline font-medium flex items-center justify-center gap-1">Share a hidden place! <ChevronRight className="w-4 h-4" /></Link>
    </div>
  )

  return (
    <div className="space-y-3">
      {gems.map(g => (
        <div key={g.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900">{g.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5"><MapPin className="w-3.5 h-3.5" />{g.nearest_city} · <span className="capitalize">{g.category}</span></p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-gray-400">{new Date(g.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${GEM_STATUS_STYLES[g.status] || 'bg-gray-100 text-gray-600'}`}>{g.status}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfileTab({ user, profile }: { user: any; profile: any }) {
  const supabase = createClient()
  const [form, setForm] = useState({ full_name: profile?.full_name || '', phone: profile?.phone || '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const [newPwd, setNewPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await supabase.from('profiles').update({ full_name: form.full_name, phone: form.phone, avatar_url: avatarUrl }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `avatars/${user.id}-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('user-avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('user-avatars').getPublicUrl(path)
      setAvatarUrl(data.publicUrl)
    }
    setUploading(false)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPwd.length < 8) { setPwdMsg('Password must be at least 8 characters.'); return }
    const { error } = await supabase.auth.updateUser({ password: newPwd })
    setPwdMsg(error ? error.message : 'Password updated successfully!')
    if (!error) setNewPwd('')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h3 className="font-bold text-xl text-gray-900 mb-6">Profile Information</h3>
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-blue-100 mb-3">
            {avatarUrl
              ? <img src={avatarUrl} className="w-full h-full object-cover" alt="" />
              : <div className="w-full h-full flex items-center justify-center text-blue-600 font-extrabold text-4xl">{form.full_name?.charAt(0) || '?'}</div>
            }
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer rounded-full">
              <Camera className="w-6 h-6 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>
          <p className="text-sm text-gray-400">{uploading ? 'Uploading…' : 'Hover to change avatar'}</p>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input value={user?.email || ''} disabled className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 9876543210" />
          </div>
          <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50">
            {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 self-start">
        <h3 className="font-bold text-xl text-gray-900 mb-6">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Minimum 8 characters" />
          </div>
          {pwdMsg && <p className={`text-sm font-medium ${pwdMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{pwdMsg}</p>}
          <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition">
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, profile, loading, isAdmin } = useAuth()
  const initialTab = (searchParams.get('tab') as Tab) || 'bookings'
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login?redirect=/dashboard')
    if (!loading && isAdmin) router.replace('/admin')
  }, [loading, user, isAdmin, router])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="h-24 bg-gray-200 rounded-3xl" />
        <div className="h-14 bg-gray-200 rounded-2xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  )

  if (!user) return null

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'bookings', label: 'My Bookings', icon: CalendarCheck },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'gems', label: 'My Gems', icon: Gem },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 mb-8 flex items-center gap-6 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30 flex-shrink-0">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
              : <span className="text-2xl font-extrabold">{profile?.full_name?.charAt(0) || '?'}</span>
            }
          </div>
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Traveler'}! 👋
            </h1>
            <p className="text-blue-100 mt-1">{user.email}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-8 flex overflow-x-auto gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition ${activeTab === id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'bookings' && <BookingsTab userId={user.id} />}
        {activeTab === 'wishlist' && <WishlistTab userId={user.id} />}
        {activeTab === 'gems' && <GemsTab userId={user.id} />}
        {activeTab === 'profile' && <ProfileTab user={user} profile={profile} />}

      </div>
    </div>
  )
}
