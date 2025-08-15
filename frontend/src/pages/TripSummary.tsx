import { Button } from "@/components/ui/button";
import { Activity, DayPlan, useTripPlanner } from "@/contexts/TripPlannerContext";
import { useNavigate } from "react-router-dom";
import LayoutDiv from "@/components/layout-div";
import { useRef, useState, useEffect } from "react";
import { API_URL } from "@/App";
import { useUser } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function TripSummary() {
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
    selectedOutboundFlight,
    selectedReturnFlight,
    selectedHotel,
    dayPlan,
    planChanges,
    departureAirportCode,
    arrivalAirportCode,
    destinationArrivalTime,
    returnDateTime,
    destinationCityCommonName
  } = useTripPlanner();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // const [canScrollLeft, setCanScrollLeft] = useState(false);
  // const [canScrollRight, setCanScrollRight] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { isSignedIn, user } = useUser();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }; 

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      // const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      // setCanScrollLeft(scrollLeft > 0);
      // setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // const scrollLeftFn = () => {
  //   if (scrollContainerRef.current) {
  //     const cardWidth = 320 + 24; // card width (w-80 = 320px) + gap (gap-6 = 24px)
  //     scrollContainerRef.current.scrollBy({ 
  //       left: -cardWidth, 
  //       behavior: 'smooth' 
  //     });
  //     setTimeout(updateScrollButtons, 300);
  //   }
  // };

  // const scrollRightFn = () => {
  //   if (scrollContainerRef.current) {
  //     const cardWidth = 320 + 24; // card width (w-80 = 320px) + gap (gap-6 = 24px)
  //     scrollContainerRef.current.scrollBy({ 
  //       left: cardWidth, 
  //       behavior: 'smooth' 
  //     });
  //     setTimeout(updateScrollButtons, 300);
  //   }
  // };

  // Initialize scroll button states when component mounts or dayPlan changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updateScrollButtons();
    }, 100);
    return () => clearTimeout(timer);
  }, [dayPlan]);

  const handleSaveTrip = () => {
    if (!isSignedIn) {
      setShowAuthDialog(true);
      return;
    }
    saveTripToDatabase();
  };

  const saveTripToDatabase = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const userId = user?.id;
      if (userId == null) {
        setSaveStatus('error');
        console.error('User not authenticated');
        return;
      }
      
      const tripData = {
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
        selectedOutboundFlight,
        selectedReturnFlight,
        selectedHotel,
        dayPlan,
        planChanges,
        departureAirportCode,
        arrivalAirportCode,
        destinationArrivalTime,
        returnDateTime,
        destinationCityCommonName,
        userId
      };

      const response = await fetch(`${API_URL}/users/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      const result = await response.json();

      if (result.success) {
        setSaveStatus('success');
        console.log('Trip saved successfully with ID:', result.tripId);
      } else {
        setSaveStatus('error');
        console.error('Failed to save trip:', result.error);
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('Error saving trip:', error);
    } finally {
      setIsSaving(false);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  return (
    <LayoutDiv className="overflow-scroll" >
      <div className="flex flex-col sm:flex-row mb-6 sm:mb-8 justify-between w-full items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-4xl font-black">Your Trip Summary</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/')} className="bg-white">
              Start Over
            </Button>
            <Button 
              onClick={handleSaveTrip} 
              disabled={isSaving}
              className={`${
                saveStatus === 'success' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : saveStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#28666E] hover:bg-[#1f4f54]'
              } transition-colors duration-200`}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : saveStatus === 'success' ? (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved Successfully!
                </div>
              ) : saveStatus === 'error' ? (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Save Failed
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Trip
                </div>
              )}
            </Button>
          </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Trip Overview */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#28666E] to-[#1f4f54] px-6 py-4">
                <h2 className="text-xl font-bold text-white">Trip Overview</h2>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">FROM</p>
                    <p className="font-bold text-lg">{departureLocation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">TO</p>
                    <p className="font-bold text-lg">{arrivalLocation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">DEPARTURE</p>
                    <p className="font-semibold">{formatDate(departureDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">RETURN</p>
                    <p className="font-semibold">{formatDate(returnDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">TRAVELERS</p>
                    <p className="font-semibold">{numberOfAdults} Adults, {numberOfChildren} Children</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">BUDGET</p>
                    <p className="font-semibold text-green-600">${minimumBudget} - ${maximumBudget}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Changes */}
            

            {/* Flights */}
            <div className="space-y-4">
              {/* Outbound Flight */}
              {selectedOutboundFlight && (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="bg-blue-50 border-l-4 border-blue-500 px-6 py-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Outbound Flight
                    </h3>
                  </div>
                  <div className="flex-col gap-2 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {selectedOutboundFlight.airline_logo && (
                          <img 
                            className="h-12 w-12 border rounded-full" 
                            src={selectedOutboundFlight.airline_logo}
                            alt={selectedOutboundFlight.flights[0].airline}
                          />
                        )}
                        <div>
                          <p className="font-bold text-lg">{selectedOutboundFlight.flights[0].airline}</p>
                          <p className="text-gray-600 text-sm">{selectedOutboundFlight.flights[0].flight_number}</p>
                          <div className="flex sm:hidden items-baseline mt-1 gap-2">
                            <p className="text-gray-500 text-sm ">Price</p>
                            <p className="font-bold text-md text-green-600">${selectedOutboundFlight.price}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Arrival Time</p>
                        <p className="font-semibold">{formatTime(selectedOutboundFlight.flights[0].arrival_airport.time)}</p>
                      </div>
                      <div className="text-right hidden sm:flex flex-col">
                        <p className="text-gray-500 text-sm">Price</p>
                        <p className="font-bold text-xl text-green-600">${selectedOutboundFlight.price}</p>
                      </div>
                    </div>
                    {/* <div className="flex items-baseline gap-2 mt-4">
                      <p className="text-gray-500 text-xl ">Price</p>
                      <p className="font-bold text-xl text-green-600">${selectedOutboundFlight.price}</p>
                    </div> */}
                  </div>
                </div>
              )}

              {/* Return Flight */}
              {selectedReturnFlight && (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="bg-orange-50 border-l-4 border-orange-500 px-6 py-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Return Flight
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {selectedReturnFlight.airline_logo && (
                          <img 
                            className="h-12 w-12 border rounded-full" 
                            src={selectedReturnFlight.airline_logo}
                            alt={selectedReturnFlight.flights[0].airline}
                          />
                        )}
                        <div>
                          <p className="font-bold text-lg">{selectedReturnFlight.flights[0].airline}</p>
                          <p className="text-gray-600 text-sm">{selectedReturnFlight.flights[0].flight_number}</p>
                          <div className="flex sm:hidden items-baseline mt-1 gap-2">
                            <p className="text-gray-500 text-sm ">Price</p>
                            <p className="font-bold text-md text-green-600">${selectedOutboundFlight?.price}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Departure Time</p>
                        <p className="font-semibold">{formatTime(selectedReturnFlight.flights[0].departure_airport.time)}</p>
                      </div>
                      <div className="text-right hidden sm:flex flex-col">
                        <p className="text-gray-500 text-sm">Price</p>
                        <p className="font-bold text-xl text-green-600">${selectedReturnFlight.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hotel */}
            {selectedHotel && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-purple-50 border-l-4 border-purple-500 px-6 py-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Hotel Accommodation
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg">{selectedHotel.hotel?.name || 'Hotel Name'}</p>
                      <p className="text-gray-600">{selectedHotel.hotel?.cityCode || 'Location'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">Total Price</p>
                      <p className="font-bold text-xl text-green-600">${selectedHotel.offers?.[0]?.price?.total || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Preferences */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b">
                <h3 className="text-lg font-bold text-gray-800">Your Preferences</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-gray-600 font-medium mb-2">Hotel Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {hotelPreferences.map((pref, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 font-medium mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {planChanges && planChanges.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Itinerary adjustments made
                </h3>
                <ul className="space-y-1 text-sm text-blue-700">
                  {planChanges.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>
                        <strong>{change.activityName}</strong> moved from {change.originalDay} to {change.newDay} 
                        <span className="text-blue-600"> - {change.reason}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
      </div>

      <div className="mb-6 w-full flex flex-col items-start">
        <h2 className="text-2xl sm:text-3xl font-black mb-2">Your Itinerary</h2>
        <p className="text-gray-600">Scroll through your day-by-day adventure</p>
      </div>
      
      <ScrollArea className="w-full rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {dayPlan.map((day, index) => 
            <DayCard day={day} index={index} />
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to sign in to save your trip. Don't worry, your trip details will be preserved!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAuthDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowAuthDialog(false);
                navigate('/sign-in', { 
                  state: { 
                    redirectTo: '/trip-summary',
                    preserveTripData: true 
                  } 
                });
              }}
              className="bg-[#28666E] hover:bg-[#1f4f54]"
            >
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LayoutDiv>
  )
}

export default TripSummary; 


const ActivityCard = ({
  activityIndex, activity
} : {
  activity: Activity,
  activityIndex: number,
}) => {
  return (
    <div key={activityIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex flex-col gap-2 justify-between items-start mb-2">
        <h5 className="font-semibold text-gray-800 leading-tight">{activity.title}</h5>
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-medium">
          {activity.estimated_cost}
        </span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
          {activity.type}
        </span>
        <span className="text-gray-600 text-sm">
          {activity.start_time} - {activity.end_time}
        </span>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{activity.description}</p>
    </div>
  )
}

const DayCard = ( {day, index} : { day: DayPlan, index: number}) => {
  return (
    <div 
      className="flex-none w-80 bg-white rounded-xl shadow-lg border border-gray-200 snap-start overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Day Header */}
      <div className="bg-gradient-to-r from-[#28666E] to-[#1f4f54] px-6 py-4">
        <h3 className="text-xl font-bold text-white mb-1">{day.title}</h3>
        <div className="flex items-center gap-2 text-white/90 text-sm">
          <span>Day {index + 1}</span>
          <span>•</span>
          <span>{day.activities.length} activities</span>
        </div>
      </div>

      {/* Weather Forecast */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
          Weather Forecast
        </h4>
        <div className="grid grid-cols-3 gap-2 text-sm text-blue-700">
          <div className="text-center">
            <p className="font-medium">High</p>
            <p className="text-lg font-bold">{day.weather_forcast.high}</p>
          </div>
          <div className="text-center">
            <p className="font-medium">Low</p>
            <p className="text-lg font-bold">{day.weather_forcast.low}</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-xs">{day.weather_forcast.description}</p>
          </div>
        </div>
      </div>

      {/* Activities */}
      <ScrollArea className="w-full rounded-md border">
      <div className="p-6 max-h-96 space-y-4 always-visible-scrollbar force-scrollbar-y">
        {day.activities.map((activity, activityIndex) => (
          <ActivityCard activity={activity} activityIndex={activityIndex}/>
        ))}
      </div>
      </ScrollArea>
    </div>
  )
}