import { FarmingData } from "@/components/FarmingForm";

export interface CropRecommendation {
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

export class CropRecommendationService {
  async getRecommendations(farmingData: FarmingData): Promise<CropRecommendation[]> {
    try {
      const response = await fetch('/api/crop-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ farmingData })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error && data.fallback) {
        // Return fallback recommendations if API fails
        return this.getFallbackRecommendations(farmingData);
      }

      return data.recommendations || this.getFallbackRecommendations(farmingData);
    } catch (error) {
      console.error('Error fetching crop recommendations:', error);
      // Return fallback recommendations if API fails
      return this.getFallbackRecommendations(farmingData);
    }
  }

  private getFallbackRecommendations(farmingData: FarmingData): CropRecommendation[] {
    // Fallback recommendations based on season
    const fallbackRecommendations: Record<string, CropRecommendation[]> = {
      Kharif: [
        {
          name: "Rice",
          profitability: "high",
          estimatedEarnings: { perAcre: 45000, total: 45000 },
          suitability: 85,
          growthPeriod: "120-140 days",
          waterRequirement: "high",
          inputs: {
            seeds: "20-25 kg per acre",
            fertilizers: ["NPK 10:26:26", "Urea", "DAP"],
            pesticides: ["Carbendazim", "Chlorpyrifos"]
          },
          marketDemand: "high",
          tips: [
            "Ensure proper water management during flowering stage",
            "Apply phosphorus during land preparation",
            "Monitor for brown plant hopper"
          ]
        }
      ],
      Rabi: [
        {
          name: "Wheat",
          profitability: "high",
          estimatedEarnings: { perAcre: 40000, total: 40000 },
          suitability: 90,
          growthPeriod: "120-150 days",
          waterRequirement: "medium",
          inputs: {
            seeds: "100-125 kg per acre",
            fertilizers: ["NPK 12:32:16", "Urea", "Zinc"],
            pesticides: ["Mancozeb", "Propiconazole"]
          },
          marketDemand: "high",
          tips: [
            "Sow by end of November for best results",
            "Maintain proper seed depth (3-5 cm)",
            "Apply nitrogen in 3 split doses"
          ]
        }
      ],
      Zaid: [
        {
          name: "Summer Vegetables",
          profitability: "medium",
          estimatedEarnings: { perAcre: 35000, total: 35000 },
          suitability: 80,
          growthPeriod: "60-90 days",
          waterRequirement: "high",
          inputs: {
            seeds: "2-3 kg per acre",
            fertilizers: ["NPK 19:19:19", "Micronutrients"],
            pesticides: ["Neem oil", "Bacillus thuringiensis"]
          },
          marketDemand: "medium",
          tips: [
            "Provide adequate shade during peak summer",
            "Ensure consistent water supply",
            "Use mulching to conserve moisture"
          ]
        }
      ]
    };

    return fallbackRecommendations[farmingData.season] || fallbackRecommendations.Kharif;
  }
}

export const cropRecommendationService = new CropRecommendationService();