export declare const apiClient: import("axios").AxiosInstance;
export declare const getAuthTokenPayload: () => {
    org_id?: string;
    role?: string;
    sub?: string;
    email?: string;
    [key: string]: unknown;
} | null;
export declare const fetchBranches: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
interface BranchFormPayload {
    name?: string;
    internal_code?: string;
    address_line1?: string;
    address_line2?: string;
    address_city?: string;
    address_state?: string;
    country_code?: string;
    address_pincode?: string;
    contact_phone?: string;
    contact_email?: string;
    to_status?: string;
    reason?: string | null;
}
export declare const addBranch: (formData: BranchFormPayload) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const deleteBranch: (gymId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const updateBranch: (gymId: string, formData: BranchFormPayload) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const updateAddress: (addressId: string, formData: BranchFormPayload) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const transitionBranchStatus: (branchId: string, formData: BranchFormPayload) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const pollTransitionStatus: (branchId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export {};
