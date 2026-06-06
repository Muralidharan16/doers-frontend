import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { MembershipPlan, CreateMembershipPlanPayload, UpdateMembershipPlanPayload, DurationUnit } from '@/features/gym/types/membershipPlans';

const createPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  description: z.string().optional().nullable(),
  price: z.number().min(0, 'Price cannot be negative'),
  duration_value: z.number().int().gt(0, 'Duration must be greater than 0'),
  duration_unit: z.enum(['days', 'months', 'years'] as const),
  max_members: z.number().int().gte(1, 'Must allow at least 1 member'),
  branch_id: z.string().optional().nullable(),
  valid_from: z.string().optional().nullable(),
  valid_until: z.string().optional().nullable(),
}).refine((data) => {
  if (data.valid_from && data.valid_until) {
    return new Date(data.valid_until) > new Date(data.valid_from);
  }
  return true;
}, {
  message: 'Valid until must be after valid from',
  path: ['valid_until'],
});

type PlanFormValues = z.infer<typeof createPlanSchema>;

interface MembershipPlanFormProps {
  plan?: MembershipPlan;
  onSubmit: (data: CreateMembershipPlanPayload | UpdateMembershipPlanPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export const MembershipPlanForm: React.FC<MembershipPlanFormProps> = ({
  plan,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
}) => {
  const isEditing = !!plan;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PlanFormValues>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: plan
      ? {
          name: plan.name,
          description: plan.description,
          price: plan.price,
          duration_value: plan.duration_value,
          duration_unit: plan.duration_unit,
          max_members: plan.max_members,
          branch_id: plan.branch_id || undefined,
          valid_from: plan.valid_from ? new Date(plan.valid_from).toISOString().split('T')[0] : undefined,
          valid_until: plan.valid_until ? new Date(plan.valid_until).toISOString().split('T')[0] : undefined,
        }
      : {
          name: '',
          description: '',
          price: 0,
          duration_value: 1,
          duration_unit: 'months' as DurationUnit,
          max_members: 1,
          branch_id: undefined,
          valid_from: undefined,
          valid_until: undefined,
        },
  });

  const maxMembers = useWatch({ control, name: 'max_members' });

  const handleFormSubmit = async (data: PlanFormValues) => {
    if (isEditing) {
      const updatePayload: UpdateMembershipPlanPayload = {
        name: data.name,
        description: data.description || null,
        price: data.price,
        duration_value: data.duration_value,
        duration_unit: data.duration_unit,
        max_members: data.max_members,
        valid_from: data.valid_from || null,
        valid_until: data.valid_until || null,
      };
      await onSubmit(updatePayload);
    } else {
      const createPayload: CreateMembershipPlanPayload = {
        name: data.name,
        description: data.description || null,
        price: data.price,
        duration_value: data.duration_value,
        duration_unit: data.duration_unit,
        max_members: data.max_members,
        branch_id: data.branch_id || null,
        valid_from: data.valid_from || null,
        valid_until: data.valid_until || null,
      };
      await onSubmit(createPayload);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[var(--border-default)]">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
          {isEditing ? 'Edit Membership Plan' : 'Create Membership Plan'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/20 rounded-md text-[12px] flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-3">
        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
            Plan Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Monthly Access, Couple Offer, Family Pack"
            {...register('name')}
            className={`w-full px-3 py-2 mt-1 bg-[var(--bg-input)] border rounded-md text-[13px] focus:outline-none transition-colors ${
              errors.name
                ? 'border-[var(--red)] focus:border-[var(--red)]'
                : 'border-[var(--border-default)] focus:border-[var(--accent)]'
            }`}
          />
          {errors.name && <p className="text-[11px] text-[var(--red)] mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
            Description
          </label>
          <textarea
            placeholder="Brief description of this plan..."
            {...register('description')}
            className={`w-full px-3 py-2 mt-1 bg-[var(--bg-input)] border rounded-md text-[13px] focus:outline-none transition-colors resize-none ${
              errors.description
                ? 'border-[var(--red)] focus:border-[var(--red)]'
                : 'border-[var(--border-default)] focus:border-[var(--accent)]'
            }`}
            rows={3}
          />
          {errors.description && <p className="text-[11px] text-[var(--red)] mt-1">{errors.description.message}</p>}
        </div>
      </div>

      {/* Pricing & Duration */}
      <div className="space-y-3 pt-2 border-t border-[var(--border-default)]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('price', { valueAsNumber: true })}
              className={`w-full px-3 py-2 mt-1 bg-[var(--bg-input)] border rounded-md text-[13px] focus:outline-none transition-colors ${
                errors.price
                  ? 'border-[var(--red)] focus:border-[var(--red)]'
                  : 'border-[var(--border-default)] focus:border-[var(--accent)]'
              }`}
            />
            {errors.price && <p className="text-[11px] text-[var(--red)] mt-1">{errors.price.message}</p>}
            <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
              Currency: Inherited from organization
            </p>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
              Duration Value *
            </label>
            <input
              type="number"
              min="1"
              placeholder="1"
              {...register('duration_value', { valueAsNumber: true })}
              className={`w-full px-3 py-2 mt-1 bg-[var(--bg-input)] border rounded-md text-[13px] focus:outline-none transition-colors ${
                errors.duration_value
                  ? 'border-[var(--red)] focus:border-[var(--red)]'
                  : 'border-[var(--border-default)] focus:border-[var(--accent)]'
              }`}
            />
            {errors.duration_value && <p className="text-[11px] text-[var(--red)] mt-1">{errors.duration_value.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
            Duration Unit *
          </label>
          <select
            {...register('duration_unit')}
            className={`w-full px-3 py-2 mt-1 bg-[var(--bg-input)] border rounded-md text-[13px] focus:outline-none transition-colors ${
              errors.duration_unit
                ? 'border-[var(--red)] focus:border-[var(--red)]'
                : 'border-[var(--border-default)] focus:border-[var(--accent)]'
            }`}
          >
            <option value="days">Days</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
          {errors.duration_unit && <p className="text-[11px] text-[var(--red)] mt-1">{errors.duration_unit.message}</p>}
        </div>
      </div>

      {/* Members */}
      <div className="space-y-3 pt-2 border-t border-[var(--border-default)]">
        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
            Max Members *
          </label>
          <input
            type="number"
            min="1"
            placeholder="1"
            {...register('max_members', { valueAsNumber: true })}
            className={`w-full px-3 py-2 mt-1 bg-[var(--bg-input)] border rounded-md text-[13px] focus:outline-none transition-colors ${
              errors.max_members
                ? 'border-[var(--red)] focus:border-[var(--red)]'
                : 'border-[var(--border-default)] focus:border-[var(--accent)]'
            }`}
          />
          {errors.max_members && <p className="text-[11px] text-[var(--red)] mt-1">{errors.max_members.message}</p>}
          <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
            {maxMembers === 1
              ? '✓ Individual-style plan'
              : maxMembers === 2
              ? '✓ Couple-style plan'
              : `✓ Family/group-style plan (${maxMembers} members)`}
          </p>
        </div>
      </div>

      {/* Branch & Validity */}
      <div className="space-y-3 pt-2 border-t border-[var(--border-default)]">
        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
            Branch (Optional)
          </label>
          <input
            type="text"
            placeholder="Leave empty for all branches"
            {...register('branch_id')}
            className={`w-full px-3 py-2 mt-1 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-md text-[13px] focus:outline-none focus:border-[var(--accent)] transition-colors ${
              errors.branch_id ? 'border-[var(--red)]' : ''
            }`}
            disabled
          />
          <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
            Branch selection will be available in P4. Currently applies to all branches.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
              Valid From (Optional)
            </label>
            <input
              type="date"
              {...register('valid_from')}
              className={`w-full px-3 py-2 mt-1 bg-[var(--bg-input)] border rounded-md text-[13px] focus:outline-none transition-colors ${
                errors.valid_from
                  ? 'border-[var(--red)] focus:border-[var(--red)]'
                  : 'border-[var(--border-default)] focus:border-[var(--accent)]'
              }`}
            />
            {errors.valid_from && <p className="text-[11px] text-[var(--red)] mt-1">{errors.valid_from.message}</p>}
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
              Valid Until (Optional)
            </label>
            <input
              type="date"
              {...register('valid_until')}
              className={`w-full px-3 py-2 mt-1 bg-[var(--bg-input)] border rounded-md text-[13px] focus:outline-none transition-colors ${
                errors.valid_until
                  ? 'border-[var(--red)] focus:border-[var(--red)]'
                  : 'border-[var(--border-default)] focus:border-[var(--accent)]'
              }`}
            />
            {errors.valid_until && <p className="text-[11px] text-[var(--red)] mt-1">{errors.valid_until.message}</p>}
          </div>
        </div>
      </div>

      {/* Read-only info for edit */}
      {isEditing && plan && (
        <div className="p-3 bg-[var(--bg-hover)]/50 border border-[var(--border-default)] rounded-md text-[12px] text-[var(--text-muted)] space-y-1">
          <p>
            <strong>Plan Code:</strong> {plan.plan_code} (auto-generated, not editable)
          </p>
          <p>
            <strong>Currency:</strong> {plan.currency} (inherited from organization, not editable)
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-[var(--border-default)]">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );
};
