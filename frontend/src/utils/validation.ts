export interface ValidationErrors {
  departureDate?: string;
  returnDate?: string;
  travelers?: string;
}

export const validateTripDates = (departureDate: string, returnDate: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Get today's date and tomorrow's date
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Format dates for comparison (YYYY-MM-DD)
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
  
  // Validate departure date
  if (departureDate && departureDate < tomorrowFormatted) {
    errors.departureDate = 'Departure date must be at least tomorrow';
  }
  
  // Validate return date
  if (departureDate && returnDate && returnDate <= departureDate) {
    errors.returnDate = 'Return date must be after departure date';
  }
  
  return errors;
};

export const validateTravelers = (adults: number, children: number): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const totalTravelers = adults + children;
  
  if (totalTravelers > 6) {
    errors.travelers = 'Maximum 6 travelers allowed (including adults and children)';
  }
  
  if (adults < 1) {
    errors.travelers = 'At least 1 adult is required';
  }
  
  return errors;
};

export const validateTripForm = (
  departureDate: string, 
  returnDate: string, 
  adults: number, 
  children: number
): ValidationErrors => {
  const dateErrors = validateTripDates(departureDate, returnDate);
  const travelerErrors = validateTravelers(adults, children);
  
  return {
    ...dateErrors,
    ...travelerErrors
  };
}; 