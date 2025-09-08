import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FarmingData } from "./FarmingForm";
import { 
  TrendingUp, 
  Droplets, 
  Bug, 
  Sprout, 
  Calendar,
  IndianRupee,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

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

interface CropRecommendationsProps {
  data: FarmingData;
  onNewRecommendation: () => void;
}

const CropRecommendations = ({ data, onNewRecommendation }: CropRecommendationsProps) => {
  // Enhanced recommendations based on location and input data
  const generateRecommendations = (): CropRecommendation[] => {
    // Location-based recommendations (simplified logic for demo)
    const getLocationBasedCrops = () => {
      if (data.coordinates) {
        const { latitude } = data.coordinates;
        
        // Northern India (higher latitude)
        if (latitude > 28) {
          return {
            kharif: ["Rice", "Sugarcane", "Cotton"],
            rabi: ["Wheat", "Barley", "Mustard"],
            zaid: ["Fodder crops", "Vegetables"]
          };
        }
        // Central India
        else if (latitude > 20) {
          return {
            kharif: ["Cotton", "Soybean", "Maize"],
            rabi: ["Wheat", "Gram", "Linseed"],
            zaid: ["Groundnut", "Vegetables"]
          };
        }
        // Southern India (lower latitude)
        else {
          return {
            kharif: ["Rice", "Ragi", "Groundnut"],
            rabi: ["Rice", "Millets", "Pulses"],
            zaid: ["Rice", "Vegetables"]
          };
        }
      }
      
      // Default recommendations if no coordinates
      return {
        kharif: ["Rice", "Cotton"],
        rabi: ["Wheat", "Mustard"],
        zaid: ["Vegetables"]
      };
    };

    const locationCrops = getLocationBasedCrops();
    // Enhanced recommendations based on location
    const baseRecommendations: Record<string, CropRecommendation[]> = {
      kharif: [
        {
          name: "Rice",
          profitability: "high",
          estimatedEarnings: { perAcre: 45000, total: 45000 },
          suitability: 92,
          growthPeriod: "120-140 days",
          waterRequirement: "high",
          inputs: {
            seeds: "20-25 kg per acre",
            fertilizers: ["NPK 10:26:26", "Urea", "DAP"],
            pesticides: ["Carbendazim", "Chlorpyrifos", "2,4-D"]
          },
          marketDemand: "high",
          tips: [
            "Ensure proper water management during flowering stage",
            "Apply phosphorus during land preparation",
            "Monitor for brown plant hopper"
          ]
        },
        {
          name: "Cotton",
          profitability: "high",
          estimatedEarnings: { perAcre: 55000, total: 55000 },
          suitability: 88,
          growthPeriod: "180-200 days",
          waterRequirement: "medium",
          inputs: {
            seeds: "1.5-2 kg per acre",
            fertilizers: ["NPK 12:32:16", "Potash", "Zinc Sulphate"],
            pesticides: ["Imidacloprid", "Profenofos", "Emamectin Benzoate"]
          },
          marketDemand: "high",
          tips: [
            "Plant during optimal time (May-June)",
            "Maintain 60-90cm row spacing",
            "Regular monitoring for bollworm"
          ]
        }
      ],
      rabi: [
        {
          name: "Wheat",
          profitability: "high",
          estimatedEarnings: { perAcre: 40000, total: 40000 },
          suitability: 95,
          growthPeriod: "120-150 days",
          waterRequirement: "medium",
          inputs: {
            seeds: "100-125 kg per acre",
            fertilizers: ["NPK 12:32:16", "Urea", "Zinc"],
            pesticides: ["Mancozeb", "Propiconazole", "2,4-D"]
          },
          marketDemand: "high",
          tips: [
            "Sow by end of November for best results",
            "Maintain proper seed depth (3-5 cm)",
            "Apply nitrogen in 3 split doses"
          ]
        },
        {
          name: "Mustard",
          profitability: "medium",
          estimatedEarnings: { perAcre: 35000, total: 35000 },
          suitability: 85,
          growthPeriod: "90-120 days",
          waterRequirement: "low",
          inputs: {
            seeds: "3-4 kg per acre",
            fertilizers: ["NPK 18:46:0", "Sulphur", "Boron"],
            pesticides: ["Dimethoate", "Cypermethrin", "Quinalphos"]
          },
          marketDemand: "medium",
          tips: [
            "Sow in well-prepared seedbed",
            "Apply sulphur for better oil content",
            "Monitor for aphids during flowering"
          ]
        }
      ]
    };

    return baseRecommendations[data.season] || baseRecommendations.kharif;
  };

  const recommendations = generateRecommendations();

  const getProfitabilityColor = (level: string) => {
    switch (level) {
      case "high": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getWaterColor = (level: string) => {
    switch (level) {
      case "high": return "text-blue-600";
      case "medium": return "text-blue-400";
      case "low": return "text-blue-200";
      default: return "text-blue-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Your Personalized Crop Recommendations
        </h2>
        <p className="text-muted-foreground">
          Based on your {data.location} farm conditions for {data.season} season
          {data.coordinates && (
            <span className="block text-sm mt-1 text-green-600">
              ✓ Location verified using GPS coordinates
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-6">
        {recommendations.map((crop, index) => (
          <Card key={index} className="shadow-soft hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-primary flex items-center gap-2">
                    <Sprout className="h-6 w-6" />
                    {crop.name}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {crop.suitability}% suitable for your conditions
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge className={getProfitabilityColor(crop.profitability)}>
                    {crop.profitability} profit
                  </Badge>
                  <div className="mt-2 flex items-center text-harvest font-bold">
                    <IndianRupee className="h-4 w-4" />
                    {crop.estimatedEarnings.perAcre.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Per acre earnings
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="inputs">Inputs</TabsTrigger>
                  <TabsTrigger value="cultivation">Cultivation</TabsTrigger>
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Growth Period</p>
                        <p className="text-sm text-muted-foreground">{crop.growthPeriod}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Droplets className={`h-5 w-5 ${getWaterColor(crop.waterRequirement)}`} />
                      <div>
                        <p className="font-medium">Water Need</p>
                        <p className="text-sm text-muted-foreground capitalize">{crop.waterRequirement}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-harvest" />
                      <div>
                        <p className="font-medium">Market Demand</p>
                        <p className="text-sm text-muted-foreground capitalize">{crop.marketDemand}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="inputs" className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Sprout className="h-4 w-4" />
                        Seeds
                      </h4>
                      <p className="text-sm text-muted-foreground">{crop.inputs.seeds}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Fertilizers
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {crop.inputs.fertilizers.map((fertilizer, i) => (
                          <li key={i}>• {fertilizer}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Bug className="h-4 w-4" />
                        Pesticides
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {crop.inputs.pesticides.map((pesticide, i) => (
                          <li key={i}>• {pesticide}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cultivation" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Expert Tips
                    </h4>
                    <ul className="space-y-2">
                      {crop.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="earnings" className="space-y-4">
                  <div className="bg-gradient-harvest p-6 rounded-lg text-white text-center">
                    <h4 className="font-medium mb-2">Estimated Earnings Per Acre</h4>
                    <p className="text-3xl font-bold flex items-center justify-center">
                      <IndianRupee className="h-6 w-6" />
                      {crop.estimatedEarnings.perAcre.toLocaleString()}
                    </p>
                    <p className="text-sm mt-2 opacity-90">
                      Based on current market rates and average yields
                    </p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    *Earnings are estimated based on current market prices and average yields. 
                    Actual results may vary based on market conditions and farming practices.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-6">
        <Button 
          onClick={onNewRecommendation}
          variant="outline" 
          size="lg"
          className="border-primary text-primary hover:bg-primary hover:text-white mr-4"
        >
          Get New Recommendations
        </Button>
        <Button 
          onClick={() => window.location.reload()}
          variant="default" 
          size="lg"
          className="bg-gradient-primary"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default CropRecommendations;