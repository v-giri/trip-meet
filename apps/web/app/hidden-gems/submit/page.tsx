'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase'
import { useAuth } from '../../../hooks/useAuth'
import LocationPicker from '../../../components/gems/LocationPicker'
import { MapPin, Image as ImageIcon, Send, CheckCircle, ChevronLeft } from 'lucide-react'

export default function SubmitGemPage() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'adventure',
    nearest_city: '',
    estimated_cost: '',
    best_time_to_visit: '',
  })
  
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3)
      setImages(files)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('You must be logged in to submit a hidden gem.')
      return
    }

    if (!location) {
      setError('Please pick a location on the map.')
      return
    }
    if (form.description.length < 50) {
      setError('Description must be at least 50 characters.')
      return
    }

    setSubmitting(true)

    try {
      // Upload images
      const imageUrls: string[] = []
      
      for (const file of images) {
        const path = `gems/${user.id}-${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from('gem-images').upload(path, file)
        if (uploadError) throw uploadError
        
        const { data } = supabase.storage.from('gem-images').getPublicUrl(path)
        imageUrls.push(data.publicUrl)
      }

      // Insert record
      const { error: dbError } = await supabase.from('hidden_gems').insert([{
        ...form,
        lat: location.lat,
        lng: location.lng,
        images: imageUrls,
        status: 'pending',
        submitted_by: user.id
      }])

      if (dbError) throw dbError

      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to submit the gem.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Submission Received!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for sharing your secret spot. Our team will review your submission to ensure quality. It usually takes 24 hours.
          </p>
          <div className="space-y-3">
            <Link href="/hidden-gems" className="block w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition">
              Back to Khazana Map
            </Link>
            <Link href="/dashboard" className="block w-full bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition">
              View My Submissions
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/hidden-gems" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-6 transition">
          <ChevronLeft className="w-4 h-4" /> Back to Map
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Share a Hidden Gem</h1>
          <p className="text-gray-500">Know a secret spot? Add it to the Khazana Map for others to explore carefully.</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-medium text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Left Column: Form Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Place Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. Secret Waterfall of Coorg" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nearest City *</label>
                  <input required value={form.nearest_city} onChange={e => setForm({...form, nearest_city: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. Madikeri" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition">
                      <option value="adventure">Adventure</option>
                      <option value="peaceful">Peaceful</option>
                      <option value="budget">Budget</option>
                      <option value="couple">Couple</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Estimated Cost</label>
                    <input value={form.estimated_cost} onChange={e => setForm({...form, estimated_cost: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. ₹500/person" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Description * <span className="text-gray-400 font-normal text-xs ml-1">(min 50 chars)</span></label>
                  <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="How to reach, what to expect, and any tips..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Best Time to Visit</label>
                  <input value={form.best_time_to_visit} onChange={e => setForm({...form, best_time_to_visit: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. Early morning in Monsoon" />
                </div>
              </div>

              {/* Right Column: Location & Photos */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500"/> Pin Location *</label>
                  <LocationPicker 
                    onLocationSelect={(lat, lng) => setLocation({lat, lng})} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-green-500"/> Upload Photos <span className="text-gray-400 font-normal text-xs">(max 3)</span></label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageChange} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition cursor-pointer"
                  />
                  {images.length > 0 && (
                    <div className="flex gap-3 flex-wrap mt-4">
                      {images.map((img, i) => (
                        <div key={i} className="w-20 h-20 rounded-xl overflow-hidden shadow-sm border">
                          <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="preview" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="pt-8 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={submitting} 
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-extrabold text-lg px-8 py-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : <><Send className="w-5 h-5"/> Submit Location</>}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
