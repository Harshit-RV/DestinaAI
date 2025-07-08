import { z } from "zod";
import { getResponseFromOpenAI } from "./getResponseFromOpenAI";

export const getAirportCodesFromCityname = async (departureCityName: string, arrivalCityName: string) => {
  const response = await getResponseFromOpenAI({
    schema: z.object({
      departureCodes: z.array(z.string()),
      departureCityName: z.string(),
      departureCountryName: z.string(),
      arrivalCityName: z.string(),
      arrivalCountryName: z.string(),
      arrivalCodes: z.array(z.string()),
    }),
    instruction: "Return only the 3-letter IATA airport code for the specified city. Do not return any 4-letter ICAO codes. Do not return multiple codes for the same airport. Return only one IATA code per airport. Only include airports located in the specified city. If the specified city does not have a commercial airport, return the nearest city’s commercial airport’s IATA code. Return only the 3-letter IATA code, nothing else — no airport name, no location, no explanation. Do not return any private or non-commercial airports. Return the departure city name and the arrival city name in their most common form (for eg. Paris as a city, France as a country instead of Paris, Paris, France and Dubai as a city, United Arab Emirates as a country instead of Dubai, Dubai, United Arab Emirates and Paris as a city, France as a country instead of Paris,Paris,Ile-de-France,France).",
    // instruction: "Get the only IATA airport codes for the given city name (only return the 3 letter code of the airport, and only one entry for one aiport). Return the airport code for only the specified city. Return neighbouring cities airports if and only if the city specified has no commercial airport.",
    prompt: `Departure city: ${departureCityName}, Arrival city: ${arrivalCityName}`,
  });
  return response;
}

// // example schema
// {
//   "departureCodes": ["CDG", "ORY"],
//   "arrivalCodes": ["LHR", "LCY"],
// }