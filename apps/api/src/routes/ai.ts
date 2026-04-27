import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const apiKey = process.env.GEMINI_API_KEY || 'fake-key-for-now';
const genAI = new GoogleGenerativeAI(apiKey);

router.post('/generate-itinerary', async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination, budget, days, travelType, interests } = req.body;

    if (!destination || !budget || !days || !travelType || !interests) {
       res.status(400).json({ error: 'Missing required fields' });
       return;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemPrompt = "You are TripMeet's expert Indian travel planner. Generate a detailed day-wise travel itinerary. Always respond in valid JSON format only. Include realistic cost estimates in Indian Rupees. Focus on authentic local experiences.";
    
    const userPrompt = `Generate a ${days}-day itinerary for ${destination} for ${travelType} travel.
     Budget: ₹${budget} total. Interests: ${interests}.
     Return JSON with this exact structure:
     {
       "destination": "string",
       "totalDays": "number",
       "estimatedTotalCost": "number",
       "bestTimeToVisit": "string",
       "days": [{
         "day": "number",
         "title": "string",
         "description": "string",
         "activities": [{
           "time": "string",
           "activity": "string",
           "location": "string",
           "estimatedCost": "number",
           "tips": "string"
         }],
         "accommodation": "string",
         "estimatedDayCost": "number"
       }],
       "packingTips": ["string"],
       "importantNotes": ["string"]
     }`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] }
    });

    const responseText = result.response.text();
    let parsedJson;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Gemini response', responseText);
      res.status(500).json({ error: 'Failed to generate valid JSON itinerary' });
      return;
    }

    res.json(parsedJson);

  } catch (error: any) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
