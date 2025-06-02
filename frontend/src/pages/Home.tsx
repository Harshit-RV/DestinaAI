import { useState, useEffect, useRef, } from "react";
import debounce from "lodash.debounce";
import mapSvg from "../assets/map.svg";
import axios from 'axios'
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import { DatePicker } from "@/components/ui/datepicker";
import { Button } from "@/components/ui/button";
import ReactSlider from 'react-slider'
import { LayoutDiv } from "@/App";


function Home() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLButtonElement | null>(null);
  const calendarPopoverRef = useRef<HTMLDivElement | null>(null);

  const [ completions, setCompletions ] = useState<string[]>([]);
  const [ currentLocationCompletions, setCurrentLocationCompletions ] = useState<string[]>([]);

  const [ hotelPref, setHotelPref ] = useState<string[]>([]);
  const [ interests, setInterests ] = useState<string[]>([]);
  const [ budget, setBudget ] = useState<Record<number, number>>([]);

  const addHotelPref = (pref: string) => {
    setHotelPref((prev) => {
      if (prev.includes(pref)) {
        return prev.filter((item) => item !== pref);
      } else {
        return [...prev, pref];
      }
    });
  }

  const addInterest = (interest: string) => {
    setInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isInsideDialog = dialogRef.current?.contains(event.target as Node);
      const isInsideCalendar = calendarRef.current?.contains(event.target as Node);
      const isInsidePopover = calendarPopoverRef.current?.contains(event.target as Node);
    
      if (!isInsideDialog && !isInsideCalendar && !isInsidePopover) {
        setIsSearchExpanded(false);
      }
    }

    if (isSearchExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded]);

  const getResults = async (query: string | null) => {
    const data = await axios.get(`https://z2bt85w1-3000.inc1.devtunnels.ms/travelplan/search?keyword=${query}`);
    data.data.map((item: { canonical_name: string; }) => {
      setCompletions((prev) => [...prev, item.canonical_name]);
    })
  }

  const getResultsForCurrentLocation = async (query: string | null) => {
    const data = await axios.get(`https://z2bt85w1-3000.inc1.devtunnels.ms/travelplan/search?keyword=${query}`);
    data.data.map((item: { canonical_name: string; }) => {
      setCurrentLocationCompletions((prev) => [...prev, item.canonical_name]);
    })
  }

  return (
    <LayoutDiv>
      <div className="flex mb-4 justify-between w-full items-center">
       
        <h1 className="text-7xl font-black">LET'S TRAVEL</h1>
        <button>
          <h2 className="bg-gray-200 p-3 text-2xl font-black transform overflow-hidden rounded-lg text-left hover:shadow-xl transition-all sm:w-full sm:max-w-lg">
            User Profile
          </h2>
        </button>
      </div>
       
      

      {!isSearchExpanded ? (
        <div
          onClick={() => setIsSearchExpanded(true)}
          className="min-h-20 text-xl hover:cursor-pointer font-semibold tracking-wider text-gray-600 flex items-center px-10 rounded-full w-full max-w-[750px] border bg-gray-200"
        >
          Start planning your dream trip
        </div>
      ) : (
        <div aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
          ></div>
          <div
            ref={dialogRef}
            className="z-10 flex flex-col gap-4 w-[750px] relative"
          >
            <TextInput 
              onChange={debounce((e) => getResults(e as unknown as string), 300)}
              onClick={() => setIsSearchExpanded(true)} trigger={[""]} 
              options={{"": completions}}
              autoFocus
              placeholder="Search for a destination"
              className="h-20  min-h-20 max-h-20 bg-gray-200 rounded-full w-full max-w-[750px] border px-10 py-6 font-bold text-xl"
            />
            <div className="w-full p-6 px-8 bg-white rounded-3xl">

              <div className="flex flex-col gap-2 mb-2">
                <div className="text-gray-400 text-sm font-bold">LEAVING FROM</div>
                <TextInput 
                  onChange={debounce((e) => getResultsForCurrentLocation(e as unknown as string), 300)}
                  onClick={() => setIsSearchExpanded(true)} trigger={[""]} 
                  options={{"": currentLocationCompletions}}
                  autoFocus
                  aria-expanded={false}
                  placeholder="Your location"
                  className="h-10 min-h-10 max-h-10 rounded-lg bg-white border flex py-2 px-4 font-bold text-md"
                />
              </div>

              <div className="flex gap-10">
                <div className="flex flex-col gap-2">
                  <div className="text-gray-400 text-sm font-bold">FROM</div>
                  <DatePicker ref={calendarRef} calendarPopoverRef={calendarPopoverRef}/>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-gray-400 text-sm font-bold">TO</div>
                  <DatePicker ref={calendarRef} calendarPopoverRef={calendarPopoverRef}/>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-5">
                <div className="font-bold text-sm text-gray-400">Hotel Preference</div>
                <div className="flex gap-2">
                  <PreferenceBox title="Luxury" selected={hotelPref.includes("Luxury")} addItem={addHotelPref} />
                  <PreferenceBox title="Budget" selected={hotelPref.includes("Budget")} addItem={addHotelPref} />
                  <PreferenceBox title="Family Friendly" selected={hotelPref.includes("Family Friendly")} addItem={addHotelPref} />
                  <PreferenceBox title="Pet Friendly" selected={hotelPref.includes("Pet Friendly")} addItem={addHotelPref} />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-5">
                <div className="font-bold text-sm text-gray-400">Interests</div>
                <div className="flex gap-2">
                  <PreferenceBox title="Adventure" selected={interests.includes("Adventure")} addItem={addInterest} />
                  <PreferenceBox title="Culture" selected={interests.includes("Culture")} addItem={addInterest} />
                  <PreferenceBox title="Food" selected={interests.includes("Food")} addItem={addInterest} />
                  <PreferenceBox title="Relaxation" selected={interests.includes("Relaxation")} addItem={addInterest} />
                  <PreferenceBox title="Shopping" selected={interests.includes("Shopping")} addItem={addInterest} />
                </div>
              </div>

              <div className="flex flex-col gap-8 mt-5">
                <div className="font-bold text-sm text-gray-400">Budget</div>
                <ReactSlider
                  className="w-full h-2 bg-gray-300 text-black rounded relative"
                  thumbClassName="w-5 h-8 bg-primary text-black rounded-full cursor-pointer"
                  trackClassName="h-4"
                  min={100}
                  max={10000}
                  defaultValue={[1000, 2000]}
                  ariaLabel={['Lower thumb', 'Upper thumb']}
                  // pearling
                  onAfterChange={(value) => {  
                    var newBudget = [...value];
                    setBudget(newBudget);
                  }}
                  minDistance={100}
                  renderThumb={(props, {valueNow} : { valueNow: number; }) => {
                    return (
                      <div {...props} className="w-5 h-5 -top-1.5 bg-primary rounded-full cursor-pointer flex items-center justify-center relative">
                        <span className="absolute -top-7 bg-black text-white text-xs px-2 py-1 rounded">
                          ${valueNow}
                        </span>
                      </div>
                    )
                  }}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant={'outline'}
                  className="h-10 w-32"
                  onClick={() => setIsSearchExpanded(false)}
                >
                Cancel</Button>
                <Button className="h-10 w-32">Generate</Button>
              </div>
              {/* < BudgetRangeSlider /> */}
            </div>
          </div>
        </div>
      )}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 ">
        <Graybox />
        <Graybox />
        <Graybox />
        <Graybox />
        <Graybox />
        <Graybox />
      </div>
      <img src={mapSvg} className="w-full h-full"></img>
    </LayoutDiv>
  );
}


const Graybox = () => {
  return (
    <div className="bg-[#F6F6F6] h-32 w-full border border-gray-200 hover:shadow-2xl hover:rounded-3xl transition duration-1000"></div>
  );
};

const PreferenceBox = ({ title, selected, addItem }: { title: string; selected: boolean; addItem: (item: string) => void }) => {
  return (
    <Button onClick={() => addItem(title)} variant={'outline'} className={`bg-gray-50 hover:bg-gray-100 border-2 hover:cursor-pointer ${selected ? "border-gray-700" : ""} `}>{title}</Button>
  );
}



export default Home;

