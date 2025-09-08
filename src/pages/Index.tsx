import { useState } from "react";
import Hero from "@/components/Hero";
import FarmingForm, { FarmingData } from "@/components/FarmingForm";
import CropRecommendations from "@/components/CropRecommendations";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"hero" | "form" | "results">("hero");
  const [farmingData, setFarmingData] = useState<FarmingData | null>(null);

  const handleGetStarted = () => {
    setCurrentStep("form");
  };

  const handleFormSubmit = (data: FarmingData) => {
    setFarmingData(data);
    setCurrentStep("results");
  };

  const handleNewRecommendation = () => {
    setCurrentStep("form");
    setFarmingData(null);
  };

  const handleBackToHome = () => {
    setCurrentStep("hero");
    setFarmingData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      {currentStep === "hero" && (
        <div onClick={handleGetStarted}>
          <Hero />
        </div>
      )}
      
      {currentStep === "form" && (
        <div className="container mx-auto px-4 py-12">
          <FarmingForm onSubmit={handleFormSubmit} onBackToHome={handleBackToHome} />
        </div>
      )}
      
      {currentStep === "results" && farmingData && (
        <div className="container mx-auto px-4 py-12">
          <CropRecommendations 
            data={farmingData} 
            onNewRecommendation={handleNewRecommendation}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
