import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FarmingData } from "./FarmingForm";
import { cropRecommendationService, CropRecommendation } from "@/services/cropRecommendationService";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Droplets, 
  Bug, 
  Sprout, 
  Calendar,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";


interface CropRecommendationsProps {
  data: FarmingData;
  onNewRecommendation: () => void;
}

const CropRecommendations = ({ data, onNewRecommendation }: CropRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await cropRecommendationService.getRecommendations(data);
        setRecommendations(results);
      } catch (err) {
        setError('Failed to get recommendations. Please try again.');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [data]);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Getting Your Personalized Recommendations
          </h2>
          <p className="text-muted-foreground mb-8">
            Analyzing your farm conditions with AI...
          </p>
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Unable to Get Recommendations
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={onNewRecommendation} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Your AI-Powered Crop Recommendations
        </h2>
        <p className="text-muted-foreground">
          Based on your {data.location} farm conditions for {data.season} season
          {data.coordinates && (
            <span className="block text-sm mt-1 text-green-600">
              ✓ Location verified using GPS coordinates
            </span>
          )}
        </p>
        <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary">
          Powered by AI & Real-time Data
        </Badge>
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