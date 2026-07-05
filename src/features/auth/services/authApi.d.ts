import type { LoginCredentials, AuthTokens, SignupPayload, AuthResponse, SignupResponse, User } from '../types';
export declare const authApi: {
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    signup: (payload: SignupPayload) => Promise<SignupResponse>;
    resendVerification: (email: string) => Promise<{
        message: string;
    }>;
    signupStatus: (email: string, pollToken: string) => Promise<{
        status: string;
        onboarding_completed?: boolean;
        access_token?: string;
        refresh_token?: string;
        user?: {
            id: string;
            email: string;
            name: string;
            organizationName?: string;
        };
    }>;
    refresh: (refreshToken: string) => Promise<AuthTokens & {
        onboarding_completed?: boolean;
    }>;
    logout: () => Promise<void>;
    getMe: () => Promise<User>;
};
