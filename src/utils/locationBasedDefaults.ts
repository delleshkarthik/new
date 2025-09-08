/**
 * Utility functions to determine soil type and climate type based on location
 */

export const getSoilTypeByLocation = (location: string, state?: string): string => {
  const locationLower = location.toLowerCase();
  const stateLower = state?.toLowerCase() || '';

  // Maharashtra, Gujarat - Black soil (cotton soil)
  if (stateLower.includes('maharashtra') || stateLower.includes('gujarat') || 
      locationLower.includes('pune') || locationLower.includes('mumbai') || 
      locationLower.includes('nagpur') || locationLower.includes('aurangabad')) {
    return 'black';
  }

  // Punjab, Haryana, UP - Alluvial soil
  if (stateLower.includes('punjab') || stateLower.includes('haryana') || 
      stateLower.includes('uttar pradesh') || stateLower.includes('bihar') ||
      locationLower.includes('chandigarh') || locationLower.includes('delhi')) {
    return 'alluvial';
  }

  // Tamil Nadu, Karnataka, Andhra Pradesh - Red soil
  if (stateLower.includes('tamil nadu') || stateLower.includes('karnataka') || 
      stateLower.includes('andhra pradesh') || stateLower.includes('telangana') ||
      locationLower.includes('bangalore') || locationLower.includes('chennai') || 
      locationLower.includes('hyderabad')) {
    return 'red';
  }

  // Kerala, Goa - Laterite soil
  if (stateLower.includes('kerala') || stateLower.includes('goa') ||
      locationLower.includes('kochi') || locationLower.includes('panaji')) {
    return 'laterite';
  }

  // Rajasthan - Desert soil
  if (stateLower.includes('rajasthan') || 
      locationLower.includes('jaipur') || locationLower.includes('jodhpur')) {
    return 'desert';
  }

  // Hill stations and mountain regions - Mountain soil
  if (locationLower.includes('shimla') || locationLower.includes('manali') || 
      locationLower.includes('dharamshala') || stateLower.includes('himachal') ||
      stateLower.includes('uttarakhand') || locationLower.includes('dehradun')) {
    return 'mountain';
  }

  // Default to alluvial (most common in India)
  return 'alluvial';
};

export const getClimateTypeByLocation = (location: string, state?: string): string => {
  const locationLower = location.toLowerCase();
  const stateLower = state?.toLowerCase() || '';

  // Coastal regions
  if (stateLower.includes('kerala') || stateLower.includes('goa') || 
      stateLower.includes('karnataka') || stateLower.includes('tamil nadu') ||
      locationLower.includes('mumbai') || locationLower.includes('chennai') || 
      locationLower.includes('kochi') || locationLower.includes('mangalore')) {
    return 'coastal';
  }

  // Arid/Semi-arid regions
  if (stateLower.includes('rajasthan') || stateLower.includes('gujarat') ||
      locationLower.includes('jaipur') || locationLower.includes('jodhpur') || 
      locationLower.includes('ahmedabad')) {
    return 'arid';
  }

  // Temperate regions (hill stations and northern plains in winter)
  if (stateLower.includes('himachal') || stateLower.includes('uttarakhand') ||
      stateLower.includes('kashmir') || locationLower.includes('shimla') || 
      locationLower.includes('manali') || locationLower.includes('dehradun')) {
    return 'temperate';
  }

  // Subtropical (northern plains)
  if (stateLower.includes('punjab') || stateLower.includes('haryana') || 
      stateLower.includes('uttar pradesh') || stateLower.includes('bihar') ||
      locationLower.includes('delhi') || locationLower.includes('chandigarh')) {
    return 'subtropical';
  }

  // Default to tropical (most of India)
  return 'tropical';
};