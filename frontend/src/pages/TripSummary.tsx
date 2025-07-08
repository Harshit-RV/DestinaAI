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

  return (
    <LayoutDiv>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Your Trip Summary</h1>

        {/* Trip Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Trip Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">From</p>
              <p className="font-semibold">{departureLocation}</p>
            </div>
            <div>
              <p className="text-gray-600">To</p>
              <p className="font-semibold">{arrivalLocation}</p>
            </div>
            <div>
              <p className="text-gray-600">Departure</p>
              <p className="font-semibold">{formatDate(departureDate)}</p>
            </div>
            <div>
              <p className="text-gray-600">Return</p>
              <p className="font-semibold">{formatDate(returnDate)}</p>
            </div>
            <div>
              <p className="text-gray-600">Travelers</p>
              <p className="font-semibold">{numberOfAdults} Adults, {numberOfChildren} Children</p>
            </div>
            <div>
              <p className="text-gray-600">Budget</p>
              <p className="font-semibold">${minimumBudget} - ${maximumBudget}</p>
            </div>
          </div>
        </div>

        {/* Outbound Flight */}
        {selectedOutboundFlight && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Outbound Flight</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Airline</p>
                <p className="font-semibold">{selectedOutboundFlight.flights[0].airline}</p>
              </div>
              <div>
                <p className="text-gray-600">arrival time</p>
                <p className="font-semibold">{selectedOutboundFlight.flights[0].arrival_airport.time}</p>
              </div>

              <div>
                <p className="text-gray-600">Flight Number</p>
                <p className="font-semibold">{selectedOutboundFlight.flights[0].flight_number}</p>
              </div>
              <div>
                <p className="text-gray-600">Price</p>
                <p className="font-semibold">${selectedOutboundFlight.price}</p>
              </div>
            </div>
          </div>
        )}

        {/* Return Flight */}
        {selectedReturnFlight && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Return Flight</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Airline</p>
                <p className="font-semibold">{selectedReturnFlight.flights[0].airline}</p>
              </div>
              <div>
                <p className="text-gray-600">Flight Number</p>
                <p className="font-semibold">{selectedReturnFlight.flights[0].flight_number}</p>
              </div>
              <div>
                <p className="text-gray-600">Price</p>
                <p className="font-semibold">${selectedReturnFlight.price}</p>
              </div>
            </div>
          </div>
        )}

        {/* Hotel */}
        {!!selectedHotel && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Hotel</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Hotel Name</p>
                <p className="font-semibold">{(selectedHotel as Record<string, any>)?.name || 'Hotel Name'}</p>
              </div>
              <div>
                <p className="text-gray-600">Location</p>
                <p className="font-semibold">{(selectedHotel as Record<string, any>)?.location || 'Location'}</p>
              </div>
              <div>
                <p className="text-gray-600">Price per Night</p>
                <p className="font-semibold">${(selectedHotel as Record<string, any>)?.price || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Day Plan */}
        {dayPlan && dayPlan.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Itinerary</h2>
            <div className="space-y-6">
              {dayPlan.map((day, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">{day.title}</h3>
                  
                  {/* Weather Forecast */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <h4 className="font-semibold text-blue-800 mb-1">Weather Forecast</h4>
                    <div className="flex items-center gap-4 text-sm text-blue-700">
                      <span>High: {day.weather_forcast.high}</span>
                      <span>Low: {day.weather_forcast.low}</span>
                      <span>{day.weather_forcast.description}</span>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="space-y-3">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-lg">{activity.title}</h5>
                          <span className="text-green-600 font-medium">{activity.estimated_cost}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="bg-blue-100 px-2 py-1 rounded">{activity.type}</span>
                          <span>{activity.start_time} - {activity.end_time}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Preferences</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Hotel Preferences</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {hotelPreferences.map((pref, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {pref}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-600">Interests</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map((interest, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            Start Over
          </Button>
          <Button onClick={() => console.log('Booking confirmed!')}>
            Confirm Booking
          </Button>
        </div>
      </div>
    </LayoutDiv>
  );
}

export default TripSummary; 