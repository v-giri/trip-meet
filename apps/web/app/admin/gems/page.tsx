'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '../../../lib/supabase'
import { Check, X, Trash2, Plus, Pencil, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 10

function GemFormModal({ gem, onClose, onSaved }: { gem: any | null; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: gem?.name || '',
    description: gem?.description || '',
    category: gem?.category || 'adventure',
    nearest_city: gem?.nearest_city || '',
    estimated_cost: gem?.estimated_cost || '',
    best_time_to_visit: gem?.best_time_to_visit || '',
    lat: gem?.lat || '',
    lng: gem?.lng || '',
    status: gem?.status || 'approved',
  })
  const [images, setImages] = useState<string[]>(gem?.images || [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    for (const file of files) {
      const path = `gems/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('gem-images').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('gem-images').getPublicUrl(path)
        setImages(prev => [...prev, data.publicUrl])
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      lat: form.lat ? parseFloat(form.lat as string) : null,
      lng: form.lng ? parseFloat(form.lng as string) : null,
      images,
      is_manual: true,
    }
    if (gem?.id) {
      await supabase.from('hidden_gems').update(payload).eq('id', gem.id)
    } else {
      await supabase.from('hidden_gems').insert([{ ...payload, submitted_by: null }])
    }
    setSaving(false)
    onSaved()
    onClose()
  }

  const inp = "w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
  const lbl = "block text-sm font-semibold text-gray-700 mb-1"

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl">
        <div className="flex items-center justify-between px-8 py-5 border-b">
          <h2 className="text-xl font-bold">{gem ? 'Edit Gem' : 'Add Hidden Gem'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="p-8 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className={lbl}>Name *</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inp} /></div>
            <div className="md:col-span-2"><label className={lbl}>Description *</label><textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inp} /></div>
            <div><label className={lbl}>Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inp}>
                <option value="adventure">Adventure</option><option value="peaceful">Peaceful</option><option value="budget">Budget</option><option value="couple">Couple</option>
              </select>
            </div>
            <div><label className={lbl}>Nearest City *</label><input required value={form.nearest_city} onChange={e => setForm({...form, nearest_city: e.target.value})} className={inp} /></div>
            <div><label className={lbl}>Estimated Cost</label><input value={form.estimated_cost} onChange={e => setForm({...form, estimated_cost: e.target.value})} className={inp} placeholder="₹500–₹1500/person" /></div>
            <div><label className={lbl}>Best Time to Visit</label><input value={form.best_time_to_visit} onChange={e => setForm({...form, best_time_to_visit: e.target.value})} className={inp} /></div>
            <div><label className={lbl}>Latitude</label><input type="number" step="any" value={form.lat} onChange={e => setForm({...form, lat: e.target.value})} className={inp} /></div>
            <div><label className={lbl}>Longitude</label><input type="number" step="any" value={form.lng} onChange={e => setForm({...form, lng: e.target.value})} className={inp} /></div>
            <div><label className={lbl}>Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inp}>
                <option value="approved">Approved</option><option value="pending">Pending</option><option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div>
            <label className={lbl}>Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="block text-sm text-gray-500 mb-2" />
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => setImages(p => p.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border font-medium text-gray-700 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-8 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-50">{saving ? 'Saving…' : 'Save Gem'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminGemsPage() {
  const supabase = createClient()
  const [tab, setTab] = useState<'pending' | 'all'>('pending')
  const [gems, setGems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [modalGem, setModalGem] = useState<any | undefined>(undefined)

  const load = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('hidden_gems').select('*', { count: 'exact' }).order('created_at', { ascending: false })
    if (tab === 'pending') query = query.eq('status', 'pending')
    query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
    const { data, count } = await query
    setGems(data || [])
    setTotal(count || 0)
    setLoading(false)
  }, [tab, page])

  useEffect(() => { load() }, [load])

  const setStatus = async (id: string, status: string) => {
    await supabase.from('hidden_gems').update({ status }).eq('id', id)
    load()
  }

  const deleteGem = async (id: string) => {
    if (!confirm('Delete this gem permanently?')) return
    await supabase.from('hidden_gems').delete().eq('id', id)
    load()
  }

  const pages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Hidden Gems</h1>
          <p className="text-gray-500 mt-1">{total} in current view</p>
        </div>
        {tab === 'all' && (
          <button onClick={() => setModalGem(null)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl shadow transition">
            <Plus className="w-5 h-5" /> Add Gem
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {(['pending', 'all'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setPage(0) }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm capitalize transition ${tab === t ? 'bg-green-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >{t === 'pending' ? 'Pending Submissions' : 'All Gems'}</button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />)}</div>
      ) : tab === 'pending' ? (
        <div className="space-y-6">
          {gems.map(g => (
            <div key={g.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4">
                {g.images?.[0] ? (
                  <img src={g.images[0]} className="h-40 md:h-full w-full object-cover" alt="" />
                ) : (
                  <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400"><MapPin className="w-8 h-8" /></div>
                )}
                <div className="p-6 md:col-span-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-900">{g.name}</h3>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold capitalize">{g.category}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{g.nearest_city}</p>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{g.description}</p>
                  {g.estimated_cost && <p className="text-xs text-gray-500 mb-1">Cost: {g.estimated_cost}</p>}
                  {g.best_time_to_visit && <p className="text-xs text-gray-500 mb-4">Best time: {g.best_time_to_visit}</p>}
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => setStatus(g.id, 'approved')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => setStatus(g.id, 'rejected')} className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-bold px-4 py-2 rounded-xl text-sm transition">
                      <X className="w-4 h-4" /> Reject
                    </button>
                    <button onClick={() => setModalGem(g)} className="flex items-center gap-2 text-gray-600 border border-gray-200 hover:bg-gray-50 font-medium px-4 py-2 rounded-xl text-sm transition">
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {gems.length === 0 && <div className="text-center text-gray-400 py-16 bg-white rounded-2xl border border-dashed border-gray-200"><Check className="w-12 h-12 mx-auto mb-3 text-green-400" /><p className="font-medium">All submissions reviewed!</p></div>}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">City</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {gems.map(g => (
                  <tr key={g.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{g.name}</td>
                    <td className="px-6 py-4 capitalize text-gray-600">{g.category}</td>
                    <td className="px-6 py-4 text-gray-600">{g.nearest_city}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${g.status === 'approved' ? 'bg-green-100 text-green-700' : g.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{g.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setModalGem(g)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => deleteGem(g.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {gems.length === 0 && <p className="text-center text-gray-400 py-12">No gems found.</p>}
          </div>
          {pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <span className="text-sm text-gray-500">Page {page + 1} of {pages}</span>
              <div className="flex gap-2">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                <button disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {modalGem !== undefined && <GemFormModal gem={modalGem} onClose={() => setModalGem(undefined)} onSaved={load} />}
    </div>
  )
}
