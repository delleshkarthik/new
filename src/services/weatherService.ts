interface WeatherData {
  temperature: {
    current: number;
    min: number;
    max: number;
  };
  humidity: number;
  rainfall: number;
  conditions: string;
  windSpeed: number;
  soilTemperature?: number;
}

interface ClimateData {
  season: string;
  averageTemp: number;
  rainfall: number;
  humidity: number;
  bestCrops: string[];
}

export class WeatherService {
  private apiKey = ""; // Will be populated from environment

  async getWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      // Use Supabase edge function for secure API access
      const response = await fetch('/api/weather-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: lat, longitude: lon })
      });
      
      if (!response.ok) {
        // Fallback to direct API call for development
        return this.getFallbackWeatherData(lat, lon);
      }

      const data = await response.json();
      
      return {
        temperature: {
          current: data.current.temperature,
          min: data.current.temp_min,
          max: data.current.temp_max,
        },
        humidity: data.current.humidity,
        rainfall: data.forecast.rainfall_5day,
        conditions: data.current.conditions,
        windSpeed: data.current.wind_speed,
        soilTemperature: data.forecast.soil_temperature,
      };
    } catch (error) {
      console.error('Weather service error:', error);
      return this.getFallbackWeatherData(lat, lon);
    }
  }

  private async getFallbackWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      // Fallback weather estimation based on location and season
      const temp = this.estimateTemperature(lat);
      const humidity = this.estimateHumidity(lat);
      
      return {
        temperature: {
          current: temp,
          min: temp - 5,
          max: temp + 5,
        },
        humidity,
        rainfall: 0,
        conditions: 'Clear conditions (estimated)',
        windSpeed: 2.5,
        soilTemperature: temp - 2,
      };
    } catch (error) {
      console.error('Fallback weather estimation failed:', error);
      return null;
    }
  }

  private estimateTemperature(latitude: number): number {
    // Simple temperature estimation based on latitude and season
    const currentMonth = new Date().getMonth() + 1;
    let baseTemp = 25;
    
    // Adjust for latitude (higher = cooler)
    if (latitude > 28) baseTemp -= 5;
    else if (latitude < 15) baseTemp += 5;
    
    // Adjust for season
    if (currentMonth >= 12 || currentMonth <= 2) baseTemp -= 8; // Winter
    else if (currentMonth >= 3 && currentMonth <= 5) baseTemp += 5; // Summer
    else if (currentMonth >= 6 && currentMonth <= 9) baseTemp += 2; // Monsoon
    
    return Math.max(10, Math.min(45, baseTemp));
  }

  private estimateHumidity(latitude: number): number {
    // Coastal areas and southern regions typically have higher humidity
    if (latitude < 20) return 70; // Southern India
    if (latitude > 28) return 50; // Northern India
    return 60; // Central India
  }

  async getClimateAnalysis(lat: number, lon: number): Promise<ClimateData | null> {
    const weather = await this.getWeatherData(lat, lon);
    if (!weather) return null;

    // Determine season and recommendations based on location and weather
    const currentMonth = new Date().getMonth() + 1;
    let season = "kharif";
    
    if (currentMonth >= 11 || currentMonth <= 4) {
      season = "rabi";
    } else if (currentMonth >= 5 && currentMonth <= 6) {
      season = "zaid";
    }

    // Climate-based crop recommendations
    const bestCrops = this.getCropRecommendations(weather, lat, season);

    return {
      season,
      averageTemp: weather.temperature.current,
      rainfall: weather.rainfall,
      humidity: weather.humidity,
      bestCrops,
    };
  }

  private getCropRecommendations(weather: WeatherData, latitude: number, season: string): string[] {
    const temp = weather.temperature.current;
    const humidity = weather.humidity;
    const rainfall = weather.rainfall;

    // Regional and climate-based recommendations
    if (latitude > 28) { // Northern India
      if (season === "rabi" && temp < 25) {
        return ["Wheat", "Barley", "Mustard", "Peas"];
      } else if (season === "kharif" && temp > 25 && humidity > 60) {
        return ["Rice", "Sugarcane", "Cotton"];
      }
    } else if (latitude > 20) { // Central India
      if (temp > 30 && rainfall < 50) {
        return ["Cotton", "Soybean", "Jowar"];
      } else if (temp < 30 && rainfall > 50) {
        return ["Rice", "Maize", "Sugarcane"];
      }
    } else { // Southern India
      if (humidity > 70) {
        return ["Rice", "Coconut", "Spices"];
      } else {
        return ["Millets", "Groundnut", "Cotton"];
      }
    }

    return ["Mixed farming recommended"];
  }

  // Initialize with API key (called from component)
  setApiKey(key: string) {
    this.apiKey = key;
  }
}

export const weatherService = new WeatherService();