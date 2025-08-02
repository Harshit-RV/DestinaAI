interface HotelCarbonEmissions {
  daily_emissions: number;
  total_emissions: number;
  comparison_rating: 'low' | 'medium' | 'high';
}

export interface Hotel {
  type: string;
  hotel: {
    hotelId: string;
    chainCode: string;
    dupeId: string;
    name: string;
    cityCode: string;
    latitude: number;
    longitude: number;
  };
  available: boolean;
  photoUrl: string[];
  carbon_emissions?: HotelCarbonEmissions;
  offers: {
    id: string;
    checkInDate: string;
    checkOutDate: string;
    rateCode: string;
    boardType: string;
    room: {
      type: string;
      typeEstimated: {
        category: string;
        beds: number;
        bedType: string;
      };
      description: {
        text: string;
        lang: string;
      };
    };
    guests: {
      adults: number;
    };
    price: {
      currency: string;
      base: string;
      total: string;
      taxes: {
        code: string;
        percentage?: string;
        included: boolean;
        pricingFrequency?: string;
        pricingMode?: string;
      }[];
      variations: {
        average: {
          base: string;
        };
        changes: {
          startDate: string;
          endDate: string;
          base: string;
        }[];
      };
    };
    policies: {
      cancellations: {
        policyType: string;
      }[];
      prepay: {
        acceptedPayments: {
          creditCards: string[];
          methods: string[];
          creditCardPolicies: {
            vendorCode: string;
          }[];
        };
      };
      paymentType: string;
      refundable: {
        cancellationRefund: string;
      };
    };
    self: string;
    roomInformation: {
      description: string;
      type: string;
      typeEstimated: {
        bedType: string;
        beds: number;
        category: string;
      };
    };
  }[];
  self: string;
  images: { type: string }[];
}
