'use client'

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { createClient } from '../../lib/supabase'

interface CustomTourModalProps {
  isOpen: boolean
  onClose: () => void
  tourDestination?: string
}

export default function CustomTourModal({ isOpen, onClose, tourDestination }: CustomTourModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: tourDestination || '',
    travel_date: '',
    duration_days: '',
    budget: '',
    traveler_count: '2',
    special_requirements: ''
  })
  
  const supabase = createClient()

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Check if user is logged in to attach user_id
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('custom_tour_requests').insert([
      {
        ...formData,
        user_id: user?.id || null,
        duration_days: parseInt(formData.duration_days) || null,
        budget: parseFloat(formData.budget) || null,
        traveler_count: parseInt(formData.traveler_count) || null,
      }
    ])

    setLoading(false)

    if (!error) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 3000)
    } else {
      alert("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8 relative">
        <div className="absolute top-0 right-0 p-4">
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {success ? (
          <div className="p-12 text-center h-full flex flex-col justify-center items-center">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Sent!</h2>
            <p className="text-gray-600 text-lg">Our travel experts will review your details and contact you within 24 hours to craft your perfect itinerary.</p>
          </div>
        ) : (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request a Custom Tour</h2>
            <p className="text-gray-500 mb-8">Tell us what you're looking for, and we'll build a personalized itinerary just for you.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Destination *</label>
                  <input required name="destination" value={formData.destination} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500" placeholder="e.g. Kerala, Bali" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Approx. Travel Date</label>
                  <input type="date" name="travel_date" value={formData.travel_date} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (Days)</label>
                  <input type="number" name="duration_days" value={formData.duration_days} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500" placeholder="5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Travelers</label>
                  <input type="number" min="1" name="traveler_count" value={formData.traveler_count} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total Budget (₹)</label>
                  <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500" placeholder="e.g. 50000" />
                </div>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Special Requirements or Notes</label>
                <textarea name="special_requirements" rows={3} value={formData.special_requirements} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500" placeholder="Tell us about the vibe you want, dietary needs, specific places you want to visit..."></textarea>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition w-full md:w-auto disabled:opacity-50 flex justify-center items-center">
                  {loading ? 'Submitting...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
