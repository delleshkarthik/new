import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-agriculture.jpg";
import { Sprout, TrendingUp, Users, Award, MapPin, Calendar, Zap, Star, Quote } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Header with Trust Badge */}
          <div className="flex items-center justify-center mb-4">
            <Badge className="bg-harvest/20 text-harvest border-harvest/30 px-4 py-1 mb-4">
              <Star className="h-3 w-3 mr-1" />
              Trusted by 50,000+ Farmers
            </Badge>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <Sprout className="h-12 w-12 text-harvest mr-3" />
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              Krishi<span className="text-harvest">AI</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-4xl mx-auto">
            Transform your farming with AI-powered insights. Get personalized crop recommendations, 
            real-time weather data, and profit forecasts to maximize your harvest.
          </p>

          {/* Statistics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-harvest">50K+</div>
              <div className="text-white/80 text-sm">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-harvest">₹25L+</div>
              <div className="text-white/80 text-sm">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-harvest">95%</div>
              <div className="text-white/80 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-harvest">100+</div>
              <div className="text-white/80 text-sm">Crop Varieties</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-harvest text-white border-0 hover:shadow-glow transition-all duration-300 px-8 py-3 text-lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              Get Smart Recommendations
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg"
            >
              Watch Demo
            </Button>
          </div>
          
          {/* Enhanced Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center group hover:bg-white/15 transition-all duration-300">
              <div className="bg-harvest/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-harvest" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">AI-Powered Analytics</h3>
              <p className="text-white/80 text-sm">Advanced algorithms analyze 15+ factors including soil, weather, and market prices for optimal crop selection</p>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center group hover:bg-white/15 transition-all duration-300">
              <div className="bg-harvest/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-harvest" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">Location Intelligence</h3>
              <p className="text-white/80 text-sm">Real-time weather data, soil analysis, and local market insights tailored to your exact location</p>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center group hover:bg-white/15 transition-all duration-300">
              <div className="bg-harvest/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8 text-harvest" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">Season Planning</h3>
              <p className="text-white/80 text-sm">Automatic season detection and multi-season crop planning to maximize year-round profitability</p>
            </Card>
          </div>

          {/* Testimonial Section */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 max-w-2xl mx-auto">
            <Quote className="h-8 w-8 text-harvest mx-auto mb-4" />
            <p className="text-white/90 text-lg italic mb-4">
              "KrishiAI helped me increase my crop yield by 40% and saved ₹2 lakhs in the first season. 
              The recommendations are spot-on!"
            </p>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-white font-semibold">Rajesh Kumar</p>
                <p className="text-white/60 text-sm">Farmer, Punjab</p>
                <div className="flex justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-harvest fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hero;