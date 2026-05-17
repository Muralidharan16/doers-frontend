import type { OrganizationProfile, OrganizationUpdatePayload } from '../types';
export declare const organizationApi: {
    getProfile: () => Promise<OrganizationProfile>;
    updateProfile: (payload: OrganizationUpdatePayload) => Promise<OrganizationProfile>;
};
