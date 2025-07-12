import axios from 'axios';
import config from '../config';
import { getResponseFromOpenAI } from './getResponseFromOpenAI';
import { z } from 'zod';

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

interface AmadeusAcceptedPayments {
    creditCards: string[];
    methods: string[];
    creditCardPolicies: AmadeusCreditCardPolicy[];
}

interface AmadeusGuarantee {
    acceptedPayments: AmadeusAcceptedPayments;
}

interface AmadeusRefundable {
    cancellationRefund: string;
}

interface AmadeusPolicies {
    cancellations: AmadeusCancellation[];
    guarantee: AmadeusGuarantee;
    paymentType: string;
    refundable: AmadeusRefundable;
}

interface AmadeusRoomInformation {
    description: string;
    type: string;
    typeEstimated: AmadeusRoomTypeEstimated;
}

interface AmadeusOffer {
    id: string;
    checkInDate: string;
    checkOutDate: string;
    rateCode: string;
    rateFamilyEstimated: AmadeusRateFamilyEstimated;
    boardType: string;
    room: AmadeusRoom;
    guests: AmadeusGuests;
    price: AmadeusPrice;
    policies: AmadeusPolicies;
    self: string;
    roomInformation: AmadeusRoomInformation;
}

interface AmadeusHotelOffer {
    type: string;
    hotel: AmadeusHotelInfo;
    available: boolean;
    offers: AmadeusOffer[];
    self: string;
}

interface AmadeusHotelOffersResponse {
    data: AmadeusHotelOffer[];
}

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
            'https://test.api.amadeus.com/v1/security/oauth2/token',
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
        console.log('response', response);
        console.log('response.data', response.data);

        const tokenData: AmadeusTokenResponse = response.data;
        cachedToken = tokenData.access_token;
        // Set expiry to 30 minutes before actual expiry for safety
        tokenExpiry = Date.now() + (tokenData.expires_in - 1800) * 1000;
        console.log('tokenData', tokenData);
        return tokenData.access_token;
    } catch (error) {
        console.error('Error getting Amadeus access token:', error);
        throw new Error('Failed to get Amadeus access token');
    }
}

interface HotelsByCity {
    cityCode: string;
}

/**
 * Get hotels by city code using Amadeus API
 */
export async function getHotelsByCity(props: HotelsByCity): Promise<string[]> {
    try {
        const accessToken = await getAmadeusAccessToken();
        
        const response = await axios.get(
            `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city`,
            {
                params: {
                    cityCode: props.cityCode,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const hotelData: AmadeusHotelResponse = response.data;
        const hotelIds = hotelData.data.map((hotel) => {
            return hotel.hotelId;
        })
        return hotelIds;
    } catch (error) {
        console.error('Error fetching hotels from Amadeus:', error);
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
            `https://test.api.amadeus.com/v3/shopping/hotel-offers`,
            {
                params: {
                    hotelIds: props.hotelIds.join(','),
                    checkInDate: props.checkInDate,
                    checkOutDate: props.checkOutDate,
                    adults: props.numberOfAdults,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const hotelData: AmadeusHotelOffersResponse = response.data;
        return hotelData.data;
    } catch (error) {
        console.error('Error fetching hotel offers from Amadeus:', error);
        throw new Error('Failed to fetch hotel offers from Amadeus API');
    }
}

interface HotelsOffersByCityCode {
    cityCode: string;
    limit?: number; 
    checkInDate: string;
    checkOutDate: string;
    numberOfAdults: number;
    numberOfChildren: number;
}
/**
 * Get hotel offers by city code (fetches hotel IDs first, then gets offers)
 */
export async function getHotelsOffersByCityCode(props: HotelsOffersByCityCode): Promise<AmadeusHotelOffer[]> {
    try {
        // First get hotel IDs for the city
        const hotelIds = await getHotelsByCity({ cityCode: props.cityCode });
        
        // Limit the number of hotels if specified (to avoid API limits)
        const limitedHotelIds = props.limit ? hotelIds.slice(0, props.limit) : hotelIds.slice(0, 20); // Default limit to 20
        
        if (limitedHotelIds.length === 0) {
            throw new Error(`No hotels found for city code: ${props.cityCode}`);
        }
        
        // Then get offers for those hotels
        return await getHotelsOffersByCity({ hotelIds: limitedHotelIds, checkInDate: props.checkInDate, checkOutDate: props.checkOutDate, numberOfAdults: props.numberOfAdults, numberOfChildren: props.numberOfChildren });
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
    AmadeusHotelOffersResponse,
    AmadeusOffer,
    AmadeusPrice,
    AmadeusHotelInfo
}; 