import { LayoutDiv } from "@/App";
import { Button } from "@/components/ui/button";
import { useState } from "react";


function ChooseFlight() {
  const [ selectedFlight, setSelectedFlight ] = useState<number>(0);

  return (
    <LayoutDiv>
      <div className="flex mb-2 justify-between w-full items-center">
        <h1 className="text-3xl font-black">Choose Your Flight</h1>
      </div>
      
      <div className="border w-full overflow-scroll overflow-x-hidden">
        <FlightBox id={1} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(1)}/>
        <FlightBox id={2} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(2)}/>
        <FlightBox id={3} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(3)}/>
        <FlightBox id={4} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(4)}/>
        <FlightBox id={5} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(5)}/>
        <FlightBox id={6} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(6)}/>
        <FlightBox id={7} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(7)}/>
        <FlightBox id={8} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(8)}/>
      </div>

      <div className="flex justify-end w-full">
        <Button size={'lg'}>Continue</Button>
      </div>
    </LayoutDiv>
  );
}

const FlightBox = ({ id, selectedIndex, onClick } : { id: number, selectedIndex: number, onClick: () => void }) => {
  return (
    <div onClick={onClick} className={`hover:cursor-pointer flex border-b px-10 py-6 items-center justify-between ${selectedIndex == id ? "outline-[#28666E] outline-2" : ""} m-0.5`}>
      <div className="flex gap-7">
        <img className="h-14 w-14 border rounded-full" src="https://logos-world.net/wp-content/uploads/2022/01/Akasa-Air-Emblem.png"/>
        <div className="flex flex-col gap-1">
          <div className="text-black font-bold text-xl">8:30 to 10:30</div>
          <div className="text-gray-500 text-sm">Asaka Airline</div>
        </div>
      </div>
      <div className="text-gray-500 text-md">2hr 25min </div>
      <div className="text-gray-500 text-md">7850kg CO2</div>
      <div className="text-gray-500 text-md">Non-Stop </div>
      <div className="text-gray-700 font-bold text-lg">$1000 </div>
    </div>
  );
};


export default ChooseFlight;

