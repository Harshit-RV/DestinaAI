import { useState, useEffect, useRef } from "react";
import mapSvg from "../assets/map.svg";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function Home() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
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

  return (
    <div className="h-screen flex w-full bg-[#F6F6F6]">
      <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
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
      <div className="bg-white rounded-3xl w-full p-10 my-10 mr-10 flex-col flex gap-5 items-center">
        <div className="flex mb-4 justify-between w-full items-center">
          <h1 className="text-7xl font-black">LET'S TRAVEL</h1>
          <button>
            <h2 className="bg-gray-200 p-3 rounded text-2xl font-black transform overflow-hidden rounded-lg text-left hover:shadow-xl transition-all sm:w-full sm:max-w-lg">
              User Profile
            </h2>
          </button>
        </div>
        <SignedIn>
          <div>
            signed in
          </div>
        </SignedIn>
        <SignedOut><div>
          signed out
        </div></SignedOut>
        

        {!isSearchExpanded ? (
          <div
            onClick={() => setIsSearchExpanded(true)}
            className="min-h-20 text-xl font-semibold tracking-wider text-gray-600 flex items-center px-10 rounded-full w-full max-w-[750px] border bg-gray-200"
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
              <input
                onClick={() => setIsSearchExpanded(true)}
                className="h-20 p-10 rounded-3xl w-full max-w-[750px] border bg-gray-200"
              ></input>
              <div className="w-full h-96 bg-white rounded-3xl"></div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Deactivate
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
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
      </div>
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

const Graybox = () => {
  return (
    <div className="bg-[#F6F6F6] h-32 w-full border border-gray-200 hover:shadow-2xl hover:rounded-3xl transition duration-1000"></div>
  );
};

export default Home;
