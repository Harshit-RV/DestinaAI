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

interface ReturnFlightsDataProps {
  departureToken: string;
  arrivalAirportId: string;
  departureAirportId: string;
  returnDate: string;
  outboundDate: string;
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

export async function getReturnFlightsData(props: ReturnFlightsDataProps) {
  serpConfig.api_key = config.serpApiKey;
  
  const response = await getJson({
    engine: "google_flights",
    hl: "en",
    sort_by: "6",
    departure_token: props.departureToken,
    arrival_id: props.arrivalAirportId,
    departure_id: props.departureAirportId,
    return_date: props.returnDate,
    outbound_date: props.outboundDate,
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