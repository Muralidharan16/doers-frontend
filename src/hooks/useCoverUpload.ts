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

import { useState, useEffect, useRef, useCallback } from 'react';
import { assetService } from '@/lib/services/assetService';
import type { CoverStatusResponse } from '@/types/assets';

export type CoverUploadState = 'idle-empty' | 'focal-picking' | 'uploading' | 'processing' | 'ready' | 'failed' | 'deleting';

export function useCoverUpload() {
  const [coverState, setCoverState] = useState<CoverUploadState>('idle-empty');
  const [coverUrls, setCoverUrls] = useState<CoverStatusResponse | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptsRef = useRef(0);

  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Ensure polling is cleared on unmount
  useEffect(() => {
    return () => clearPolling();
  }, [clearPolling]);

  // Centralized polling logic
  const pollStatus = useCallback(() => {
    clearPolling();
    pollAttemptsRef.current = 0;
    setCoverState('processing');

    pollIntervalRef.current = setInterval(async () => {
      try {
        pollAttemptsRef.current += 1;
        if (pollAttemptsRef.current > 30) {
          clearPolling();
          setCoverState('failed');
          setError('Processing timed out. Please try again.');
          return;
        }

        const data = await assetService.getCoverStatus();
        if (data.status === 'ready') {
          clearPolling();
          setCoverUrls(data);
          setCoverState('ready');
          setProgress(0);
        } else if (data.status === 'failed') {
          clearPolling();
          setCoverState('failed');
          setError('Antivirus scan or image validation failed.');
        }
      } catch (err: any) {
        // Fail closed on status check errors
        clearPolling();
        setCoverState('failed');
        setError(err.response?.data?.detail || 'Failed to verify cover status.');
      }
    }, 2000);
  }, [clearPolling]);

  const loadInitialStatus = useCallback(async () => {
    try {
      const data = await assetService.getCoverStatus();
      if (data.cover_desktop_url) {
        setCoverUrls(data);
        setCoverState('ready');
      } else {
        setCoverState('idle-empty');
      }
    } catch {
      setCoverState('idle-empty');
    }
  }, []);

  useEffect(() => {
    loadInitialStatus();
  }, [loadInitialStatus]);

  // Upload method with focal Y input
  const uploadCover = useCallback(async (file: File, focalY: number) => {
    try {
      // client-side clamp verification
      if (focalY < 0.0 || focalY > 1.0) {
        throw new Error('Focal point out of bounds.');
      }

      setError(null);
      setProgress(0);
      setCoverState('uploading');

      // Step 1: Get S3 presigned POST URL
      const { upload_url, fields, upload_id } = await assetService.getCoverUploadUrl();

      // Step 2: Upload direct to S3 using XHR
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file); // MUST be the last field

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', upload_url, true);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setProgress(pct);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 204 || xhr.status === 200) {
            resolve();
          } else {
            reject(new Error('S3 upload rejected'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error uploading to S3'));
        xhr.send(formData);
      });

      // Step 3: Confirm cover upload with focal_y
      await assetService.confirmCoverUpload({
        upload_id: upload_id,
        focal_y: focalY
      });

      // Step 4: Begin polling for status
      pollStatus();
    } catch (err: any) {
      setCoverState('failed');
      setError(err.message || 'Cover upload failed. Please try again.');
    }
  }, [pollStatus]);

  // Delete method
  const deleteCover = useCallback(async () => {
    try {
      setCoverState('deleting');
      setError(null);
      await assetService.deleteCover();
      setCoverUrls(null);
      setCoverState('idle-empty');
      setProgress(0);
    } catch (err: any) {
      setCoverState('ready');
      setError(err.response?.data?.detail || 'Failed to remove cover photo.');
    }
  }, []);

  return {
    coverState,
    coverUrls,
    progress,
    error,
    uploadCover,
    deleteCover,
    setCoverState,
    resetState: () => {
      setCoverState(coverUrls?.cover_desktop_url ? 'ready' : 'idle-empty');
      setError(null);
      setProgress(0);
    }
  };
}
