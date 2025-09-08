import { useState, useEffect } from 'react';
import { geocodingService } from '@/services/geocodingService';
import { weatherService } from '@/services/weatherService';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  city?: string;
  state?: string;
  country?: string;
  district?: string;
  weatherData?: {
    temperature: number;
    humidity: number;
    rainfall: number;
    conditions: string;
  };
}

interface GeolocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    permissionDenied: false,
  });

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        try {
          // Use enhanced geocoding service
          const locationData = await geocodingService.reverseGeocode(latitude, longitude);
          
          // Get weather data
          let weatherData;
          try {
            const weather = await weatherService.getWeatherData(latitude, longitude);
            if (weather) {
              weatherData = {
                temperature: weather.temperature.current,
                humidity: weather.humidity,
                rainfall: weather.rainfall,
                conditions: weather.conditions,
              };
            }
          } catch (error) {
            console.warn('Weather data unavailable:', error);
          }
          
          setState(prev => ({
            ...prev,
            location: {
              latitude,
              longitude,
              accuracy,
              city: locationData?.city || 'Unknown City',
              state: locationData?.state || 'Unknown State',
              country: locationData?.country || 'Unknown Country',
              district: locationData?.district,
              weatherData,
            },
            loading: false,
            error: null,
          }));
        } catch (error) {
          // Fallback to basic location without enhanced data
          setState(prev => ({
            ...prev,
            location: {
              latitude,
              longitude,
              accuracy,
              city: 'Location Area',
              state: 'Unknown State',
              country: 'India',
            },
            loading: false,
            error: null,
          }));
        }
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        let permissionDenied = false;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            permissionDenied = true;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location';
            break;
        }

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          permissionDenied,
        }));
      },
      options
    );
  };

  // Initialize weather service with API key on first use
  useEffect(() => {
    // Weather data is now handled via Supabase edge function for security
    weatherService.setApiKey('secure-edge-function');
  }, []);

  const resetLocation = () => {
    setState({
      location: null,
      loading: false,
      error: null,
      permissionDenied: false,
    });
  };

  return {
    ...state,
    requestLocation,
    resetLocation,
  };
};