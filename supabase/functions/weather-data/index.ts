import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { latitude, longitude } = await req.json()
    
    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get OpenWeather API key from secrets
    const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY')
    
    if (!openWeatherApiKey) {
      return new Response(
        JSON.stringify({ error: 'Weather API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&units=metric`
    )
    
    if (!weatherResponse.ok) {
      throw new Error('Weather API request failed')
    }

    const weatherData = await weatherResponse.json()

    // Fetch 5-day forecast for rainfall prediction
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&units=metric`
    )

    let totalRainfall = 0
    if (forecastResponse.ok) {
      const forecastData = await forecastResponse.json()
      if (forecastData?.list) {
        forecastData.list.forEach((item: any) => {
          if (item.rain?.['3h']) {
            totalRainfall += item.rain['3h']
          }
        })
      }
    }

    // Enhanced weather data for farming
    const enhancedWeatherData = {
      location: {
        latitude,
        longitude,
        name: weatherData.name || 'Unknown Location'
      },
      current: {
        temperature: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        temp_min: Math.round(weatherData.main.temp_min),
        temp_max: Math.round(weatherData.main.temp_max),
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        conditions: weatherData.weather[0].description,
        condition_code: weatherData.weather[0].id,
        wind_speed: weatherData.wind.speed,
        wind_direction: weatherData.wind.deg,
        visibility: weatherData.visibility / 1000, // Convert to km
        uv_index: weatherData.uvi || null
      },
      forecast: {
        rainfall_5day: Math.round(totalRainfall * 10) / 10, // Round to 1 decimal
        soil_temperature: Math.round(weatherData.main.temp - 2) // Approximate soil temp
      },
      agricultural_insights: {
        season_suitability: getSuitabilityScore(weatherData, latitude),
        irrigation_recommendation: getIrrigationAdvice(weatherData, totalRainfall),
        pest_risk_level: getPestRiskLevel(weatherData),
        planting_conditions: getPlantingConditions(weatherData)
      },
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(enhancedWeatherData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Weather service error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch weather data',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function getSuitabilityScore(weather: any, latitude: number): string {
  const temp = weather.main.temp
  const humidity = weather.main.humidity
  
  // Regional suitability logic
  if (latitude > 28) { // Northern India
    if (temp >= 15 && temp <= 30 && humidity >= 40) return 'excellent'
    if (temp >= 10 && temp <= 35) return 'good'
    return 'moderate'
  } else if (latitude > 20) { // Central India
    if (temp >= 20 && temp <= 35 && humidity >= 50) return 'excellent'
    if (temp >= 15 && temp <= 40) return 'good'
    return 'moderate'
  } else { // Southern India
    if (temp >= 22 && temp <= 32 && humidity >= 60) return 'excellent'
    if (temp >= 18 && temp <= 38) return 'good'
    return 'moderate'
  }
}

function getIrrigationAdvice(weather: any, rainfall: number): string {
  const humidity = weather.main.humidity
  
  if (rainfall > 20) return 'reduce_irrigation'
  if (rainfall > 5 && humidity > 70) return 'minimal_irrigation'
  if (humidity < 40) return 'increase_irrigation'
  return 'normal_irrigation'
}

function getPestRiskLevel(weather: any): string {
  const temp = weather.main.temp
  const humidity = weather.main.humidity
  
  if (temp > 30 && humidity > 80) return 'high'
  if (temp > 25 && humidity > 60) return 'medium'
  return 'low'
}

function getPlantingConditions(weather: any): string {
  const temp = weather.main.temp
  const conditions = weather.weather[0].main.toLowerCase()
  
  if (conditions.includes('rain') && temp > 15) return 'ideal_for_planting'
  if (temp >= 18 && temp <= 30) return 'good_for_planting'
  if (temp < 10 || temp > 40) return 'poor_for_planting'
  return 'moderate_for_planting'
}