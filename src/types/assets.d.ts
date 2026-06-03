export type AssetStatus = "pending" | "processing" | "ready" | "failed";
export interface UploadUrlResponse {
    upload_url: string;
    fields: Record<string, string>;
    upload_id: string;
    expires_in: number;
}
export interface LogoStatusResponse {
    status: AssetStatus;
    logo_thumb_url: string | null;
    logo_medium_url: string | null;
    logo_full_url: string | null;
}
export interface CoverStatusResponse {
    status: AssetStatus;
    cover_mobile_url: string | null;
    cover_tablet_url: string | null;
    cover_desktop_url: string | null;
}
export interface CoverConfirmRequest {
    upload_id: string;
    focal_y: number;
}
