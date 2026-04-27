import { useState } from 'react';
import { createClient } from '../lib/supabase';

export interface ItineraryData {
  destination: string;
  totalDays: number;
  estimatedTotalCost: number;
  bestTimeToVisit: string;
  days: {
    day: number;
    title: string;
    description: string;
    activities: {
      time: string;
      activity: string;
      location: string;
      estimatedCost: number;
      tips: string;
    }[];
    accommodation: string;
    estimatedDayCost: number;
  }[];
  packingTips: string[];
  importantNotes: string[];
}

export function useAIPlanner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const supabase = createClient();

  const generateItinerary = async (formData: { destination: string; days: number; budget: number; travelType: string; interests: string }) => {
    setLoading(true);
    setError(null);
    try {
      const REQ_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${REQ_URL}/api/ai/generate-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary. Please try again.');
      }

      const data = await response.json();
      setItinerary(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const saveItinerary = async () => {
    if (!itinerary) return false;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Note: Assuming saved_itineraries table exists in the schema to support saving.
      const { error } = await supabase.from('saved_itineraries').insert([
        {
          user_id: user.id,
          destination: itinerary.destination,
          itinerary_json: itinerary
        }
      ]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const resetPlanner = () => {
    setItinerary(null);
    setError(null);
  };

  return {
    generateItinerary,
    saveItinerary,
    resetPlanner,
    loading,
    error,
    itinerary
  };
}
