import { FlightData } from '@/pages/ChooseFlight';
import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react';

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

  // Selected hotel
  selectedHotel: unknown | null;

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
  setSelectedHotel: Dispatch<SetStateAction<unknown>>;
}

const TripPlannerContext = createContext<TripPlannerContextType | undefined>(undefined);

export function TripPlannerProvider({ children }: { children: ReactNode }) {
  const [departureLocation, setDepartureLocation] = useState('');
  const [arrivalLocation, setArrivalLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('2025-06-20');
  const [returnDate, setReturnDate] = useState('2025-06-27');
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
  const [selectedHotel, setSelectedHotel] = useState<unknown | null>(null);

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