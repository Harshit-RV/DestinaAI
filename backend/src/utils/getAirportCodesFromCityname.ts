import { z } from "zod";
import { getResponseFromOpenAI } from "./getResponseFromOpenAI";

export const getAirportCodesFromCityname = async (departureCityName: string, arrivalCityName: string) => {
  const response = await getResponseFromOpenAI({
    schema: z.object({
      departureCodes: z.array(z.string()),
      arrivalCodes: z.array(z.string()),
    }),
    instruction: "Get the only IATA airport codes for the given city name (only return the 3 letter code of the airport, and only one entry for one aiport). Return the airport code for only the specified city. Return neighbouring cities airports if and only if the city specified has no commercial airport.",
    prompt: `Departure city: ${departureCityName}, Arrival city: ${arrivalCityName}`,
  });
  return response;
}

// // example schema
// {
//   "departureCodes": ["CDG", "ORY"],
//   "arrivalCodes": ["LHR", "LCY"],
// }