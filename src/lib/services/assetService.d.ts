import type { UploadUrlResponse, LogoStatusResponse, CoverStatusResponse, CoverConfirmRequest } from '@/types/assets';
export declare const assetService: {
    getLogoUploadUrl: () => Promise<UploadUrlResponse>;
    confirmLogoUpload: (uploadId: string) => Promise<void>;
    getLogoStatus: () => Promise<LogoStatusResponse>;
    deleteLogo: () => Promise<void>;
    getCoverUploadUrl: () => Promise<UploadUrlResponse>;
    confirmCoverUpload: (payload: CoverConfirmRequest) => Promise<void>;
    getCoverStatus: () => Promise<CoverStatusResponse>;
    deleteCover: () => Promise<void>;
};
