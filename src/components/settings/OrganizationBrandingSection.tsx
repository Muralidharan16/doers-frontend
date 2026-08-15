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

import React, { useEffect, useState } from 'react';
import { LogoUploader } from './LogoUploader';
import { CoverUploader } from './CoverUploader';
import { apiClient } from '@/shared/services/api/client';
import { Loader2 } from 'lucide-react';

export const OrganizationBrandingSection: React.FC = () => {
  const [orgProfile, setOrgProfile] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgProfile = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get('/organizations/profile');
        const profile = data.data || data;
        setOrgProfile({
          id: profile.id,
          name: profile.name,
        });
      } catch (err: unknown) {
        setError('Failed to sync branding parameters.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16" aria-busy="true">
        <Loader2 className="animate-spin text-[var(--accent-gold)]/40" size={24} strokeWidth={1.5} />
      </div>
    );
  }

  if (error || !orgProfile) {
    return (
      <div 
        role="alert" 
        className="p-4 bg-[var(--destructive)]/5 text-[var(--destructive)] border border-[var(--destructive)]/10 rounded-[6px] text-[10px] font-mono uppercase tracking-[0.18em]"
      >
        {error || 'Branding services temporarily unavailable.'}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-subtle-up">
      {/* Section Headings */}
      <div className="space-y-4">
        <div className="metadata-label opacity-40">Section 03 / Visual Branding</div>
        <h2 className="section-title">Institutional Branding Assets</h2>
        <p className="font-sans text-sm text-ink/40 font-light max-w-lg leading-relaxed">
          Customise your gym's customer-facing digital assets. Upload your emblem logo and high-resolution banner photo for optimal presentation across the platform's user terminals.
        </p>
      </div>

      {/* Grid of uploaders */}
      <div className="grid grid-cols-1 gap-8">
        <LogoUploader orgId={orgProfile.id} orgName={orgProfile.name} />
        <CoverUploader orgId={orgProfile.id} />
      </div>
    </div>
  );
};
