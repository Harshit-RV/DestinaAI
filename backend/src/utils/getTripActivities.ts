import { z } from "zod";
import { getResponseFromOpenAI } from "./getResponseFromOpenAI";

interface getFinalPlanInput {
  arrivalCityName: string;
  interests: string[];
  numberOfChildren: number;
  numberOfAdults: number;
  arrivalTime: string;
  departureTime: string;
  hotelName: string;
  hotelLatitude: number;
  hotelLongitude: number;
  numberOfDays: number;
}

export const getFinalPlan = async (input: getFinalPlanInput) => {
  const response = await getResponseFromOpenAI({
    schema: z.object({
      dayPlan: z.array(z.object({
        title: z.string(),
        activities: z.array(z.object({
          type: z.string(),
          start_time: z.string(),
          end_time: z.string(),
          title: z.string(),
          estimated_cost: z.string(),
          description: z.string(),
        })),
        weather_forcast: z.object({
          low: z.string(),
          high: z.string(),
          description: z.string()
        })
      })).min(input.numberOfDays),
    }),
    instruction: `

input:
city name, interests, arrival time, departure time, hotel info (including name, latitude, longitude),  number of children, adults, 

your task:    
list of activities that align with interests and age groups specified organised day by day with estimated prices and in efficient order of travel. include places to eat, hang around, view, and everyone beyond
add method of transport as well, add it as an activity only because travel can also take time. the order of the days should be in the order of the arrival and departure time. do not mess up the order of the days.
Do not write number of day in the title.

give me a plan for ${input.numberOfDays} days. no less, no more.

structure to follow:
 schema: z.object({
      activities: z.array(z.object({
        title: z.string(),
        activities: z.array(z.object({
          type: z.string(),
          start_time: z.string(),
          end_time: z.string(),
          title: z.string(),
          estimated_cost: z.string(),
          description: z.string(),
        })),
        weather_forcast: z.object({
          low: z.string(),
          high: z.string(),
          description: z.string()
        })
      }))
    }),
type can be food, activity, transport

make sure to count the number of days based on the arrival and departure time
`,
    // instruction: "Get the only IATA airport codes for the given city name (only return the 3 letter code of the airport, and only one entry for one aiport). Return the airport code for only the specified city. Return neighbouring cities airports if and only if the city specified has no commercial airport.",
    // instruction: "Return only the 3-letter IATA airport code for the specified city. Do not return any 4-letter ICAO codes. Do not return multiple codes for the same airport. Return only one IATA code per airport. Only include airports located in the specified city. If the specified city does not have a commercial airport, return the nearest city’s commercial airport’s IATA code. Return only the 3-letter IATA code, nothing else — no airport name, no location, no explanation. Do not return any private or non-commercial airports. Return the departure city name and the arrival city name in their most common form (for eg. Paris as a city, France as a country instead of Paris, Paris, France and Dubai as a city, United Arab Emirates as a country instead of Dubai, Dubai, United Arab Emirates and Paris as a city, France as a country instead of Paris,Paris,Ile-de-France
    prompt: `Arrival city: ${input.arrivalCityName}, Departure time: ${input.departureTime}, Arrival time: ${input.arrivalTime}, Hotel name: ${input.hotelName}, Hotel latitude: ${input.hotelLatitude}, Hotel longitude: ${input.hotelLongitude}, Interests: ${input.interests}, Number of children: ${input.numberOfChildren}, Number of adults: ${input.numberOfAdults}`,
  });
  return response;
}


export const getTripActivities = async (input: getFinalPlanInput) => {
  const response = await getResponseFromOpenAI({
    schema: z.object({
      activitiesByDays: z.array(z.object({
        id: z.string(),
        title: z.string(),
        color: z.string(),
        maxActivities: z.number(),
        items: z.array(z.object({
          id: z.string(),
          color: z.string(),
          content: z.string(),
          description: z.string(),
        }))
      })).min(input.numberOfDays),
    }),
    
    instruction: `

input:
city name, interests, arrival time, departure time, hotel info (including name, latitude, longitude),  number of children, adults, 

your task:    
Generate a daily list of activities based on the user’s interests and age group. Organize the itinerary day by day in the correct chronological order, strictly based on arrival and departure time.

give me a plan for ${input.numberOfDays} days. no less, no more.

Your response will be used in a drag-and-drop itinerary planner, so follow these strict formatting and structural rules:

🧭 Organization
	•	THE FIRST ACTIVITY MUST BE THE HOTEL CHECK IN AND THE LAST ACTIVITY MUST BE THE HOTEL CHECK OUT. 
  other activities can be dragged around.

🧩 Grouping & Color Coding
	•	If two or more activities are geographically close or logically connected, they should be grouped as a single activity item so the user can drag them together.
	•	If an activity is not logically grouped, assign it color #FFFFFF (white).
`,
    // instruction: "Get the only IATA airport codes for the given city name (only return the 3 letter code of the airport, and only one entry for one aiport). Return the airport code for only the specified city. Return neighbouring cities airports if and only if the city specified has no commercial airport.",
    // instruction: "Return only the 3-letter IATA airport code for the specified city. Do not return any 4-letter ICAO codes. Do not return multiple codes for the same airport. Return only one IATA code per airport. Only include airports located in the specified city. If the specified city does not have a commercial airport, return the nearest city’s commercial airport’s IATA code. Return only the 3-letter IATA code, nothing else — no airport name, no location, no explanation. Do not return any private or non-commercial airports. Return the departure city name and the arrival city name in their most common form (for eg. Paris as a city, France as a country instead of Paris, Paris, France and Dubai as a city, United Arab Emirates as a country instead of Dubai, Dubai, United Arab Emirates and Paris as a city, France as a country instead of Paris,Paris,Ile-de-France
    prompt: `Arrival city: ${input.arrivalCityName}, Departure time: ${input.departureTime}, Arrival time: ${input.arrivalTime}, Hotel name: ${input.hotelName}, Hotel latitude: ${input.hotelLatitude}, Hotel longitude: ${input.hotelLongitude}, Interests: ${input.interests}, Number of children: ${input.numberOfChildren}, Number of adults: ${input.numberOfAdults}`,
  });
  return response;
}