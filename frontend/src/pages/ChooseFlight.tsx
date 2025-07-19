import { API_URL } from "@/App";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { useNavigate } from "react-router-dom";
import LayoutDiv from "@/components/layout-div";
import { FlightData } from "@/types/flight";
import { FlightBox } from "@/components/flight-box";


function ChooseFlight({ type = 'outbound' }: { type: "outbound" | "return" }) {
  const navigate = useNavigate();
  const {
    departureAirportCode,
    arrivalAirportCode,
    departureDate,
    returnDate,
    selectedOutboundFlight,
    setSelectedOutboundFlight,
    setSelectedReturnFlight,
    setDestinationArrivalTime
  } = useTripPlanner();

  const [selectedFlight, setSelectedFlight] = useState<number>(0);
  const [flightData, setFlightData] = useState<FlightData[]>([]);
  

  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<string | null>(null);

  const fetchFlightData = async () => {
    try {
      setError(null);
      setFlightData([]);
      setSelectedFlight(0);
      setLoading(true);
      const response = await fetch(
        `${API_URL}/travelplan/flights?` + 
        `departureAirportId=${departureAirportCode}&` +
        `arrivalAirportId=${arrivalAirportCode}&` +
        `departureDate=${departureDate}&` +
        `returnDate=${returnDate}`
      );
      const data = await response.json();
      setFlightData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setError(JSON.stringify(error));
    }
  }

  const fetchReturnFlightData = async () => {
    
    if (!selectedOutboundFlight?.departure_token) {
      return;
    }

    try {
      setFlightData([]);
      setSelectedFlight(0);
      setLoading(true);
      const response = await fetch(
        `${API_URL}/travelplan/return-flights?` +
        `departureAirportId=${arrivalAirportCode}&` +
        `arrivalAirportId=${departureAirportCode}&` +
        `departureDate=${departureDate}&` +
        `returnDate=${returnDate}&` +
        `departureToken=${selectedOutboundFlight.departure_token}`
      );
      const data = await response.json();
      setFlightData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching return flights:', error);
    }
  }

  useEffect(() => {
    if (type === 'outbound') {
      fetchFlightData();
    } else {
      fetchReturnFlightData();
    }
  }, [type]);

  const handleContinue = () => {
    const selectedFlightData = flightData[selectedFlight - 1];
    
    if (type === 'outbound') {
      setSelectedOutboundFlight(selectedFlightData);
      setDestinationArrivalTime(selectedFlightData.flights[selectedFlightData.flights.length - 1].arrival_airport.time);
      navigate('/choose-return-flight');
    } else {
      setSelectedReturnFlight(selectedFlightData);
      navigate('/choose-hotel');
    }
  };

  return (
    <LayoutDiv>
      <div className="flex mb-2 justify-between w-full items-center">
        <h1 className="text-3xl flex items-baseline gap-2 font-black">Choose Your {type === 'outbound' ? 'Outbound' : 'Return'} Flight <div className="text-gray-400 text-sm font-normal">({flightData.length} results)</div></h1>
      </div>

      {
        error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )
      }
      
      {loading ?  
        <div className="flex flex-col items-center justify-center h-64">
          <div className="h-10">
              <div role="status">
                  <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
              </div>
          </div>
        </div>
        : (
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
        )
      }

      <div className="flex justify-end w-full">
        <Button 
          size={'lg'} 
          onClick={handleContinue}
          disabled={selectedFlight === 0}
        >
          Continue
        </Button>
      </div>
    </LayoutDiv>
  );
}



export default ChooseFlight;

