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

import { apiClient } from '@/shared/services/api/client';
import type { 
  UploadUrlResponse, 
  LogoStatusResponse, 
  CoverStatusResponse, 
  CoverConfirmRequest 
} from '@/types/assets';

export const assetService = {
  // Logo APIs
  getLogoUploadUrl: async (): Promise<UploadUrlResponse> => {
    const { data } = await apiClient.post('/organizations/logo/upload-url');
    return data.data || data;
  },

  confirmLogoUpload: async (uploadId: string): Promise<void> => {
    await apiClient.patch('/organizations/logo/confirm', { upload_id: uploadId });
  },

  getLogoStatus: async (): Promise<LogoStatusResponse> => {
    const { data } = await apiClient.get('/organizations/logo/status');
    return data.data || data;
  },

  deleteLogo: async (): Promise<void> => {
    await apiClient.delete('/organizations/logo');
  },

  // Cover Photo APIs
  getCoverUploadUrl: async (): Promise<UploadUrlResponse> => {
    const { data } = await apiClient.post('/organizations/cover/upload-url');
    return data.data || data;
  },

  confirmCoverUpload: async (payload: CoverConfirmRequest): Promise<void> => {
    await apiClient.patch('/organizations/cover/confirm', payload);
  },

  getCoverStatus: async (): Promise<CoverStatusResponse> => {
    const { data } = await apiClient.get('/organizations/cover/status');
    return data.data || data;
  },

  deleteCover: async (): Promise<void> => {
    await apiClient.delete('/organizations/cover');
  }
};
