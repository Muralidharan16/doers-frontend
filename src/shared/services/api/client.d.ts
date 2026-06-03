export declare const apiClient: import("axios").AxiosInstance;
export declare const getAuthTokenPayload: () => any;
export declare const fetchBranches: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const addBranch: (formData: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const deleteBranch: (gymId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const updateBranch: (gymId: string, formData: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const updateAddress: (addressId: string, formData: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const transitionBranchStatus: (branchId: string, formData: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const pollTransitionStatus: (branchId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
