import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Plus, Search, MoreHorizontal, UserMinus } from 'lucide-react';

const MOCK_MEMBERS = [
  { id: '1', name: 'Devon Lane', email: 'devon@lane.com', plan: 'Studio Gold Annual', status: 'healthy', joinDate: '12 Jan 2026', checkins: 42, initials: 'DL' },
  { id: '2', name: 'Kathryn Murphy', email: 'kathryn@murphy.com', plan: 'Studio Premium Monthly', status: 'healthy', joinDate: '04 Feb 2026', checkins: 28, initials: 'KM' },
  { id: '3', name: 'Albert Flores', email: 'albert@flores.com', plan: 'Studio Gold Annual', status: 'muted', joinDate: '19 Nov 2025', checkins: 89, initials: 'AF' },
  { id: '4', name: 'Eleanor Pena', email: 'eleanor@pena.com', plan: 'Studio Foundation', status: 'healthy', joinDate: '08 Mar 2026', checkins: 14, initials: 'EP' },
  { id: '5', name: 'Jenny Wilson', email: 'jenny@wilson.com', plan: 'Studio Premium Monthly', status: 'healthy', joinDate: '22 Feb 2026', checkins: 19, initials: 'JW' },
  { id: '6', name: 'Guy Hawkins', email: 'guy@hawkins.com', plan: 'Studio Gold Annual', status: 'healthy', joinDate: '10 Jan 2026', checkins: 35, initials: 'GH' },
  { id: '7', name: 'Theresa Webb', email: 'theresa@webb.com', plan: 'Studio Foundation', status: 'muted', joinDate: '14 Oct 2025', checkins: 50, initials: 'TW' },
  { id: '8', name: 'Savannah Nguyen', email: 'savannah@nguyen.com', plan: 'Studio Premium Monthly', status: 'healthy', joinDate: '01 Mar 2026', checkins: 11, initials: 'SN' },
];

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [members, setMembers] = useState(MOCK_MEMBERS);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) || 
                          member.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddMember = () => {
    const name = prompt("Enter member full name:");
    if (!name) return;
    const email = prompt("Enter member email address:");
    if (!email) return;
    
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newMember = {
      id: String(members.length + 1),
      name,
      email,
      plan: 'Studio Premium Monthly',
      status: 'healthy',
      joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      checkins: 0,
      initials,
    };
    setMembers([newMember, ...members]);
  };

  const handleToggleStatus = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, status: m.status === 'healthy' ? 'muted' : 'healthy' } : m));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Members Registry" 
        category="Management" 
        action={
          <Button variant="primary" onClick={handleAddMember} className="gap-2">
            <Plus size={14} />
            <span>Add Member</span>
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Total Members</div>
          <div className="text-[32px] font-light text-[var(--text-primary)] mt-2 leading-none">{members.length}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Active & Inactive</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Active Members</div>
          <div className="text-[32px] font-light text-[var(--green)] mt-2 leading-none">
            {members.filter(m => m.status === 'healthy').length}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Operational Status</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Inactive</div>
          <div className="text-[32px] font-light text-[var(--text-secondary)] mt-2 leading-none">
            {members.filter(m => m.status === 'muted').length}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Subscription Suspended</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">New This Month</div>
          <div className="text-[32px] font-light text-[var(--accent)] mt-2 leading-none">3</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Registries in May</div>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="relative flex-1">
          <Input 
            placeholder="Search members..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={statusFilter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'healthy' ? 'primary' : 'secondary'}
            onClick={() => setStatusFilter('healthy')}
          >
            Active
          </Button>
          <Button 
            variant={statusFilter === 'muted' ? 'primary' : 'secondary'}
            onClick={() => setStatusFilter('muted')}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Members Grid / Table */}
      {filteredMembers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <UserMinus size={40} className="text-[var(--text-muted)] opacity-60 animate-pulse" />
          <div className="space-y-1">
            <h3 className="text-[14px] font-semibold text-[var(--text-secondary)]">No members found</h3>
            <p className="text-[12px] text-[var(--text-muted)] max-w-xs">
              No registry records matched your search parameters.
            </p>
          </div>
          <Button variant="primary" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        <>
          {/* Desktop Table View (lg+) */}
          <div className="hidden lg:block overflow-hidden border border-[var(--border-default)] rounded-[var(--radius-lg)]">
            <table className="w-full text-left border-collapse bg-[var(--bg-surface)]">
              <thead>
                <tr className="bg-[var(--bg-page)] text-[10px] tracking-[0.1em] text-[var(--text-muted)] uppercase font-semibold border-b border-[var(--border-default)]">
                  <th className="py-4 px-6">Avatar & Name</th>
                  <th className="py-4 px-6">Plan</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6">Join Date</th>
                  <th className="py-4 px-6 text-center">Check-ins</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)] text-[13px] text-[var(--text-primary)]">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[var(--bg-hover)] transition-colors duration-150">
                    <td className="py-3.5 px-6 flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-[12px]"
                        style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}
                      >
                        {member.initials}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-[11px] text-[var(--text-muted)] font-normal">{member.email}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-medium">{member.plan}</td>
                    <td className="py-3.5 px-6 text-center">
                      <Badge variant={member.status === 'healthy' ? 'healthy' : 'muted'}>
                        {member.status === 'healthy' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-[var(--text-secondary)]">{member.joinDate}</td>
                    <td className="py-3.5 px-6 text-center font-medium font-mono">{member.checkins}</td>
                    <td className="py-3.5 px-6 text-right relative">
                      <button 
                        onClick={() => handleToggleStatus(member.id)}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-md transition-colors"
                        title="Toggle Member Status"
                        style={{ minWidth: '44px', minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet & Mobile Card List View (lg- hidden) */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="flex flex-col justify-between space-y-4 hover:border-[var(--accent)] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[13px]"
                      style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-[14px] text-[var(--text-primary)]">{member.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{member.email}</div>
                    </div>
                  </div>
                  <Badge variant={member.status === 'healthy' ? 'healthy' : 'muted'}>
                    {member.status === 'healthy' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="pt-2 border-t border-[var(--border-default)] grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Plan</span>
                    <span className="font-medium text-[var(--text-primary)]">{member.plan}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Check-ins</span>
                    <span className="font-medium font-mono text-[var(--text-primary)]">{member.checkins}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-default)] flex justify-between items-center">
                  <span className="text-[11px] text-[var(--text-muted)]">Joined {member.joinDate}</span>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleToggleStatus(member.id)}
                    className="text-[12px] p-2 hover:text-[var(--accent)]"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    Toggle Status
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
