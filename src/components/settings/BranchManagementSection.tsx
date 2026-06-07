import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Building2, Plus, Edit2, Trash2, Mail, Phone, Hash, AlertTriangle, Clock, Contact } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  getAuthTokenPayload,
  fetchBranches,
  addBranch,
  deleteBranch,
  updateBranch,
  updateAddress,
  transitionBranchStatus,
  pollTransitionStatus
} from '@/shared/services/api/client';
import { BranchContactsSection } from './BranchContactsSection';
import { BranchOperatingHoursSection } from './BranchOperatingHoursSection';

// The 9 fields representing our branch lifecycle schema
const branchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  internal_code: z.string().min(1, 'Internal code is required'),
  status: z.enum(['ACTIVE', 'MAINTENANCE', 'DECOMMISSIONED']),
  contact_email: z.string().email('Valid email required'),
  contact_phone: z.string().min(10, 'Valid phone required'),
  address_line1: z.string().min(1, 'Address is required'),
  address_city: z.string().min(1, 'City is required'),
  address_state: z.string().min(1, 'State is required'),
  address_pincode: z.string().min(5, 'Pincode is required'),
});

type BranchFormValues = z.infer<typeof branchSchema>;

interface Branch {
  id: string;
  name: string;
  internal_code?: string;
  gymu_id?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED';
  contact_email: string;
  contact_phone: string;
  address_id?: string;
  address_line1: string;
  address_city: string;
  address_state: string;
  address_pincode: string;
  total_members?: number;
}

export const BranchManagementSection: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Custom API Integration States
  const [deletingBranchId, setDeletingBranchId] = useState<string | null>(null);
  const [transitioningBranchIds, setTransitioningBranchIds] = useState<Set<string>>(new Set());
  const [failedStep, setFailedStep] = useState<'gym' | 'address' | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [blockedTransitionError, setBlockedTransitionError] = useState<string | null>(null);
  const [userRole] = useState<string>(() => {
    const payload = getAuthTokenPayload();
    return payload?.role ? payload.role.toLowerCase() : 'owner';
  });

  // Confirmation Modals State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Branch | null>(null);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState<{ branch: Branch, newStatus: string } | null>(null);
  const [showDecommissionConfirm, setShowDecommissionConfirm] = useState<{ branch: Branch, newStatus: string } | null>(null);
  const [maintenanceReason, setMaintenanceReason] = useState<string>("");
  const [decommissionReason, setDecommissionReason] = useState<string>("");
  const [decommissionEffectiveDate, setDecommissionEffectiveDate] = useState<string>("");

  const pollingIntervals = React.useRef<Record<string, ReturnType<typeof setInterval>>>({});

  // Role permissions checks
  const canAddBranch = userRole === 'owner';
  const canDeleteBranch = userRole === 'owner';
  const canEditBranch = userRole === 'owner' || userRole === 'manager';
  const canTransitionToDecommissioned = userRole === 'owner';
  const canTransitionToMaintenance = userRole === 'owner' || userRole === 'manager';

  const handleApiError = React.useCallback((err: unknown) => {
    const e = err as { response?: { status?: number, data?: { detail?: unknown, message?: string } }, code?: string, message?: string };
    if (e.response) {
      const status = e.response.status;
      const detail = e.response.data?.detail;
      const message = e.response.data?.message;

      if (status === 400 || status === 422) {
        const errors: Record<string, string> = {};
        if (Array.isArray(detail)) {
          detail.forEach((item: { loc?: string[], msg?: string }) => {
            const field = item.loc?.[item.loc.length - 1];
            if (field) {
              errors[field] = item.msg || "Invalid field";
            }
          });
          setFieldErrors(errors);
        } else if (typeof detail === 'string') {
          setFormError(detail);
        } else if (detail && typeof detail === 'object' && 'message' in detail && typeof (detail as Record<string, unknown>).message === 'string') {
          setFormError((detail as Record<string, unknown>).message as string);
        } else if (typeof message === 'string') {
          setFormError(message);
        } else {
          setFormError("Validation failed. Please verify the input fields.");
        }
      } else if (status === 401) {
        window.location.assign('/login');
      } else if (status === 403) {
        setFormError("You don't have permission to perform this action");
      } else if (status === 404) {
        setFormError("Branch not found. Please refresh the page.");
      } else if (status === 409) {
        setFormError((typeof detail === 'string' ? detail : null) || message || "Conflict. A duplicate record may exist.");
      } else if (status === 500) {
        setFormError("Something went wrong. Please try again.");
      } else {
        setFormError((typeof detail === 'string' ? detail : null) || message || "An unexpected error occurred.");
      }
    } else if (e.code === "ECONNABORTED" || e.message?.includes("timeout")) {
      setFormError("Request timed out. Check your connection and retry.");
    } else {
      setFormError(e.message || "Something went wrong. Please try again.");
    }
  }, []);

  const handleFetchBranches = React.useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setFormError(null);
    try {
      const response = await fetchBranches();
      if (response.data?.data) {
        setBranches(response.data.data);
      }
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [handleApiError]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleFetchBranches();

    const refreshInterval = setInterval(() => {
      handleFetchBranches(false);
    }, 5000);

    const intervals = pollingIntervals.current;
    return () => {
      clearInterval(refreshInterval);
      // Cleanup polling intervals on unmount
      Object.values(intervals).forEach(clearInterval);
    };
  }, [handleFetchBranches]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: { status: 'ACTIVE' }
  });

  const startSagaPolling = (branchId: string) => {
    if (pollingIntervals.current[branchId]) return;

    setTransitioningBranchIds(prev => {
      const next = new Set(prev);
      next.add(branchId);
      return next;
    });

    const interval = setInterval(async () => {
      try {
        const res = await pollTransitionStatus(branchId);
        const state = res.data?.data || res.data;

        if (!state.lifecycle_transition_in_progress) {
          clearInterval(interval);
          delete pollingIntervals.current[branchId];
          setTransitioningBranchIds(prev => {
            const next = new Set(prev);
            next.delete(branchId);
            return next;
          });

          // Saga finished successfully, refetch
          await handleFetchBranches();
        }
      } catch {
        clearInterval(interval);
        delete pollingIntervals.current[branchId];
        setTransitioningBranchIds(prev => {
          const next = new Set(prev);
          next.delete(branchId);
          return next;
        });
        await handleFetchBranches();
      }
    }, 3000);

    pollingIntervals.current[branchId] = interval;
  };

  const executeStatusTransition = async (branchId: string, toStatus: string, reason: string) => {
    setTransitioningBranchIds(prev => {
      const next = new Set(prev);
      next.add(branchId);
      return next;
    });

    try {
      // REPLACED: was setBranches(branches.map(b => b.id === branchId ? { ...b, status: toStatus } : b))
      // NOW: calls real API status transition saga
      const res = await transitionBranchStatus(branchId, {
        to_status: toStatus,
        reason: reason
      });

      const state = res.data?.data || res.data;
      if (state.lifecycle_transition_in_progress || state.saga_status === 'processing') {
        startSagaPolling(branchId);
      } else {
        await handleFetchBranches();
        setTransitioningBranchIds(prev => {
          const next = new Set(prev);
          next.delete(branchId);
          return next;
        });
      }
    } catch (err: unknown) {
      handleApiError(err);
      await handleFetchBranches();
      setTransitioningBranchIds(prev => {
        const next = new Set(prev);
        next.delete(branchId);
        return next;
      });
    }
  };

  const handleStatusChange = (branch: Branch, newStatus: string) => {
    setBlockedTransitionError(null);
    const oldStatus = branch.status.toUpperCase();
    const targetStatus = newStatus.toUpperCase();

    if (oldStatus === targetStatus) return;

    // Enforce valid transition paths
    if (oldStatus === 'DECOMMISSIONED') {
      setBlockedTransitionError("This transition is not allowed. A decommissioned branch cannot be reactivated.");
      return;
    }

    if (targetStatus === 'DECOMMISSIONED') {
      setShowDecommissionConfirm({ branch, newStatus });
      setDecommissionReason("");
      setDecommissionEffectiveDate("");
    } else if (targetStatus === 'MAINTENANCE') {
      setShowMaintenanceConfirm({ branch, newStatus });
      setMaintenanceReason("");
    } else if (targetStatus === 'ACTIVE') {
      executeStatusTransition(branch.id, 'ACTIVE', 'Reactivating branch');
    }
  };

  const onSubmit = async (data: BranchFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      if (editingId) {
        const branchToEdit = branches.find(b => b.id === editingId);
        if (!branchToEdit) {
          setFormError("Branch not found. Please refresh the page.");
          setIsSubmitting(false);
          return;
        }

        // Step 1: Update Gym/Branch name
        if (failedStep === null || failedStep === 'gym') {
          try {
            // REPLACED: was setBranches(branches.map(...))
            // NOW: calls real API PUT /gyms/{gym_id}
            await updateBranch(editingId, data);
            setFailedStep(null);
          } catch (err: unknown) {
            setFailedStep('gym');
            handleApiError(err);
            setIsSubmitting(false);
            return;
          }
        }

        // Step 2: Update Address details
        if (failedStep === null || failedStep === 'address') {
          try {
            const addressId = branchToEdit.address_id || editingId;
            // REPLACED: was setBranches(branches.map(...))
            // NOW: calls real API PATCH /addresses/{address_id}
            await updateAddress(addressId, data);
            setFailedStep(null);
          } catch (err: unknown) {
            setFailedStep('address');
            setFormError("Branch name saved but address update failed. Please retry address.");
            handleApiError(err);
            setIsSubmitting(false);
            return;
          }
        }

        closeForm();
        await handleFetchBranches();
      } else {
        // Add Branch
        // REPLACED: was setBranches([...branches, ...])
        // NOW: calls real API POST /gyms
        await addBranch(data);
        closeForm();
        await handleFetchBranches();
      }
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateNextInternalCode = () => {
    if (branches.length === 0) return "TFD-01";
    
    const existingNumbers = branches
      .map(b => b.gymu_id || b.internal_code)
      .filter(Boolean)
      .map(code => {
        const match = code.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      });
      
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    return `TFD-${String(maxNumber + 1).padStart(2, '0')}`;
  };

  const openNewForm = () => {
    reset({
      internal_code: generateNextInternalCode(),
      status: 'ACTIVE'
    });
    setIsFormOpen(true);
  };

  const openEdit = (branch: Branch) => {
    setEditingId(branch.id);
    reset({
      name: branch.name,
      internal_code: branch.gymu_id || branch.internal_code,
      status: branch.status,
      contact_email: branch.contact_email,
      contact_phone: branch.contact_phone === "Pending Setup" ? "" : branch.contact_phone,
      address_line1: branch.address_line1,
      address_city: branch.address_city,
      address_state: branch.address_state,
      address_pincode: branch.address_pincode,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFailedStep(null);
    setFormError(null);
    setFieldErrors({});
    reset({ status: 'ACTIVE' });
  };

  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return;
    const gymId = showDeleteConfirm.id;
    setDeletingBranchId(gymId);
    setShowDeleteConfirm(null);
    setFormError(null);

    try {
      // REPLACED: was setBranches(branches.filter(b => b.id !== id))
      // NOW: calls real API DELETE /gyms/{gym_id}
      await deleteBranch(gymId);
      await handleFetchBranches();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setDeletingBranchId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {blockedTransitionError && (
        <div className="p-3 bg-[var(--red)]/10 border border-[var(--red)]/20 rounded-lg flex items-center gap-2 text-[12px] text-[var(--red)]">
          <AlertTriangle size={14} />
          <span>{blockedTransitionError}</span>
        </div>
      )}

      {formError && (
        <div className="p-3 bg-[var(--red)]/10 border border-[var(--red)]/20 rounded-lg text-[12px] text-[var(--red)]">
          {formError}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !isFormOpen ? (
        <>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">Your Branches</h2>
              <p className="text-[12px] text-[var(--text-muted)] max-w-xl">
                Manage your gym locations, contacts, and hours.
              </p>
            </div>
            {canAddBranch && (
              <Button variant="primary" onClick={openNewForm} className="gap-2">
                <Plus size={14} /> Add Branch
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {branches.map(branch => {
              const isLocked = transitioningBranchIds.has(branch.id);
              return (
                <Card
                  key={branch.id}
                  className={`p-0 hover:border-[var(--accent)]/60 transition-colors overflow-hidden ${
                    isLocked ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {/* Branch Header */}
                  <div className="p-5 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-default)] flex items-center justify-center flex-shrink-0">
                          <Building2 size={18} className="text-[var(--text-secondary)]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-[15px] font-semibold text-[var(--text-primary)] truncate">{branch.name}</h3>
                            {isLocked && (
                              <span className="text-[11px] text-[var(--accent)] font-medium animate-pulse">
                                Transition in progress...
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] mt-0.5 font-mono uppercase tracking-wider">
                            <Hash size={10} /> {branch.gymu_id || branch.internal_code}
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions — stacks below title on mobile */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {canTransitionToDecommissioned || canTransitionToMaintenance ? (
                          <select
                            value={branch.status}
                            disabled={isLocked}
                            onChange={(e) => handleStatusChange(branch, e.target.value)}
                            className="text-[12px] bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded px-2 py-1 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            {canTransitionToMaintenance && <option value="MAINTENANCE">MAINTENANCE</option>}
                            {canTransitionToDecommissioned && <option value="DECOMMISSIONED">DECOMMISSIONED</option>}
                          </select>
                        ) : (
                          <Badge variant={branch.status === 'ACTIVE' ? 'healthy' : 'muted'}>
                            {branch.status}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 border-l border-[var(--border-default)] pl-3">
                          {canEditBranch && (
                            <button
                              onClick={() => openEdit(branch)}
                              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors rounded-md hover:bg-[var(--bg-hover)]"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {canDeleteBranch && (
                            <button
                              onClick={() => setShowDeleteConfirm(branch)}
                              disabled={deletingBranchId === branch.id}
                              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--red)] transition-colors rounded-md hover:bg-[var(--bg-hover)]"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Address & Contact Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mt-3 border-t border-[var(--border-default)]/50">
                      <div className="flex items-start gap-2 text-[12px] text-[var(--text-secondary)]">
                        <MapPin size={14} className="mt-0.5 text-[var(--text-muted)] flex-shrink-0" />
                        <span>
                          {branch.address_line1}, {branch.address_city}, {branch.address_state} {branch.address_pincode}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
                          <Phone size={13} className="text-[var(--text-muted)] flex-shrink-0" />
                          <span>{branch.contact_phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
                          <Mail size={13} className="text-[var(--text-muted)] flex-shrink-0" />
                          <span>{branch.contact_email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subsections — Contacts & Operating Hours */}
                  <div className="border-t border-[var(--border-default)]">
                    <div className="p-5 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Contact size={14} className="text-[var(--text-muted)]" />
                        <h4 className="text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Contacts</h4>
                      </div>
                      <BranchContactsSection branchId={branch.id} />
                    </div>
                  </div>
                  <div className="border-t border-[var(--border-default)]">
                    <div className="p-5 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock size={14} className="text-[var(--text-muted)]" />
                        <h4 className="text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Operating Hours</h4>
                      </div>
                      <BranchOperatingHoursSection branchId={branch.id} />
                    </div>
                  </div>
                </Card>
              );
            })}

            {branches.length === 0 && (
              <div className="py-16 text-center border border-dashed border-[var(--border-default)] rounded-xl bg-[var(--bg-hover)]/50">
                <p className="text-[13px] text-[var(--text-muted)]">No branches added yet. Add your first gym location to get started.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-default)]">
            <div>
              <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
                {editingId ? 'Edit Branch' : 'Add New Branch'}
              </h2>
            </div>
            <button
              onClick={closeForm}
              className="text-[12px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              CANCEL
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Core Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Branch Name</label>
                <input
                  {...register('name')}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                  placeholder="e.g. Titan Downtown"
                />
                {errors.name && <p className="text-[11px] text-[var(--red)]">{errors.name.message}</p>}
                {fieldErrors.name && <p className="text-[11px] text-[var(--red)]">{fieldErrors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Internal Code</label>
                <input
                  {...register('internal_code')}
                  readOnly
                  className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none font-mono uppercase text-[var(--text-muted)] cursor-not-allowed"
                  placeholder="TFD-01"
                />
                {errors.internal_code && <p className="text-[11px] text-[var(--red)]">{errors.internal_code.message}</p>}
                {fieldErrors.internal_code && <p className="text-[11px] text-[var(--red)]">{fieldErrors.internal_code}</p>}
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Operational Status</label>
                <select
                  {...register('status')}
                  disabled
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)] opacity-60 cursor-not-allowed"
                >
                  <option value="ACTIVE">Active & Operational</option>
                  <option value="MAINTENANCE">Under Maintenance</option>
                  <option value="DECOMMISSIONED">Decommissioned</option>
                </select>
              </div>
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Contact Email</label>
                <input
                  {...register('contact_email')}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                  placeholder="manager@branch.com"
                />
                {errors.contact_email && <p className="text-[11px] text-[var(--red)]">{errors.contact_email.message}</p>}
                {fieldErrors.email && <p className="text-[11px] text-[var(--red)]">{fieldErrors.email}</p>}
              </div>
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Contact Phone</label>
                <input
                  {...register('contact_phone')}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                  placeholder="+91 9876543210"
                />
                {errors.contact_phone && <p className="text-[11px] text-[var(--red)]">{errors.contact_phone.message}</p>}
                {fieldErrors.phone && <p className="text-[11px] text-[var(--red)]">{fieldErrors.phone}</p>}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4 pt-2 border-t border-[var(--border-default)]">
              <h3 className="text-[12px] font-semibold text-[var(--text-primary)]">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Address Line 1</label>
                  <input
                    {...register('address_line1')}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                    placeholder="Street address"
                  />
                  {errors.address_line1 && <p className="text-[11px] text-[var(--red)]">{errors.address_line1.message}</p>}
                  {fieldErrors.address_line1 && <p className="text-[11px] text-[var(--red)]">{fieldErrors.address_line1}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">City</label>
                  <input
                    {...register('address_city')}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                  />
                  {errors.address_city && <p className="text-[11px] text-[var(--red)]">{errors.address_city.message}</p>}
                  {fieldErrors.city && <p className="text-[11px] text-[var(--red)]">{fieldErrors.city}</p>}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">State</label>
                    <input
                      {...register('address_state')}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                    />
                    {errors.address_state && <p className="text-[11px] text-[var(--red)]">{errors.address_state.message}</p>}
                    {fieldErrors.state_province && <p className="text-[11px] text-[var(--red)]">{fieldErrors.state_province}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Pincode</label>
                    <input
                      {...register('address_pincode')}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                    />
                    {errors.address_pincode && <p className="text-[11px] text-[var(--red)]">{errors.address_pincode.message}</p>}
                    {fieldErrors.postal_code && <p className="text-[11px] text-[var(--red)]">{fieldErrors.postal_code}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : failedStep ? (
                  <span>Retry {failedStep === 'gym' ? 'Name' : 'Address'}</span>
                ) : editingId ? (
                  <span>Save Changes</span>
                ) : (
                  <span>Add Branch</span>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-6 animate-scale-up border-[var(--border-strong)]">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <AlertTriangle className="text-[var(--red)]" size={20} />
                Delete Branch
              </h3>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                Are you sure? This will soft-delete the branch and cannot be undone from the UI.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
              <Button
                variant="primary"
                className="bg-[var(--red)] hover:bg-[var(--red)]/90 border-transparent text-white"
                onClick={handleDeleteConfirm}
              >
                Confirm Delete
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Maintenance Transition Modal */}
      {showMaintenanceConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-6 animate-scale-up border-[var(--border-strong)]">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Transition to Maintenance</h3>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                Please specify the reason for putting this branch under maintenance.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Reason</label>
              <input
                type="text"
                value={maintenanceReason}
                onChange={(e) => setMaintenanceReason(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                placeholder="e.g. Scheduled renovation, equipment upgrades"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowMaintenanceConfirm(null)}>Cancel</Button>
              <Button
                variant="primary"
                disabled={!maintenanceReason.trim()}
                onClick={() => {
                  executeStatusTransition(
                    showMaintenanceConfirm.branch.id,
                    'MAINTENANCE',
                    maintenanceReason
                  );
                  setShowMaintenanceConfirm(null);
                }}
              >
                Put in Maintenance
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Decommission Transition Modal */}
      {showDecommissionConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-6 animate-scale-up border-[var(--border-strong)]">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Close Branch Permanently</h3>
              <div className="p-3 bg-[var(--red)]/10 border border-[var(--red)]/20 rounded-lg space-y-1">
                <h4 className="text-[12px] font-bold text-[var(--red)] uppercase tracking-wider">Warning: This cannot be undone</h4>
                <ul className="text-[11px] text-[var(--red)] list-disc pl-4 space-y-0.5">
                  <li>All future member bookings will be immediately cancelled.</li>
                  <li>Members registered to this home branch will be notified.</li>
                  <li>Check-in gates and QR access will be blocked instantly.</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Reason for Decommission</label>
                <input
                  type="text"
                  value={decommissionReason}
                  onChange={(e) => setDecommissionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                  placeholder="e.g. Relocating, Lease termination"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Effective Date</label>
                <input
                  type="date"
                  value={decommissionEffectiveDate}
                  onChange={(e) => setDecommissionEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowDecommissionConfirm(null)}>Cancel</Button>
              <Button
                variant="primary"
                className="bg-[var(--red)] hover:bg-[var(--red)]/90 border-transparent text-white"
                disabled={!decommissionReason.trim() || !decommissionEffectiveDate}
                onClick={() => {
                  executeStatusTransition(
                    showDecommissionConfirm.branch.id,
                    'DECOMMISSIONED',
                    `${decommissionReason} (Effective: ${decommissionEffectiveDate})`
                  );
                  setShowDecommissionConfirm(null);
                }}
              >
                Confirm Decommission
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
