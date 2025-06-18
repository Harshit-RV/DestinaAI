import { Routes, Route } from 'react-router-dom';
import { TripPlannerProvider } from './contexts/TripPlannerContext';
import Home from './pages/Home';
import ChooseFlight from './pages/ChooseFlight';
import ChooseHotel from './pages/ChooseHotel';
import TripSummary from './pages/TripSummary';
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import TripPlanner from "./pages/TripPlanner";
import NavBarItem from "@/components/navbar-item";

// export const API_URL = "http://localhost:3000";
export const API_URL = "https://z2bt85w1-3000.inc1.devtunnels.ms";

function App() {
  return (
    <TripPlannerProvider>
      <div className="h-screen flex w-full bg-[#F6F6F6]">
        <SignedOut>
          <div className="w-56 hidden md:flex flex-col items-center p-6 gap-6">
            <img
              className="h-20 w-20 rounded-full object-cover"
              src="https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"
              alt=""
            />
            <div className="flex flex-col gap-3 w-full">
              <NavBarItem title="Home" />
              <NavBarItem title="Home" />
              <NavBarItem title="Home" />
              <NavBarItem title="Home" />
              <NavBarItem title="Home" />
            </div>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="w-56 hidden md:flex flex-col items-center p-6 gap-6">
            <img
              className="h-20 w-20 rounded-full object-cover"
              src="https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"
              alt=""
            />
            <div className="flex flex-col gap-3 w-full">
              <NavBarItem title="Home" />
              <NavBarItem title="Home" />
              <NavBarItem title="Home" />
              <NavBarItem title="Home" />
              <NavBarItem title="Home" />
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
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
        </Routes>
      </div>
    </TripPlannerProvider>
  );
}

export default App;
