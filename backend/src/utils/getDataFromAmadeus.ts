import axios from 'axios';
import config from '../config';
import { getResponseFromOpenAI } from './getResponseFromOpenAI';
import { z } from 'zod';
import { getHotelPhotoUrl } from './google';

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

/**
 * Get hotels by city code using Amadeus API
 */
export async function getHotelsByCity(props: { cityCode: string }): Promise<HotelNamePhotoUrl[]> {
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
        const hotelIds: HotelNamePhotoUrl[] = await Promise.all(hotelData.data.map(async (hotel) => {
            const photoUrl = await getHotelPhotoUrl(hotel.name, hotel.geoCode.latitude, hotel.geoCode.longitude);
            console.log('photoUrl', photoUrl);
            return { 
                hotelId: hotel.hotelId, 
                photoUrl: photoUrl 
            };
        }));
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
        console.error('Error fetching hotel offers from Amadeus');
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
        const hotelIds = await getHotelsByCity({ cityCode: props.cityCode });
        
        const finalHotelOffers: AmadeusHotelOffer[] = [];

        for (let i = 1; i < 4; i++) {
            try {
                const limitedHotelIds = props.limit ? hotelIds.slice(i * 50, (i + 1) * 50) : hotelIds.slice(i * 50, (i + 1) * 50);
                console.log('limitedHotelIds', limitedHotelIds);
                const hotelOffers = await getHotelsOffersByCity({ hotelIds: limitedHotelIds.map((hotel) => hotel.hotelId), checkInDate: props.checkInDate, checkOutDate: props.checkOutDate, numberOfAdults: props.numberOfAdults, numberOfChildren: props.numberOfChildren });
                console.log('hotelOffers', hotelOffers);
                const hotelOffersWithPhotoUrl = hotelOffers.map((hotelOffer) => {
                    const photoUrl = limitedHotelIds.find((hotel) => hotel.hotelId === hotelOffer.hotel.hotelId)?.photoUrl;
                    console.log('photoUrl', photoUrl);
                    return { ...hotelOffer, photoUrl: photoUrl };
                });
                finalHotelOffers.push(...hotelOffersWithPhotoUrl);
            } catch (error) {
                console.error('Error fetching hotel offers by city code:', error);
                continue;
            }
        }
        
        return finalHotelOffers;
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
    AmadeusHotelInfo
}; 