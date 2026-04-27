'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, ChevronLeft, ChevronRight, Star } from 'lucide-react'

const PAGE_SIZE = 10

function TourFormModal({ tour, onClose, onSaved }: { tour: any | null; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: tour?.title || '',
    slug: tour?.slug || '',
    category: tour?.category || 'family',
    description: tour?.description || '',
    short_description: tour?.short_description || '',
    price_per_person: tour?.price_per_person || '',
    duration_days: tour?.duration_days || '',
    destination: tour?.destination || '',
    inclusions: (tour?.inclusions || []).join('\n'),
    exclusions: (tour?.exclusions || []).join('\n'),
    is_domestic: tour?.is_domestic ?? true,
    is_featured: tour?.is_featured ?? false,
    is_active: tour?.is_active ?? true,
  })
  const [itinerary, setItinerary] = useState<any[]>(tour?.itinerary || [])
  const [images, setImages] = useState<string[]>(tour?.images || [])

  const addDay = () => setItinerary(prev => [...prev, { day: prev.length + 1, title: '', description: '', activities: [] }])
  const removeDay = (i: number) => setItinerary(prev => prev.filter((_, idx) => idx !== i))
  const updateDay = (i: number, field: string, value: string) =>
    setItinerary(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: value } : d))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    for (const file of files) {
      const path = `tours/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('tour-images').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('tour-images').getPublicUrl(path)
        setImages(prev => [...prev, data.publicUrl])
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      price_per_person: parseFloat(form.price_per_person as string) || null,
      duration_days: parseInt(form.duration_days as string) || null,
      inclusions: form.inclusions.split('\n').filter(Boolean),
      exclusions: form.exclusions.split('\n').filter(Boolean),
      itinerary,
      images,
    }
    if (tour?.id) {
      await supabase.from('tours').update(payload).eq('id', tour.id)
    } else {
      await supabase.from('tours').insert([payload])
    }
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-xl">
        <div className="flex items-center justify-between px-8 py-5 border-b">
          <h2 className="text-xl font-bold text-gray-900">{tour ? 'Edit Tour' : 'Add New Tour'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Title *</label><input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" placeholder="Tour Title" /></div>
            <div><label className="label">Slug</label><input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="input" placeholder="tour-slug" /></div>
            <div><label className="label">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">
                <option value="family">Family</option><option value="honeymoon">Honeymoon</option><option value="group">Group</option><option value="student">Student</option>
              </select>
            </div>
            <div><label className="label">Destination *</label><input required value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} className="input" /></div>
            <div><label className="label">Price/Person (₹) *</label><input required type="number" value={form.price_per_person} onChange={e => setForm({...form, price_per_person: e.target.value})} className="input" /></div>
            <div><label className="label">Duration (Days) *</label><input required type="number" value={form.duration_days} onChange={e => setForm({...form, duration_days: e.target.value})} className="input" /></div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_domestic} onChange={e => setForm({...form, is_domestic: e.target.checked})} /> Domestic</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} /> Featured</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active</label>
            </div>
          </div>
          <div><label className="label">Short Description</label><textarea rows={2} value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})} className="input" /></div>
          <div><label className="label">Full Description</label><textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input" /></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="label">Inclusions (one per line)</label><textarea rows={4} value={form.inclusions} onChange={e => setForm({...form, inclusions: e.target.value})} className="input" placeholder="Hotel accommodation&#10;Breakfast&#10;Transport" /></div>
            <div><label className="label">Exclusions (one per line)</label><textarea rows={4} value={form.exclusions} onChange={e => setForm({...form, exclusions: e.target.value})} className="input" placeholder="Airfare&#10;Personal expenses" /></div>
          </div>

          {/* Itinerary Builder */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="label mb-0">Day-wise Itinerary</label>
              <button type="button" onClick={addDay} className="text-sm bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 transition flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Day
              </button>
            </div>
            <div className="space-y-3">
              {itinerary.map((day, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-sm text-gray-700">Day {day.day}</span>
                    <button type="button" onClick={() => removeDay(i)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                  </div>
                  <input value={day.title} onChange={e => updateDay(i, 'title', e.target.value)} className="input mb-2" placeholder="Day title" />
                  <textarea rows={2} value={day.description} onChange={e => updateDay(i, 'description', e.target.value)} className="input" placeholder="Day description" />
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="block text-sm text-gray-500 mb-3" />
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border font-medium text-gray-700 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Tour'}
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`.label{display:block;font-size:.8rem;font-weight:600;color:#374151;margin-bottom:4px}.input{width:100%;border:1px solid #d1d5db;border-radius:.75rem;padding:.6rem .75rem;font-size:.875rem;outline:none;transition:all .2s}.input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgb(59 130 246/.15)}`}</style>
    </div>
  )
}

export default function AdminToursPage() {
  const supabase = createClient()
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [modalTour, setModalTour] = useState<any | null | undefined>(undefined) // undefined = closed

  const load = async () => {
    setLoading(true)
    const { data, count } = await supabase
      .from('tours').select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
    setTours(data || [])
    setTotal(count || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [page])

  const toggleField = async (id: string, field: 'is_active' | 'is_featured', val: boolean) => {
    await supabase.from('tours').update({ [field]: !val }).eq('id', id)
    load()
  }

  const deleteTour = async (id: string) => {
    if (!confirm('Delete this tour? This cannot be undone.')) return
    await supabase.from('tours').delete().eq('id', id)
    load()
  }

  const pages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Tours</h1>
          <p className="text-gray-500 mt-1">{total} tours in database</p>
        </div>
        <button onClick={() => setModalTour(null)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition">
          <Plus className="w-5 h-5" /> Add Tour
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Destination</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Active</th>
                <th className="px-6 py-3 text-left">Featured</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
              ) : tours.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900 max-w-[180px] truncate">{t.title}</td>
                  <td className="px-6 py-4 capitalize text-gray-600">{t.category}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-[120px] truncate">{t.destination}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{Number(t.price_per_person).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleField(t.id, 'is_active', t.is_active)} className={t.is_active ? 'text-green-600' : 'text-gray-400'}>
                      {t.is_active ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleField(t.id, 'is_featured', t.is_featured)} className={t.is_featured ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}>
                      <Star className={`w-5 h-5 ${t.is_featured ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setModalTour(t)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteTour(t.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && tours.length === 0 && <p className="text-center text-gray-400 py-12">No tours found. Add one!</p>}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Page {page + 1} of {pages}</span>
            <div className="flex gap-2">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {modalTour !== undefined && (
        <TourFormModal tour={modalTour} onClose={() => setModalTour(undefined)} onSaved={load} />
      )}
    </div>
  )
}
