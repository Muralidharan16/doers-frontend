import type { LogoStatusResponse } from '@/types/assets';
export type UploadState = 'idle-empty' | 'idle-has-logo' | 'uploading' | 'processing' | 'ready' | 'failed' | 'deleting';
export declare function useLogoUpload(): {
    logoState: UploadState;
    logoUrls: LogoStatusResponse | null;
    progress: number;
    error: string | null;
    uploadLogo: (file: File) => Promise<void>;
    deleteLogo: () => Promise<void>;
    resetState: () => void;
};
