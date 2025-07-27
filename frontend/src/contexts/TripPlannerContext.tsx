import { FlightData } from '@/pages/ChooseFlight';
import { Hotel } from '@/types/hotel';
import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react';

interface Activity {
  type: string;
  start_time: string;
  end_time: string;
  title: string;
  estimated_cost: string;
  description: string;
}

interface WeatherForecast {
  low: string;
  high: string;
  description: string;
}

interface DayPlan {
  title: string;
  activities: Activity[];
  weather_forcast: WeatherForecast;
}

const defaultDayPlan: DayPlan[] = [
            {
                "title": "Day 1: Exploring New Delhi's Heart",
                "activities": [
                    {
                        "type": "activity",
                        "start_time": "10:00",
                        "end_time": "12:30",
                        "title": "India Gate & Rajpath Walk",
                        "estimated_cost": "Free",
                        "description": "Begin your Delhi exploration with a leisurely walk along Rajpath, embracing the iconic view of the India Gate, dedicated to Indian soldiers. Enjoy the lush greenery and engage with local vendors."
                    },
                    {
                        "type": "activity",
                        "start_time": "13:00",
                        "end_time": "14:30",
                        "title": "Lunch at Connaught Place",
                        "estimated_cost": "₹1200",
                        "description": "Relish a delightful lunch at Connaught Place, offering a range of Indian and international cuisines. Recommended: Saravana Bhavan for authentic South Indian or Kareem's for Mughlai dishes."
                    },
                    {
                        "type": "activity",
                        "start_time": "15:00",
                        "end_time": "17:00",
                        "title": "Visit to Rashtrapati Bhavan",
                        "estimated_cost": "₹50 each for entry",
                        "description": "Witness the grandeur of the President’s residence with a pre-booked tour. Stroll through the exquisite Mughal Gardens if in season."
                    },
                    {
                        "type": "activity",
                        "start_time": "17:30",
                        "end_time": "19:00",
                        "title": "Explore Lodi Garden",
                        "estimated_cost": "Free",
                        "description": "Unwind in the serene Lodi Gardens. Marvel at the beauty of ancient tombs and enjoy a tranquil stroll through lush landscapes."
                    },
                    {
                        "type": "activity",
                        "start_time": "19:30",
                        "end_time": "21:30",
                        "title": "Dinner at Khan Market",
                        "estimated_cost": "₹2000",
                        "description": "Dine at one of the upscale restaurants in Khan Market, known for its vibrant dining options. Recommended: The Big Chill Café for continental delicacies."
                    }
                ],
                "weather_forcast": {
                    "low": "28°C",
                    "high": "38°C",
                    "description": "Sunny with occasional clouds"
                }
            },
            {
                "title": "Day 2: Historical Marvels",
                "activities": [
                    {
                        "type": "activity",
                        "start_time": "09:00",
                        "end_time": "11:00",
                        "title": "Red Fort Visit",
                        "estimated_cost": "₹550 each for foreigners, ₹35 for Indian citizens",
                        "description": "Delve into history with a tour of the majestic Red Fort, a UNESCO World Heritage Site. Enjoy the striking architecture and explore the museum within."
                    },
                    {
                        "type": "activity",
                        "start_time": "11:30",
                        "end_time": "13:00",
                        "title": "Rickshaw Ride in Chandni Chowk",
                        "estimated_cost": "₹100",
                        "description": "Experience the hustle and bustle of Chandni Chowk on a rickshaw ride. Explore the vibrant markets and indulge in local street food, like jalebi and parathas."
                    },
                    {
                        "type": "activity",
                        "start_time": "13:30",
                        "end_time": "15:00",
                        "title": "Lunch at Karim's",
                        "estimated_cost": "₹800",
                        "description": "Savor the rich, traditional Mughlai cuisine at Karim’s in Old Delhi. Try the Butter Chicken and Kababs."
                    },
                    {
                        "type": "activity",
                        "start_time": "15:30",
                        "end_time": "17:00",
                        "title": "Visit Humayun’s Tomb",
                        "estimated_cost": "₹600 each for foreigners, ₹40 for Indian citizens",
                        "description": "Explore the magnificent Humayun's Tomb, another UNESCO site, known as the precursor to the Taj Mahal. Appreciate its architectural beauty and lush surroundings."
                    },
                    {
                        "type": "activity",
                        "start_time": "17:30",
                        "end_time": "19:00",
                        "title": "Qutub Minar Complex",
                        "estimated_cost": "₹550 each for foreigners, ₹40 for Indian citizens",
                        "description": "Discover the tallest brick minaret in the world within the Qutub Minar complex. Absorb the history and beauty of the surrounding structures."
                    },
                    {
                        "type": "activity",
                        "start_time": "19:30",
                        "end_time": "21:00",
                        "title": "Dinner at Hauz Khas Village",
                        "estimated_cost": "₹2200",
                        "description": "Conclude your day with dinner at Hauz Khas Village, a hub for dining and nightlife. Recommended: Social for its modern twist on cuisine and café culture."
                    }
                ],
                "weather_forcast": {
                    "low": "29°C",
                    "high": "39°C",
                    "description": "Clear and warm"
                }
            },
            {
                "title": "Day 3: Culture & Heritage",
                "activities": [
                    {
                        "type": "activity",
                        "start_time": "09:00",
                        "end_time": "11:00",
                        "title": "Morning at Jama Masjid",
                        "estimated_cost": "Free (camera fee: ₹300)",
                        "description": "Start your day with a visit to one of the largest mosques in India, the Jama Masjid. Climb the tower for a panoramic view of Old Delhi."
                    },
                    {
                        "type": "activity",
                        "start_time": "11:30",
                        "end_time": "13:00",
                        "title": "Exploring Raj Ghat",
                        "estimated_cost": "Free",
                        "description": "Pay homage to Mahatma Gandhi at Raj Ghat. The serene park area offers a contemplative space, reflecting India’s freedom struggle."
                    },
                    {
                        "type": "activity",
                        "start_time": "13:30",
                        "end_time": "15:00",
                        "title": "Lunch at Pandara Road",
                        "estimated_cost": "₹1500",
                        "description": "Dine at one of the famous eateries in Pandara Road for a delightful mix of North Indian flavors. Recommended: Gulati Restaurant for an extensive thali."
                    },
                    {
                        "type": "activity",
                        "start_time": "15:30",
                        "end_time": "17:30",
                        "title": "National Museum Visit",
                        "estimated_cost": "₹650 each for foreigners, ₹20 for Indian citizens",
                        "description": "Immerse in India’s diverse history and culture at the National Museum. From ancient artifacts to modern art, the exhibits are a treasure trove of knowledge."
                    },
                    {
                        "type": "activity",
                        "start_time": "18:00",
                        "end_time": "19:00",
                        "title": "India Habitat Center",
                        "estimated_cost": "Free",
                        "description": "Visit India Habitat Center for an insightful perspective on India’s art and culture. Check out any ongoing exhibitions or events."
                    },
                    {
                        "type": "activity",
                        "start_time": "19:30",
                        "end_time": "21:30",
                        "title": "Dinner at Connaught Place",
                        "estimated_cost": "₹1800",
                        "description": "Enjoy your final dinner in New Delhi at a rooftop restaurant. Feel free to revisit your favorite spots from Day 1 or explore new ones with ambiance."
                    }
                ],
                "weather_forcast": {
                    "low": "28°C",
                    "high": "37°C",
                    "description": "Partly cloudy with a breeze"
                }
            },
            {
                "title": "Day 4: Spiritual & Scenic Declarations",
                "activities": [
                    {
                        "type": "activity",
                        "start_time": "09:00",
                        "end_time": "11:00",
                        "title": "Akshardham Temple Visit",
                        "estimated_cost": "Free",
                        "description": "Explore the architectural marvel of the Akshardham Temple. Enjoy the spiritual ambiance and the detailed carvings. Boat rides and exhibitions available at nominal cost."
                    },
                    {
                        "type": "activity",
                        "start_time": "11:30",
                        "end_time": "13:00",
                        "title": "Meandering Lodhi Art District",
                        "estimated_cost": "Free",
                        "description": "Walkthrough India’s first open-air public art district in Lodi Colony. Experience the vibrant murals and installations made by national and international artists."
                    },
                    {
                        "type": "activity",
                        "start_time": "13:30",
                        "end_time": "15:00",
                        "title": "Lunch at Defence Colony",
                        "estimated_cost": "₹1500",
                        "description": "Enjoy a delightful lunch at Defence Colony. Recommended: Mocha Art House for a fusion of art and delicious meals."
                    },
                    {
                        "type": "activity",
                        "start_time": "15:30",
                        "end_time": "17:00",
                        "title": "Explore Dilli Haat",
                        "estimated_cost": "₹50 entry fee",
                        "description": "Shop and explore Indian handicrafts and artisanal products at Dilli Haat. Delight in cultural performances and savor regional dishes."
                    },
                    {
                        "type": "activity",
                        "start_time": "17:30",
                        "end_time": "19:00",
                        "title": "Lotus Temple Visit",
                        "estimated_cost": "Free",
                        "description": "Experience peace and tranquility at the Lotus Temple, known for its distinctive Bahá'í House of Worship design and serene gardens."
                    },
                    {
                        "type": "activity",
                        "start_time": "19:30",
                        "end_time": "21:00",
                        "title": "Cultural Evening at Kingdom of Dreams",
                        "estimated_cost": "₹3000 per person",
                        "description": "Enjoy an enchanting cultural extravaganza at the Kingdom of Dreams. Witness the blend of India’s lively arts, crafts, heritage, cuisine, and performances."
                    }
                ],
                "weather_forcast": {
                    "low": "27°C",
                    "high": "36°C",
                    "description": "Sunny with light winds"
                }
            },
            {
                "title": "Day 5: The Departure Day",
                "activities": [
                    {
                        "type": "activity",
                        "start_time": "09:00",
                        "end_time": "11:00",
                        "title": "Breakfast at Chandni Chowk",
                        "estimated_cost": "₹400",
                        "description": "End your Delhi journey with a final trip to Chandni Chowk. Indulge in aloo parathas and lassi at a local eatery."
                    },
                    {
                        "type": "activity",
                        "start_time": "11:30",
                        "end_time": "13:00",
                        "title": "Souvenir Shopping at Janpath",
                        "estimated_cost": "Depending on purchases",
                        "description": "Pick up unique souvenirs, handicrafts, and textiles at Janpath Market. Bargain with vendors for the best deals."
                    },
                    {
                        "type": "activity",
                        "start_time": "13:30",
                        "end_time": "15:00",
                        "title": "Check-out and Relax at the Hotel",
                        "estimated_cost": "Included in hotel stay",
                        "description": "Return to Hyatt Centric, Janakpuri for a relaxing stay, check-out preparations, and enjoying the hotel’s amenities."
                    }
                ],
                "weather_forcast": {
                    "low": "28°C",
                    "high": "37°C",
                    "description": "Clear skies with sunshine"
                }
            },
            {
                "title": "Day 6: Departure",
                "activities": [
                    {
                        "type": "activity",
                        "start_time": "09:00",
                        "end_time": "11:00",
                        "title": "Leisurely Morning at Hotel",
                        "estimated_cost": "Included in hotel stay",
                        "description": "Relax and prepare for your journey back. Enjoy a leisurely breakfast and last-minute preparations."
                    },
                    {
                        "type": "activity",
                        "start_time": "11:30",
                        "end_time": "12:00",
                        "title": "Hotel Check-out",
                        "estimated_cost": "Included in hotel stay",
                        "description": "Complete your check-out from Hyatt Centric, Janakpuri."
                    },
                    {
                        "type": "activity",
                        "start_time": "12:00",
                        "end_time": "21:00",
                        "title": "Free Time & Calm Reflection",
                        "estimated_cost": "Optional excursions or at leisure",
                        "description": "Explore nearby areas, read a book, or reflect on your journey in New Delhi. Enjoy amenities until it's time to depart for the airport."
                    },
                    {
                        "type": "activity",
                        "start_time": "21:30",
                        "end_time": "----",
                        "title": "Departure from New Delhi",
                        "estimated_cost": "As per travel bookings",
                        "description": "Bid adieu to New Delhi as you embark on your onward journey, carrying memories of rich culture and history."
                    }
                ],
                "weather_forcast": {
                    "low": "27°C",
                    "high": "36°C",
                    "description": "Clear evening skies"
                }
            },
            {
                "title": "Additional Tips for Your New Delhi Journey:",
                "activities": [
                    {
                        "type": "tip",
                        "start_time": "",
                        "end_time": "",
                        "title": "Transportation Methods",
                        "estimated_cost": "Variable",
                        "description": "Consider using apps like Ola or Uber for hassle-free transportation. Rickshaws are a good option for short sight-seeing trips."
                    },
                    {
                        "type": "tip",
                        "start_time": "",
                        "end_time": "",
                        "title": "Safety & Precautions",
                        "estimated_cost": "Free",
                        "description": "Stay hydrated, especially in summer months. Wear comfortable clothing and shoes. Respect local customs, especially when visiting religious sites."
                    },
                    {
                        "type": "tip",
                        "start_time": "",
                        "end_time": "",
                        "title": "Cuisine & Dining",
                        "estimated_cost": "Variable",
                        "description": "Trying street food is a must but ensure hygiene. Always taste the Chaat, Butter Chicken, and a variety of Parathas. Opt for bottled water."
                    },
                    {
                        "type": "tip",
                        "start_time": "",
                        "end_time": "",
                        "title": "Booking Tickets in Advance",
                        "estimated_cost": "Variable",
                        "description": "Pre-book tickets for attractions like Rashtrapati Bhavan, Kingdom of Dreams, and National Museum to avoid lengthy queues."
                    }
                ],
                "weather_forcast": {
                    "low": "",
                    "high": "",
                    "description": ""
                }
            },
            {
                "title": "Note",
                "activities": [
                    {
                        "type": "note",
                        "start_time": "",
                        "end_time": "",
                        "title": "Weather Consideration",
                        "estimated_cost": "Variable",
                        "description": "New Delhi can be quite hot in August. Plan your outings in the morning or late afternoon to avoid the peak sun hours. Always carry a hat, sunblock, and water."
                    }
                ],
                "weather_forcast": {
                    "low": "",
                    "high": "",
                    "description": ""
                }
            },
            {
                "title": "Additional Safety Measures",
                "activities": [
                    {
                        "type": "safety",
                        "start_time": "",
                        "end_time": "",
                        "title": "Safe Travel Tips",
                        "estimated_cost": "Free",
                        "description": "Avoid isolated areas during late evening hours. Use well-reputed transportation options, and keep emergency contacts handy."
                    },
                    {
                        "type": "safety",
                        "start_time": "",
                        "end_time": "",
                        "title": "Secure your Belongings",
                        "estimated_cost": "Free",
                        "description": "Keep personal belongings secure and be vigilant in crowded areas to avoid pickpockets."
                    },
                    {
                        "type": "safety",
                        "start_time": "",
                        "end_time": "",
                        "title": "Currency & Transactions",
                        "estimated_cost": "Variable",
                        "description": "It's advisable to carry some cash for small vendors but use cards for most transactions. Keep small denominations handy."
                    }
                ],
                "weather_forcast": {
                    "low": "",
                    "high": "",
                    "description": ""
                }
            },
            {
                "title": "Contact Information",
                "activities": [
                    {
                        "type": "contact",
                        "start_time": "",
                        "end_time": "",
                        "title": "Emergency Contacts",
                        "estimated_cost": "Free",
                        "description": "Police: 100, Ambulance: 102, Tourist Helpline: 1363"
                    }
                ],
                "weather_forcast": {
                    "low": "",
                    "high": "",
                    "description": ""
                }
            }
        ];

interface TripPlannerContextType {
  // User input from Home page
  departureLocation: string;
  arrivalLocation: string;
  departureDate: string;
  returnDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  hotelPreferences: string[];
  interests: string[];
  minimumBudget: number;
  maximumBudget: number;

  // Airport codes from GPT
  departureAirportCode: string[];
  arrivalAirportCode: string[];

  // Selected flights
  selectedOutboundFlight: FlightData | null;
  selectedReturnFlight: FlightData | null;

  // Arrival time in destination city (for outbound flight)
  destinationArrivalTime: string;
  returnDateTime: string;

  // Selected hotel
  selectedHotel: Hotel | null;

  // Day plans
  dayPlan: DayPlan[];

  // Destination city common name
  destinationCityCommonName: string;
    
  // Setters
  setDepartureLocation: Dispatch<SetStateAction<string>>;
  setArrivalLocation: Dispatch<SetStateAction<string>>;
  setDepartureDate: Dispatch<SetStateAction<string>>;
  setReturnDate: Dispatch<SetStateAction<string>>;
  setNumberOfAdults: Dispatch<SetStateAction<number>>;
  setNumberOfChildren: Dispatch<SetStateAction<number>>;
  setHotelPreferences: Dispatch<SetStateAction<string[]>>;
  setInterests: Dispatch<SetStateAction<string[]>>;
  setMinimumBudget: Dispatch<SetStateAction<number>>;
  setMaximumBudget: Dispatch<SetStateAction<number>>;
  setDepartureAirportCode: Dispatch<SetStateAction<string[]>>;
  setArrivalAirportCode: Dispatch<SetStateAction<string[]>>;
  setSelectedOutboundFlight: Dispatch<SetStateAction<FlightData | null>>;
  setSelectedReturnFlight: Dispatch<SetStateAction<FlightData | null>>;
  setDestinationArrivalTime: Dispatch<SetStateAction<string>>;
  setSelectedHotel: Dispatch<SetStateAction<Hotel>>;
  setDestinationCityCommonName: Dispatch<SetStateAction<string>>;
  setDayPlan: Dispatch<SetStateAction<DayPlan[]>>;
  setReturnDateTime:  Dispatch<SetStateAction<string>>
}

const TripPlannerContext = createContext<TripPlannerContextType | undefined>(undefined);

export function TripPlannerProvider({ children }: { children: ReactNode }) {
  // Set default dates to tomorrow and a week later
  const getDefaultDates = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    
    return {
      departureDate: tomorrow.toISOString().split('T')[0],
      returnDate: nextWeek.toISOString().split('T')[0]
    };
  };

  const defaultDates = getDefaultDates();
  
  const [departureLocation, setDepartureLocation] = useState('');
  const [arrivalLocation, setArrivalLocation] = useState('');
  const [departureDate, setDepartureDate] = useState(defaultDates.departureDate);
  const [returnDate, setReturnDate] = useState(defaultDates.returnDate);
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [hotelPreferences, setHotelPreferences] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [minimumBudget, setMinimumBudget] = useState(1000);
  const [maximumBudget, setMaximumBudget] = useState(2000);
  const [departureAirportCode, setDepartureAirportCode] = useState<string[]>([]);
  const [arrivalAirportCode, setArrivalAirportCode] = useState<string[]>([]);
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState<FlightData | null>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<FlightData | null>(null);
  const [destinationArrivalTime, setDestinationArrivalTime] = useState('');
  const [returnDateTime, setReturnDateTime] = useState('');
  const [destinationCityCommonName, setDestinationCityCommonName] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [dayPlan, setDayPlan] = useState<DayPlan[]>(defaultDayPlan);

  return (
    <TripPlannerContext.Provider
      value={{
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
        departureAirportCode,
        arrivalAirportCode,
        selectedOutboundFlight,
        selectedReturnFlight,
        selectedHotel,
        destinationArrivalTime,
        destinationCityCommonName,
        dayPlan,
        returnDateTime,
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
        setSelectedOutboundFlight,
        setSelectedReturnFlight,
        setSelectedHotel,
        setDestinationArrivalTime,
        setDestinationCityCommonName,
        setDayPlan,
        setReturnDateTime
      }}
    >
      {children}
    </TripPlannerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTripPlanner() {
  const context = useContext(TripPlannerContext);
  if (context === undefined) {
    throw new Error('useTripPlanner must be used within a TripPlannerProvider');
  }
  return context;
} 