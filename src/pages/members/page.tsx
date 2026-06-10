import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AlertTriangle, Edit2, Plus, Search, Trash2, UserMinus, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
import { getAuthTokenPayload } from '@/shared/services/api/client';

type StatusFilter = 'all' | MemberStatus;
type FormMode = 'create' | 'edit';

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
  home_branch_id: nullableValue(form.home_branch_id),
  email: nullableValue(form.email),
  date_of_birth: nullableValue(form.date_of_birth),
  gender: nullableValue(form.gender),
  blood_group: nullableValue(form.blood_group),
  emergency_contact_name: nullableValue(form.emergency_contact_name),
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
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberFormState>(emptyFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const openCreateForm = () => {
    setFormMode('create');
    setEditingMember(null);
    setForm(emptyFormState);
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
    if (!form.phone.trim()) return 'Phone number is required.';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return 'Enter a valid email address.';
    }
    return null;
  };

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

  const handleDelete = async (member: Member) => {
    const confirmed = window.confirm(`Archive ${member.name}? They will disappear from the default active list.`);
    if (!confirmed) return;

    setSuccessMessage(null);
    try {
      await deleteMember.mutateAsync(member.id);
      setSuccessMessage('Member archived successfully.');
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Unable to archive member. Please try again.'));
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
                          {member.email || 'No email'} · UID {member.member_uid}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-medium">{member.phone}</td>
                    <td className="py-3.5 px-6 text-[var(--text-secondary)]">
                      {member.home_branch_id || 'No home branch'}
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
                          onClick={() => handleDelete(member)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--red)] rounded-md transition-colors"
                          title="Archive member"
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
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Member UID</span>
                    <span className="font-medium text-[var(--text-primary)] break-all">{member.member_uid}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Home Branch</span>
                    <span className="font-medium text-[var(--text-primary)] break-all">{member.home_branch_id || 'No home branch'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Joined</span>
                    <span className="font-medium text-[var(--text-primary)]">{formatDate(member.created_at)}</span>
                  </div>
                </div>

                {(member.blood_group || member.emergency_contact_name || member.notes) && (
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {member.blood_group && <span>Blood group {member.blood_group}. </span>}
                    {member.emergency_contact_name && <span>Emergency: {member.emergency_contact_name}. </span>}
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
                    onClick={() => handleDelete(member)}
                    className="text-[12px] p-2 hover:text-[var(--red)]"
                  >
                    <Trash2 size={14} />
                    Archive
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

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
                />
                <Input
                  label="Home branch ID"
                  value={form.home_branch_id}
                  onChange={(event) => setForm((current) => ({ ...current, home_branch_id: event.target.value }))}
                  placeholder="Optional branch UUID"
                />
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
                <Input
                  label="Blood group"
                  value={form.blood_group}
                  onChange={(event) => setForm((current) => ({ ...current, blood_group: event.target.value }))}
                />
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
                  label="Emergency contact"
                  value={form.emergency_contact_name}
                  onChange={(event) => setForm((current) => ({ ...current, emergency_contact_name: event.target.value }))}
                />
                <Input
                  label="Emergency phone"
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
