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
import { getApiErrorMessage } from '@/shared/lib/apiError';
import type { LogoStatusResponse } from '@/types/assets';

export type UploadState = 'idle-empty' | 'idle-has-logo' | 'uploading' | 'processing' | 'ready' | 'failed' | 'deleting';

export function useLogoUpload() {
  const [logoState, setLogoState] = useState<UploadState>('idle-empty');
  const [logoUrls, setLogoUrls] = useState<LogoStatusResponse | null>(null);
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
    setLogoState('processing');

    pollIntervalRef.current = setInterval(async () => {
      try {
        pollAttemptsRef.current += 1;
        if (pollAttemptsRef.current > 30) {
          clearPolling();
          setLogoState('failed');
          setError('Processing timed out. Please try again.');
          return;
        }

        const data = await assetService.getLogoStatus();
        if (data.status === 'ready') {
          clearPolling();
          setLogoUrls(data);
          setLogoState('ready');
          setProgress(0);
          window.dispatchEvent(new CustomEvent('logo-updated', { detail: data.logo_thumb_url }));
        } else if (data.status === 'failed') {
          clearPolling();
          setLogoState('failed');
          setError('Antivirus scan or image validation failed.');
        }
      } catch (err: unknown) {
        // Fail closed on status check errors
        clearPolling();
        setLogoState('failed');
        setError(getApiErrorMessage(err, 'Failed to verify logo status.'));
      }
    }, 2000);
  }, [clearPolling]);

  const loadInitialStatus = useCallback(async () => {
    try {
      const data = await assetService.getLogoStatus();
      if (data.logo_thumb_url) {
        setLogoUrls(data);
        setLogoState('idle-has-logo');
      } else {
        setLogoState('idle-empty');
      }
    } catch {
      setLogoState('idle-empty');
    }
  }, []);

  useEffect(() => {
    loadInitialStatus();
  }, [loadInitialStatus]);

  // Upload method
  const uploadLogo = useCallback(async (file: File) => {
    try {
      setError(null);
      setProgress(0);
      setLogoState('uploading');

      // Step 1: Get S3 presigned POST URL
      const { upload_url, fields, upload_id } = await assetService.getLogoUploadUrl();

      // Step 2: Upload direct to S3 using XHR for progress tracking
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file); // file MUST be the last field

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

      // Step 3: Confirm logo upload
      await assetService.confirmLogoUpload(upload_id);

      // Step 4: Begin polling for status
      pollStatus();
    } catch (err: unknown) {
      setLogoState('failed');
      setError(getApiErrorMessage(err, err instanceof Error ? err.message : 'Logo upload failed. Please try again.'));
    }
  }, [pollStatus]);

  // Delete method
  const deleteLogo = useCallback(async () => {
    try {
      setLogoState('deleting');
      setError(null);
      await assetService.deleteLogo();
      setLogoUrls(null);
      setLogoState('idle-empty');
      setProgress(0);
      window.dispatchEvent(new CustomEvent('logo-updated', { detail: null }));
    } catch (err: unknown) {
      setLogoState('idle-has-logo');
      setError(getApiErrorMessage(err, 'Failed to remove logo.'));
    }
  }, []);

  return {
    logoState,
    logoUrls,
    progress,
    error,
    uploadLogo,
    deleteLogo,
    resetState: () => {
      setLogoState(logoUrls?.logo_thumb_url ? 'idle-has-logo' : 'idle-empty');
      setError(null);
      setProgress(0);
    }
  };
}
