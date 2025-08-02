import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutDiv from "@/components/layout-div";
import { API_URL } from "@/App";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { Hotel } from "@/types/hotel";
import { HotelBox } from "@/components/hotel-box";

function ChooseHotel() {
  const navigate = useNavigate();
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [ hotelData, setHotelData ] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

   const {
    selectedOutboundFlight,
    selectedReturnFlight,
    numberOfAdults,
    arrivalAirportCode,
    numberOfChildren,
    setSelectedHotel,
  } = useTripPlanner();


  const getDateFromAirportTime = (timestamp: string | undefined) => {
    if (!timestamp) return '';
    const date = timestamp.split(' ')[0];
    const time = timestamp.split(' ')[1];

    const hours = time.split(':')[0];

    if (Number(hours) < 8) {
      const dayPart = date.split('-')[2];
      let dayBefore = String(Number(dayPart) - 1);
      dayBefore = dayBefore.toString().padStart(2, '0');
      return date.split('-')[0] + '-' + date.split('-')[1] + '-' + dayBefore;
    } else {
      return date;
    }
  }

  const fetchHotelData = async () => {
    try {
      setError(null);
      setHotelData([]);
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/travelplan/hotels?` + 
        `location=${arrivalAirportCode}&` +
        `checkInDate=${getDateFromAirportTime(selectedOutboundFlight?.flights[selectedOutboundFlight?.flights.length - 1].arrival_airport.time)}&` +
        `checkOutDate=${getDateFromAirportTime(selectedReturnFlight?.flights[0].departure_airport.time)}&` +
        `numberOfAdults=${numberOfAdults}&` +
        `numberOfChildren=${numberOfChildren}`
      );
      const data = await response.json();
      // Add empty images array to each hotel
      const hotelDataWithImages = data.data.map((hotel: Hotel) => ({
        ...hotel,
        images: [{ type: "" }]
      }));
      setHotelData(hotelDataWithImages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError(JSON.stringify(error));
      setIsLoading(false);
    }
  }

  const handleContinue = () => {
    navigate('/plan-your-trip');
  };

  useEffect(() => {
    fetchHotelData();
  }, []);

  return (
    <LayoutDiv>
      <div className="flex flex-col sm:flex-row mb-4 sm:mb-2 justify-between w-full items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-black">Choose Your Hotel</h1>
        {/* <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">Filters</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Hotel Filters</SheetTitle>
              <SheetDescription>
                Filter hotels based on your preferences
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm">Sort By</div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Price</SelectLabel>
                      <SelectItem value="price-high-to-low">Price (high to low)</SelectItem>
                      <SelectItem value="price-low-to-high">Price (low to high)</SelectItem>
                      <SelectItem value="rating-high-to-low">Rating (high to low)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 px-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Free Wi-Fi</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Pet Friendly</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Pool</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Fitness Center</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Kitchen</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Wheelchair Accessible</div>
                </div>
              </div>
              <div className="grid gap-3">
                <Input id="price-range" placeholder="Price range" />
              </div>
            </div>
            <SheetFooter>
              <Button type="submit">Apply Filters</Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet> */}
      </div>

      {
        error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )
      }
      
      {isLoading ? (
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
      ) : (
        <div className="border w-full overflow-scroll overflow-x-hidden max-h-[calc(100vh-200px)]">
          {hotelData.map((hotel) => (
            <HotelBox 
              key={hotel.hotel.hotelId}
              hotel={hotel}
              selected={hotel.hotel.hotelId === selectedHotelId}
              onClick={() => {
                setSelectedHotelId(hotel.hotel.hotelId)
                setSelectedHotel(hotel)
              }}
            />
          ))}
        </div>
      )}

      <div className="flex justify-end w-full mt-4">
        <Button 
          size={'lg'} 
          className="w-full sm:w-40" 
          disabled={!selectedHotelId}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </LayoutDiv>
  );
}



export default ChooseHotel;

