import React, { useEffect, useState } from 'react';
import { organizationApi } from '../services/organizationApi';
import type { OrganizationProfile } from '../types';
import { Loader2, Save, Globe, Info, Calendar, Megaphone, Building2, Check, Briefcase, ShieldCheck, FileText } from 'lucide-react';
import { FACILITY_TYPE_LABELS } from '@/features/auth/types';
import { getApiErrorMessage } from '@/shared/lib/apiError';

export const BasicInfoForm: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    organizationApi.getProfile()
      .then((data) => {
        if (active) {
          setProfile(data);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError('Failed to load organization profile');
        }
        console.error(err);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const payload = {
        name: profile.name,
        business_type: profile.business_type,
        tagline: profile.tagline,
        description: profile.description,
        year_established: profile.year_established,
        website_url: profile.website_url,
        business_id: profile.business_id,
        gst_number: profile.gst_number,
        pan_number: profile.pan_number,
      };

      await organizationApi.updateProfile(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-ink/20" size={32} strokeWidth={1} />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-8 bg-destructive/5 text-destructive border border-destructive/10 rounded-luxury-sm text-xs font-mono uppercase tracking-widest">
        {error}. Synchronisation required.
      </div>
    );
  }

  if (!profile) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-16">
      <div className="space-y-4">
        <div className="metadata-label opacity-40">Section 01 / Identity</div>
        <h2 className="section-title">Institutional Identity</h2>
        <p className="font-sans text-sm text-ink/40 font-light max-w-lg leading-relaxed">
          Define your organization's core parameters and philosophical ethos within the platform's registry.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/5 text-destructive border border-destructive/10 rounded-luxury-sm text-[10px] font-mono uppercase tracking-[0.2em]">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-gold/5 text-gold border border-gold/10 rounded-luxury-sm text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-3">
          <Check size={12} /> Registry Updated Successfully
        </div>
      )}

      <div className="grid grid-cols-1 gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="metadata-label flex items-center gap-3">
               <Building2 size={12} strokeWidth={1.5} className="opacity-40" /> Organization Title
            </label>
            <input 
              className="luxury-input"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
              placeholder="Executive Fitness Club"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="metadata-label flex items-center gap-3">
               <Briefcase size={12} strokeWidth={1.5} className="opacity-40" /> Business Type
            </label>
            <select 
              className="luxury-input appearance-none bg-transparent"
              value={profile.business_type || ''}
              onChange={e => setProfile({...profile, business_type: e.target.value})}
            >
              <option value="" disabled className="bg-paper text-ink/40">Select Classification</option>
              {Object.entries(FACILITY_TYPE_LABELS).map(([val, label]) => (
                <option key={val} value={val} className="bg-paper text-ink">{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="metadata-label flex items-center gap-3">
             <Megaphone size={12} strokeWidth={1.5} className="opacity-40" /> Philosophy Tagline
          </label>
          <input 
            className="luxury-input"
            value={profile.tagline || ''}
            onChange={e => setProfile({...profile, tagline: e.target.value})}
            placeholder="Where excellence meets wellness"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="metadata-label flex items-center gap-3">
               <Calendar size={12} strokeWidth={1.5} className="opacity-40" /> Established
            </label>
            <input 
              className="luxury-input"
              type="number"
              value={profile.year_established || ''}
              onChange={e => setProfile({...profile, year_established: parseInt(e.target.value) || undefined})}
              placeholder="2024"
            />
          </div>

          <div className="space-y-3">
            <label className="metadata-label flex items-center gap-3">
               <Globe size={12} strokeWidth={1.5} className="opacity-40" /> Global URL
            </label>
            <input 
              className="luxury-input"
              type="url"
              value={profile.website_url || ''}
              onChange={e => setProfile({...profile, website_url: e.target.value})}
              placeholder="https://doers.premium"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="metadata-label flex items-center gap-3">
             <Info size={12} strokeWidth={1.5} className="opacity-40" /> Institutional Ethos
          </label>
          <textarea 
            className="luxury-input min-h-[180px] resize-none leading-loose py-5"
            value={profile.description || ''}
            onChange={e => setProfile({...profile, description: e.target.value})}
            placeholder="The architectural ethos and visionary goals of your wellness space..."
          />
        </div>
      </div>

      <div className="space-y-4 pt-10 border-t border-ink/5">
        <div className="metadata-label opacity-40">Section 02 / Legal & Compliance</div>
        <h2 className="section-title">Registration Registry</h2>
        <p className="font-sans text-sm text-ink/40 font-light max-w-lg leading-relaxed">
          Securely manage your legal identifiers. Data is AES-256 encrypted at rest following standard security protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-3">
          <label className="metadata-label flex items-center gap-3">
             <ShieldCheck size={12} strokeWidth={1.5} className="opacity-40" /> Business ID
          </label>
          <input 
            className="luxury-input font-mono"
            value={profile.business_id || ''}
            onChange={e => setProfile({...profile, business_id: e.target.value})}
            placeholder="Registration Number"
          />
        </div>

        <div className="space-y-3">
          <label className="metadata-label flex items-center gap-3">
             <FileText size={12} strokeWidth={1.5} className="opacity-40" /> GST / Tax ID
          </label>
          <input 
            className="luxury-input font-mono"
            value={profile.gst_number || ''}
            onChange={e => setProfile({...profile, gst_number: e.target.value})}
            placeholder="Tax Identifier"
          />
        </div>

        <div className="space-y-3">
          <label className="metadata-label flex items-center gap-3">
             <FileText size={12} strokeWidth={1.5} className="opacity-40" /> PAN Number
          </label>
          <input 
            className="luxury-input font-mono uppercase"
            value={profile.pan_number || ''}
            onChange={e => setProfile({...profile, pan_number: e.target.value.toUpperCase()})}
            placeholder="ABCDE1234F"
            maxLength={10}
          />
        </div>
      </div>

      <div className="pt-12 flex justify-end">
        <button 
          type="submit" 
          className="btn-luxury-primary min-w-[240px] group transition-all duration-500"
          disabled={saving}
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin opacity-40" />
          ) : (
            <div className="flex items-center gap-4">
              <Save size={14} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
              <span>Commit Registry Updates</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};
