import { getResponseFromGemini } from './getResponseFromGemini';
import { z } from 'zod';

// Define the schema for hotel emissions response
const HotelEmissionsSchema = z.object({
  daily_emissions: z.number().describe("Daily CO2 emissions in kg per room per day"),
  total_emissions: z.number().describe("Total CO2 emissions in kg for the entire stay"),
  comparison_rating: z.enum(['low', 'medium', 'high']).describe("Rating compared to typical hotels (low = better, high = worse)")
});

// Define the schema for batch hotel emissions response
const BatchHotelEmissionsSchema = z.object({
  hotels: z.array(z.object({
    hotel_id: z.string().describe("Unique identifier for the hotel"),
    daily_emissions: z.number().describe("Daily CO2 emissions in kg per room per day"),
    total_emissions: z.number().describe("Total CO2 emissions in kg for the entire stay"),
    comparison_rating: z.enum(['low', 'medium', 'high']).describe("Rating compared to typical hotels (low = better, high = worse)")
  })).describe("Array of hotel emissions calculations")
});

export type HotelEmissions = z.infer<typeof HotelEmissionsSchema>;
export type BatchHotelEmissions = z.infer<typeof BatchHotelEmissionsSchema>;

interface CalculateHotelEmissionsProps {
  hotelName: string;
  hotelType?: string;
  roomType?: string;
  numberOfNights: number;
  numberOfGuests: number;
  cityCode?: string;
}

interface HotelInfo {
  hotelId: string;
  hotelName: string;
  hotelType?: string;
  roomType?: string;
  cityCode?: string;
}

interface CalculateBatchHotelEmissionsProps {
  hotels: HotelInfo[];
  numberOfNights: number;
  numberOfGuests: number;
}

export async function calculateHotelEmissions(props: CalculateHotelEmissionsProps): Promise<HotelEmissions> {
  const {
    hotelName,
    hotelType,
    roomType,
    numberOfNights,
    numberOfGuests,
    cityCode
  } = props;

  const instruction = `
You are an expert in hotel sustainability and carbon emissions calculations. 
Calculate the carbon emissions for a hotel stay based on the provided information.

Consider these factors:
- Hotel size and type (luxury hotels typically have higher emissions)
- Room type and size
- Location and local energy mix
- Number of guests and nights
- Typical hotel energy consumption (heating, cooling, lighting, hot water, laundry, food service)
- Average hotel emissions range from 10-50 kg CO2 per room per night

Provide realistic estimates based on industry data and sustainability research.
`;

  const prompt = `
Calculate carbon emissions for:
- Hotel: ${hotelName}
- Hotel Type: ${hotelType || 'Standard hotel'}
- Room Type: ${roomType || 'Standard room'}
- Number of nights: ${numberOfNights}
- Number of guests: ${numberOfGuests}
- Location: ${cityCode || 'Unknown'}

Please provide accurate carbon emission estimates in kg CO2.
`;

  try {
    const response = await getResponseFromGemini({
      schema: HotelEmissionsSchema,
      instruction,
      prompt
    });

    return response.parsed as HotelEmissions;
  } catch (error) {
    console.error('Error calculating hotel emissions:', error);
    
    // Fallback calculation based on industry averages
    const avgDailyEmissions = 25; // kg CO2 per room per night (industry average)
    const dailyEmissions = avgDailyEmissions;
    const totalEmissions = dailyEmissions * numberOfNights;
    
    // Simple rating based on total emissions
    let comparisonRating: 'low' | 'medium' | 'high' = 'medium';
    if (totalEmissions < 60) comparisonRating = 'low';
    else if (totalEmissions > 120) comparisonRating = 'high';

    return {
      daily_emissions: dailyEmissions,
      total_emissions: totalEmissions,
      comparison_rating: comparisonRating
    };
  }
}

export async function calculateBatchHotelEmissions(props: CalculateBatchHotelEmissionsProps): Promise<Record<string, HotelEmissions>> {
  const { hotels, numberOfNights, numberOfGuests } = props;

  if (hotels.length === 0) {
    return {};
  }

  const instruction = `
You are an expert in hotel sustainability and carbon emissions calculations. 
Calculate the carbon emissions for multiple hotel stays based on the provided information.

Consider these factors:
- Hotel size and type (luxury hotels typically have higher emissions)
- Room type and size
- Location and local energy mix
- Number of guests and nights
- Typical hotel energy consumption (heating, cooling, lighting, hot water, laundry, food service)
- Average hotel emissions range from 10-50 kg CO2 per room per night

Provide realistic estimates based on industry data and sustainability research.
You must provide emissions for ALL hotels in the list.
`;

  const hotelsList = hotels.map((hotel, index) => 
    `${index + 1}. Hotel ID: ${hotel.hotelId}
   - Name: ${hotel.hotelName}
   - Type: ${hotel.hotelType || 'Standard hotel'}
   - Room Type: ${hotel.roomType || 'Standard room'}
   - Location: ${hotel.cityCode || 'Unknown'}`
  ).join('\n\n');

  const prompt = `
Calculate carbon emissions for the following ${hotels.length} hotels:

${hotelsList}

Stay details:
- Number of nights: ${numberOfNights}
- Number of guests: ${numberOfGuests}

Please provide accurate carbon emission estimates in kg CO2 for each hotel.
Make sure to include all ${hotels.length} hotels in your response with their exact hotel_id values.
`;

  try {
    const response = await getResponseFromGemini({
      schema: BatchHotelEmissionsSchema,
      instruction,
      prompt
    });

    const batchResult = response.parsed as BatchHotelEmissions;
    const result: Record<string, HotelEmissions> = {};

    // Convert array response to object keyed by hotel_id
    batchResult.hotels.forEach(hotel => {
      result[hotel.hotel_id] = {
        daily_emissions: hotel.daily_emissions,
        total_emissions: hotel.total_emissions,
        comparison_rating: hotel.comparison_rating
      };
    });

    // Add fallback for any missing hotels
    hotels.forEach(hotel => {
      if (!result[hotel.hotelId]) {
        console.warn(`Missing emissions data for hotel ${hotel.hotelId}, using fallback`);
        const avgDailyEmissions = 25; // kg CO2 per room per night
        const totalEmissions = avgDailyEmissions * numberOfNights;
        let comparisonRating: 'low' | 'medium' | 'high' = 'medium';
        if (totalEmissions < 60) comparisonRating = 'low';
        else if (totalEmissions > 120) comparisonRating = 'high';

        result[hotel.hotelId] = {
          daily_emissions: avgDailyEmissions,
          total_emissions: totalEmissions,
          comparison_rating: comparisonRating
        };
      }
    });

    return result;
  } catch (error) {
    console.error('Error calculating batch hotel emissions:', error);
    
    // Fallback: create emissions for all hotels using averages
    const result: Record<string, HotelEmissions> = {};
    hotels.forEach(hotel => {
      const avgDailyEmissions = 25; // kg CO2 per room per night (industry average)
      const totalEmissions = avgDailyEmissions * numberOfNights;
      
      let comparisonRating: 'low' | 'medium' | 'high' = 'medium';
      if (totalEmissions < 60) comparisonRating = 'low';
      else if (totalEmissions > 120) comparisonRating = 'high';

      result[hotel.hotelId] = {
        daily_emissions: avgDailyEmissions,
        total_emissions: totalEmissions,
        comparison_rating: comparisonRating
      };
    });

    return result;
  }
}