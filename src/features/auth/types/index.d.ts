export interface LoginCredentials {
    email: string;
    password: string;
}
export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}
export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
    onboarding_completed: boolean;
}
export interface User {
    id: string;
    email: string;
    name?: string;
    organizationName?: string;
    gym_ids?: string[];
}
export type FacilityType = 'gym' | 'yoga_studio' | 'crossfit_box' | 'swimming_pool' | 'martial_arts' | 'dance_studio' | 'sports_academy' | 'multi_sport' | 'others';
export declare const FACILITY_TYPE_LABELS: Record<FacilityType, string>;
export interface SignupPayload {
    org_name: string;
    owner_name: string;
    email: string;
    password: string;
    facility_type: FacilityType;
}
