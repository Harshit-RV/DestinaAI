import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import LayoutDiv from '@/components/layout-div';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/App';
interface SavedTrip {
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
  selectedOutboundFlight?: unknown;
  selectedReturnFlight?: unknown;
  selectedHotel?: unknown;
  dayPlan?: unknown;
  planChanges?: unknown;
  interests?: string[] | null;
  hotelPreferences?: string[] | null;
}

function Trips() {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/${user.id}/trips`);
      const result = await response.json();
      
      if (result.success) {
        setTrips(result.trips || []);
      } else {
        setError('Failed to fetch trips');
        console.error('Failed to fetch trips:', result.error);
      }
    } catch (err) {
      setError('Error loading trips');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }
    
    fetchTrips();
  }, [isSignedIn, user, navigate, fetchTrips]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCreatedDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTripClick = (trip: SavedTrip) => {
    // Navigate to saved trip summary with trip data
    navigate('/saved-trip-summary', { 
      state: { 
        tripData: trip 
      } 
    });
  };

  if (!isSignedIn) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <LayoutDiv>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#28666E] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </LayoutDiv>
    );
  }

  if (error) {
    return (
      <LayoutDiv>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchTrips} variant="outline">
            Try Again
          </Button>
        </div>
      </LayoutDiv>
    );
  }

  return (
    <LayoutDiv>
      <div className="flex flex-col sm:flex-row mb-6 sm:mb-8 justify-between w-full items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black">Your Trips</h1>
          <p className="text-gray-600 mt-2">
            {trips.length === 0 ? 'No trips found' : `${trips.length} saved trip${trips.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-[#28666E] hover:bg-[#1f4f54] text-white"
        >
          Plan New Trip
        </Button>
      </div>

      {trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No trips yet</h3>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Start planning your first adventure! Create a trip and it will appear here for easy access later.
          </p>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-[#28666E] hover:bg-[#1f4f54] text-white"
          >
            Plan Your First Trip
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => handleTripClick(trip)}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Trip Header */}
              <div className="bg-gradient-to-r from-[#28666E] to-[#1f4f54] px-6 py-4">
                <h3 className="text-lg font-bold text-white truncate">
                  {trip.departureLocation || 'Unknown'} → {trip.arrivalLocation || 'Unknown'}
                </h3>
                <p className="text-white/90 text-sm">
                  {trip.destinationCityCommonName || trip.arrivalLocation || 'Unknown Destination'}
                </p>
              </div>

              {/* Trip Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Departure</p>
                    <p className="font-semibold">{trip.departureDate ? formatDate(trip.departureDate) : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Return</p>
                    <p className="font-semibold">{trip.returnDate ? formatDate(trip.returnDate) : 'Not set'}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Travelers</p>
                    <p className="font-semibold">{trip.numberOfAdults || 0} Adults, {trip.numberOfChildren || 0} Children</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 font-medium">Budget</p>
                    <p className="font-semibold text-green-600">${trip.minimumBudget || 0} - ${trip.maximumBudget || 0}</p>
                  </div>
                </div>

                {/* Interests Tags */}
                {trip.interests && trip.interests.length > 0 && (
                  <div>
                    <p className="text-gray-500 font-medium text-sm mb-2">Interests</p>
                    <div className="flex flex-wrap gap-1">
                      {trip.interests.slice(0, 3).map((interest, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {interest}
                        </span>
                      ))}
                      {trip.interests.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          +{trip.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Created Date */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-gray-400 text-xs">
                    Created on {trip.created_at ? formatCreatedDate(trip.created_at) : 'Unknown date'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </LayoutDiv>
  );
}

export default Trips;
