export interface Registration {
    id: string;
    id_type: string;
    id_number_masked: string;
    country_code: string;
    is_verified: boolean;
    verified_at?: string;
}
export interface OrganizationProfile {
    id: string;
    name: string;
    tagline?: string;
    description?: string;
    year_established?: number;
    website_url?: string;
    social_links: Record<string, string>;
    registrations: Registration[];
}
export interface OrganizationUpdatePayload {
    name?: string;
    tagline?: string;
    description?: string;
    year_established?: number;
    website_url?: string;
    social_links?: Record<string, string>;
}
