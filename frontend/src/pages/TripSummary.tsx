import { Button } from "@/components/ui/button";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { useNavigate } from "react-router-dom";
import LayoutDiv from "@/components/layout-div";

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
    dayPlan
  } = useTripPlanner();

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

  return (
    <LayoutDiv className="overflow-y-auto">
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
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
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
                    <div className="p-6 max-h-96 overflow-y-auto space-y-4">
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