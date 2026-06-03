import type { CoverStatusResponse } from '@/types/assets';
export type CoverUploadState = 'idle-empty' | 'focal-picking' | 'uploading' | 'processing' | 'ready' | 'failed' | 'deleting';
export declare function useCoverUpload(): {
    coverState: CoverUploadState;
    coverUrls: CoverStatusResponse | null;
    progress: number;
    error: string | null;
    uploadCover: (file: File, focalY: number) => Promise<void>;
    deleteCover: () => Promise<void>;
    setCoverState: import("react").Dispatch<import("react").SetStateAction<CoverUploadState>>;
    resetState: () => void;
};
