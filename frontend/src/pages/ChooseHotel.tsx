import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectItem, SelectContent } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
// import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import LayoutDiv from "@/components/layout-div";
import { API_URL } from "@/App";
import { useTripPlanner } from "@/contexts/TripPlannerContext";

interface Hotel {
  property_token: string;
  name: string;
  description: string;
  images: { thumbnail: string }[];
  overall_rating: number;
  reviews: number;
  rate_per_night: { lowest: string };
  amenities: string[];
}

function ChooseHotel() {
  const navigate = useNavigate();
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [ hotelData, setHotelData ] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

   const {
    arrivalLocation,
    hotelPreferences,
    interests,
  } = useTripPlanner();

  const fetchHotelData = async () => {
    try {
      setHotelData([]);
      setLoading(true);
      const response = await fetch(
        `${API_URL}/travelplan/hotels?` + 
        `interests=${interests.join(', ')}&` +
        `location=${arrivalLocation}&` +
        `hotelPreference=${hotelPreferences.join(', ')}&` +
        `checkInDate=2025-06-23&` +
        `checkOutDate=2025-06-28`
      );
      const data = await response.json();
      setHotelData(data.properties);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  }

  const handleContinue = () => {
    navigate('/trip-summary');
  };

  useEffect(() => {
    fetchHotelData();
  }, []);

  return (
    <LayoutDiv>
      <div className="flex mb-2 justify-between w-full items-center">
        <h1 className="text-3xl font-black">Choose Your Hotel</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Filters</Button>
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
        </Sheet>
      </div>
      
      <div className="border w-full overflow-scroll overflow-x-hidden max-h-[calc(100vh-200px)]">
        {hotelData.map((hotel) => (
          <HotelBox 
            key={hotel.property_token}
            hotel={hotel}
            selected={hotel.property_token === selectedHotelId}
            onClick={() => setSelectedHotelId(hotel.property_token)}
          />
        ))}
      </div>

      <div className="flex justify-end w-full mt-4">
        <Button 
          size={'lg'} 
          className="w-40" 
          disabled={!selectedHotelId}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </LayoutDiv>
  );
}

const HotelBox = ({ 
  hotel, 
  selected, 
  onClick 
} : { 
  hotel: Hotel, 
  selected: boolean, 
  onClick: () => void 
}) => {
  const imageUrl = hotel.images && hotel.images.length > 0 
    ? hotel.images[0].thumbnail 
    :  "https://via.placeholder.com/150";

  const displayAmenities = hotel.amenities ? hotel.amenities.slice(0, 9) : [];
  
  const rating = hotel.overall_rating 
    ? hotel.overall_rating.toFixed(1) 
    : "N/A";
  
  const reviewsCount = hotel.reviews || 0;
  
  const pricePerNight = hotel.rate_per_night?.lowest || "N/A";

  return (
    <div 
      onClick={onClick} 
      className={`flex border-b w-full items-center pr-10 justify-between ${selected ? "outline-[#28666E] outline-2" : ""} m-0.5`}
    >
      <img
          className="h-full w-1/4"
          src={imageUrl}
          alt={`${hotel.name} Photo`} 
      />
      <div className="flex w-3/4 flex-col pl-6">
        <div className={`flex items-center justify-between`}>
        
          <div className="flex h-full w-3/5 gap-5 ">
            <div className="flex flex-col gap-2 justify-center">
              <div className="text-black font-bold text-xl">{hotel.name}</div>
              <div className="text-gray-400 text-sm">{hotel.description}</div>
            </div>
          </div>

          <div className="text-gray-500 gap-2 flex flex-col text-md">
            <div className="text-2xl">{rating} ⭐️</div>
            <div className="text-sm">{reviewsCount} Reviews</div>
          </div>

          <div className="text-gray-600 flex flex-col text-md">
            <div className="text-2xl text-black font-bold">{pricePerNight}</div>
            <div className="text-sm">per night</div>
          </div>
        </div>
        
        <div className="mt-5 text-sm bg-gray-100 px-6 py-1.5 rounded-md text-gray-600 text-xs">
            {displayAmenities.join(" | ")}
        </div>
      </div>

    </div>
  );
};



export default ChooseHotel;

