interface LocationResult {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  district?: string;
  accuracy: 'high' | 'medium' | 'low';
}

export class GeocodingService {
  async reverseGeocode(lat: number, lng: number): Promise<LocationResult | null> {
    // Try multiple services for better reliability
    const services = [
      () => this.tryBigDataCloud(lat, lng),
      () => this.tryNominatim(lat, lng),
      () => this.tryFallbackService(lat, lng),
    ];

    for (const service of services) {
      try {
        const result = await service();
        if (result) return result;
      } catch (error) {
        console.warn('Geocoding service failed, trying next:', error);
        continue;
      }
    }

    return null;
  }

  private async tryBigDataCloud(lat: number, lng: number): Promise<LocationResult | null> {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    
    if (!response.ok) throw new Error('BigDataCloud API failed');
    
    const data = await response.json();
    
    return {
      latitude: lat,
      longitude: lng,
      city: data.city || data.locality || 'Unknown City',
      state: data.principalSubdivision || 'Unknown State',
      country: data.countryName || 'Unknown Country',
      district: data.localityInfo?.administrative?.find((item: any) => 
        item.description?.includes('district'))?.name,
      accuracy: 'high'
    };
  }

  private async tryNominatim(lat: number, lng: number): Promise<LocationResult | null> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'KrishiAI-App/1.0'
        }
      }
    );
    
    if (!response.ok) throw new Error('Nominatim API failed');
    
    const data = await response.json();
    const address = data.address || {};
    
    return {
      latitude: lat,
      longitude: lng,
      city: address.city || address.town || address.village || 'Unknown City',
      state: address.state || 'Unknown State',
      country: address.country || 'Unknown Country',
      district: address.state_district,
      accuracy: 'medium'
    };
  }

  private async tryFallbackService(lat: number, lng: number): Promise<LocationResult | null> {
    // Simple coordinate-based location estimation for India
    const regions = [
      { name: "Northern India", minLat: 28, maxLat: 35, states: ["Punjab", "Haryana", "Delhi", "UP"] },
      { name: "Central India", minLat: 20, maxLat: 28, states: ["MP", "Maharashtra", "Gujarat"] },
      { name: "Southern India", minLat: 8, maxLat: 20, states: ["Karnataka", "Tamil Nadu", "Kerala", "Andhra Pradesh"] },
      { name: "Eastern India", minLat: 20, maxLat: 28, states: ["West Bengal", "Odisha", "Jharkhand"] },
    ];

    const region = regions.find(r => lat >= r.minLat && lat <= r.maxLat) || regions[1];
    
    return {
      latitude: lat,
      longitude: lng,
      city: "Location Area",
      state: region.states[0],
      country: "India",
      accuracy: 'low'
    };
  }

  async geocodeAddress(address: string): Promise<LocationResult | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=in`,
        {
          headers: {
            'User-Agent': 'KrishiAI-App/1.0'
          }
        }
      );
      
      if (!response.ok) throw new Error('Address geocoding failed');
      
      const data = await response.json();
      if (!data.length) return null;
      
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      
      return await this.reverseGeocode(lat, lng);
    } catch (error) {
      console.error('Address geocoding error:', error);
      return null;
    }
  }
}

export const geocodingService = new GeocodingService();