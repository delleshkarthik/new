/**
 * Utility functions for automatic season detection based on current date
 */

export type Season = "Kharif" | "Rabi" | "Zaid";

export interface SeasonInfo {
  season: Season;
  description: string;
  months: string;
  cropTypes: string;
}

/**
 * Determines the current season based on the date
 * Indian agricultural seasons:
 * - Kharif: June-November (Monsoon season)
 * - Rabi: November-April (Winter season) 
 * - Zaid: April-June (Summer season)
 */
export const getCurrentSeason = (date: Date = new Date()): SeasonInfo => {
  const month = date.getMonth() + 1; // getMonth() returns 0-11, we need 1-12

  if (month >= 6 && month <= 10) {
    return {
      season: "Kharif",
      description: "Monsoon season - ideal for rain-fed crops",
      months: "June - October",
      cropTypes: "Rice, Cotton, Sugarcane, Pulses"
    };
  } else if (month === 11 || month === 12 || month <= 3) {
    return {
      season: "Rabi", 
      description: "Winter season - perfect for cool weather crops",
      months: "November - March",
      cropTypes: "Wheat, Barley, Peas, Gram"
    };
  } else {
    return {
      season: "Zaid",
      description: "Summer season - suitable for irrigated crops",
      months: "April - May",
      cropTypes: "Watermelon, Cucumber, Fodder crops"
    };
  }
};

/**
 * Get upcoming season information
 */
export const getUpcomingSeason = (date: Date = new Date()): SeasonInfo => {
  const currentSeason = getCurrentSeason(date);
  
  switch (currentSeason.season) {
    case "Kharif":
      return {
        season: "Rabi",
        description: "Winter season - perfect for cool weather crops",
        months: "November - March", 
        cropTypes: "Wheat, Barley, Peas, Gram"
      };
    case "Rabi":
      return {
        season: "Zaid",
        description: "Summer season - suitable for irrigated crops",
        months: "April - May",
        cropTypes: "Watermelon, Cucumber, Fodder crops"
      };
    case "Zaid":
      return {
        season: "Kharif",
        description: "Monsoon season - ideal for rain-fed crops", 
        months: "June - October",
        cropTypes: "Rice, Cotton, Sugarcane, Pulses"
      };
  }
};