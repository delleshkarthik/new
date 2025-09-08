import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FarmingData {
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  season: string;
  soilType: string;
  climate: string;
  temperature: string;
  additionalInfo: string;
}

interface CropRecommendation {
  name: string;
  profitability: "high" | "medium" | "low";
  estimatedEarnings: {
    perAcre: number;
    total: number;
  };
  suitability: number;
  growthPeriod: string;
  waterRequirement: "low" | "medium" | "high";
  inputs: {
    seeds: string;
    fertilizers: string[];
    pesticides: string[];
  };
  marketDemand: "high" | "medium" | "low";
  tips: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY is not set')
    }

    const { farmingData }: { farmingData: FarmingData } = await req.json()

    const prompt = `Based on the following farming conditions, recommend the most profitable and suitable crops to cultivate. Provide detailed information in the exact JSON format specified.

Farming Conditions:
- Location: ${farmingData.location}
- Season: ${farmingData.season}
- Soil Type: ${farmingData.soilType}
- Climate: ${farmingData.climate}
- Temperature: ${farmingData.temperature}
- Additional Info: ${farmingData.additionalInfo}
${farmingData.coordinates ? `- GPS Coordinates: ${farmingData.coordinates.latitude}, ${farmingData.coordinates.longitude}` : ''}

Please respond with a JSON array of 2-3 crop recommendations in this exact format:
[
  {
    "name": "Crop Name",
    "profitability": "high/medium/low",
    "estimatedEarnings": {
      "perAcre": 45000,
      "total": 45000
    },
    "suitability": 92,
    "growthPeriod": "120-140 days",
    "waterRequirement": "high/medium/low",
    "inputs": {
      "seeds": "20-25 kg per acre",
      "fertilizers": ["NPK 10:26:26", "Urea", "DAP"],
      "pesticides": ["Carbendazim", "Chlorpyrifos"]
    },
    "marketDemand": "high/medium/low",
    "tips": [
      "Specific cultivation tip 1",
      "Specific cultivation tip 2",
      "Specific cultivation tip 3"
    ]
  }
]

Consider the season, soil type, climate, and location to provide region-specific recommendations with accurate market prices in INR. Focus on crops that are well-suited to the given conditions and have good market demand. Make sure earnings are realistic based on current Indian agricultural market prices.

Respond ONLY with the JSON array, no additional text.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert agricultural advisor with deep knowledge of Indian farming practices, crop suitability, and market conditions. Provide accurate, location-specific crop recommendations based on scientific agricultural principles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from Groq API')
    }

    // Parse the JSON response
    let recommendations: CropRecommendation[]
    try {
      recommendations = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      throw new Error('Invalid JSON response from AI')
    }

    return new Response(
      JSON.stringify({ recommendations }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in crop-recommendations function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        fallback: true 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})