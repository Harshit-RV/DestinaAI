import { Button } from "@/components/ui/button";
import { Activity, DayPlan } from "@/contexts/TripPlannerContext";
import { useNavigate, useLocation } from "react-router-dom";
import LayoutDiv from "@/components/layout-div";
import { useRef, useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface SavedTripData {
  id: number;
  arrivalLocation: string | null;
  departureLocation: string | null;
  departureDate: string | null;
  returnDate: string | null;
  numberOfAdults: number | null;
  numberOfChildren: number | null;
  minimumBudget: number | null;
  maximumBudget: number | null;
  created_at: number | null;
  destinationCityCommonName: string | null;
  arrivalAirportCode: string[] | null;
  departureAirportCode: string[] | null;
  destinationArrivalTime: string | null;
  returnDateTime: string | null;
  selectedOutboundFlight?: any;
  selectedReturnFlight?: any;
  selectedHotel?: any;
  dayPlan?: any;
  planChanges?: any;
  interests?: string[] | null;
  hotelPreferences?: string[] | null;
  estimatedCarbonEmissionFromActivities?: string
}

function SavedTripSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tripData, setTripData] = useState<SavedTripData | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get trip data from location state
    if (location.state && location.state.tripData) {
      const tripData = location.state.tripData;
      console.log('Received trip data:', tripData);
      console.log('Day plan structure:', tripData.dayPlan);
      console.log('Plan changes structure:', tripData.planChanges);
      setTripData(tripData);
    } else {
      // If no trip data, redirect to trips page
      navigate('/trips');
    }
  }, [location.state, navigate]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
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
      // Scroll button logic if needed
    }
  };

  // Initialize scroll button states when component mounts or dayPlan changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updateScrollButtons();
    }, 100);
    return () => clearTimeout(timer);
  }, [tripData?.dayPlan]);

  if (!tripData) {
    return (
      <LayoutDiv>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#28666E] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </LayoutDiv>
    );
  }

  return (
    <LayoutDiv className="overflow-scroll" >
      <div className="flex flex-col sm:flex-row mb-6 sm:mb-8 justify-between w-full items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-4xl font-black">Your Saved Trip</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/trips')} className="bg-white">
              Back to Trips
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-[#28666E] hover:bg-[#1f4f54]"
            >
              Plan New Trip
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
                    <p className="font-bold text-lg">{tripData.departureLocation || 'Unknown'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">TO</p>
                    <p className="font-bold text-lg">{tripData.arrivalLocation || 'Unknown'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">DEPARTURE</p>
                    <p className="font-semibold">{formatDate(tripData.departureDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">RETURN</p>
                    <p className="font-semibold">{formatDate(tripData.returnDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">TRAVELERS</p>
                    <p className="font-semibold">{tripData.numberOfAdults || 0} Adults, {tripData.numberOfChildren || 0} Children</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">BUDGET</p>
                    <p className="font-semibold text-green-600">${tripData.minimumBudget || 0} - ${tripData.maximumBudget || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flights */}
            <div className="space-y-4">
              {/* Outbound Flight */}
              {tripData.selectedOutboundFlight && (
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
                        {tripData.selectedOutboundFlight.airline_logo && (
                          <img 
                            className="h-12 w-12 border rounded-full" 
                            src={tripData.selectedOutboundFlight.airline_logo}
                            alt={tripData.selectedOutboundFlight.flights?.[0]?.airline || 'Airline'}
                          />
                        )}
                        <div>
                          <p className="font-bold text-lg">{tripData.selectedOutboundFlight.flights?.[0]?.airline || 'Unknown Airline'}</p>
                          <p className="text-gray-600 text-sm">{tripData.selectedOutboundFlight.flights?.[0]?.flight_number || 'N/A'}</p>
                          <div className="flex sm:hidden items-baseline mt-1 gap-2">
                            <p className="text-gray-500 text-sm ">Price</p>
                            <p className="font-bold text-md text-green-600">${tripData.selectedOutboundFlight.price || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Arrival Time</p>
                        <p className="font-semibold">
                          {tripData.selectedOutboundFlight.flights?.[0]?.arrival_airport?.time 
                            ? formatTime(tripData.selectedOutboundFlight.flights[0].arrival_airport.time)
                            : 'N/A'
                          }
                        </p>
                      </div>
                      <div className="text-right hidden sm:flex flex-col">
                        <p className="text-gray-500 text-sm">Price</p>
                        <p className="font-bold text-xl text-green-600">${tripData.selectedOutboundFlight.price || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Return Flight */}
              {tripData.selectedReturnFlight && (
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
                        {tripData.selectedReturnFlight.airline_logo && (
                          <img 
                            className="h-12 w-12 border rounded-full" 
                            src={tripData.selectedReturnFlight.airline_logo}
                            alt={tripData.selectedReturnFlight.flights?.[0]?.airline || 'Airline'}
                          />
                        )}
                        <div>
                          <p className="font-bold text-lg">{tripData.selectedReturnFlight.flights?.[0]?.airline || 'Unknown Airline'}</p>
                          <p className="text-gray-600 text-sm">{tripData.selectedReturnFlight.flights?.[0]?.flight_number || 'N/A'}</p>
                          <div className="flex sm:hidden items-baseline mt-1 gap-2">
                            <p className="text-gray-500 text-sm ">Price</p>
                            <p className="font-bold text-md text-green-600">${tripData.selectedReturnFlight.price || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Departure Time</p>
                        <p className="font-semibold">
                          {tripData.selectedReturnFlight.flights?.[0]?.departure_airport?.time 
                            ? formatTime(tripData.selectedReturnFlight.flights[0].departure_airport.time)
                            : 'N/A'
                          }
                        </p>
                      </div>
                      <div className="text-right hidden sm:flex flex-col">
                        <p className="text-gray-500 text-sm">Price</p>
                        <p className="font-bold text-xl text-green-600">${tripData.selectedReturnFlight.price || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hotel */}
            {tripData.selectedHotel && (
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
                      <p className="font-bold text-lg">{tripData.selectedHotel.hotel?.name || 'Hotel Name'}</p>
                      <p className="text-gray-600">{tripData.selectedHotel.hotel?.cityCode || 'Location'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">Total Price</p>
                      <p className="font-bold text-xl text-green-600">${tripData.selectedHotel.offers?.[0]?.price?.total || 'N/A'}</p>
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
                {tripData.hotelPreferences && tripData.hotelPreferences.length > 0 && (
                  <div>
                    <p className="text-gray-600 font-medium mb-2">Hotel Preferences</p>
                    <div className="flex flex-wrap gap-2">
                      {tripData.hotelPreferences.map((pref, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {tripData.interests && tripData.interests.length > 0 && (
                  <div>
                    <p className="text-gray-600 font-medium mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {tripData.interests.map((interest, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(!tripData.hotelPreferences || tripData.hotelPreferences.length === 0) && 
                 (!tripData.interests || tripData.interests.length === 0) && (
                  <p className="text-gray-500 text-sm">No preferences saved</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b">
                <h3 className="text-lg font-bold text-gray-800">Estimated Carbon Emissions</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 font-medium">Hotel</p>
                  <div className="flex flex-wrap gap-2">
                      <span  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {tripData.selectedHotel?.carbon_emissions?.total_emissions} kg of CO2
                      </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 font-medium">Flights</p>
                  <div className="flex flex-wrap gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {(Number(tripData.selectedOutboundFlight?.carbon_emissions.this_flight ?? 0)  + Number(tripData.selectedReturnFlight?.carbon_emissions.this_flight ?? 0)) / 1000} kg of CO2
                      </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 font-medium">Activities</p>
                  <div className="flex flex-wrap gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {tripData.estimatedCarbonEmissionFromActivities}
                      </span>
                  </div>
                </div>
              </div>
            </div>
            
            {(() => {
              // Handle different plan changes data structures from database
              let planChangesData = null;
              
              if (tripData.planChanges) {
                // If planChanges is an object with explanation property (from database)
                if (typeof tripData.planChanges === 'object' && tripData.planChanges.explanation) {
                  try {
                    planChangesData = JSON.parse(tripData.planChanges.explanation);
                  } catch (e) {
                    // If parsing fails, use the single change object
                    planChangesData = [tripData.planChanges];
                  }
                }
                // If planChanges is already an array (direct from context)
                else if (Array.isArray(tripData.planChanges)) {
                  planChangesData = tripData.planChanges;
                }
                // If it's a single object, wrap it in an array
                else if (typeof tripData.planChanges === 'object') {
                  planChangesData = [tripData.planChanges];
                }
              }
              
              return planChangesData && planChangesData.length > 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Itinerary adjustments made
                  </h3>
                  <ul className="space-y-1 text-sm text-blue-700">
                    {planChangesData.map((change: any, index: number) => (
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
              ) : null;
            })()}
          </div>
      </div>

      {(() => {
        // Handle different day plan data structures from database
        let dayPlanData = null;
        
        if (tripData.dayPlan) {
          // If dayPlan is an object with activities property (from database)
          if (typeof tripData.dayPlan === 'object' && tripData.dayPlan.activities) {
            dayPlanData = tripData.dayPlan.activities;
          }
          // If dayPlan is already an array (direct from context)
          else if (Array.isArray(tripData.dayPlan)) {
            dayPlanData = tripData.dayPlan;
          }
        }
        
        if (dayPlanData && dayPlanData.length > 0) {
          return (
            <>
              <div className="mb-6 w-full flex flex-col items-start">
                <h2 className="text-2xl sm:text-3xl font-black mb-2">Your Itinerary</h2>
                <p className="text-gray-600">Scroll through your day-by-day adventure</p>
              </div>
              
              <ScrollArea className="w-full rounded-md border">
                <div className="flex w-max space-x-4 p-4">
                  {dayPlanData.map((day: DayPlan, index: number) => 
                    <DayCard key={index} day={day} index={index} />
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </>
          );
        } else {
          return (
            <div className="mb-6 w-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Itinerary Available</h3>
              <p className="text-gray-500 text-center">
                This trip doesn't have a detailed day-by-day itinerary saved.
              </p>
            </div>
          );
        }
      })()}
    </LayoutDiv>
  )
}

export default SavedTripSummary;

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
      {day.weather_forcast && (
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
      )}

      {/* Activities */}
      <ScrollArea className="w-full rounded-md border">
      <div className="p-6 max-h-96 space-y-4 always-visible-scrollbar force-scrollbar-y">
        {day.activities.map((activity: Activity, activityIndex: number) => (
          <ActivityCard key={activityIndex} activity={activity} activityIndex={activityIndex}/>
        ))}
      </div>
      </ScrollArea>
    </div>
  )
}
