export interface PincodeLookupResponse {
  city: string;
  state: string;
  district: string;
}

export interface CompleteOnboardingPayload {
  phone: string;
  country_code: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
}
