import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import { AlertTriangle, Edit2, Plus, Search, Trash2, UserMinus, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  useCreateMember,
  useDeleteMember,
  useMembers,
  useUpdateMember,
} from '@/features/members';
import type {
  CreateMemberPayload,
  Member,
  MemberStatus,
  UpdateMemberPayload,
} from '@/features/members';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { fetchBranches, getAuthTokenPayload } from '@/shared/services/api/client';

type StatusFilter = 'all' | MemberStatus;
type FormMode = 'create' | 'edit';

interface BranchOption {
  id: string;
  name: string;
  city?: string | null;
}

interface ApiBranch {
  id?: unknown;
  name?: unknown;
  internal_code?: unknown;
  address_city?: unknown;
}

interface MemberFormState {
  name: string;
  phone: string;
  email: string;
  home_branch_id: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  address: string;
  notes: string;
  status: MemberStatus;
}

const emptyFormState: MemberFormState = {
  name: '',
  phone: '',
  email: '',
  home_branch_id: '',
  gender: '',
  date_of_birth: '',
  blood_group: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  address: '',
  notes: '',
  status: 'active',
};

const memberStatuses: MemberStatus[] = ['active', 'inactive', 'frozen', 'expired', 'blocked'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const getCurrentOrgId = (): string | undefined => {
  const payload = getAuthTokenPayload();
  return typeof payload?.org_id === 'string' ? payload.org_id : undefined;
};

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'MB';

const formatMemberNumber = (member: Member): string =>
  Number.isFinite(member.member_number) ? String(member.member_number) : 'Not assigned';

const getMemberRemovalIdentifier = (member: Member): string => {
  const name = member.name.trim();
  if (name) return name;

  const email = member.email?.trim();
  if (email) return email;

  const displayCode = member.member_display_code?.trim();
  if (displayCode) return displayCode;

  if (Number.isFinite(member.member_number)) return `Member No. ${member.member_number}`;

  const phone = member.phone.trim();
  if (phone) return phone;

  return 'this member';
};

const memberRemovalFallbackError = 'The member could not be removed from active members. Please try again.';

const getMemberRemovalErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    const response = 'response' in error ? error.response : undefined;
    if (response && typeof response === 'object' && 'data' in response) {
      const data = response.data;
      if (data && typeof data === 'object' && 'detail' in data && typeof data.detail === 'string') {
        const detail = data.detail.trim();
        if (detail) return detail;
      }
    }

    if ('message' in error && typeof error.message === 'string') {
      const message = error.message.trim();
      if (message) return message;
    }
  }

  return memberRemovalFallbackError;
};

const titleCase = (value: string): string =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'Not available';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusBadgeVariant = (status: MemberStatus): 'healthy' | 'warning' | 'muted' => {
  if (status === 'active') return 'healthy';
  if (status === 'blocked' || status === 'expired') return 'warning';
  return 'muted';
};

const getBranchLabel = (
  branchId: string | null | undefined,
  branches: BranchOption[]
): string => {
  if (!branchId) return 'No home branch';
  return branches.find((branch) => branch.id === branchId)?.name ?? branchId;
};

const normalizeBranchOption = (branch: ApiBranch): BranchOption | null => {
  if (typeof branch.id !== 'string' || !branch.id) return null;
  const name = typeof branch.name === 'string' && branch.name.trim()
    ? branch.name.trim()
    : typeof branch.internal_code === 'string' && branch.internal_code.trim()
      ? branch.internal_code.trim()
      : 'Unnamed branch';

  return {
    id: branch.id,
    name,
    city: typeof branch.address_city === 'string' ? branch.address_city : null,
  };
};

const normalizeIndianPhone = (value: string): string | null => {
  const cleaned = value.trim().replace(/[\s\-()]/g, '').replace(/^\+?91/, '').replace(/^0+/, '');
  return /^[6-9]\d{9}$/.test(cleaned) ? cleaned : null;
};

const getAge = (dateString: string): number | null => {
  const dob = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
};

const getMemberFormState = (member?: Member): MemberFormState => {
  if (!member) return emptyFormState;
  return {
    name: member.name,
    phone: member.phone,
    email: member.email ?? '',
    home_branch_id: member.home_branch_id ?? '',
    gender: member.gender ?? '',
    date_of_birth: member.date_of_birth ?? '',
    blood_group: member.blood_group ?? '',
    emergency_contact_name: member.emergency_contact_name ?? '',
    emergency_contact_phone: member.emergency_contact_phone ?? '',
    address: member.address ?? '',
    notes: member.notes ?? '',
    status: member.status,
  };
};

const optionalValue = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const nullableValue = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const buildCreatePayload = (form: MemberFormState): CreateMemberPayload => ({
  name: form.name.trim(),
  phone: form.phone.trim(),
  home_branch_id: form.home_branch_id.trim(),
  email: nullableValue(form.email),
  date_of_birth: form.date_of_birth,
  gender: nullableValue(form.gender),
  blood_group: nullableValue(form.blood_group),
  emergency_contact_name: form.emergency_contact_name.trim(),
  emergency_contact_phone: nullableValue(form.emergency_contact_phone),
  address: nullableValue(form.address),
  notes: nullableValue(form.notes),
});

const buildUpdatePayload = (form: MemberFormState): UpdateMemberPayload => ({
  name: optionalValue(form.name),
  phone: optionalValue(form.phone),
  home_branch_id: nullableValue(form.home_branch_id),
  email: nullableValue(form.email),
  date_of_birth: nullableValue(form.date_of_birth),
  gender: nullableValue(form.gender),
  blood_group: nullableValue(form.blood_group),
  emergency_contact_name: nullableValue(form.emergency_contact_name),
  emergency_contact_phone: nullableValue(form.emergency_contact_phone),
  address: nullableValue(form.address),
  notes: nullableValue(form.notes),
  status: form.status,
});

export default function MembersPage() {
  const orgId = getCurrentOrgId();
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(Boolean(orgId));
  const [branchesError, setBranchesError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberFormState>(emptyFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedMemberForRemoval, setSelectedMemberForRemoval] = useState<Member | null>(null);
  const [removalDialogError, setRemovalDialogError] = useState<string | null>(null);
  const removalTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!orgId) return;

    let isMounted = true;

    fetchBranches()
      .then((response) => {
        if (!isMounted) return;
        const rawBranches: ApiBranch[] = Array.isArray(response.data?.data) ? response.data.data : [];
        setBranches(rawBranches.map(normalizeBranchOption).filter((branch): branch is BranchOption => Boolean(branch)));
      })
      .catch((error) => {
        if (!isMounted) return;
        setBranches([]);
        setBranchesError(getApiErrorMessage(error, 'Unable to load branches.'));
      })
      .finally(() => {
        if (isMounted) setBranchesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orgId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const listParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      is_active: true,
      page: 1,
      limit: 50,
    }),
    [debouncedSearch, statusFilter]
  );

  const membersQuery = useMembers(orgId, listParams);
  const createMember = useCreateMember(orgId);
  const updateMember = useUpdateMember(orgId);
  const deleteMember = useDeleteMember(orgId);

  const members = membersQuery.data?.data ?? [];
  const totalMembers = membersQuery.data?.total ?? 0;
  const activeMembers = members.filter((member) => member.status === 'active').length;
  const inactiveMembers = members.filter((member) => member.status !== 'active').length;
  const isMemberRemovalPending = deleteMember.isPending;
  const selectedMemberRemovalIdentifier = selectedMemberForRemoval
    ? getMemberRemovalIdentifier(selectedMemberForRemoval)
    : 'this member';

  const openCreateForm = () => {
    setFormMode('create');
    setEditingMember(null);
    setForm({
      ...emptyFormState,
      home_branch_id: '',
    });
    setFormError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  };

  const openEditForm = (member: Member) => {
    setFormMode('edit');
    setEditingMember(member);
    setForm(getMemberFormState(member));
    setFormError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (createMember.isPending || updateMember.isPending) return;
    setIsFormOpen(false);
    setEditingMember(null);
    setForm(emptyFormState);
    setFormError(null);
  };

  const validateForm = (): string | null => {
    if (!form.name.trim()) return 'Member name is required.';
    if (form.name.trim().length < 2) return 'Member name must be at least 2 characters.';
    if (!form.phone.trim()) return 'Phone number is required.';
    if (!normalizeIndianPhone(form.phone)) return 'Enter a valid 10-digit Indian mobile number.';
    if (!form.date_of_birth) return 'Date of birth is required.';
    const age = getAge(form.date_of_birth);
    if (age === null) return 'Enter a valid date of birth.';
    if (age < 3) return 'Member must be at least 3 years old.';
    if (age > 120) return 'Member age cannot exceed 120 years.';
    if (!form.emergency_contact_name.trim()) return 'Emergency Contact No. 1 is required.';
    if (!normalizeIndianPhone(form.emergency_contact_name)) {
      return 'Enter a valid Emergency Contact No. 1 mobile number.';
    }
    if (form.emergency_contact_phone.trim() && !normalizeIndianPhone(form.emergency_contact_phone)) {
      return 'Enter a valid Emergency Contact No. 2 mobile number.';
    }
    if (!form.home_branch_id) return 'Home branch is required.';
    if (!branches.some((branch) => branch.id === form.home_branch_id)) return 'Select a valid home branch.';
    if (form.blood_group && !bloodGroups.includes(form.blood_group)) return 'Select a valid blood group.';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return 'Enter a valid email address.';
    }
    return null;
  };

  const branchSelectHelp = branchesError
    ? branchesError
    : branchesLoading
      ? 'Loading branches...'
      : branches.length === 0
        ? 'No active branches available.'
        : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      if (formMode === 'create') {
        await createMember.mutateAsync(buildCreatePayload(form));
        setSuccessMessage('Member created successfully.');
      } else if (editingMember) {
        await updateMember.mutateAsync({
          memberId: editingMember.id,
          payload: buildUpdatePayload(form),
        });
        setSuccessMessage('Member updated successfully.');
      }
      closeForm();
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Unable to save member. Please try again.'));
    }
  };

  const openMemberRemovalDialog = (
    member: Member,
    event: MouseEvent<HTMLElement>
  ) => {
    if (isMemberRemovalPending) return;
    removalTriggerRef.current = event.currentTarget;
    setSelectedMemberForRemoval(member);
    setRemovalDialogError(null);
    setSuccessMessage(null);
  };

  const closeMemberRemovalDialog = () => {
    if (isMemberRemovalPending) return;
    setSelectedMemberForRemoval(null);
    setRemovalDialogError(null);
  };

  const confirmMemberRemoval = async () => {
    if (!selectedMemberForRemoval || isMemberRemovalPending) return;

    setRemovalDialogError(null);
    setSuccessMessage(null);
    try {
      await deleteMember.mutateAsync(selectedMemberForRemoval.id);
      setSuccessMessage('Member removed from active members.');
      setSelectedMemberForRemoval(null);
    } catch (error) {
      setRemovalDialogError(getMemberRemovalErrorMessage(error));
      throw error;
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
  };

  if (!orgId) {
    return (
      <div className="space-y-8 animate-fade-in">
        <PageHeader title="Members Registry" category="Management" />
        <Card className="flex items-center gap-3 text-[13px] text-[var(--red)]">
          <AlertTriangle size={18} />
          <span>Organization context not available. Please sign in again.</span>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Members Registry"
        category="Management"
        action={
          <Button variant="primary" onClick={openCreateForm} className="gap-2">
            <Plus size={14} />
            <span>Add Member</span>
          </Button>
        }
      />

      {successMessage && (
        <div className="p-3 rounded-md border border-[var(--green)]/30 text-[13px] text-[var(--green)] bg-[var(--green)]/10">
          {successMessage}
        </div>
      )}

      {formError && !isFormOpen && (
        <div className="p-3 rounded-md border border-[var(--red)]/30 text-[13px] text-[var(--red)] bg-[var(--red)]/10">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Total Members</div>
          <div className="text-[32px] font-light text-[var(--text-primary)] mt-2 leading-none">{totalMembers}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Current filtered result</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Active</div>
          <div className="text-[32px] font-light text-[var(--green)] mt-2 leading-none">{activeMembers}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Visible on this page</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Other Status</div>
          <div className="text-[32px] font-light text-[var(--text-secondary)] mt-2 leading-none">{inactiveMembers}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Inactive, frozen, expired, blocked</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Loaded</div>
          <div className="text-[32px] font-light text-[var(--accent)] mt-2 leading-none">{members.length}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Records on screen</div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={statusFilter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          {memberStatuses.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'primary' : 'secondary'}
              onClick={() => setStatusFilter(status)}
            >
              {titleCase(status)}
            </Button>
          ))}
        </div>
      </div>

      {membersQuery.isLoading ? (
        <Card className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </Card>
      ) : membersQuery.error ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <AlertTriangle size={36} className="text-[var(--red)]" />
          <div className="space-y-1">
            <h3 className="text-[14px] font-semibold text-[var(--text-secondary)]">Unable to load members</h3>
            <p className="text-[12px] text-[var(--text-muted)] max-w-sm">
              {getApiErrorMessage(membersQuery.error, 'The member registry could not be loaded.')}
            </p>
          </div>
          <Button variant="secondary" onClick={() => membersQuery.refetch()}>
            Try Again
          </Button>
        </Card>
      ) : members.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <UserMinus size={40} className="text-[var(--text-muted)] opacity-60" />
          <div className="space-y-1">
            <h3 className="text-[14px] font-semibold text-[var(--text-secondary)]">No members found</h3>
            <p className="text-[12px] text-[var(--text-muted)] max-w-xs">
              No member records matched the current search and status filters.
            </p>
          </div>
          <Button variant="primary" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        <>
          <div className="hidden lg:block overflow-hidden border border-[var(--border-default)] rounded-[var(--radius-lg)]">
            <table className="w-full text-left border-collapse bg-[var(--bg-surface)]">
              <thead>
                <tr className="bg-[var(--bg-page)] text-[10px] tracking-[0.1em] text-[var(--text-muted)] uppercase font-semibold border-b border-[var(--border-default)]">
                  <th className="py-4 px-6">Member</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Home Branch</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6">Joined</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)] text-[13px] text-[var(--text-primary)]">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-[var(--bg-hover)] transition-colors duration-150">
                    <td className="py-3.5 px-6 flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-[12px]"
                        style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}
                      >
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-[11px] text-[var(--text-muted)] font-normal">
                          {member.email || 'No email'} · Member No. {formatMemberNumber(member)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-medium">{member.phone}</td>
                    <td className="py-3.5 px-6 text-[var(--text-secondary)]">
                      {getBranchLabel(member.home_branch_id, branches)}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <Badge variant={getStatusBadgeVariant(member.status)}>
                        {titleCase(member.status)}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-[var(--text-secondary)]">{formatDate(member.created_at)}</td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditForm(member)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-md transition-colors"
                          title="Edit member"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={(event) => openMemberRemovalDialog(member, event)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--red)] rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          title="Remove from active members"
                          disabled={isMemberRemovalPending}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <Card key={member.id} className="flex flex-col justify-between space-y-4 hover:border-[var(--accent)] transition-all duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[13px] shrink-0"
                      style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}
                    >
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[14px] text-[var(--text-primary)] truncate">{member.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">{member.email || member.phone}</div>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(member.status)}>
                    {titleCase(member.status)}
                  </Badge>
                </div>

                <div className="pt-2 border-t border-[var(--border-default)] grid grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Phone</span>
                    <span className="font-medium text-[var(--text-primary)]">{member.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Member No.</span>
                    <span className="font-medium text-[var(--text-primary)] break-all">{formatMemberNumber(member)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Home Branch</span>
                    <span className="font-medium text-[var(--text-primary)] break-all">
                      {getBranchLabel(member.home_branch_id, branches)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Joined</span>
                    <span className="font-medium text-[var(--text-primary)]">{formatDate(member.created_at)}</span>
                  </div>
                </div>

                {(member.blood_group || member.emergency_contact_name || member.notes) && (
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {member.blood_group && <span>Blood group {member.blood_group}. </span>}
                    {member.emergency_contact_name && <span>Emergency Contact No. 1: {member.emergency_contact_name}. </span>}
                    {member.notes && <span>Notes added.</span>}
                  </div>
                )}

                <div className="pt-3 border-t border-[var(--border-default)] flex justify-between items-center">
                  <Button
                    variant="ghost"
                    onClick={() => openEditForm(member)}
                    className="text-[12px] p-2 hover:text-[var(--accent)]"
                  >
                    <Edit2 size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={(event) => openMemberRemovalDialog(member, event)}
                    className="text-[12px] p-2 hover:text-[var(--red)] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isMemberRemovalPending}
                  >
                    <Trash2 size={14} />
                    Remove from active members
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <ConfirmationDialog
        open={Boolean(selectedMemberForRemoval)}
        title="Remove member from active list"
        description={`Remove “${selectedMemberRemovalIdentifier}” from active members? They will no longer appear in the default active-member list.`}
        confirmLabel="Remove from active members"
        pendingLabel="Removing…"
        cancelLabel="Keep active"
        destructive
        pending={isMemberRemovalPending}
        error={removalDialogError}
        triggerRef={removalTriggerRef}
        onCancel={closeMemberRemovalDialog}
        onConfirm={confirmMemberRemoval}
      />

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Member Profile
                </div>
                <h2 className="text-[18px] font-medium text-[var(--text-primary)]">
                  {formMode === 'create' ? 'Add member' : 'Edit member'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Close member form"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-md border border-[var(--red)]/30 text-[13px] text-[var(--red)] bg-[var(--red)]/10">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
                <Input
                  label="Phone"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
                <Input
                  label="Date of birth"
                  type="date"
                  value={form.date_of_birth}
                  onChange={(event) => setForm((current) => ({ ...current, date_of_birth: event.target.value }))}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] tracking-[0.08em] text-[var(--text-muted)] uppercase font-semibold">
                    Home Branch
                  </label>
                  <select
                    value={form.home_branch_id}
                    onChange={(event) => setForm((current) => ({ ...current, home_branch_id: event.target.value }))}
                    required
                    disabled={branchesLoading || branches.length === 0}
                    className="bg-[var(--bg-input)] border border-[var(--border-default)] rounded-[var(--radius-md)] px-3 py-2.5 text-[16px] md:text-[14px] text-[var(--text-primary)] disabled:opacity-60"
                  >
                    <option value="">{branchesLoading ? 'Loading branches...' : 'Select home branch'}</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.city ? `${branch.name} - ${branch.city}` : branch.name}
                      </option>
                    ))}
                  </select>
                  {branchSelectHelp && (
                    <span className="text-[11px] text-[var(--text-muted)]">{branchSelectHelp}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] tracking-[0.08em] text-[var(--text-muted)] uppercase font-semibold">
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
                    className="bg-[var(--bg-input)] border border-[var(--border-default)] rounded-[var(--radius-md)] px-3 py-2.5 text-[14px] text-[var(--text-primary)]"
                  >
                    <option value="">Not set</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] tracking-[0.08em] text-[var(--text-muted)] uppercase font-semibold">
                    Blood Group
                  </label>
                  <select
                    value={form.blood_group}
                    onChange={(event) => setForm((current) => ({ ...current, blood_group: event.target.value }))}
                    className="bg-[var(--bg-input)] border border-[var(--border-default)] rounded-[var(--radius-md)] px-3 py-2.5 text-[16px] md:text-[14px] text-[var(--text-primary)]"
                  >
                    <option value="">Not set</option>
                    {bloodGroups.map((bloodGroup) => (
                      <option key={bloodGroup} value={bloodGroup}>
                        {bloodGroup}
                      </option>
                    ))}
                  </select>
                </div>
                {formMode === 'edit' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] tracking-[0.08em] text-[var(--text-muted)] uppercase font-semibold">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, status: event.target.value as MemberStatus }))
                      }
                      className="bg-[var(--bg-input)] border border-[var(--border-default)] rounded-[var(--radius-md)] px-3 py-2.5 text-[14px] text-[var(--text-primary)]"
                    >
                      {memberStatuses.map((status) => (
                        <option key={status} value={status}>
                          {titleCase(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <Input
                  label="Emergency Contact No. 1"
                  value={form.emergency_contact_name}
                  onChange={(event) => setForm((current) => ({ ...current, emergency_contact_name: event.target.value }))}
                  required
                />
                <Input
                  label="Emergency Contact No. 2"
                  value={form.emergency_contact_phone}
                  onChange={(event) => setForm((current) => ({ ...current, emergency_contact_phone: event.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] tracking-[0.08em] text-[var(--text-muted)] uppercase font-semibold">
                    Address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                    rows={3}
                    className="bg-[var(--bg-input)] border border-[var(--border-default)] rounded-[var(--radius-md)] px-3 py-2.5 text-[14px] text-[var(--text-primary)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] tracking-[0.08em] text-[var(--text-muted)] uppercase font-semibold">
                    Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                    rows={3}
                    className="bg-[var(--bg-input)] border border-[var(--border-default)] rounded-[var(--radius-md)] px-3 py-2.5 text-[14px] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMember.isPending || updateMember.isPending}>
                  {createMember.isPending || updateMember.isPending ? 'Saving...' : 'Save member'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
