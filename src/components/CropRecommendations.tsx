import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FarmingData } from "./FarmingForm";
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
  Loader2,
  Key,
  MessageSquare
} from "lucide-react";


interface CropRecommendationsProps {
  data: FarmingData;
  onNewRecommendation: () => void;
}

const CropRecommendations = ({ data, onNewRecommendation }: CropRecommendationsProps) => {
  const [groqApiKey, setGroqApiKey] = useState(() => {
    return localStorage.getItem('groq_api_key') || '';
  });
  const [recommendation, setRecommendation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(!groqApiKey);

  const saveApiKey = () => {
    if (groqApiKey.trim()) {
      localStorage.setItem('groq_api_key', groqApiKey.trim());
      setShowApiKeyInput(false);
      generateRecommendation();
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('groq_api_key');
    setGroqApiKey('');
    setShowApiKeyInput(true);
    setRecommendation('');
  };

  const generateRecommendation = async () => {
    if (!groqApiKey.trim()) {
      setError('Please enter your Groq API key first');
      setShowApiKeyInput(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const prompt = `You are an expert agricultural advisor with deep knowledge of Indian farming practices. Based on the following farming conditions, provide detailed and conversational crop recommendations:

**Farm Details:**
- Location: ${data.location}
- Season: ${data.season}
- Soil Type: ${data.soilType}
- Climate: ${data.climate}
- Temperature: ${data.temperature}
- Additional Information: ${data.additionalInfo}
${data.coordinates ? `- GPS Coordinates: ${data.coordinates.latitude}, ${data.coordinates.longitude}` : ''}

Please provide a detailed, conversational response that includes:
1. The most profitable and suitable crops for these conditions
2. Expected earnings per acre in INR
3. Specific cultivation tips and best practices
4. Water requirements and irrigation advice
5. Market demand and timing recommendations
6. Input requirements (seeds, fertilizers, pesticides)

Write as if you're having a friendly conversation with a farmer, providing practical and actionable advice. Be specific about the location and conditions mentioned.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are an expert agricultural advisor specializing in Indian farming. Provide detailed, practical, and conversational advice to farmers.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const aiResponse = result.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response received from Groq AI');
      }

      setRecommendation(aiResponse);
    } catch (err: any) {
      setError(err.message || 'Failed to get recommendations from Groq AI');
      console.error('Groq API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groqApiKey && !showApiKeyInput) {
      generateRecommendation();
    }
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

  if (showApiKeyInput) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Setup Groq AI Integration
          </h2>
          <p className="text-muted-foreground mb-8">
            Enter your Groq API key to get personalized crop recommendations
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Groq API Key
            </CardTitle>
            <CardDescription>
              Your API key will be stored locally in your browser
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groq-key">API Key</Label>
              <Input
                id="groq-key"
                type="password"
                placeholder="Enter your Groq API key"
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && saveApiKey()}
              />
            </div>
            <Button 
              onClick={saveApiKey} 
              className="w-full"
              disabled={!groqApiKey.trim()}
            >
              Save API Key & Get Recommendations
            </Button>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Note: Your API key is stored locally and visible in browser dev tools. 
                Only use this for personal/development purposes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Getting Your AI Recommendations
          </h2>
          <p className="text-muted-foreground mb-8">
            Analyzing your {data.location} farm conditions with Groq AI...
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
            Error Getting Recommendations
          </h2>
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex gap-2 justify-center mt-4">
            <Button onClick={generateRecommendation} variant="outline">
              Try Again
            </Button>
            <Button onClick={clearApiKey} variant="outline">
              Change API Key
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Your AI Crop Recommendations
        </h2>
        <p className="text-muted-foreground">
          Personalized advice for your {data.location} farm
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <MessageSquare className="h-3 w-3 mr-1" />
            Powered by Groq AI
          </Badge>
          <Button 
            onClick={clearApiKey} 
            variant="ghost" 
            size="sm"
            className="text-xs"
          >
            Change API Key
          </Button>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            Farm Analysis & Recommendations
          </CardTitle>
          <CardDescription>
            Based on: {data.season} season • {data.soilType} soil • {data.climate} climate • {data.temperature}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-green max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {recommendation}
            </div>
          </div>
        </CardContent>
      </Card>

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
          onClick={generateRecommendation}
          variant="default" 
          size="lg"
          className="bg-gradient-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Regenerate Response'
          )}
        </Button>
      </div>
    </div>
  );
};

export default CropRecommendations;