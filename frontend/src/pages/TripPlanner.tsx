import { API_URL } from "@/App";
import { useState } from "react";
// import { useParams } from "react-router-dom";
import ChooseFlight from "./ChooseFlight";
import ChooseHotel from "./ChooseHotel";


interface TripPlannerProps {
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
}

enum PlanningStatus {
  AWAITING_OPENAI_RESPONSE = "AWAITING_OPENAI_RESPONSE",
  CHOOSE_FLIGHT = "CHOOSE_FLIGHT",
  CHOOSE_RETURN_FLIGHT = "CHOOSE_RETURN_FLIGHT",
  CHOOSE_HOTEL = "CHOOSE_HOTEL",
}


const TripPlanner = () => {

  // const { departureLocation, arrivalLocation, departureDate, returnDate, numberOfAdults, numberOfChildren, hotelPreferences, interests, minimumBudget, maximumBudget } = useParams<TripPlannerProps>();
  
  const [planningStatus, setPlanningStatus] = useState<PlanningStatus>(PlanningStatus.CHOOSE_FLIGHT);
  const [ tripPlannerData, setTripPlannerData ] = useState<TripPlannerProps>({
    departureLocation: "",
    arrivalLocation: "",
    departureDate: "",
    returnDate: "",
    numberOfAdults: 0,
    numberOfChildren: 0,
    hotelPreferences: [],
    interests: [],
    minimumBudget: 0,
    maximumBudget: 0,
  });

  const getAirportCodes = async () => {
    const response = await fetch(`${API_URL}/util/get-airport-codes?city1=${departureLocation}&city2=${arrivalLocation}`);
    const data = await response.json();
    console.log(data);
  }
  
  if (planningStatus === PlanningStatus.AWAITING_OPENAI_RESPONSE) {
    getAirportCodes();
    return <div>Awaiting OpenAI response</div>;
  }

  if (planningStatus === PlanningStatus.CHOOSE_FLIGHT) {
    return <ChooseFlight type="outbound" />;
  }

  if (planningStatus === PlanningStatus.CHOOSE_RETURN_FLIGHT) {
    return <ChooseFlight type="return" />;
  }

  if (planningStatus === PlanningStatus.CHOOSE_HOTEL) {
    return <ChooseHotel />;
  }

  const getAllQueryParams = () => {
    const departureLocation = (new URLSearchParams(window.location.search)).get("departureLocation")
    const arrivalLocation = (new URLSearchParams(window.location.search)).get("arrivalLocation")
    const departureDate = (new URLSearchParams(window.location.search)).get("departureDate")
    const returnDate = (new URLSearchParams(window.location.search)).get("returnDate")
    const numberOfAdults = (new URLSearchParams(window.location.search)).get("numberOfAdults")
    const numberOfChildren = (new URLSearchParams(window.location.search)).get("numberOfChildren")
    const hotelPreferences = (new URLSearchParams(window.location.search)).get("hotelPreferences")
    const interests = (new URLSearchParams(window.location.search)).get("interests")
    const minimumBudget = (new URLSearchParams(window.location.search)).get("minimumBudget")
    const maximumBudget = (new URLSearchParams(window.location.search)).get("maximumBudget")

    setTripPlannerData({
      departureLocation: departureLocation || "",
      arrivalLocation: arrivalLocation || "",
      departureDate: departureDate || "",
      returnDate: returnDate || "", 
      numberOfAdults: numberOfAdults ? parseInt(numberOfAdults) : 0,
      numberOfChildren: numberOfChildren ? parseInt(numberOfChildren) : 0,
      hotelPreferences: hotelPreferences ? hotelPreferences.split(",") : [],
      interests: interests ? interests.split(",") : [],
      minimumBudget: minimumBudget ? parseInt(minimumBudget) : 0,
      maximumBudget: maximumBudget ? parseInt(maximumBudget) : 0,
    });
  }

  // useEffect(() => {
  //   getAllQueryParams();
  // }, []);

  
  return (
    <div>
      <button onClick={() => setPlanningStatus(PlanningStatus.AWAITING_OPENAI_RESPONSE)}>Awaiting OpenAI response</button>
      <h1>Trip Planner</h1>
    </div>
  );
};

export default TripPlanner;