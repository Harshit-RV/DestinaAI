import { FlightData } from '@/types/flight';
import { Hotel } from '@/types/hotel';
import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch, useEffect } from 'react';

export interface Activity {
  type: string;
  start_time: string;
  end_time: string;
  title: string;
  estimated_cost: string;
  description: string;
}

interface WeatherForecast {
  low: string;
  high: string;
  description: string;
}

export interface DayPlan {
  title: string;
  activities: Activity[];
  weather_forcast: WeatherForecast;
}

interface PlanChange {
  changeType: string;
  activityName: string;
  originalDay: string;
  newDay: string;
  reason: string;
  explanation: string;
}

interface TripPlannerContextType {
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
  selectedOutboundFlight: FlightData | null;
  selectedReturnFlight: FlightData | null;

  // Arrival time in destination city (for outbound flight)
  destinationArrivalTime: string;
  returnDateTime: string;

  // Selected hotel
  selectedHotel: Hotel | null;

  // Day plans
  dayPlan: DayPlan[];

  // Plan changes made by AI
  planChanges: PlanChange[];

  // Destination city common name
  destinationCityCommonName: string;
    
  // Setters
  setDepartureLocation: Dispatch<SetStateAction<string>>;
  setArrivalLocation: Dispatch<SetStateAction<string>>;
  setDepartureDate: Dispatch<SetStateAction<string>>;
  setReturnDate: Dispatch<SetStateAction<string>>;
  setNumberOfAdults: Dispatch<SetStateAction<number>>;
  setNumberOfChildren: Dispatch<SetStateAction<number>>;
  setHotelPreferences: Dispatch<SetStateAction<string[]>>;
  setInterests: Dispatch<SetStateAction<string[]>>;
  setMinimumBudget: Dispatch<SetStateAction<number>>;
  setMaximumBudget: Dispatch<SetStateAction<number>>;
  setDepartureAirportCode: Dispatch<SetStateAction<string[]>>;
  setArrivalAirportCode: Dispatch<SetStateAction<string[]>>;
  setSelectedOutboundFlight: Dispatch<SetStateAction<FlightData | null>>;
  setSelectedReturnFlight: Dispatch<SetStateAction<FlightData | null>>;
  setDestinationArrivalTime: Dispatch<SetStateAction<string>>;
  setSelectedHotel: Dispatch<SetStateAction<Hotel | null>>;
  setDestinationCityCommonName: Dispatch<SetStateAction<string>>;
  setDayPlan: Dispatch<SetStateAction<DayPlan[]>>;
  setPlanChanges: Dispatch<SetStateAction<PlanChange[]>>;
  setReturnDateTime:  Dispatch<SetStateAction<string>>
}

const TripPlannerContext = createContext<TripPlannerContextType | undefined>(undefined);

export function TripPlannerProvider({ children }: { children: ReactNode }) {
  // Set default dates to tomorrow and a week later
  const getDefaultDates = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    
    return {
      departureDate: tomorrow.toISOString().split('T')[0],
      returnDate: nextWeek.toISOString().split('T')[0]
    };
  };

  const defaultDates = getDefaultDates();
  
  const [departureLocation, setDepartureLocation] = useState('');
  const [arrivalLocation, setArrivalLocation] = useState('');
  const [departureDate, setDepartureDate] = useState(defaultDates.departureDate);
  const [returnDate, setReturnDate] = useState(defaultDates.returnDate);
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [hotelPreferences, setHotelPreferences] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [minimumBudget, setMinimumBudget] = useState(1000);
  const [maximumBudget, setMaximumBudget] = useState(2000);
  const [departureAirportCode, setDepartureAirportCode] = useState<string[]>([]);
  const [arrivalAirportCode, setArrivalAirportCode] = useState<string[]>([]);
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState<FlightData | null>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<FlightData | null>(null);
  const [destinationArrivalTime, setDestinationArrivalTime] = useState('');
  const [returnDateTime, setReturnDateTime] = useState('');
  const [destinationCityCommonName, setDestinationCityCommonName] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [dayPlan, setDayPlan] = useState<DayPlan[]>([]);
  const [planChanges, setPlanChanges] = useState<PlanChange[]>([]);
  const [gotFromLocalStorage, setGotFromLocalStorage] = useState(false);

  // Load data from localStorage on initial mount
  useEffect(() => {
    if (gotFromLocalStorage) return;
    
    const dataFromLocalStorage = localStorage.getItem("trip-data");

    if (dataFromLocalStorage) {
      const parsedData = JSON.parse(dataFromLocalStorage);
      setDepartureLocation(parsedData.departureLocation);
      setArrivalLocation(parsedData.arrivalLocation);
      setDepartureDate(parsedData.departureDate);
      setReturnDate(parsedData.returnDate);
      setNumberOfAdults(parsedData.numberOfAdults);
      setNumberOfChildren(parsedData.numberOfChildren);
      setHotelPreferences(parsedData.hotelPreferences);
      setInterests(parsedData.interests);
      setMinimumBudget(parsedData.minimumBudget);
      setMaximumBudget(parsedData.maximumBudget);
      setDepartureAirportCode(parsedData.departureAirportCode); 
      setArrivalAirportCode(parsedData.arrivalAirportCode);
      setSelectedOutboundFlight(parsedData.selectedOutboundFlight);
      setSelectedReturnFlight(parsedData.selectedReturnFlight);
      setDestinationArrivalTime(parsedData.destinationArrivalTime);
      setReturnDateTime(parsedData.returnDateTime);
      setDestinationCityCommonName(parsedData.destinationCityCommonName);
      setSelectedHotel(parsedData.selectedHotel);
      setDayPlan(parsedData.dayPlan);
      setPlanChanges(parsedData.planChanges);
      setGotFromLocalStorage(true);
    }
  }, []);

  // Update localStorage whenever trip data changes
  useEffect(() => {
    // Don't save empty initial values on first load
    if (!gotFromLocalStorage) return;

    localStorage.setItem("trip-data", JSON.stringify({
      departureLocation,
      arrivalLocation,
      departureDate,
      returnDate,
      numberOfAdults,
      numberOfChildren,
      hotelPreferences,
      interests,
      minimumBudget,
      maximumBudget,
      departureAirportCode,
      arrivalAirportCode,
      selectedOutboundFlight,
      selectedReturnFlight,
      destinationArrivalTime,
      returnDateTime,
      destinationCityCommonName,
      selectedHotel,
      dayPlan,
      planChanges
    }));
  }, [
    gotFromLocalStorage,
    departureLocation,
    arrivalLocation,
    departureDate,
    returnDate,
    numberOfAdults,
    numberOfChildren,
    hotelPreferences,
    interests,
    minimumBudget,
    maximumBudget,
    departureAirportCode,
    arrivalAirportCode,
    selectedOutboundFlight,
    selectedReturnFlight,
    destinationArrivalTime,
    returnDateTime,
    destinationCityCommonName,
    selectedHotel,
    dayPlan,
    planChanges
  ]);

  return (
    <TripPlannerContext.Provider
      value={{
        departureLocation,
        arrivalLocation,
        departureDate,
        returnDate,
        numberOfAdults,
        numberOfChildren,
        hotelPreferences,
        interests,
        minimumBudget,
        maximumBudget,
        departureAirportCode,
        arrivalAirportCode,
        selectedOutboundFlight,
        selectedReturnFlight,
        selectedHotel,
        destinationArrivalTime,
        destinationCityCommonName,
        dayPlan,
        planChanges,
        returnDateTime,
        setDepartureLocation,
        setArrivalLocation,
        setDepartureDate,
        setReturnDate,
        setNumberOfAdults,
        setNumberOfChildren,
        setHotelPreferences,
        setInterests,
        setMinimumBudget,
        setMaximumBudget,
        setDepartureAirportCode,
        setArrivalAirportCode,
        setSelectedOutboundFlight,
        setSelectedReturnFlight,
        setSelectedHotel,
        setDestinationArrivalTime,
        setDestinationCityCommonName,
        setDayPlan,
        setPlanChanges,
        setReturnDateTime
      }}
    >
      {children}
    </TripPlannerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTripPlanner() {
  const context = useContext(TripPlannerContext);
  if (context === undefined) {
    throw new Error('useTripPlanner must be used within a TripPlannerProvider');
  }
  return context;
} 