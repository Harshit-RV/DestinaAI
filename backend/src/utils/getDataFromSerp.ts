import { config as serpConfig, getJson } from "serpapi";
import config from '../config';

interface FlightsDataProps {
  departureAirportId: string;
  arrivalAirportId: string;
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


interface ReturnFlightsDataProps {
  departureToken: string;
  arrivalAirportId: string;
  departureAirportId: string;
  returnDate: string;
  outboundDate: string;
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

interface HotelsDataProps {
  q: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
}

export async function getHotelsData(props: HotelsDataProps) {
  serpConfig.api_key = config.serpApiKey;

  const response = await getJson({
    engine: "google_hotels",
    q: props.q,
    hl: "en",
    check_in_date: props.checkInDate,
    check_out_date: props.checkOutDate,
    adults: props.numberOfAdults,
    children: props.numberOfChildren,
    property_types: "12, 13, 15, 17, 18, 19, 23",
    currency: "USD",
    vacation_rentals: "false",
  });

  return response;
}