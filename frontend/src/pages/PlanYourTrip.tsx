import { useEffect, useState } from "react";
import CustomKanban, { KanbanColumn } from "../components/CustomKanban"
import { API_URL } from "@/App";
import { Button } from "@/components/ui/button";
const defaultColumns: KanbanColumn[] =[
  {
      "id": "day1",
      "title": "Day 1: Arrival and Relaxation",
      "color": "#89CFF0",
      "maxActivities": 3,
      "items": [
          {
              "id": "activity1",
              "color": "#7ED957",
              "content": "Check-in at Ritz Carlton DIFC",
              "description": "Arrive at Dubai, check in and relax at the Ritz Carlton Hotel."
          },
          {
              "id": "activity2",
              "color": "#FFD700",
              "content": "Dubai Mall Exploration",
              "description": "Visit the Dubai Mall for shopping and enjoy the Dubai Aquarium (museum-like experience)."
          },
          {
              "id": "activity3",
              "color": "#00BFFF",
              "content": "Evening Fountain Show at Dubai Mall",
              "description": "Watch the Dubai Fountain show outside the Dubai Mall."
          }
      ]
  },
  {
      "id": "day2",
      "title": "Day 2: Museum and Old Dubai",
      "color": "#F08080",
      "maxActivities": 3,
      "items": [
          {
              "id": "activity1",
              "color": "#20B2AA",
              "content": "Breakfast in Al Fahidi District",
              "description": "Enjoy a traditional breakfast in the Al Fahidi Historical Neighbourhood."
          },
          {
              "id": "activity2",
              "color": "#B8860B",
              "content": "Dubai Museum",
              "description": "Explore the Dubai Museum at Al Fahidi Fort to learn about Dubai’s history."
          },
          {
              "id": "activity3",
              "color": "#FFB6C1",
              "content": "Shopping at Gold & Spice Souks",
              "description": "Shop for unique gifts at the Gold Souk and Spice Souk in Deira."
          }
      ]
  },
  {
      "id": "day3",
      "title": "Day 3: Water Sports and Relaxation",
      "color": "#40E0D0",
      "maxActivities": 3,
      "items": [
          {
              "id": "activity1",
              "color": "#4682B4",
              "content": "Morning Beach Time at JBR",
              "description": "Relax at Jumeirah Beach and prepare for water activities."
          },
          {
              "id": "activity2",
              "color": "#00CED1",
              "content": "Jetskiing & Parasailing",
              "description": "Participate in water sports like jetskiing and parasailing at JBR."
          },
          {
              "id": "activity3",
              "color": "#E9967A",
              "content": "Dinner at Pier 7",
              "description": "Enjoy dinner with views at Pier 7, Dubai Marina."
          }
      ]
  },
  {
      "id": "day4",
      "title": "Day 4: Shopping Extravaganza",
      "color": "#DC143C",
      "maxActivities": 3,
      "items": [
          {
              "id": "activity1",
              "color": "#4B0082",
              "content": "Mall of the Emirates",
              "description": "Shop at the Mall of the Emirates and try Ski Dubai if interested."
          },
          {
              "id": "activity2",
              "color": "#8B0000",
              "content": "Lunch at the Mall",
              "description": "Relax and have a diverse lunch within Mall of the Emirates."
          },
          {
              "id": "activity3",
              "color": "#B22222",
              "content": "Global Village (Evening, if open)",
              "description": "Visit Global Village for shopping, food, and cultural experiences (open seasonally)."
          }
      ]
  },
  {
      "id": "day5",
      "title": "Day 5: Art and Water",
      "color": "#9370DB",
      "maxActivities": 3,
      "items": [
          {
              "id": "activity1",
              "color": "#00FA9A",
              "content": "Visit Louvre Abu Dhabi (optional day trip)",
              "description": "Take a museum-focused day trip to Abu Dhabi to visit the Louvre."
          },
          {
              "id": "activity2",
              "color": "#483D8B",
              "content": "Yacht Cruise in Marina",
              "description": "Take a private or group yacht cruise with water-sport options."
          },
          {
              "id": "activity3",
              "color": "#C71585",
              "content": "Dine at Dubai Marina Walk",
              "description": "Dine at one of the restaurants at Dubai Marina Walk after your cruise."
          }
      ]
  },
  {
      "id": "day6",
      "title": "Day 6: Museum and Shopping",
      "color": "#FFA500",
      "maxActivities": 3,
      "items": [
          {
              "id": "activity1",
              "color": "#FFD700",
              "content": "Visit Museum of the Future",
              "description": "Explore the ultramodern Museum of the Future in Dubai."
          },
          {
              "id": "activity2",
              "color": "#A0522D",
              "content": "City Walk Shopping & Lunch",
              "description": "Shop and have lunch at City Walk, a trendy outdoor retail complex."
          },
          {
              "id": "activity3",
              "color": "#F0E68C",
              "content": "La Mer Beach Water Sports",
              "description": "Enjoy paddle boarding or kayaking at La Mer Beach."
          }
      ]
  },
  {
      "id": "day7",
      "title": "Day 7: Last Day Leisure",
      "color": "#2E8B57",
      "maxActivities": 2,
      "items": [
          {
              "id": "activity1",
              "color": "#D2B48C",
              "content": "Morning Relaxation at Hotel",
              "description": "Enjoy the Ritz Carlton spa or pool to relax before departure."
          },
          {
              "id": "activity2",
              "color": "#A9A9A9",
              "content": "Pack & Departure Preparation",
              "description": "Pack your belongings, check out, and prepare for transfer to the airport."
          }
      ]
  }
];
const PlanYourTrip = () => {
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    try {
      setError(null);
      setActivities([]);
      setLoading(true);
      const response = await fetch(
        `${API_URL}/travelplan/activity` 
      );
      const data = await response.json();

      const activitiesByDay: KanbanColumn[] = data.parsed.activitiesByDays 
      console.log({activitiesByDay})

      const filteredActivities = activitiesByDay.map((day, index) => {
        if (index === 0) {
          return { ...day, items: day.items.slice(1) };
        }
        if (index === activitiesByDay.length - 1) {
          return { ...day, items: day.items.slice(0, -1) };
        }
        return day;
      })
      console.log({filteredActivities})

      
      setActivities(filteredActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setError(JSON.stringify(error));
    }
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 bg-white p-5 overflow-scroll">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Plan Your Trip</div>
        <Button className="px-8">Finish Planning</Button>
      </div>
      <CustomKanban initialData={activities} />
    </div>
  )
}

export default PlanYourTrip;