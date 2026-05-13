export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  gym_ids?: string[];
}

export type FacilityType =
  | 'gym'
  | 'yoga_studio'
  | 'crossfit_box'
  | 'swimming_pool'
  | 'martial_arts'
  | 'dance_studio'
  | 'sports_academy'
  | 'multi_sport'
  | 'others';

export const FACILITY_TYPE_LABELS: Record<FacilityType, string> = {
  gym:            'Gym',
  yoga_studio:    'Yoga Studio',
  crossfit_box:   'CrossFit Box',
  swimming_pool:  'Swimming Pool',
  martial_arts:   'Martial Arts',
  dance_studio:   'Dance Studio',
  sports_academy: 'Sports Academy',
  multi_sport:    'Multi-Sport Complex',
  others:         'Others',
};

export interface SignupPayload {
  org_name:      string;
  owner_name:    string;
  email:         string;
  password:      string;
  facility_type: FacilityType;
}