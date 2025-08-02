import { Hotel } from "@/types/hotel";

export const HotelBox = ({ 
  hotel, 
  selected, 
  onClick 
} : { 
  hotel: Hotel, 
  selected: boolean, 
  onClick: () => void 
}) => {

  // Get the first offer for display
  const firstOffer = hotel.offers[0];
  
  // Format price
  const priceTotal = firstOffer ? `${firstOffer.price.currency} ${firstOffer.price.total}` : "N/A";
  
  // Get room description
  const roomDescription = firstOffer?.room?.description?.text || firstOffer?.roomInformation?.description || "No description available";
  
  // Get room type info
  const roomType= "";

  return (
    <div 
      onClick={onClick} 
      className={`flex flex-col md:flex-row border-b w-full items-start md:items-center p-4 md:pr-10 md:justify-between ${selected ? "outline-[#28666E] outline-2 bg-blue-50" : ""} m-0.5 hover:cursor-pointer`}
    >
      {/* Hotel Image Placeholder */}
      {hotel.photoUrl && hotel.photoUrl.length > 0 ? (
        // <img src={hotel.photoUrl[0]} alt={hotel.hotel.name} className="w-full h-full object-cover rounded-lg md:rounded-none" />
        <img
          className="w-full max-w-56 md:w-1/4 max-h-48 md:h-full object-cover rounded-lg md:rounded-none mb-4 md:mb-0"
          src={hotel.photoUrl[0]}
          alt={hotel.hotel.name}
          onError={(e) => {
            e.currentTarget.src = hotel.photoUrl.length > 1 ? hotel.photoUrl[1] : hotel.photoUrl[0];
          }}
        />
      ) : (
        <span className="w-full max-w-56 md:w-1/4 max-h-48 md:h-full flex items-center justify-center text-gray-500 text-sm">No Image Available</span>
      )}
    
      <div className="flex flex-col w-full md:pl-6">
        {/* Hotel Information */}
        <div className="flex flex-col md:flex-row w-full gap-4">
          {/* Main hotel details */}
          <div className="flex flex-col sm:flex-row w-full sm:w-full gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <div className="text-black font-bold text-lg sm:text-xl">{hotel.hotel.name}</div>
              <div className="text-gray-400 text-sm line-clamp-2">{roomDescription}</div>
              <div className="text-gray-600 text-xs">{roomType}</div>
            </div>
          </div>

          {/* Hotel Info, Emissions and Price */}
          <div className="flex w-full md:w-3/5 justify-around py-2 gap-5">
            {/* Carbon Emissions */}
            {hotel.carbon_emissions && (
              <div className="hidden sm:flex flex-col items-center gap-4">
                <div className="flex flex-col justify-center items-center gap-0"> 
                  <div className="text-gray-500 text-xs">Carbon</div>
                  <div className="text-gray-500 text-xs">Emissions</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  hotel.carbon_emissions.comparison_rating === 'low' 
                    ? 'bg-green-100 text-green-700' 
                    : hotel.carbon_emissions.comparison_rating === 'high'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {hotel.carbon_emissions.comparison_rating === 'low' ? 'Eco friendly' : 
                   hotel.carbon_emissions.comparison_rating === 'high' ? 'High' : 'Medium'}
                </div>
              </div>
            )}

            <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 sm:gap-1">
              <div className="text-gray-500 text-center sm:text-right">
                {/* <div className="text-sm">{hotel.hotel.cityCode}</div> */}
                {/* <div className="text-xs">{hotel.available ? "Available" : "Not Available"}</div> */}
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 sm:gap-1">
              <div className="text-gray-600 text-center sm:text-right">
                <div className="text-xl sm:text-2xl text-black font-bold">{priceTotal}</div>
                <div className="text-xs sm:text-sm">total price</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Room Features and Mobile Emissions */}
        <div className="w-full md:hidden sm:col-span-full mt-4 sm:mt-5">
          <div className="flex flex-wrap gap-2">
            {firstOffer && (
              <>
                <span className="bg-gray-100 px-3 py-1.5 rounded-md text-gray-600 text-xs">
                  {firstOffer.guests.adults} Adults
                </span>
              </>
            )}
            {hotel.carbon_emissions && (
              <>
                <span className="bg-gray-100 px-3 py-1.5 rounded-md text-gray-600 text-xs">
                  {Math.round(hotel.carbon_emissions.total_emissions)}kg CO2
                </span>
                <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                  hotel.carbon_emissions.comparison_rating === 'low' 
                    ? 'bg-green-100 text-green-700' 
                    : hotel.carbon_emissions.comparison_rating === 'high'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {hotel.carbon_emissions.comparison_rating === 'low' ? 'Low Impact' : 
                   hotel.carbon_emissions.comparison_rating === 'high' ? 'High Impact' : 'Medium Impact'}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mt-5 hidden md:flex text-sm bg-gray-100 px-6 py-1.5 rounded-md text-gray-600 text-xs">
          {firstOffer.guests.adults} Adult(s)
        </div>
      </div>
   
    </div>
  );
};