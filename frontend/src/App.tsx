
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ChooseFlight from "./pages/ChooseFlight";
import ChooseHotel from "./pages/ChooseHotel";
import { cn } from "./lib/utils";
import { type ClassValue } from "clsx"
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export const API_URL = "http://localhost:3000";
// export const API_URL = "https://vfskrvh2-3000.inc1.devtunnels.ms";

function App() {
  return (
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
        <Route path="/" element={<Home />}></Route>
        <Route path="/choose/flight" element={<ChooseFlight />}></Route>
        <Route path="/choose/hotel" element={<ChooseHotel />}></Route>
        <Route path="/sign-in" element={<Signin />}></Route>
        <Route path="/sign-up" element={<Signup />}></Route>
      </Routes>
    </div>
  );
}

const NavBarItem = ({ title }: { title: string }) => {
  return (
    <div className="bg-white w-full rounded-lg border-2 px-3 py-2 border-gray-200 font-normal m-0">
      {title}
    </div>
  );
};

export const LayoutDiv = ({ children, className }: { children: React.ReactNode, className?: ClassValue  }) => {
  return (
    <div className={cn("bg-white rounded-xl w-full p-7 my-5 mr-5 flex-col flex gap-3 items-center", className)}>
      {children}
    </div>
  );
}

export default App;
