/*
 * THEME ANALYSIS FINDINGS
 * Colors: --bg-page: #F7F5F1, --bg-surface: #FFFFFF, --text-primary: #1A1814, --accent-gold: #B87333
 * Radius: rounded-[6px] / var(--radius-md)
 * Font: Instrument Sans (--font-sans), Cormorant Garamond (--font-serif)
 * Components: Custom UI components (Card, Button, Input) & lucide-react icons
 * Buttons: Button (variants: primary | secondary | danger | ghost)
 * Forms: Vanilla React state-driven, luxury-input styling
 * API: Axios instance (apiClient) at src/shared/services/api/client.ts with Authorization headers
 * Toasts: Premium inline custom status banners (matching existing error/success styling)
 * Loading: Loader2 spinner from lucide-react with animate-spin
 * File upload: No existing pattern found — establish new
 */

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
  focal_y: number; // 0.0 to 1.0
}
