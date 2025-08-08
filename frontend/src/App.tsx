import { Routes, Route } from 'react-router-dom';
import { TripPlannerProvider } from './contexts/TripPlannerContext';
import Home from './pages/Home';
import ChooseFlight from './pages/ChooseFlight';
import ChooseHotel from './pages/ChooseHotel';
import TripSummary from './pages/TripSummary';
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import TripPlanner from "./pages/TripPlanner";
import NavBarItem from "@/components/navbar-item";
import PlanYourTrip from './pages/PlanYourTrip';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { createOrUpdateUser } from './utils/userHelpers';

export const API_URL = "http://localhost:3000";
// export const API_URL = "https://z2bt85w1-3000.inc1.devtunnels.ms";

function App() {
  const navigate = useNavigate();
  const { user, isSignedIn, isLoaded } = useUser();

  // Create user in Supabase when they sign in
  useEffect(() => {
    const createUserInSupabase = async () => {
      if (isLoaded && isSignedIn && user) {
        const userData = {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          first_name: user.firstName,
          last_name: user.lastName,
        };

        const result = await createOrUpdateUser(userData);
        if (result.success) {
          console.log('User created/updated in Supabase:', result.user);
        } else {
          console.error('Failed to create/update user in Supabase:', result.error);
        }
      }
    };

    createUserInSupabase();
  }, [user, isSignedIn, isLoaded]);
  
  return (
    <TripPlannerProvider>
      <div className="h-screen flex w-full bg-[#F6F6F6]">
        <div className="w-56 hidden md:flex flex-col py-6 px-3 gap-6">
          <SignedIn>
            <UserButton/>
          </SignedIn>
          <SignedOut>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => navigate('/sign-in')} 
                className="bg-[#28666E] hover:bg-[#1f4f54] text-white"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/sign-up')} 
                variant="outline"
                className="bg-white"
              >
                Sign Up
              </Button>
            </div>
          </SignedOut>
          <div className="flex flex-col justify-start gap-3 w-full">
            <NavBarItem title="Home" />
            <SignedIn>
              <NavBarItem title="Trips" />
            </SignedIn>
          </div>
        </div>
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
