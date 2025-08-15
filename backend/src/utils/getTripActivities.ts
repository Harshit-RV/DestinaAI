import { z } from "zod";
import { getResponseFromOpenAI } from "./getResponseFromOpenAI";
import { getResponseFromGemini } from "./getResponseFromGemini";

interface getTripActivitiesInput {
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

interface getFinalPlanInput extends getTripActivitiesInput {
  activities: any[];
}

export const getFinalPlan = async (input: getFinalPlanInput) => {
  const response = await getResponseFromGemini({
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
      planChanges: z.array(z.object({
        changeType: z.string(), // "reordered", "moved_day", "time_adjusted"
        activityName: z.string(),
        originalDay: z.string(),
        newDay: z.string(),
        reason: z.string(),
        explanation: z.string()
      })).optional(),
      totalCarbonEmission: z.string(),
    }),
    instruction: `

input:
city name, interests, arrival time, departure time, hotel info (including name, latitude, longitude),  number of children, adults, 

your task:    
your task is to take this list of activities and organise them day by day with estimated prices and in efficient order of travel. include places to eat, hang around, view, and everyone beyond
add method of transport as well, add it as an activity only because travel can also take time. the order of the days should be in the order of the arrival and departure time. do not mess up the order of the days.
Do not write number of day in the title.

IMPORTANT: If activities that are paired for a single day by the user do not make logical sense to be paired together (e.g., conflicting locations, timing issues, weather dependencies, travel efficiency), you are ALLOWED to:
1. Change the order of activities within the same day
2. Move activities to different days if absolutely necessary for logical flow
3. Keep changes MINIMAL - only make changes when absolutely necessary for a better travel experience
4. ONLY RETURN planChanges WHEN YOU'VE MADE A CHANGE. DO NOT RETURN DUMMY DATA OR CHANGES LIKE "moved from day 1 to day 1" because it makes no sense.
5. Activities moved around in their own specific days do not count as a change!

When you make changes, document them in the "planChanges" array with:
- changeType: "reordered", "moved_day", "time_adjusted"
- activityName: the name of the activity that was changed
- originalDay: what day it was originally on
- newDay: what day it's now on (or same if just reordered)
- reason: brief reason (e.g., "travel efficiency", "weather optimization", "logical flow")
- explanation: detailed explanation of why the change improves the trip

LIST OF ACTIVITIES:${JSON.stringify(input.activities, null, 2)}

Also return the estimated carbon emission for all activities combined. This would include transport and more.
FORMAT OF CARBON EMISSION SHOULD BE "X kg of CO2"

structure to follow:
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
      })),
      planChanges: z.array(z.object({
        changeType: z.string(),
        activityName: z.string(),
        originalDay: z.string(),
        newDay: z.string(),
        reason: z.string(),
        explanation: z.string()
      })).optional()
    }),
type can be food, activity, transport

make sure to count the number of days based on the arrival and departure time
`,
    prompt: `Arrival city: ${input.arrivalCityName}, Departure time: ${input.departureTime}, Arrival time: ${input.arrivalTime}, Hotel name: ${input.hotelName}, Hotel latitude: ${input.hotelLatitude}, Hotel longitude: ${input.hotelLongitude}, Interests: ${input.interests}, Number of children: ${input.numberOfChildren}, Number of adults: ${input.numberOfAdults}, Activities: ${JSON.stringify(input.activities, null, 2)}`,
  });
  
  return response;
}

export const getTripActivities = async (input: getTripActivitiesInput) => {
  try {    
    const response = await getResponseFromGemini({
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
    
    instruction: `Generate a ${input.numberOfDays}-day itinerary for a drag-and-drop trip planner.

REQUIRED OUTPUT: JSON object with "activitiesByDays" array containing exactly ${input.numberOfDays} day objects.

Each day object MUST have:
- id: string (e.g., "day-1", "day-2", etc.)
- title: string (e.g., "Day 1: Arrival & Local Exploration")
- color: string (hex color like "#FF5733")
- maxActivities: number (set to 10)
- items: array of activity objects

Each activity item MUST have:
- id: string (unique identifier)
- color: string (hex color, use "#FFFFFF" for individual activities)
- content: string (brief activity name)
- description: string (detailed description)

SPECIAL REQUIREMENTS:
1. Day 1 MUST start with hotel check-in activity. pack everything like airport transfer, check in, travel to hotel in this one activity.
2. Last day MUST end with hotel check-out activity. pack everything like airport transfer, check in, travel from hotel in this one activity.
3. Group related activities with same color (e.g., nearby restaurants, connected attractions)
4. Individual activities use color "#FFFFFF"
5. Each day should have 4-8 activities including meals and transport
6. Include realistic timing and locations based on the hotel position

INPUT DATA: City: ${input.arrivalCityName}, Hotel: ${input.hotelName}, Adults: ${input.numberOfAdults}, Children: ${input.numberOfChildren}, Interests: ${input.interests.join(', ')}, Arrival: ${input.arrivalTime}, Departure: ${input.departureTime}`,
    prompt: `Arrival city: ${input.arrivalCityName}, Departure time: ${input.departureTime}, Arrival time: ${input.arrivalTime}, Hotel name: ${input.hotelName}, Hotel latitude: ${input.hotelLatitude}, Hotel longitude: ${input.hotelLongitude}, Interests: ${input.interests}, Number of children: ${input.numberOfChildren}, Number of adults: ${input.numberOfAdults}`,
  });
  
  return response;
} catch (e) {
  console.log(e)
  return null;
}
}