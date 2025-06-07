import { config as serpConfig, getJson } from "serpapi";
import config from '../config';

interface FlightsDataProps {
  departureAirportId: string;
  arrivalAirportId: string;
  departureDate: string;
  returnDate: string;
}

interface HotelsDataProps {
  q: string;
  departureDate: string;
  returnDate: string;
}

export async function getFlightsData(props: FlightsDataProps) {
  serpConfig.api_key = config.serpApiKey;
  
  const response = await getJson({
    engine: "google_flights",
    hl: "en",
    sort_by: "6",
    departure_id: props.departureAirportId,
    arrival_id: props.arrivalAirportId,
    outbound_date: props.departureDate,
    return_date: props.returnDate,
    currency: "USD",
  });

  return response.other_flights;
}


export async function getHotelsData(props: HotelsDataProps) {
  serpConfig.api_key = config.serpApiKey;

  const response = await getJson({
    engine: "google_hotels",
    q: props.q,
    hl: "en",
    check_in_date: props.departureDate,
    check_out_date: props.returnDate,
    currency: "USD",
  });

  return response;
}