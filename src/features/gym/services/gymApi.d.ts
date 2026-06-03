export interface Gym {
    id: string;
    org_id: string;
    gymu_id: string;
    name: string;
    address?: string;
    city?: string;
    phone?: string;
    is_active: boolean;
}
export declare const gymApi: {
    getGyms: () => Promise<Gym[]>;
};
