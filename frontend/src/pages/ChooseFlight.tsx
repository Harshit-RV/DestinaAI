import { API_URL, LayoutDiv } from "@/App";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Airport {
  name: string;
  id: string;
  time: string;
}

interface Flight {
  departure_airport: Airport;
  arrival_airport: Airport;
  duration: number;
  airplane: string;
  airline: string;
  airline_logo: string;
  travel_class: string;
  flight_number: string;
  ticket_also_sold_by?: string[];
  legroom: string;
  extensions: string[];
  often_delayed_by_over_30_min?: boolean;
}

interface CarbonEmissions {
  this_flight: number;
  typical_for_this_route: number;
  difference_percent: number;
}

interface Layover {
  duration: number;
  name: string;
  id: string;
}

interface FlightData {
  flights: Flight[];
  layovers?: Layover[];
  total_duration: number;
  carbon_emissions: CarbonEmissions;
  price: number;
  type: string;
  airline_logo: string;
  extensions: string[];
  departure_token: string;
}

function ChooseFlight() {
  const [ selectedFlight, setSelectedFlight ] = useState<number>(0);

  const [flightData, setFlightData] = useState<FlightData[]>([]);

  const fetchFlightData = async () => {
    const response = await fetch(`${API_URL}/travelplan/flights?departureAirportId=CDG&arrivalAirportId=ORY&departureDate=2025-06-11&returnDate=2025-06-14`);
    const data = await response.json();
    setFlightData(data);
  }

  useEffect(() => {
    fetchFlightData();
  }, []);

  return (
    <LayoutDiv>
      <div className="flex mb-2 justify-between w-full items-center">
        <h1 className="text-3xl flex items-baseline gap-2 font-black">Choose Your Flight <div className="text-gray-400 text-sm font-normal">({flightData.length} results)</div></h1>
      </div>
      
      <div className="border w-full overflow-scroll overflow-x-hidden">
        {flightData.map((flightData, index) => (
          <FlightBox 
            key={index}
            id={index + 1} 
            selectedIndex={selectedFlight} 
            onClick={() => setSelectedFlight(index + 1)}
            flightData={flightData}
          />
        ))}
      </div>

      <div className="flex justify-end w-full">
        <Button size={'lg'}>Continue</Button>
      </div>
    </LayoutDiv>
  );
}

const FlightBox = ({ id, selectedIndex, onClick, flightData } : { 
  id: number, 
  selectedIndex: number, 
  onClick: () => void,
  flightData: FlightData
}) => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}hr ${mins}min`;
  };

  const isConnecting = flightData.flights.length > 1;
  const firstFlight = flightData.flights[0];
  const lastFlight = flightData.flights[flightData.flights.length - 1];

  // Create route display
  const getRouteDisplay = () => {
    if (isConnecting) {
      const airports = [firstFlight.departure_airport.id];
      flightData.flights.forEach(flight => {
        airports.push(flight.arrival_airport.id);
      });
      return airports.join(' → ');
    }
    return `${firstFlight.departure_airport.id} → ${firstFlight.arrival_airport.id}`;
  };

  return (
    <div onClick={onClick} className={`hover:cursor-pointer border-b px-10 py-6 ${selectedIndex == id ? "outline-[#28666E] outline-2 bg-blue-50" : ""} m-0.5`}>
      {/* Main flight info row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-7">
          <img className="h-14 w-14 border rounded-full" src={flightData.airline_logo}/>
          <div className="flex flex-col gap-1">
            <div className="text-black font-bold text-xl">
              {formatTime(firstFlight.departure_airport.time)} to {formatTime(lastFlight.arrival_airport.time)}
            </div>
            <div className="text-gray-500 text-sm">
              {isConnecting ? `${flightData.flights.length} flights` : firstFlight.airline} • {flightData.flights.map(f => f.flight_number).join(', ')}
            </div>
            <div className="text-gray-400 text-xs">{firstFlight.airplane}</div>
          </div>
        </div>
        <div className="font-bold text-md">{getRouteDisplay()}</div>
        <div className="text-gray-500 text-md">{formatDuration(flightData.total_duration)}</div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-gray-500 text-md">{Math.round(flightData.carbon_emissions.this_flight / 1000)}kg CO2</div>
          <span className={`ml-1 text-xs ${flightData.carbon_emissions.difference_percent < 0 ? 'text-green-600' : 'text-red-600'}`}>
            ({flightData.carbon_emissions.difference_percent > 0 ? '+' : ''}{flightData.carbon_emissions.difference_percent}% vs typical)
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          {isConnecting && flightData.layovers && (
            <div className="text-orange-600 text-sm font-medium mb-1">
              {flightData.layovers.length} stop{flightData.layovers.length > 1 ? 's' : ''}
            </div>
          )}
          {!isConnecting && (
            <div className="text-green-600 text-sm font-medium mb-1">Non-Stop</div>
          )}
          <div className="text-gray-700 font-bold text-lg">${flightData.price}</div>
          <span className="text-gray-400 text-sm">Class: {firstFlight.travel_class}</span>
        </div>
      </div>

      {/* Flight segments and layovers */}
      {isConnecting && (
        <div className="mb-4 bg-gray-50 p-4 rounded-lg">
          <div className="text-gray-700 font-medium mb-3">Flight Details:</div>
          {flightData.flights.map((flight, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="text-sm">
                    <span className="font-medium">{flight.flight_number}</span> • {flight.airline}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTime(flight.departure_airport.time)} ({flight.departure_airport.id}) → {formatTime(flight.arrival_airport.time)} ({flight.arrival_airport.id})
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDuration(flight.duration)} • {flight.airplane}
                  </div>
                </div>
                {flight.often_delayed_by_over_30_min && (
                  <span className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded">
                    Often delayed
                  </span>
                )}
              </div>
              
              {/* Layover info */}
              {index < flightData.flights.length - 1 && flightData.layovers && flightData.layovers[index] && (
                <div className="mt-2 ml-4 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                  Layover in {flightData.layovers[index].name} ({flightData.layovers[index].id}): {formatDuration(flightData.layovers[index].duration)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Additional details section */}
      <div className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2 mt-2">
          {/* Collect all extensions from all flights */}
          {flightData.flights.map(flight => flight.extensions).flat().map((extension, index) => (
            <span key={index} className="bg-gray-100 px-6 py-1.5 rounded-md text-gray-600 text-xs">
              {extension}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ChooseFlight;

