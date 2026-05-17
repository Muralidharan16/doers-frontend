import type { CompleteOnboardingPayload, PincodeLookupResponse } from '../types';
export declare const onboardingApi: {
    lookupPincode: (pincode: string) => Promise<PincodeLookupResponse>;
    complete: (payload: CompleteOnboardingPayload) => Promise<void>;
    getStatus: () => Promise<{
        onboarding_completed: boolean;
    }>;
};
