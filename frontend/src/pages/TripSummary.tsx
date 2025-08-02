import { Button } from "@/components/ui/button";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { useNavigate } from "react-router-dom";
import LayoutDiv from "@/components/layout-div";
import { useRef, useState, useEffect } from "react";

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
    planChanges
  } = useTripPlanner();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeftFn = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320 + 24; // card width (w-80 = 320px) + gap (gap-6 = 24px)
      scrollContainerRef.current.scrollBy({ 
        left: -cardWidth, 
        behavior: 'smooth' 
      });
      setTimeout(updateScrollButtons, 300);
    }
  };

  const scrollRightFn = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320 + 24; // card width (w-80 = 320px) + gap (gap-6 = 24px)
      scrollContainerRef.current.scrollBy({ 
        left: cardWidth, 
        behavior: 'smooth' 
      });
      setTimeout(updateScrollButtons, 300);
    }
  };

  // Initialize scroll button states when component mounts or dayPlan changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updateScrollButtons();
    }, 100);
    return () => clearTimeout(timer);
  }, [dayPlan]);

  return (
    <LayoutDiv className="overflow-y-auto">
      <style>{`
        .always-visible-scrollbar::-webkit-scrollbar {
          width: 12px !important;
          height: 12px !important;
          display: block !important;
        }
        .always-visible-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9 !important;
          border-radius: 6px !important;
        }
        .always-visible-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1 !important;
          border-radius: 6px !important;
        }
        .always-visible-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8 !important;
        }
        .always-visible-scrollbar {
          scrollbar-width: auto !important;
          scrollbar-color: #cbd5e1 #f1f5f9 !important;
        }
        .force-scrollbar-x {
          overflow-x: scroll !important;
        }
        .force-scrollbar-y {
          overflow-y: scroll !important;
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row mb-6 sm:mb-8 justify-between w-full items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-4xl font-black">Your Trip Summary</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/')} className="bg-white">
              Start Over
            </Button>
            <Button onClick={() => console.log('Booking confirmed!')} className="bg-[#28666E] hover:bg-[#1f4f54]">
              Confirm Booking
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Trip Overview */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#28666E] to-[#1f4f54] px-6 py-4">
                <h2 className="text-xl font-bold text-white">Trip Overview</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
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
                  <div className="p-6">
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
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Arrival Time</p>
                        <p className="font-semibold">{formatTime(selectedOutboundFlight.flights[0].arrival_airport.time)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Price</p>
                        <p className="font-bold text-xl text-green-600">${selectedOutboundFlight.price}</p>
                      </div>
                    </div>
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
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Departure Time</p>
                        <p className="font-semibold">{formatTime(selectedReturnFlight.flights[0].departure_airport.time)}</p>
                      </div>
                      <div className="text-right">
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

        {/* Day Plan - Full Width Scrollable Cards */}
        {dayPlan && dayPlan.length > 0 && (
          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black mb-2">Your Itinerary</h2>
              <p className="text-gray-600">Scroll through your day-by-day adventure</p>
            </div>
            
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={scrollLeftFn}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                  canScrollLeft ? 'hover:bg-gray-50 hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ marginLeft: '-24px' }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={scrollRightFn}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                  canScrollRight ? 'hover:bg-gray-50 hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ marginRight: '-24px' }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div 
                ref={scrollContainerRef}
                className="flex gap-6 pb-4 snap-x snap-mandatory always-visible-scrollbar force-scrollbar-x"
                onScroll={updateScrollButtons}
              >
              {dayPlan.map((day, index) => (
                <div 
                  key={index} 
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
                  <div className="p-6 max-h-96 space-y-4 always-visible-scrollbar force-scrollbar-y">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-gray-800 leading-tight">{activity.title}</h5>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2">
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
                    ))}
                  </div>
                </div>
              ))}
              </div>
            </div>
            
            {/* Scroll indicator */}
            <div className="flex justify-center mt-4">
              <p className="text-sm text-gray-500">← Scroll to see all days →</p>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </LayoutDiv>
  );
}

export default TripSummary; 