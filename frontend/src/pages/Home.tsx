import { useState, useEffect, useRef, } from "react";
import mapSvg from "../assets/map.svg";
import axios from 'axios'
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
// import { DatePicker } from "@/components/ui/datepicker";
import { Button } from "@/components/ui/button";
import ReactSlider from 'react-slider'
import { API_URL } from "@/App";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { useNavigate } from "react-router-dom";
import GrayBox from "@/components/gray-box";
import PreferenceBox from "@/components/preference-box";
import LayoutDiv from "@/components/layout-div";


function Home() {
  const navigate = useNavigate();
  const {
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
  } = useTripPlanner();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const [ completions, setCompletions ] = useState<string[]>([]);
  const [ currentLocationCompletions, setCurrentLocationCompletions ] = useState<string[]>([]);

  const generatePlan = async () => {
    if (arrivalLocation === "" || departureLocation === "" || departureDate === "" || returnDate === "") {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Get airport codes from GPT
      const response = await axios.get(`${API_URL}/util/get-airport-codes`, {
        params: {
          departureCityName: departureLocation,
          arrivalCityName: arrivalLocation
        }
      });

      console.log(response);

      const { departureCodes, arrivalCodes } = response.data.parsed;
      console.log({departureCodes, arrivalCodes});

      setDepartureAirportCode(departureCodes);
      setArrivalAirportCode(arrivalCodes);

      // Navigate to flight selection
      navigate('/choose-flight');
    } catch (error) {
      console.error('Error getting airport codes:', error);
      alert('Error getting airport codes. Please try again.');
    }
  }

  const handleDestinationChange = (e: string) => {
    getResults(e as unknown as string);
    setArrivalLocation(e);
  }

  const handleCurrentLocationChange = (e: string) => {
    getResultsForCurrentLocation(e as unknown as string);
    setDepartureLocation(e);
  }


  const addHotelPref = (pref: string) => {
    setHotelPreferences((prev) => {
      if (prev.includes(pref)) {
        return prev.filter((item) => item !== pref);
      } else {
        return [...prev, pref];
      }
    });
  }

  const addInterest = (interest: string) => {
    setInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
    }

    if (isSearchExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded]);

  const getResults = async (query: string | null) => {
    const data = await axios.get(`${API_URL}/travelplan/search?keyword=${query}`);
    data.data.map((item: { canonical_name: string; }) => {
      setCompletions((prev) => [...prev, item.canonical_name]);
    })
  }

  const getResultsForCurrentLocation = async (query: string | null) => {
    const data = await axios.get(`${API_URL}/travelplan/search?keyword=${query}`);
    data.data.map((item: { canonical_name: string; }) => {
      setCurrentLocationCompletions((prev) => [...prev, item.canonical_name]);
    })
  }

  return (
    <LayoutDiv>
      <div className="flex mb-4 justify-between w-full items-center">
       
        <h1 className="text-7xl font-black">LET'S TRAVEL</h1>
        <button>
          <h2 className="bg-gray-200 p-3 text-2xl font-black transform overflow-hidden rounded-lg text-left hover:shadow-xl transition-all sm:w-full sm:max-w-lg">
            User Profile
          </h2>
        </button>
      </div> 
       {/* <Calendar
          mode="single"
          // selected={Date()}
          onSelect={(date: unknown) => {
            if (date) {
              console.log(date);
            }
          }}
        /> */}
      
      {/* Search Container */}
      <div ref={searchContainerRef} className="relative w-full max-w-[750px] mb-8">
        {!isSearchExpanded ? (
          <div
            onClick={() => setIsSearchExpanded(true)}
            className="min-h-20 text-xl hover:cursor-pointer font-semibold tracking-wider text-gray-600 flex items-center px-10 rounded-full w-full border bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Start planning your dream trip
          </div>
        ) : (
          <div className="w-full">
            {/* Main Search Input */}
            <TextInput 
              onChange={(e) => handleDestinationChange(e as unknown as string)}
              trigger={[""]} 
              options={{"": completions}}
              autoFocus
              placeholder="Search for a destination"
              className="h-20 min-h-20 max-h-20 bg-gray-200 rounded-full w-full border px-10 py-6 font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* Dropdown Card */}
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-y-auto">
              <div className="p-6">
                {/* Leaving From Section */}
                <div className="flex flex-col gap-2 mb-6">
                  <div className="text-gray-400 text-sm font-bold">LEAVING FROM</div>
                  <TextInput 
                    onChange={(e) => handleCurrentLocationChange(e as unknown as string)}
                    trigger={[""]} 
                    options={{"": currentLocationCompletions}}
                    placeholder="Your location"
                    className="h-10 rounded-lg bg-gray-50 border border-gray-300 flex py-2 px-4 font-semibold text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Date Selection */}
                <div className="flex gap-8 mb-6">
                  <div className="flex flex-col gap-2 flex-1 relative">
                    <div className="text-gray-400 text-sm font-bold">FROM {departureDate}</div>
                    <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="h-8 rounded-lg bg-gray-50 border border-gray-300 flex items-center px-4 font-semibold text-md text-gray-700 hover:bg-gray-100 transition-colors text-left" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1 relative">
                    <div className="text-gray-400 text-sm font-bold">TO</div>
                    <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="h-8 rounded-lg bg-gray-50 border border-gray-300 flex items-center px-4 font-semibold text-md text-gray-700 hover:bg-gray-100 transition-colors text-left" />
                  </div>
                </div>

                {/* Travelers Counter */}
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex gap-6">
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="text-sm text-gray-600">Adults</div>
                      <div className="flex items-center h-9 rounded-lg bg-gray-50 border border-gray-300">
                        <button 
                          onClick={() => setNumberOfAdults(prev => Math.max(1, prev - 1))}
                          className="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                        >
                          -
                        </button>
                        <div className="flex-1 flex items-center justify-center font-semibold">
                          {numberOfAdults}
                        </div>
                        <button
                          onClick={() => setNumberOfAdults(prev => prev + 1)} 
                          className="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                      <div className="text-sm text-gray-600">Children</div>
                      <div className="flex items-center h-9 rounded-lg bg-gray-50 border border-gray-300">
                        <button
                          onClick={() => setNumberOfChildren(prev => Math.max(0, prev - 1))}
                          className="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                        >
                          -
                        </button>
                        <div className="flex-1 flex items-center justify-center font-semibold">
                          {numberOfChildren}
                        </div>
                        <button
                          onClick={() => setNumberOfChildren(prev => Math.max(0, prev + 1))}
                          className="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hotel Preferences */}
                <div className="flex flex-col gap-1 mb-6">
                  <div className="font-bold text-sm text-gray-400">HOTEL PREFERENCE</div>
                  <div className="flex flex-wrap gap-2">
                    <PreferenceBox title="Luxury" selected={hotelPreferences.includes("Luxury")} addItem={addHotelPref} />
                    <PreferenceBox title="Budget" selected={hotelPreferences.includes("Budget")} addItem={addHotelPref} />
                    <PreferenceBox title="Family Friendly" selected={hotelPreferences.includes("Family Friendly")} addItem={addHotelPref} />
                    <PreferenceBox title="Pet Friendly" selected={hotelPreferences.includes("Pet Friendly")} addItem={addHotelPref} />
                  </div>
                </div>

                {/* Interests */}
                <div className="flex flex-col gap-1 mb-6">
                  <div className="font-bold text-sm text-gray-400">INTERESTS</div>
                  <div className="flex flex-wrap gap-2">
                    <PreferenceBox title="Adventure" selected={interests.includes("Adventure")} addItem={addInterest} />
                    <PreferenceBox title="Culture" selected={interests.includes("Culture")} addItem={addInterest} />
                    <PreferenceBox title="Food" selected={interests.includes("Food")} addItem={addInterest} />
                    <PreferenceBox title="Relaxation" selected={interests.includes("Relaxation")} addItem={addInterest} />
                    <PreferenceBox title="Shopping" selected={interests.includes("Shopping")} addItem={addInterest} />
                  </div>
                </div>

                {/* Budget Slider */}
                <div className="flex flex-col gap-4 mb-6">
                  <div className="font-bold text-sm text-gray-400">BUDGET</div>
                  <div className="px-2">
                    <ReactSlider
                      className="w-full h-2 bg-gray-300 text-black rounded relative"
                      thumbClassName="w-5 h-8 bg-primary text-black rounded-full cursor-pointer"
                      trackClassName="h-4"
                      min={100}
                      max={10000}
                      defaultValue={[minimumBudget, maximumBudget]}
                      ariaLabel={['Lower thumb', 'Upper thumb']}
                      onAfterChange={(value) => {  
                        const newBudget = [...value];
                        console.log(minimumBudget, maximumBudget);
                        setMinimumBudget(newBudget[0]);
                        setMaximumBudget(newBudget[1]);
                      }}
                      minDistance={100}
                      renderThumb={(props, {valueNow} : { valueNow: number; }) => {
                        return (
                          <div {...props} className="w-5 h-5 -top-1.5 bg-primary rounded-full cursor-pointer flex items-center justify-center relative">
                            <span className="absolute -top-7 bg-black text-white text-xs px-2 py-1 rounded">
                              ${valueNow}
                            </span>
                          </div>
                        )
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button
                    variant={'outline'}
                    className="h-10 px-6"
                    onClick={() => setIsSearchExpanded(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="h-10 px-6" onClick={generatePlan}>Generate Plan</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 ">
        <GrayBox />
        <GrayBox />
        <GrayBox />
        <GrayBox />
        <GrayBox />
        <GrayBox />
      </div>
      <img src={mapSvg} className="w-full h-full"></img>
    </LayoutDiv>
  );
}

export default Home;

