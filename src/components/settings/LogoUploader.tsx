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

import React, { useRef, useState } from 'react';
import { useLogoUpload } from '@/hooks/useLogoUpload';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, Trash2, AlertCircle, Loader2, Check } from 'lucide-react';

interface LogoUploaderProps {
  orgId: string;
  orgName: string;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ orgId, orgName }) => {
  const {
    logoState,
    logoUrls,
    progress,
    error: uploadError,
    uploadLogo,
    deleteLogo,
    resetState
  } = useLogoUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Derive initials for avatar fallback
  const getInitials = () => {
    if (!orgName) return 'GF';
    return orgName
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Pre-upload client side validation
  const validateAndUpload = (file: File) => {
    setLocalError(null);

    // 1. Check file type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setLocalError('Invalid format. Accepted types: PNG, JPG, WebP.');
      return;
    }

    // 2. Check file size (5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setLocalError('File size exceeds the 5MB limit.');
      return;
    }

    // 3. Check dimensions (min 100x100px)
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (img.width < 200 || img.height < 200) {
        setLocalError('Dimensions must be at least 200x200px.');
        return;
      }
      uploadLogo(file);
    };
    img.onerror = () => {
      setLocalError('Failed to load image metadata.');
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
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

  const activeError = localError || uploadError;

  return (
    <Card className="p-6 md:p-8 space-y-6 relative overflow-hidden">
      {/* Visual Identity Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Left Side: Preview area */}
        <div className="relative">
          {logoState === 'processing' ? (
            <div 
              aria-busy="true" 
              className="w-16 h-16 rounded-full bg-[var(--bg-page)] border border-[var(--border-default)] flex items-center justify-center animate-pulse"
            >
              <Loader2 className="animate-spin text-[var(--accent-gold)]" size={20} strokeWidth={1.5} />
            </div>
          ) : logoUrls?.logo_thumb_url && (logoState === 'idle-has-logo' || logoState === 'ready') ? (
            <div className="w-16 h-16 rounded-full border border-[var(--border-strong)] overflow-hidden bg-white flex items-center justify-center">
              <img 
                src={logoUrls.logo_thumb_url} 
                alt={`${orgName} Logo`} 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-mono tracking-widest text-[#F7F5F1]"
              style={{
                background: 'linear-gradient(135deg, var(--accent-gold-dark) 0%, var(--btn-primary-bg) 100%)',
              }}
            >
              {getInitials()}
            </div>
          )}
        </div>

        {/* Right Side: Upload Dropzone & Action controls */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <h3 className="font-serif italic text-lg text-[var(--text-primary)]">Institutional Emblem</h3>
            <p className="text-xs text-[var(--text-secondary)] font-light mt-1">
              Provide a canonical single logo for authentication screens and system headers.
            </p>
          </div>

          {logoState === 'uploading' ? (
            <div className="space-y-2 py-4" aria-busy="true">
              <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">
                <span>Uploading Emblem</span>
                <span>{progress}%</span>
              </div>
              <div className="h-[2px] w-full bg-[var(--border-default)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--accent-gold)] transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : logoState === 'deleting' ? (
            <div className="flex items-center gap-3 py-4 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              <Loader2 className="animate-spin text-[var(--red)]" size={14} />
              <span>Purging Emblem...</span>
            </div>
          ) : (
            <>
              {/* Dropzone Area */}
              {(!logoUrls?.logo_thumb_url || logoState === 'failed') && (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerBrowse}
                  onKeyDown={handleKeyDown}
                  tabIndex={0}
                  role="button"
                  aria-label="Upload organization logo"
                  className={`border border-dashed rounded-[6px] p-6 text-center cursor-pointer transition-all duration-200 focus:outline-none focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)]/20 ${
                    dragActive 
                      ? 'border-[var(--accent-gold)] bg-[var(--bg-sidebar-hover)]' 
                      : 'border-[var(--border-strong)] hover:border-[var(--accent-gold)] bg-[var(--bg-page)]/40 hover:bg-[var(--bg-page)]/70'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={16} className="text-[var(--text-secondary)] opacity-60" />
                    <p className="text-[11px] font-medium text-[var(--text-primary)]">
                      Drop emblem here or <span className="text-[var(--accent-gold-text)] underline font-semibold">browse</span>
                    </p>
                    <p className="text-[9px] text-[var(--text-muted)] tracking-wide">
                      PNG, JPG, WebP — max 5MB (min 200x200px)
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons when logo exists */}
              {logoUrls?.logo_thumb_url && logoState !== 'failed' && (
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={triggerBrowse}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/webp"
                    />
                    Replace Emblem
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    <Trash2 size={13} />
                    <span>Remove Emblem</span>
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Feedback alerts */}
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

          {logoState === 'ready' && (
            <div className="p-4 bg-[var(--accent-gold)]/5 text-[var(--accent-gold-text)] border border-[var(--accent-gold)]/10 rounded-[6px] text-[10px] font-mono uppercase tracking-[0.18em] flex items-center gap-2.5">
              <Check size={14} className="text-[var(--accent-gold)]" />
              <span>Emblem Upload Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* High-Fidelity Custom Deletion Confirmation Dialog */}
      {showConfirmDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-[8px] max-w-md w-full p-6 space-y-6 shadow-2xl animate-subtle-up">
            <div className="space-y-2">
              <h4 id="confirm-delete-title" className="font-serif italic text-xl text-[var(--text-primary)]">
                Purge Digital Emblem?
              </h4>
              <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                This action will irrevocably remove the logo emblem from the global CDN caches and organization records. This compliance action will trigger database audit entries.
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
                  deleteLogo();
                }}
              >
                Confirm Purge
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
