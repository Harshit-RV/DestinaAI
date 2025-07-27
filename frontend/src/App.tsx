import { Routes, Route } from 'react-router-dom';
import { TripPlannerProvider } from './contexts/TripPlannerContext';
import Home from './pages/Home';
import ChooseFlight from './pages/ChooseFlight';
import ChooseHotel from './pages/ChooseHotel';
import TripSummary from './pages/TripSummary';
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import TripPlanner from "./pages/TripPlanner";
import NavBarItem from "@/components/navbar-item";
import PlanYourTrip from './pages/PlanYourTrip';

export const API_URL = "http://localhost:3000";
// export const API_URL = "https://z2bt85w1-3000.inc1.devtunnels.ms";

function App() {
  return (
    <TripPlannerProvider>
      <div className="h-screen flex w-full bg-[#F6F6F6]">
        <SignedIn>
          <div className="w-56 hidden md:flex flex-col py-6 px-3 gap-6">
            <UserButton/>
            <div className="flex flex-col justify-start gap-3 w-full">
              <NavBarItem title="Home" />
              <NavBarItem title="Trips" />
            </div>
          </div>
        </SignedIn>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/choose-flight" element={<ChooseFlight type="outbound" />} />
          <Route path="/choose-return-flight" element={<ChooseFlight type="return" />} />
          <Route path="/choose-hotel" element={<ChooseHotel />} />
          <Route path="/trip-summary" element={<TripSummary />} />
          <Route path="/trip-planner" element={<TripPlanner />} />
          <Route path="/plan-your-trip" element={<PlanYourTrip />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
        </Routes>
      </div>
    </TripPlannerProvider>
  );
}

export default App;
