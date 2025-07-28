import { useEffect, useState } from "react";
import CustomKanban, { KanbanColumn } from "../components/CustomKanban"
import { API_URL } from "@/App";
import { Button } from "@/components/ui/button";
import LayoutDiv from "@/components/layout-div";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const PlanYourTrip = () => {
  const [activities, setActivities] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const navigate = useNavigate();

  const {
    destinationCityCommonName,
    interests,
    destinationArrivalTime,
    returnDateTime,
    selectedHotel,
    numberOfChildren,
    numberOfAdults,
    setDayPlan,
    setPlanChanges,
  } = useTripPlanner();

  const fetchActivities = async () => {
    try {
      setActivities([]);
      setLoading(true);
      const response = await fetch(
        `${API_URL}/travelplan/activity?` +
        `cityName=${destinationCityCommonName}&` +
        `interests=${interests.join(",")}&` +
        `children=${numberOfChildren}&` +
        `adults=${numberOfAdults}&` +
        `arrivalTime=${destinationArrivalTime}&` +
        `departureTime=${returnDateTime}&` +
        `hotelName=${selectedHotel?.hotel?.name}&` +
        `hotelLatitude=${selectedHotel?.hotel.latitude}&` +
        `hotelLongitude=${selectedHotel?.hotel.longitude}`
      );
      const data = await response.json();

      const activitiesByDay: KanbanColumn[] = data.parsed.activitiesByDays 
      console.log({activitiesByDay})

      let filteredActivities = activitiesByDay.map((day, index) => {
        if (index === 0) {
          return { ...day, items: day.items.slice(1) };
        }
        if (index === activitiesByDay.length - 1) {
          return { ...day, items: day.items.slice(0, -1) };
        }
        return day;
      })
      
      filteredActivities = filteredActivities.map((value) => {
        return {
          ...value,
          id: uuidv4(),
          items: value.items.map((item) => {
            return {
              ...item,
              id: uuidv4(),
            }
          })
        }
      })

      console.log({filteredActivities})
      setActivities(filteredActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  }

  const finalizePlan = async () => {
    try {
      setFinalizing(true);
      const activitiesToSend = activities;
      console.log({activities})
      
      const response = await fetch(`${API_URL}/travelplan/finalize-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activities: activitiesToSend,
          cityName: destinationCityCommonName,
          interests: interests,
          children: numberOfChildren,
          adults: numberOfAdults,
          arrivalTime: destinationArrivalTime,
          departureTime: returnDateTime,
          hotelName: selectedHotel?.hotel?.name || '',
          hotelLatitude: selectedHotel?.hotel?.latitude || 0,
          hotelLongitude: selectedHotel?.hotel?.longitude || 0,
        }),
      });

      const data = await response.json();
      
      if (data.parsed && data.parsed.dayPlan) {
        setDayPlan(data.parsed.dayPlan);
        // Store plan changes if they exist
        if (data.parsed.planChanges) {
          setPlanChanges(data.parsed.planChanges);
        } else {
          setPlanChanges([]); // Clear any previous changes
        }
        navigate('/trip-summary');
      }
      
      setFinalizing(false);
    } catch (error) {
      console.error('Error finalizing plan:', error);
      setFinalizing(false);
    }
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <LayoutDiv className="overflow-scroll">
        <div className="flex w-full justify-between items-center">
            <div className="text-2xl font-bold">Plan Your Trip</div>
            <Button 
              disabled={loading || finalizing} 
              className="px-8"
              onClick={finalizePlan}
            >
              {finalizing ? 'Preparing final plan...' : 'Finalize'}
            </Button>
        </div>
        {
            loading ? (    
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
                <CustomKanban 
                  initialData={activities}
                  setActivities={setActivities}
                />
            )
        }
        <div className="h-14"></div>
    </LayoutDiv>
  )
}

export default PlanYourTrip;