import supabase from './supabase';
import { Database } from '../supabase';

type Tables = Database['public']['Tables'];
type TripInsert = Tables['trips']['Insert'];
type FlightInsert = Tables['flight_data']['Insert'];
type HotelInsert = Tables['hotel_data']['Insert'];
type DayPlanInsert = Tables['day_plan']['Insert'];
type PlanChangeInsert = Tables['plan_change']['Insert'];

export interface TripData {
  // User input from Home page
  departureLocation: string;
  arrivalLocation: string;
  departureDate: string;
  returnDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  hotelPreferences: string[];
  interests: string[];
  minimumBudget: number;
  maximumBudget: number;

  // Airport codes from GPT
  departureAirportCode: string[];
  arrivalAirportCode: string[];

  // Selected flights
  selectedOutboundFlight: any | null;
  selectedReturnFlight: any | null;

  // Arrival time in destination city (for outbound flight)
  destinationArrivalTime: string;
  returnDateTime: string;

  // Selected hotel
  selectedHotel: any | null;

  // Day plans
  dayPlan: any[];

  // Plan changes made by AI
  planChanges: any[];

  // Destination city common name
  destinationCityCommonName: string;

  // User ID from Clerk
  userId: string;
  estimatedCarbonEmissionFromActivities: string;
}

export async function saveTripToDatabase(tripData: TripData) {
  try {
    // 1. Save flight data if exists
    let outboundFlightId: number | null = null;
    let returnFlightId: number | null = null;

    if (tripData.selectedOutboundFlight) {
      const outboundFlightInsert: FlightInsert = {
        airline_logo: tripData.selectedOutboundFlight.airline_logo,
        carbon_emissions: tripData.selectedOutboundFlight.carbon_emissions,
        departure_token: tripData.selectedOutboundFlight.departure_token,
        extensions: tripData.selectedOutboundFlight.extensions,
        flights: tripData.selectedOutboundFlight.flights,
        layovers: tripData.selectedOutboundFlight.layovers,
        price: tripData.selectedOutboundFlight.price,
        total_duration: tripData.selectedOutboundFlight.total_duration,
        type: tripData.selectedOutboundFlight.type
      };

      const { data: outboundFlight, error: outboundError } = await supabase
        .from('flight_data')
        .insert(outboundFlightInsert)
        .select('id')
        .single();

      if (outboundError) throw outboundError;
      outboundFlightId = outboundFlight.id;
    }

    if (tripData.selectedReturnFlight) {
      const returnFlightInsert: FlightInsert = {
        airline_logo: tripData.selectedReturnFlight.airline_logo,
        carbon_emissions: tripData.selectedReturnFlight.carbon_emissions,
        departure_token: tripData.selectedReturnFlight.departure_token,
        extensions: tripData.selectedReturnFlight.extensions,
        flights: tripData.selectedReturnFlight.flights,
        layovers: tripData.selectedReturnFlight.layovers,
        price: tripData.selectedReturnFlight.price,
        total_duration: tripData.selectedReturnFlight.total_duration,
        type: tripData.selectedReturnFlight.type
      };

      const { data: returnFlight, error: returnError } = await supabase
        .from('flight_data')
        .insert(returnFlightInsert)
        .select('id')
        .single();

      if (returnError) throw returnError;
      returnFlightId = returnFlight.id;
    }

    // 2. Save hotel data if exists
    let hotelId: number | null = null;
    if (tripData.selectedHotel) {
      const hotelInsert: HotelInsert = {
        available: tripData.selectedHotel.available,
        carbon_emissions: tripData.selectedHotel.carbon_emissions,
        hotel: tripData.selectedHotel.hotel,
        images: tripData.selectedHotel.images,
        offers: tripData.selectedHotel.offers,
        photoUrl: tripData.selectedHotel.photoUrl,
        self: tripData.selectedHotel.self,
        type: tripData.selectedHotel.type
      };

      const { data: hotel, error: hotelError } = await supabase
        .from('hotel_data')
        .insert(hotelInsert)
        .select('id')
        .single();

      if (hotelError) throw hotelError;
      hotelId = hotel.id;
    }

    // 3. Save day plan if exists
    let dayPlanId: number | null = null;
    if (tripData.dayPlan && tripData.dayPlan.length > 0) {
      const dayPlanInsert: DayPlanInsert = {
        title: `Trip to ${tripData.arrivalLocation}`,
        activities: tripData.dayPlan,
        weather_forcast: null // Weather is stored within each day's activities
      };

      const { data: dayPlan, error: dayPlanError } = await supabase
        .from('day_plan')
        .insert(dayPlanInsert)
        .select('id')
        .single();

      if (dayPlanError) throw dayPlanError;
      dayPlanId = dayPlan.id;
    }

    // 4. Save plan changes if exists
    let planChangesId: number | null = null;
    if (tripData.planChanges && tripData.planChanges.length > 0) {
      // For simplicity, we'll store the first plan change and reference others in JSON
      const firstChange = tripData.planChanges[0];
      const planChangeInsert: PlanChangeInsert = {
        changeType: firstChange.changeType,
        activityName: firstChange.activityName,
        originalDay: firstChange.originalDay,
        newDay: firstChange.newDay,
        reason: firstChange.reason,
        explanation: JSON.stringify(tripData.planChanges) // Store all changes as JSON
      };

      const { data: planChange, error: planChangeError } = await supabase
        .from('plan_change')
        .insert(planChangeInsert)
        .select('id')
        .single();

      if (planChangeError) throw planChangeError;
      planChangesId = planChange.id;
    }

    // 5. Save main trip data
    const tripInsert: TripInsert = {
      userId: tripData.userId,
      arrivalAirportCode: tripData.arrivalAirportCode,
      arrivalLocation: tripData.arrivalLocation,
      created_at: Date.now(),
      dayPlan: dayPlanId,
      departureAirportCode: tripData.departureAirportCode,
      departureDate: tripData.departureDate,
      departureLocation: tripData.departureLocation,
      destinationArrivalTime: tripData.destinationArrivalTime,
      destinationCityCommonName: tripData.destinationCityCommonName,
      hotelPreferences: tripData.hotelPreferences,
      interests: tripData.interests,
      maximumBudget: tripData.maximumBudget,
      minimumBudget: tripData.minimumBudget,
      numberOfAdults: tripData.numberOfAdults,
      numberOfChildren: tripData.numberOfChildren,
      planChanges: planChangesId,
      returnDate: tripData.returnDate,
      returnDateTime: tripData.returnDateTime,
      selectedHotel: hotelId,
      selectedOutboundFlight: outboundFlightId,
      selectedReturnFlight: returnFlightId,
      estimatedCarbonEmissionFromActivities: tripData.estimatedCarbonEmissionFromActivities,
    };

    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert(tripInsert)
      .select('id')
      .single();

    if (tripError) throw tripError;

    return { success: true, tripId: trip.id };
  } catch (error) {
    console.error('Error saving trip to database:', error);
    return { success: false, error: error };
  }
}

export async function getUserTripsWithPopulatedFields(userId: string) {
  try {
    const { data: trips, error } = await supabase
      .from('trips')
      .select(`
        *,
        selectedOutboundFlight:flight_data!fk_selected_outbound_flight(*),
        selectedReturnFlight:flight_data!fk_selected_return_flight(*),
        selectedHotel:hotel_data!fk_selected_hotel(*),
        dayPlan:day_plan!fk_day_plan(*),
        planChanges:plan_change!fk_plan_changes(*)
      `)
      .eq('userId', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, trips };
  } catch (error) {
    console.error('Error fetching user trips:', error);
    return { success: false, error };
  }
}