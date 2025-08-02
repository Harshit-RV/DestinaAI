import axios from 'axios';
import config from '../config';
import { getResponseFromOpenAI } from './getResponseFromOpenAI';
import { z } from 'zod';
import { getHotelPhotoUrl } from './google-maps';

// Currency conversion types and cache
interface CurrencyRates {
    [key: string]: number;
}

interface FreeCurrencyApiResponse {
    usd: CurrencyRates;
}

// Cache for currency rates (valid for 1 hour)
let cachedRates: CurrencyRates | null = null;
let ratesExpiry: number = 0;

/**
 * Fetch latest currency exchange rates from FreeCurrencyAPI
 */
async function getCurrencyRates(): Promise<CurrencyRates> {
    // Check if cached rates are still valid
    if (cachedRates && Date.now() < ratesExpiry) {
        return cachedRates;
    }

    try {
        const response = await axios.get<FreeCurrencyApiResponse>(
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
        );
        
        cachedRates = response.data.usd;
        // Cache for 1 hour
        ratesExpiry = Date.now() + (60 * 60 * 1000);
        
        return cachedRates;
    } catch (error) {
        console.error('Error fetching currency rates:', error);
        // If we have cached rates, use them even if expired
        if (cachedRates) {
            return cachedRates;
        }
        throw new Error('Failed to fetch currency exchange rates');
    }
}

/**
 * Convert price from any currency to USD
 */
async function convertToUSD(amount: string, fromCurrency: string): Promise<string> {
    if (fromCurrency === 'USD') {
        return amount;
    }

    try {
        const rates = await getCurrencyRates();
        const rate = rates[fromCurrency.toLowerCase()];
        
        if (!rate) {
            console.warn(`Exchange rate not found for currency: ${fromCurrency}, keeping original amount`);
            return amount;
        }

        // Convert to USD: amount in foreign currency / exchange rate = amount in USD
        const usdAmount = parseFloat(amount) / rate;
        return usdAmount.toFixed(2);
    } catch (error) {
        console.error(`Error converting ${fromCurrency} to USD:`, error);
        return amount; // Return original amount if conversion fails
    }
}

/**
 * Convert all prices in an AmadeusPrice object to USD
 */
async function convertPriceToUSD(price: AmadeusPrice): Promise<AmadeusPrice> {
    if (price.currency === 'USD') {
        return price;
    }

    try {
        const convertedBase = await convertToUSD(price.base, price.currency);
        const convertedTotal = await convertToUSD(price.total, price.currency);

        // Convert price variations
        const convertedVariations: AmadeusPriceVariations = {
            average: {
                base: await convertToUSD(price.variations.average.base, price.currency)
            },
            changes: await Promise.all(price.variations.changes.map(async (change) => ({
                ...change,
                base: await convertToUSD(change.base, price.currency)
            })))
        };

        return {
            ...price,
            currency: 'USD',
            base: convertedBase,
            total: convertedTotal,
            variations: convertedVariations
        };
    } catch (error) {
        console.error('Error converting price to USD:', error);
        return price; // Return original price if conversion fails
    }
}

// Types for Amadeus OAuth Token Response
interface AmadeusTokenResponse {
    type: string;
    username: string;
    application_name: string;
    client_id: string;
    token_type: string;
    access_token: string;
    expires_in: number;
    state: string;
    scope: string;
}

// Types for Amadeus Hotel Response
interface AmadeusGeoCode {
    latitude: number;
    longitude: number;
}

interface AmadeusAddress {
    countryCode: string;
    postalCode?: string;
    cityName: string;
    lines: string[];
}

interface AmadeusRetailing {
    sponsorship: {
        isSponsored: boolean;
    };
}

interface AmadeusHotel {
    chainCode?: string;
    iataCode: string;
    dupeId: number;
    name: string;
    hotelId: string;
    geoCode: AmadeusGeoCode;
    address: AmadeusAddress;
    lastUpdate: string;
    retailing?: AmadeusRetailing;
}

interface AmadeusHotelResponse {
    data: AmadeusHotel[];
    meta: {
        count: number;
        links: {
            self: string;
        };
    };
}

// Types for Amadeus Hotel Offers Response
interface AmadeusHotelInfo {
    type: string;
    hotelId: string;
    chainCode: string;
    dupeId: string;
    photoUrl: string[] | null;
    name: string;
    cityCode: string;
    latitude: number;
    longitude: number;
}

interface AmadeusRateFamilyEstimated {
    code: string;
    type: string;
}

interface AmadeusRoomTypeEstimated {
    category: string;
    beds?: number;
    bedType?: string;
}

interface AmadeusRoomDescription {
    text: string;
    lang: string;
}

interface AmadeusRoom {
    type: string;
    typeEstimated: AmadeusRoomTypeEstimated;
    description: AmadeusRoomDescription;
}

interface AmadeusGuests {
    adults: number;
    children?: number;
}

interface AmadeusTax {
    code: string;
    percentage?: string;
    pricingFrequency?: string;
    pricingMode?: string;
    included: boolean;
}

interface AmadeusPriceVariation {
    startDate: string;
    endDate: string;
    base: string;
}

interface AmadeusPriceVariations {
    average: {
        base: string;
    };
    changes: AmadeusPriceVariation[];
}

interface AmadeusPrice {
    currency: string;
    base: string;
    total: string;
    taxes: AmadeusTax[];
    variations: AmadeusPriceVariations;
}

interface AmadeusCancellation {
    numberOfNights: number;
    deadline: string;
    policyType: string;
}

interface AmadeusCreditCardPolicy {
    vendorCode: string;
}

interface AmadeusOffer {
    id: string;
    checkInDate: string;
    checkOutDate: string;
    rateCode: string;
    rateFamilyEstimated: AmadeusRateFamilyEstimated;
    boardType: string;
    room: {
        description: string;
        type: string;
        typeEstimated: AmadeusRoomTypeEstimated;
    }
    guests: AmadeusGuests;
    price: AmadeusPrice;
    policies: {
        cancellations: AmadeusCancellation[];
        guarantee: {
            acceptedPayments: {
                creditCards: string[];
                methods: string[];
                creditCardPolicies: AmadeusCreditCardPolicy[];
            };
        };
        prepay: {
            acceptedPayments: {
                creditCards: string[];
                methods: string[];
                creditCardPolicies: AmadeusCreditCardPolicy[];
            };
        };
        paymentType: string;
        refundable: {
            cancellationRefund: string;
        };
    }
    self: string;
    roomInformation: {
        description: string;
        type: string;
        typeEstimated: AmadeusRoomTypeEstimated;
    }
}

interface AmadeusHotelOffer {
    type: string;
    hotel: AmadeusHotelInfo;
    available: boolean;
    offers: AmadeusOffer[];
    self: string;
}

// interface AmadeusHotelOffersResponse {
//     data: AmadeusHotelOffer[];
// }

// Cache for access token
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get Amadeus access token
 */
async function getAmadeusAccessToken(): Promise<string> {
    // Check if cached token is still valid
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    try {
        const response = await axios.post(
            'https://api.amadeus.com/v1/security/oauth2/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: config.amadeusClientId,
                client_secret: config.amadeusClientSecret,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        const tokenData: AmadeusTokenResponse = response.data;
        cachedToken = tokenData.access_token;
        tokenExpiry = Date.now() + (tokenData.expires_in - 1800) * 1000;
        return tokenData.access_token;
    } catch (error) {
        console.error('Error getting Amadeus access token:', error);
        throw new Error('Failed to get Amadeus access token');
    }
}

interface HotelNamePhotoUrl {
    hotelId: string;
    photoUrl: string[] | null;
}

interface getHotelsByCityResponse {
    data: HotelNamePhotoUrl[];
    numberOfTotalPages: number;
    totalCount: number;
}

/**
 * Get hotels by city code using Amadeus API
 */
export async function getHotelsByCity(props: { cityCode: string, page: number, limit: number }): Promise<getHotelsByCityResponse> {
    try {
        const accessToken = await getAmadeusAccessToken();
        
        const response = await axios.get(
            `https://api.amadeus.com/v1/reference-data/locations/hotels/by-city`,
            {
                params: {
                    cityCode: props.cityCode,
                    radius: 50,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const hotelData: AmadeusHotelResponse = response.data;
        const totalHotels = hotelData.data.length;
        const numberOfTotalPages = Math.ceil(totalHotels / props.limit);

        const hotelDataFiltered = hotelData.data.slice(props.page * props.limit, (props.page + 1) * props.limit);

        const hotelIds: HotelNamePhotoUrl[] = await Promise.all(hotelDataFiltered.map(async (hotel) => {
            const photoUrl = await getHotelPhotoUrl(hotel.name, hotel.geoCode.latitude, hotel.geoCode.longitude);
            return { 
                hotelId: hotel.hotelId, 
                photoUrl: photoUrl 
            };
        }));
        return {
            data: hotelIds,
            numberOfTotalPages,
            totalCount: totalHotels
        };
    } catch (error) {
        console.error('Error fetching hotels from Amadeus');
        throw new Error('Failed to fetch hotels from Amadeus API');
    }
}

interface HotelsOffersByCity {
    hotelIds: string[];
    checkInDate: string;
    checkOutDate: string;
    numberOfAdults: number;
    numberOfChildren: number;
}

export async function getHotelsOffersByCity(props: HotelsOffersByCity): Promise<AmadeusHotelOffer[]> {
    try {
        const accessToken = await getAmadeusAccessToken();
        
        const response = await axios.get(
            `https://api.amadeus.com/v3/shopping/hotel-offers`,
            {
                params: {
                    hotelIds: props.hotelIds.join(','),
                    checkInDate: props.checkInDate,
                    checkOutDate: props.checkOutDate,
                    adults: props.numberOfAdults,
                    currency: 'USD',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const hotelData: AmadeusHotelOffer[] = response.data.data;
        return hotelData;
    } catch (error) {
        console.error('Error fetching hotel offers from Amadeus', error);
        throw new Error('Failed to fetch hotel offers from Amadeus API');
    }
}



// Add pagination response interface
interface PaginatedHotelOffersResponse {
    data: AmadeusHotelOffer[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
}

interface HotelsOffersByCityCode {
    cityCode: string;
    limit?: number; 
    page?: number;  // Add page parameter
    checkInDate: string;
    checkOutDate: string;
    numberOfAdults: number;
    numberOfChildren: number;
}
/**
 * Get hotel offers by city code (fetches hotel IDs first, then gets offers) with pagination
 */
export async function getHotelsOffersByCityCode(props: HotelsOffersByCityCode): Promise<PaginatedHotelOffersResponse> {
    try {
        // Set defaults
        const page = props.page || 1;
        const limit = props.limit || 10;
        
        // Get hotels for this page (getHotelsByCity already handles pagination)
        const hotelsByCityResult = await getHotelsByCity({ 
            cityCode: props.cityCode, 
            page: page - 1, // Convert to 0-based indexing for getHotelsByCity
            limit: limit 
        });
        
        const paginatedHotelIds = hotelsByCityResult.data;
        const totalPages = hotelsByCityResult.numberOfTotalPages;
        const totalCount = hotelsByCityResult.totalCount;
        
        console.log(`Fetching hotels for page ${page}, showing ${paginatedHotelIds.length} hotels of approximately ${totalCount} total`);
        
        if (paginatedHotelIds.length === 0) {
            return {
                data: [],
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    totalPages,
                    hasMore: false
                }
            };
        }
        
        try {
            // Fetch offers for this page's hotels
            const hotelOffers = await getHotelsOffersByCity({ 
                hotelIds: paginatedHotelIds.map((hotel) => hotel.hotelId), 
                checkInDate: props.checkInDate, 
                checkOutDate: props.checkOutDate, 
                numberOfAdults: props.numberOfAdults, 
                numberOfChildren: props.numberOfChildren 
            });
                        
            // Add photo URLs and convert prices to USD
            const hotelOffersWithPhotoUrl = await Promise.all(hotelOffers.map(async (hotelOffer) => {
                const photoUrl = paginatedHotelIds.find((hotel) => hotel.hotelId === hotelOffer.hotel.hotelId)?.photoUrl;
                
                // Convert all offer prices to USD
                const convertedOffers = await Promise.all(hotelOffer.offers.map(async (offer) => ({
                    ...offer,
                    price: await convertPriceToUSD(offer.price)
                })));
                
                return { 
                    ...hotelOffer, 
                    photoUrl: photoUrl,
                    offers: convertedOffers
                };
            }));
            
            return {
                data: hotelOffersWithPhotoUrl,
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    totalPages,
                    hasMore: page < totalPages
                }
            };
            
        } catch (error) {
            console.error(`Error fetching hotel offers for page ${page}:`, error);
            // Return empty results but with correct pagination info
            return {
                data: [],
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    totalPages,
                    hasMore: page < totalPages
                }
            };
        }
        
    } catch (error) {
        console.error('Error fetching hotel offers by city code:', error);
        throw new Error('Failed to fetch hotel offers by city code');
    }
}


// Export types for use in other files
export type { 
    AmadeusHotel, 
    AmadeusHotelResponse, 
    AmadeusGeoCode, 
    AmadeusAddress,
    AmadeusHotelOffer,
    // AmadeusHotelOffersResponse,
    AmadeusOffer,
    AmadeusPrice,
    AmadeusHotelInfo,
    PaginatedHotelOffersResponse  // Export the new pagination type
}; 