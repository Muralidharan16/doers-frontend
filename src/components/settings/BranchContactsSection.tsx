import React, { useState, useEffect, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Phone, Mail, Star, Edit2, Trash2, Plus, AlertCircle, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { 
  getBranchContacts, 
  createBranchContact, 
  updateBranchContact, 
  deleteBranchContact, 
  promoteBranchContact 
} from '@/features/gym/services/branchContactsApi';
import type { 
  BranchContact, 
  CreateBranchContactPayload,
  UpdateBranchContactPayload
} from '@/features/gym/types/branchContacts';

interface BranchContactFormValues {
  contact_kind: 'phone' | 'email';
  contact_label: string;
  visibility_scope: string;
  is_primary: boolean;
  country_code: string;
  phone_number?: string;
  email?: string;
  whatsapp: boolean;
  sms: boolean;
  voice: boolean;
  fax: boolean;
}

interface BranchContactsSectionProps {
  branchId: string;
}

export const BranchContactsSection: React.FC<BranchContactsSectionProps> = ({ branchId }) => {
  const [contacts, setContacts] = useState<BranchContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const safeContacts = Array.isArray(contacts) ? contacts : [];
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<BranchContact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<BranchContactFormValues>({
    defaultValues: {
      contact_kind: 'phone',
      contact_label: 'Main Office',
      visibility_scope: 'public',
      is_primary: false,
      country_code: 'IN',
      whatsapp: true,
      sms: true,
      voice: true,
      fax: false,
    }
  });

  const selectedKind = useWatch({ control, name: 'contact_kind' });

  const fetchContacts = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const data = await getBranchContacts(branchId);
      setContacts(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } }, message?: string };
      setError(e?.response?.data?.detail || e?.message || 'Failed to fetch contacts');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContacts(false);
  }, [fetchContacts]);

  const handleOpenForm = (contact?: BranchContact) => {
    setFormError(null);
    if (contact) {
      setEditingContact(contact);
      reset({
        contact_kind: contact.contact_kind,
        contact_label: contact.contact_label,
        visibility_scope: contact.visibility_scope,
        is_primary: contact.is_primary,
        phone_number: contact.phone_e164 || contact.phone_number || '',
        country_code: contact.country_code || 'IN',
        email: contact.email || contact.email_normalized || '',
        whatsapp: contact.channel_capabilities?.whatsapp || false,
        sms: contact.channel_capabilities?.sms || false,
        voice: contact.channel_capabilities?.voice || false,
        fax: contact.channel_capabilities?.fax || false,
      });
    } else {
      setEditingContact(null);
      reset({
        contact_kind: 'phone',
        contact_label: 'Main Office',
        visibility_scope: 'public',
        is_primary: safeContacts.length === 0, // auto primary if first
        country_code: 'IN',
        phone_number: '',
        email: '',
        whatsapp: true,
        sms: true,
        voice: true,
        fax: false,
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingContact(null);
    setFormError(null);
  };

  const onSubmit = async (data: BranchContactFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const payload: Partial<CreateBranchContactPayload> = {
        contact_kind: data.contact_kind,
        contact_label: data.contact_label,
        visibility_scope: data.visibility_scope,
        is_primary: data.is_primary,
      };

      if (data.contact_kind === 'phone') {
        payload.phone_number = data.phone_number;
        payload.country_code = data.country_code;
        payload.channel_capabilities = {
          whatsapp: data.whatsapp,
          sms: data.sms,
          voice: data.voice,
          fax: data.fax,
        };
      } else {
        payload.email = data.email;
      }

      if (editingContact) {
        await updateBranchContact(branchId, editingContact.id, payload as UpdateBranchContactPayload);
      } else {
        await createBranchContact(branchId, payload as CreateBranchContactPayload);
      }
      
      closeForm();
      await fetchContacts();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: unknown } }, message?: string };
      setFormError(
        (Array.isArray(e?.response?.data?.detail) ? e.response.data.detail[0]?.msg : undefined) || 
        (typeof e?.response?.data?.detail === 'string' ? e.response.data.detail : null) || 
        e?.message || 
        'Failed to save contact'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await deleteBranchContact(branchId, contactId);
      await fetchContacts();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      alert(e?.response?.data?.detail || 'Failed to delete contact');
    }
  };

  const handlePromote = async (contactId: string) => {
    try {
      await promoteBranchContact(branchId, contactId);
      await fetchContacts();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      alert(e?.response?.data?.detail || 'Failed to promote contact');
    }
  };

  if (isLoading) {
    return (
      <div className="py-6 flex justify-center">
        <Loader2 className="animate-spin text-[var(--text-muted)]" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/20 rounded-md text-sm flex items-center gap-2 mt-4">
        <AlertCircle size={16} />
        {error}
      </div>
    );
  }

  return (
    <div className="mt-1">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-[var(--text-muted)]">Phone numbers and emails for this branch</p>
        <Button variant="secondary" onClick={() => handleOpenForm()} className="h-7 text-[11px] gap-1.5 px-3 flex-shrink-0">
          <Plus size={12} /> Add Contact
        </Button>
      </div>

      {safeContacts.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-[var(--border-default)] rounded-lg bg-[var(--bg-hover)]/30">
          <p className="text-[12px] text-[var(--text-muted)]">No contacts added yet. Add a phone number or email for this branch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {safeContacts.map(contact => (
            <div 
              key={contact.id} 
              className={`p-3.5 rounded-lg border flex flex-col gap-3 transition-colors ${
                contact.is_primary 
                  ? 'bg-[var(--bg-surface)] border-[var(--accent)]/40 shadow-sm' 
                  : 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${contact.is_primary ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'}`}>
                    {contact.contact_kind === 'phone' ? <Phone size={14} /> : <Mail size={14} />}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-medium text-[var(--text-primary)] flex items-center gap-2">
                      {contact.contact_kind === 'phone' ? contact.phone_e164 : contact.email_normalized}
                      {contact.is_primary && (
                        <span title="Primary Contact">
                          <Star size={12} className="text-[var(--accent-gold)] fill-[var(--accent-gold)]" />
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 capitalize">
                      {contact.contact_label} • {contact.visibility_scope}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {!contact.is_primary && (
                    <button 
                      onClick={() => handlePromote(contact.id)}
                      title="Make Primary"
                      className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-hover)] rounded"
                    >
                      <Check size={13} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleOpenForm(contact)}
                    title="Edit Contact"
                    className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button 
                    onClick={() => handleDelete(contact.id)}
                    title="Delete Contact"
                    className="p-1.5 text-[var(--text-muted)] hover:text-[var(--red)] hover:bg-[var(--bg-hover)] rounded"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {contact.contact_kind === 'phone' && contact.channel_capabilities && (
                <div className="flex flex-wrap gap-1.5 pl-9">
                  {contact.channel_capabilities.whatsapp && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#25D366]/10 text-[#075E54] font-medium border border-[#25D366]/20">
                      WhatsApp
                    </span>
                  )}
                  {contact.channel_capabilities.sms && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium border border-[var(--border-default)]">
                      SMS
                    </span>
                  )}
                  {contact.channel_capabilities.voice && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium border border-[var(--border-default)]">
                      Voice
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Inline Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                {editingContact ? 'Edit Branch Contact' : 'Add Branch Contact'}
              </h3>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/20 rounded-md text-[12px] flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span className="flex-1">{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Type</label>
                  <select 
                    {...register('contact_kind')} 
                    disabled={!!editingContact}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Label</label>
                  <input 
                    {...register('contact_label', { required: true })} 
                    placeholder="e.g. Front Desk"
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {selectedKind === 'phone' ? (
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-1 space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Code</label>
                    <input 
                      {...register('country_code')} 
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="col-span-3 space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Phone Number</label>
                    <input 
                      {...register('phone_number', { required: selectedKind === 'phone' })} 
                      placeholder="9876543210"
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Email Address</label>
                  <input 
                    type="email"
                    {...register('email', { required: selectedKind === 'email' })} 
                    placeholder="contact@branch.com"
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Visibility</label>
                  <select 
                    {...register('visibility_scope')} 
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="public">Public</option>
                    <option value="internal">Internal (Staff)</option>
                    <option value="management">Management</option>
                    <option value="emergency">Emergency</option>
                    <option value="billing">Billing</option>
                  </select>
                </div>
                
                <div className="flex flex-col justify-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" {...register('is_primary')} className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer" />
                    <span className="text-[12px] font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Set as Primary</span>
                  </label>
                </div>
              </div>

              {selectedKind === 'phone' && (
                <div className="pt-2 border-t border-[var(--border-default)]">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)] block mb-2">Channel Capabilities</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" {...register('whatsapp')} className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]" />
                      <span className="text-[12px] text-[var(--text-secondary)]">WhatsApp</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" {...register('sms')} className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]" />
                      <span className="text-[12px] text-[var(--text-secondary)]">SMS</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" {...register('voice')} className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]" />
                      <span className="text-[12px] text-[var(--text-secondary)]">Voice</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-5 mt-2">
                <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={14} className="animate-spin mr-2 inline" /> : null}
                  {editingContact ? 'Save Changes' : 'Add Contact'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
