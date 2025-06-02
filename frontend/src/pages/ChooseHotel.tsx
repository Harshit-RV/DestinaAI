import { LayoutDiv } from "@/App";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectItem, SelectContent } from "@/components/ui/select";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function ChooseHotel() {
  const [ selectedFlight, setSelectedFlight ] = useState<number>(0);

  return (
    <LayoutDiv>
      <div className="flex mb-2 justify-between w-full items-center">
        <h1 className="text-3xl font-black">Choose Your Hotel</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Filters</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm">Sort By</div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Price</SelectLabel>
                      <SelectItem value="price-high-to-low">Price (high to low)</SelectItem>
                      <SelectItem value="price-low-to-high">Price (low to high)</SelectItem>
                      <SelectItem value="rating-high-to-low">Rating (high to low)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 px-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Free Wifi</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Free Wifi</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Free Wifi</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Free Wifi</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Free Wifi</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <div>Free Wifi</div>
                </div>
              </div>
              <div className="grid gap-3">
                <Input id="sheet-demo-username" defaultValue="@peduarte" />
              </div>
            </div>
            <SheetFooter>
              <Button type="submit">Apply Filters</Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
      </div>
      
      <div className="border w-full overflow-scroll overflow-x-hidden">
        <HotelBox id={1} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(1)}/>
        <HotelBox id={2} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(2)}/>
        <HotelBox id={3} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(3)}/>
        <HotelBox id={4} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(4)}/>
        <HotelBox id={5} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(5)}/>
        <HotelBox id={6} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(6)}/>
        <HotelBox id={7} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(7)}/>
        <HotelBox id={8} selectedIndex={selectedFlight} onClick={() => setSelectedFlight(8)}/>
      </div>

      <div className="flex justify-end w-full">
        <Button size={'lg'} className="w-40" disabled={selectedFlight==0}>Continue</Button>
      </div>
    </LayoutDiv>
  );
}

const HotelBox = ({ id, selectedIndex, onClick } : { id: number, selectedIndex: number, onClick: () => void }) => {
  return (
   <>
    <div onClick={onClick} className={`flex border-b items-center pr-10 justify-between ${selectedIndex === id ? "outline-[#28666E] outline-2" : ""} m-0.5 h-40`}>
      <div className="flex h-full gap-5">
        <img
          className="h-full w-2/5 border-r"
          src="https://www.seleqtionshotels.com/content/dam/seleqtions/Connaugth/TCPD_PremiumBedroom4_1235.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg"
          alt="Ritz Carlton Photos" 
        />
        <div className="flex flex-col gap-2 justify-center">
          <div className="text-black font-bold text-2xl">The Ritz Carlton Dubai</div>
          <div className="text-gray-500 text-sm">Janakpuri, New Delhi, IN</div>
        </div>
      </div>
      <div className="text-gray-500 gap-2 flex flex-col text-md">
        <div className="text-2xl">4.5 ⭐️</div>
        <div className="text-sm">10k Reviews</div>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-gray-500 text-sm"> 
        <div>Free Wifi</div>
        <div>Pet friendly</div>
        <div>Ultra Luxury</div>
        <div>Free Wifi</div>
        <div>Pet friendly</div>
        <div>Ultra Luxury</div>
        <div>Free Wifi</div>
        <div>Pet friendly</div>
        <div>Ultra Luxury</div>
      </div>

      <div className="text-gray-600 flex flex-col text-md">
        <div className="text-2xl text-black font-bold">$100</div>
        <div className="text-sm">per night</div>
      </div>
    </div>
  </>
  );
};



const NavBarItem = ({ title }: { title: string }) => {
  return (
    <div className="bg-white w-full rounded-lg border-2 px-3 py-2 border-gray-200 font-normal m-0">
      {title}
    </div>
  );
};

const Graybox = () => {
  return (
    <div className="bg-[#F6F6F6] h-32 w-full border border-gray-200 hover:shadow-2xl hover:rounded-3xl transition duration-1000"></div>
  );
};



export default ChooseHotel;

