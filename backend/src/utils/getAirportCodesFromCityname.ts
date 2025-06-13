import { z } from "zod";
import { getResponseFromOpenAI } from "./getResponseFromOpenAI";

export const getAirportCodesFromCityname = async (departureCityName: string, arrivalCityName: string) => {
  const response = await getResponseFromOpenAI({
    schema: z.object({
      departureCodes: z.array(z.string()),
      arrivalCodes: z.array(z.string()),
    }),
    instruction: "Get the IATA airport codes for the given city name.",
    prompt: `Departure city: ${departureCityName}, Arrival city: ${arrivalCityName}`,
  });
  return response;
}

// // example schema
// {
//   "departureCodes": ["CDG", "ORY"],
//   "arrivalCodes": ["LHR", "LCY"],
// }