import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getCurrentSeason, getUpcomingSeason } from "@/utils/seasonDetection";
import { getSoilTypeByLocation, getClimateTypeByLocation } from "@/utils/locationBasedDefaults";
import { MapPin, Calendar, Thermometer, Navigation, AlertCircle, CheckCircle, Info, Home } from "lucide-react";

interface FarmingFormProps {
  onSubmit: (data: FarmingData) => void;
  onBackToHome: () => void;
}

export interface FarmingData {
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

const FarmingForm = ({ onSubmit, onBackToHome }: FarmingFormProps) => {
  const currentSeasonInfo = getCurrentSeason();
  const upcomingSeasonInfo = getUpcomingSeason();

  const [formData, setFormData] = useState<FarmingData>({
    location: "",
    season: currentSeasonInfo.season, // Automatically set current season
    soilType: "",
    climate: "", 
    temperature: "",
    additionalInfo: ""
  });

  const { location, loading, error, permissionDenied, requestLocation, resetLocation } = useGeolocation();

  useEffect(() => {
    if (location) {
      const locationString = `${location.city}, ${location.state}, ${location.country}`;
      const autoSoilType = getSoilTypeByLocation(location.city, location.state);
      const autoClimate = getClimateTypeByLocation(location.city, location.state);
      const autoTemperature = location.weatherData?.temperature ? `${location.weatherData.temperature}°C` : "";
      
      setFormData(prev => ({
        ...prev,
        location: locationString,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        soilType: autoSoilType,
        climate: autoClimate,
        temperature: autoTemperature
      }));
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof FarmingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-soft">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between mb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBackToHome}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
          <MapPin className="h-6 w-6" />
          Tell Us About Your Farm
        </CardTitle>
        <CardDescription>
          Share your farming details so we can provide the best recommendations for your success
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Detection Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                Farm Location
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={requestLocation}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                {loading ? "Detecting..." : "Auto-Detect Location"}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                  {permissionDenied && (
                    <span className="block mt-2 text-sm">
                      Please enable location access in your browser settings or enter your location manually below.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {location && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div>📍 Location: {formData.location}</div>
                    {location.district && (
                      <div className="text-xs">District: {location.district}</div>
                    )}
                    {location.weatherData && (
                      <div className="text-xs space-y-1">
                        <div>🌡️ Temperature: {location.weatherData.temperature}°C (Auto-filled)</div>
                        <div>💧 Humidity: {location.weatherData.humidity}%</div>
                        <div>🌧️ Weather: {location.weatherData.conditions}</div>
                        <div>🌍 Soil: {getSoilTypeByLocation(location.city, location.state)} (Auto-detected)</div>
                        <div>🌿 Climate: {getClimateTypeByLocation(location.city, location.state)} (Auto-detected)</div>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={resetLocation}
                    className="ml-2 p-0 h-auto"
                  >
                    Change
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">
                {location ? "Detected Location" : "Manual Location Entry"}
              </Label>
              <Input
                id="location"
                placeholder="e.g., Pune, Maharashtra"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                {location 
                  ? `Location auto-detected with ${location.weatherData ? 'weather data' : 'GPS'}. You can edit if needed.` 
                  : "Enter your city and state, or use auto-detect above."
                }
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="season" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Crop Season
              </Label>
              <Badge variant="secondary" className="bg-harvest/10 text-harvest border-harvest/20">
                Current: {currentSeasonInfo.season}
              </Badge>
            </div>
            
            <Alert className="border-harvest/20 bg-harvest/5">
              <Info className="h-4 w-4 text-harvest" />
              <AlertDescription className="text-sm">
                <strong>{currentSeasonInfo.season} Season ({currentSeasonInfo.months})</strong><br/>
                {currentSeasonInfo.description}<br/>
                <span className="text-muted-foreground">Best crops: {currentSeasonInfo.cropTypes}</span>
              </AlertDescription>
            </Alert>

            <Select 
              value={formData.season} 
              onValueChange={(value) => handleInputChange('season', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select crop season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kharif">
                  <div className="flex flex-col">
                    <span>Kharif (Monsoon Season)</span>
                    <span className="text-xs text-muted-foreground">June - October</span>
                  </div>
                </SelectItem>
                <SelectItem value="Rabi">
                  <div className="flex flex-col">
                    <span>Rabi (Winter Season)</span>
                    <span className="text-xs text-muted-foreground">November - March</span>
                  </div>
                </SelectItem>
                <SelectItem value="Zaid">
                  <div className="flex flex-col">
                    <span>Zaid (Summer Season)</span>
                    <span className="text-xs text-muted-foreground">April - May</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {formData.season !== currentSeasonInfo.season && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-sm text-orange-800">
                  You've selected a different season than current ({currentSeasonInfo.season}). 
                  Make sure this aligns with your planting schedule.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                🌍 Soil Type
                {location && <Badge variant="secondary" className="text-xs">Auto-detected</Badge>}
              </Label>
              <Select value={formData.soilType} onValueChange={(value) => handleInputChange("soilType", value)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  <SelectItem value="alluvial">Alluvial Soil</SelectItem>
                  <SelectItem value="black">Black Soil (Cotton Soil)</SelectItem>
                  <SelectItem value="red">Red Soil</SelectItem>
                  <SelectItem value="laterite">Laterite Soil</SelectItem>
                  <SelectItem value="desert">Desert Soil</SelectItem>
                  <SelectItem value="mountain">Mountain Soil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                🌿 Climate Type
                {location && <Badge variant="secondary" className="text-xs">Auto-detected</Badge>}
              </Label>
              <Select value={formData.climate} onValueChange={(value) => handleInputChange("climate", value)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select climate" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  <SelectItem value="tropical">Tropical</SelectItem>
                  <SelectItem value="subtropical">Subtropical</SelectItem>
                  <SelectItem value="temperate">Temperate</SelectItem>
                  <SelectItem value="arid">Arid/Semi-arid</SelectItem>
                  <SelectItem value="coastal">Coastal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-primary" />
              Average Temperature
              {location?.weatherData && <Badge variant="secondary" className="text-xs">Auto-filled</Badge>}
            </Label>
            <Input
              placeholder="e.g., 25°C or 20-30°C"
              value={formData.temperature}
              onChange={(e) => handleInputChange("temperature", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {location?.weatherData 
                ? "Temperature auto-filled from weather data. You can edit if needed." 
                : "Enter average temperature or temperature range for your area."
              }
            </p>
          </div>


          <div className="space-y-2">
            <Label>Additional Information</Label>
            <Textarea
              placeholder="Any specific requirements, previous crops grown, irrigation facilities, etc."
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            size="lg"
          >
            Get Crop Recommendations
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FarmingForm;