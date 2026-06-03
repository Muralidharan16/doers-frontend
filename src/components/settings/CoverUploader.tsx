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

import React, { useRef, useState, useEffect } from 'react';
import { useCoverUpload } from '@/hooks/useCoverUpload';
import { useFocalPoint } from '@/hooks/useFocalPoint';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, Trash2, Camera, AlertCircle, Loader2, Check } from 'lucide-react';

interface CoverUploaderProps {
  orgId: string;
}

export const CoverUploader: React.FC<CoverUploaderProps> = () => {
  const {
    coverState,
    coverUrls,
    progress,
    error: uploadError,
    uploadCover,
    deleteCover,
    setCoverState,
    resetState
  } = useCoverUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Hook for focal point dragger
  const {
    focalY,
    setFocalY,
    handleMouseDown,
    handleTouchStart
  } = useFocalPoint(containerRef);

  // Revoke object url on clean up
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Pre-upload validation
  const validateAndSelect = (file: File) => {
    setLocalError(null);

    // 1. Check type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setLocalError('Invalid format. Accepted types: JPG, PNG, WebP.');
      return;
    }

    // 2. Check size (10MB)
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setLocalError('File size exceeds the 10MB limit.');
      return;
    }

    // 3. Check dimensions (min 1200x400px)
    const img = new Image();
    const tempUrl = URL.createObjectURL(file);
    img.src = tempUrl;
    img.onload = () => {
      if (img.width < 1200 || img.height < 400) {
        setLocalError('Cover photo dimensions must be at least 1200×400px.');
        URL.revokeObjectURL(tempUrl);
        return;
      }
      setSelectedFile(file);
      setLocalPreviewUrl(tempUrl);
      setFocalY(0.5); // reset focal point to center
      setCoverState('focal-picking');
    };
    img.onerror = () => {
      setLocalError('Failed to load image parameters.');
      URL.revokeObjectURL(tempUrl);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerBrowse();
    }
  };

  const startUpload = () => {
    if (selectedFile) {
      uploadCover(selectedFile, focalY);
    }
  };

  const handleCancelPicking = () => {
    setSelectedFile(null);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    resetState();
  };

  const activeError = localError || uploadError;
  const hasCover = coverUrls?.cover_desktop_url;

  return (
    <Card className="p-6 md:p-8 space-y-6 relative overflow-hidden">
      <div>
        <h3 className="font-serif italic text-lg text-[var(--text-primary)]">Institutional Banner</h3>
        <p className="text-xs text-[var(--text-secondary)] font-light mt-1">
          Add a high-resolution hero photo for your public page. Min resolution 1200×400px.
        </p>
      </div>

      {/* Upload Zone / Crop Preview Screen */}
      <div className="relative rounded-[6px] overflow-hidden border border-[var(--border-strong)] bg-[var(--bg-page)]/40">
        {coverState === 'focal-picking' && localPreviewUrl ? (
          /* Focal Point Drag Workspace */
          <div className="space-y-6 p-4 bg-[var(--bg-surface)]">
            <div className="space-y-1">
              <span className="metadata-label">Focal Cropping Workspace</span>
              <p className="text-[10px] text-[var(--text-secondary)] font-light">
                Drag the horizontal line or touch point to mark the most important visual asset line in your banner.
              </p>
            </div>

            {/* Picking container */}
            <div 
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="relative w-full overflow-hidden rounded-[4px] cursor-crosshair border border-[var(--border-default)] select-none"
              style={{ maxHeight: '300px' }}
            >
              <img 
                src={localPreviewUrl} 
                alt="Focal point selector workspace" 
                className="w-full h-auto pointer-events-none block"
              />
              {/* Horizontal line indicator */}
              <div 
                className="absolute left-0 right-0 h-[1.5px] bg-[var(--accent-gold)] flex items-center justify-center pointer-events-none shadow-md"
                style={{ top: `${focalY * 100}%` }}
              >
                <div className="w-5 h-5 rounded-full bg-[var(--accent-gold)] border border-[var(--bg-surface)] flex items-center justify-center shadow-lg transform -translate-y-1/2 scale-110">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--bg-surface)]" />
                </div>
              </div>
            </div>

            {/* 16:9 Real-time Crop Preview */}
            <div className="space-y-2">
              <span className="metadata-label">16:9 Dynamic Crop Render</span>
              <div className="w-full aspect-[16/9] max-h-[160px] md:max-h-[200px] overflow-hidden rounded-[4px] border border-[var(--border-default)] bg-neutral-900">
                <img 
                  src={localPreviewUrl} 
                  alt="Dynamic crop crop test" 
                  className="w-full h-full object-cover transition-all duration-75"
                  style={{ objectPosition: `center ${focalY * 100}%` }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={handleCancelPicking}>
                Cancel
              </Button>
              <Button onClick={startUpload}>
                Confirm & Upload
              </Button>
            </div>
          </div>
        ) : coverState === 'uploading' ? (
          /* Uploading state banner */
          <div aria-busy="true" className="w-full aspect-[16/9] max-h-[240px] flex flex-col items-center justify-center gap-4 bg-[var(--bg-page)]/80">
            <Loader2 className="animate-spin text-[var(--accent-gold)]" size={24} strokeWidth={1.5} />
            <div className="w-48 space-y-2">
              <div className="flex justify-between text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                <span>Uploading Banner</span>
                <span>{progress}%</span>
              </div>
              <div className="h-[2px] w-full bg-[var(--border-default)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--accent-gold)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : coverState === 'processing' ? (
          /* Processing/Scanning loader */
          <div aria-busy="true" className="w-full aspect-[16/9] max-h-[240px] flex flex-col items-center justify-center gap-3 bg-[var(--bg-page)]/90 animate-pulse">
            <Loader2 className="animate-spin text-[var(--accent-gold)]" size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
              Antivirus Scanning & Optimizing...
            </span>
          </div>
        ) : hasCover ? (
          /* Fully Qualified CDN Responsive Banner Render */
          <div className="relative w-full aspect-[16/9] max-h-[160px] md:max-h-[240px] group">
            <picture className="w-full h-full">
              <source media="(max-width: 640px)" srcSet={coverUrls.cover_mobile_url || undefined} />
              <source media="(max-width: 1024px)" srcSet={coverUrls.cover_tablet_url || undefined} />
              <img 
                src={coverUrls.cover_desktop_url || undefined} 
                alt="Institutional banner" 
                className="w-full h-full object-cover"
              />
            </picture>
            {/* Hover overlay with replacement button */}
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
              <button 
                onClick={triggerBrowse}
                aria-label="Replace banner photo"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 border border-white/50 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
              >
                <Camera className="text-white" size={20} />
              </button>
              <button 
                onClick={() => setShowConfirmDelete(true)}
                aria-label="Remove banner photo"
                className="w-12 h-12 rounded-full bg-[var(--destructive)]/20 hover:bg-[var(--destructive)]/40 border border-[var(--destructive)]/50 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
              >
                <Trash2 className="text-white" size={20} />
              </button>
            </div>
          </div>
        ) : (
          /* Fallback empty background gradient + noise dropzone */
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerBrowse}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Upload cover photo"
            className={`relative w-full aspect-[16/9] max-h-[240px] flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[var(--accent-gold)]/20 ${
              dragActive ? 'scale-[0.99] border-dashed border-[var(--accent-gold)]' : ''
            }`}
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(184, 115, 51, 0.15) 0%, rgba(26, 24, 20, 0.03) 100%)',
              border: dragActive ? '1px dashed var(--accent-gold)' : '0.5px dashed var(--border-strong)',
            }}
          >
            {/* Noise SVG overlay */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}
            />

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/webp"
            />

            <div className="flex flex-col items-center gap-2.5 z-10 text-center px-4">
              <Upload size={18} className="text-[var(--text-secondary)] opacity-60" />
              <p className="text-[11px] font-medium text-[var(--text-primary)]">
                Drag banner here or <span className="text-[var(--accent-gold-text)] underline font-semibold">browse</span>
              </p>
              <p className="text-[9px] text-[var(--text-muted)] tracking-wide">
                JPG, PNG, WebP — min 1200×400px, max 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Alerts */}
      {activeError && (
        <div 
          role="alert" 
          className="p-4 bg-[var(--destructive)]/5 text-[var(--destructive)] border border-[var(--destructive)]/10 rounded-[6px] text-[10px] font-mono uppercase tracking-[0.18em] flex items-start gap-2.5"
        >
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span>{activeError}</span>
            <button 
              onClick={resetState} 
              className="block mt-2 text-[9px] underline font-bold tracking-widest cursor-pointer text-[var(--accent-gold-text)]"
            >
              Reset Status
            </button>
          </div>
        </div>
      )}

      {coverState === 'ready' && !uploadError && (
        <div className="p-4 bg-[var(--accent-gold)]/5 text-[var(--accent-gold-text)] border border-[var(--accent-gold)]/10 rounded-[6px] text-[10px] font-mono uppercase tracking-[0.18em] flex items-center gap-2.5">
          <Check size={14} className="text-[var(--accent-gold)]" />
          <span>Cover Banner Upload Complete</span>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showConfirmDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-cover-delete"
        >
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-[8px] max-w-md w-full p-6 space-y-6 shadow-2xl animate-subtle-up">
            <div className="space-y-2">
              <h4 id="confirm-cover-delete" className="font-serif italic text-xl text-[var(--text-primary)]">
                Purge Digital Banner?
              </h4>
              <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                This action will irrevocably remove the banner cover photo and all resized assets (mobile, tablet, desktop) from the S3 storage and global CDN endpoints.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => {
                  setShowConfirmDelete(false);
                  deleteCover();
                }}
              >
                Purge Banner
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
