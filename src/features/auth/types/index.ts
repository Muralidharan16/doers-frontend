export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  organizationName?: string;
  gym_ids?: string[];
}

export interface SessionResponse {
  user: User;
  onboarding_completed: boolean;
}

export interface RefreshResponse {
  status: string;
  onboarding_completed?: boolean;
}

export interface SignupResponse {
  status: string;
  message: string;
}

export interface SignupStatusResponse {
  status: 'pending' | 'verified';
  onboarding_completed?: boolean;
  user?: User;
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
