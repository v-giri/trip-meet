'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, MapPin, Calendar, Wallet, Users, Compass, Check, ArrowRight, Download, Save, RefreshCw, ChevronDown, ChevronUp, Plane } from 'lucide-react'
import { useAIPlanner } from '../../hooks/useAIPlanner'
import TourCard from '../../components/tours/TourCard'

export default function AIPlannerPage() {
  const { generateItinerary, saveItinerary, resetPlanner, loading, error, itinerary } = useAIPlanner()

  const [formData, setFormData] = useState({
    destination: '',
    days: 5,
    budget: 50000,
    travelType: 'Family',
    interests: [] as string[]
  })

  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true })
  const [isSaved, setIsSaved] = useState(false)
  
  const [tipIndex, setTipIndex] = useState(0)
  const loadingTips = [
    "Did you know? The Taj Mahal is slowly changing color due to pollution.",
    "Pro Tip: Always carry a reusable water bottle to reduce plastic waste.",
    "Bargaining is expected in many local Indian markets. Start at 50%!",
    "Indian trains are an experience! Booking 3A or 2A is best for tourists."
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (loading) {
      interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % loadingTips.length)
      }, 4000)
    }
    return () => clearInterval(interval)
  }, [loading])

  const interestOptions = ['Adventure', 'Culture', 'Food', 'Nature', 'Shopping', 'Relaxation']

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      const current = prev.interests
      if (current.includes(interest)) {
        return { ...prev, interests: current.filter(i => i !== interest) }
      } else {
        return { ...prev, interests: [...current, interest] }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.destination || formData.interests.length === 0) {
      alert('Please provide a destination and at least one interest.')
      return
    }
    const reqData = {
      ...formData,
      interests: formData.interests.join(', ')
    }
    generateItinerary(reqData)
  }

  const toggleDay = (day: number) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }))
  }

  const handleSave = async () => {
    const success = await saveItinerary()
    if (success) {
      setIsSaved(true)
    } else {
      alert("Failed to save. You might need to be logged in.")
    }
  }

  // --- STEP 2: LOADING VIEW ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-teal-800 flex flex-col items-center justify-center p-4">
        <div className="text-center relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
          
          <Sparkles className="w-20 h-20 text-blue-300 mx-auto mb-8 animate-bounce" />
          <h2 className="text-4xl font-extrabold text-white mb-6 drop-shadow-md">AI is planning your perfect trip...</h2>
          <p className="text-xl text-blue-200 font-light max-w-lg mx-auto mb-12">
            Analyzing optimal routes, authentic local experiences, and hidden gems in {formData.destination}.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-md mx-auto">
            <p className="text-blue-100 italic transition-opacity duration-500">"{loadingTips[tipIndex]}"</p>
          </div>
        </div>
      </div>
    )
  }

  // --- STEP 3: OUTPUT VIEW ---
  if (itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <button onClick={resetPlanner} className="text-blue-600 hover:text-blue-800 font-medium flex items-center mb-4 transition">
                <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Plan Another Trip
              </button>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{itinerary.destination} Itinerary</h1>
              <p className="text-lg text-gray-600 font-medium">Curated especially for your {formData.travelType.toLowerCase()} taking {itinerary.totalDays} days.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={handleSave} disabled={isSaved} className={`flex-1 md:flex-none border-2 font-bold px-6 py-2.5 rounded-xl transition flex items-center justify-center ${isSaved ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
                {isSaved ? <><Check className="w-4 h-4 mr-2" /> Saved</> : <><Save className="w-4 h-4 mr-2" /> Save</>}
              </button>
              <button className="flex-1 md:flex-none bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition flex items-center justify-center shadow-sm">
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Itinerary */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-start">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Best time to visit</h3>
                  <p className="text-gray-600">{itinerary.bestTimeToVisit}</p>
                </div>
              </div>

              {itinerary.days.map((day) => (
                <div key={day.day} className="bg-white border rounded-3xl shadow-sm overflow-hidden">
                  <div 
                    className="p-6 cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition border-b border-transparent group"
                    onClick={() => toggleDay(day.day)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="bg-blue-100 text-blue-700 font-bold w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                          D{day.day}
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition">{day.title}</h3>
                      </div>
                      <div className="text-gray-400">
                        {expandedDays[day.day] ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                      </div>
                    </div>
                    <p className="text-gray-600 ml-16 line-clamp-1">{day.description}</p>
                  </div>

                  {expandedDays[day.day] && (
                    <div className="p-6 pt-0 ml-16 mt-6">
                      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                        
                        {day.activities.map((act, i) => (
                          <div key={i} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm">
                              <span className="text-xs font-bold">{act.time.split(' ')[0]}</span>
                            </div>
                            
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border shadow-sm group-hover:border-blue-300 transition">
                              <h4 className="font-bold text-gray-900 text-lg mb-1">{act.activity}</h4>
                              <div className="flex items-center text-gray-500 text-sm mb-3">
                                <MapPin className="w-3.5 h-3.5 mr-1" /> {act.location}
                              </div>
                              {act.tips && (
                                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">{act.tips}</p>
                              )}
                              {act.estimatedCost > 0 && (
                                <div className="mt-3 text-sm font-semibold text-gray-700 bg-gray-100 inline-block px-2 py-1 rounded">
                                  Est: ₹{act.estimatedCost.toLocaleString('en-IN')}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                      </div>

                      <div className="mt-8 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                        <div className="flex items-center text-gray-700">
                          <Plane className="w-5 h-5 mr-3 text-blue-500" />
                          <span className="font-medium">Stay: {day.accommodation}</span>
                        </div>
                        <div className="text-sm font-bold text-gray-900 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                          Day Cost: ₹{day.estimatedDayCost.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column: Summaries */}
            <div className="lg:col-span-1 space-y-6 sticky top-24">
              
              {/* Cost Breakdown */}
              <div className="bg-white p-8 rounded-3xl border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Wallet className="w-32 h-32" />
                </div>
                <h3 className="font-extrabold text-2xl mb-6 text-gray-900 relative z-10">Estimated Cost</h3>
                
                <div className="space-y-6 relative z-10">
                  <div>
                    <div className="flex justify-between text-sm mb-2 text-gray-600 font-medium">
                      <span>Accommodation (~45%)</span>
                      <span className="font-bold text-gray-900">₹{Math.round((itinerary.estimatedTotalCost||0)*0.45).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2 text-gray-600 font-medium">
                      <span>Activities (~30%)</span>
                      <span className="font-bold text-gray-900">₹{Math.round((itinerary.estimatedTotalCost||0)*0.30).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2 text-gray-600 font-medium">
                      <span>Food (~25%)</span>
                      <span className="font-bold text-gray-900">₹{Math.round((itinerary.estimatedTotalCost||0)*0.25).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-4 border-t flex justify-between items-end">
                    <span className="text-gray-500 font-medium">Total (Estimated)</span>
                    <span className="font-extrabold text-3xl text-gray-900">₹{itinerary.estimatedTotalCost?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Packing Tips */}
              <div className="bg-white p-6 rounded-3xl border shadow-sm">
                <h3 className="font-bold text-xl mb-4 text-gray-900">Packing List Tips</h3>
                <ul className="space-y-3">
                  {itinerary.packingTips.map((tip, i) => (
                    <li key={i} className="flex items-start text-gray-700 text-sm">
                      <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notes */}
              <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 shadow-sm">
                <h3 className="font-bold text-xl mb-4 text-gray-900">Important Notes</h3>
                <ul className="space-y-3 list-disc pl-5 opacity-90 text-sm text-gray-800">
                  {itinerary.importantNotes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- STEP 1: INPUT FORM ---
  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-teal-100 blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-full mb-4 shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">AI Trip Planner</h1>
          <p className="text-xl text-gray-600 font-light">Tell us your details, and Gemini 1.5 Pro will craft the perfect day-by-day itinerary instantly.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-12">
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Where do you want to go?</label>
                <div className="relative border-b-2 focus-within:border-blue-600 transition">
                  <MapPin className="absolute left-0 top-3 h-6 w-6 text-gray-400" />
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g., Kerala, Jaipur, Goa" 
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-xl font-medium focus:outline-none"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Duration (Days)</label>
                <div className="relative border-b-2 focus-within:border-blue-600 transition">
                  <Calendar className="absolute left-0 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    required 
                    min="1" max="30"
                    placeholder="5" 
                    className="w-full pl-8 pr-4 py-2 bg-transparent text-lg font-medium focus:outline-none"
                    value={formData.days}
                    onChange={(e) => setFormData({...formData, days: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Total Budget (₹)</label>
                <div className="relative border-b-2 focus-within:border-blue-600 transition">
                  <Wallet className="absolute left-0 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    required 
                    min="1000"
                    placeholder="50000" 
                    className="w-full pl-8 pr-4 py-2 bg-transparent text-lg font-medium focus:outline-none"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">Who is traveling?</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['Family', 'Honeymoon', 'Solo', 'Group', 'Student'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, travelType: type})}
                      className={`py-3 rounded-xl font-semibold border-2 transition ${formData.travelType === type ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">What are your interests? (Select multiple)</label>
                <div className="flex flex-wrap gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-5 py-2.5 rounded-full font-medium border transition ${formData.interests.includes(interest) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    >
                      {formData.interests.includes(interest) && <Check className="w-4 h-4 inline-block mr-1" />}
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xl py-5 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 mt-4">
              Generate My Itinerary
            </button>
            <p className="text-center text-gray-400 text-sm mt-4">Powered by Gemini 1.5 Pro AI model.</p>
          </div>

        </form>
      </div>
    </div>
  )
}
