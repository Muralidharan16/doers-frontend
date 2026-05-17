import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Plus, Check, MoreHorizontal, AlertCircle } from 'lucide-react';

const MOCK_PLANS = [
  { 
    id: '1', 
    name: 'Studio Gold Annual', 
    price: '₹12,500', 
    period: 'year',
    activeSubscribers: 48,
    features: ['Unlimited open gym access', '12 curated coach sessions/yr', 'Priority studio reservations', 'Locker & towel privileges'],
    isActive: true 
  },
  { 
    id: '2', 
    name: 'Studio Premium Monthly', 
    price: '₹1,800', 
    period: 'month',
    activeSubscribers: 114,
    features: ['Full studio access', '2 coach check-ins/mo', 'Standard reservation window', 'Digital progress metrics'],
    isActive: false 
  }
];

const MOCK_SUBSCRIBERS = [
  { id: '1', member: 'Devon Lane', plan: 'Studio Gold Annual', status: 'active', amount: '₹12,500', nextBilling: '12 Jan 2027' },
  { id: '2', member: 'Kathryn Murphy', plan: 'Studio Premium Monthly', status: 'active', amount: '₹1,800', nextBilling: '04 Jun 2026' },
  { id: '3', member: 'Albert Flores', plan: 'Studio Gold Annual', status: 'paused', amount: '₹12,500', nextBilling: '19 Jun 2026' },
  { id: '4', member: 'Eleanor Pena', plan: 'Studio Premium Monthly', status: 'cancelled', amount: '₹1,800', nextBilling: 'Ended' },
  { id: '5', member: 'Jenny Wilson', plan: 'Studio Premium Monthly', status: 'trial', amount: '₹0', nextBilling: '22 May 2026' },
];

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState(MOCK_PLANS);
  const subscribers = MOCK_SUBSCRIBERS;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="healthy">Active</Badge>;
      case 'paused':
        return <Badge variant="gold">Paused</Badge>;
      case 'cancelled':
        return <Badge variant="warning">Cancelled</Badge>;
      case 'trial':
        return (
          <div 
            style={{ 
              border: '0.5px solid #4A90E2', 
              color: '#4A90E2',
              fontSize: '10px',
              letterSpacing: '0.1em',
              padding: '3px 10px',
              borderRadius: '3px',
              textTransform: 'uppercase',
              fontWeight: 600,
              display: 'inline-flex'
            }}
          >
            Trial
          </div>
        );
      default:
        return <Badge variant="muted">Inactive</Badge>;
    }
  };

  const handleCreatePlan = () => {
    const name = prompt("Enter new plan title:");
    if (!name) return;
    const price = prompt("Enter plan price (e.g. ₹2,500):");
    if (!price) return;
    
    const newPlan = {
      id: String(plans.length + 1),
      name,
      price,
      period: 'month',
      activeSubscribers: 0,
      features: ['Standard entry permissions', 'Platform metrics tracking'],
      isActive: false
    };
    setPlans([...plans, newPlan]);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Plans & Subscriptions" 
        category="Finance" 
        action={
          <Button variant="primary" onClick={handleCreatePlan} className="gap-2">
            <Plus size={14} />
            <span>New Plan</span>
          </Button>
        }
      />

      {/* Renewal alerts banner */}
      <div 
        style={{ 
          backgroundColor: 'var(--accent-subtle)', 
          borderLeft: '3px solid var(--accent)', 
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          padding: '12px 18px',
        }}
        className="flex items-center gap-3"
      >
        <AlertCircle size={16} className="text-[var(--accent)]" />
        <span className="text-[13px] font-medium text-[var(--accent-text)]">
          4 subscriptions renewing in the next 7 days. Ensure payment gateways are active.
        </span>
      </div>

      {/* Plans Grid */}
      <div className="space-y-4">
        <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
          ACTIVE SERVICE TIERS
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              style={{
                border: plan.isActive ? '0.5px solid var(--accent)' : '0.5px solid var(--border-default)'
              }}
              className="relative flex flex-col justify-between"
            >
              {/* Active badge in top right */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                  {plan.activeSubscribers} SUBSCRIBERS
                </span>
                {plan.isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                )}
              </div>

              <div>
                <h3 className="text-[16px] font-medium text-[var(--text-primary)] mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-[28px] font-light text-[var(--accent)] leading-none">
                    {plan.price}
                  </span>
                  <span className="text-[12px] text-[var(--text-muted)]">
                    / {plan.period}
                  </span>
                </div>

                {/* Features list */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)]">
                      <Check size={14} className="text-[var(--green)] mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[var(--border-default)] flex items-center justify-between">
                <Button variant="ghost" className="text-[12px] px-2">
                  Edit Plan
                </Button>
                <Button variant="ghost" className="text-[12px] px-2 text-[var(--text-muted)]">
                  Archive
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="space-y-4 pt-4">
        <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
          SUBSCRIBERS REGISTRY
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-hidden border border-[var(--border-default)] rounded-[var(--radius-lg)]">
          <table className="w-full text-left border-collapse bg-[var(--bg-surface)]">
            <thead>
              <tr className="bg-[var(--bg-page)] text-[10px] tracking-[0.1em] text-[var(--text-muted)] uppercase font-semibold border-b border-[var(--border-default)]">
                <th className="py-4 px-6">Member</th>
                <th className="py-4 px-6">Plan</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6">Next Billing</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)] text-[13px] text-[var(--text-primary)]">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-[var(--bg-hover)] transition-colors duration-150">
                  <td className="py-4 px-6 font-medium">{sub.member}</td>
                  <td className="py-4 px-6 text-[var(--text-secondary)]">{sub.plan}</td>
                  <td className="py-4 px-6 text-center">{getStatusBadge(sub.status)}</td>
                  <td className="py-4 px-6 text-right font-medium font-mono">{sub.amount}</td>
                  <td className="py-4 px-6 text-[var(--text-muted)]">{sub.nextBilling}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-md transition-colors"
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

        {/* Tablet/Mobile View */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscribers.map((sub) => (
            <Card key={sub.id} className="flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[14px] text-[var(--text-primary)]">{sub.member}</span>
                {getStatusBadge(sub.status)}
              </div>
              <div className="pt-2 border-t border-[var(--border-default)] grid grid-cols-2 gap-2 text-[12px]">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Plan</span>
                  <span className="font-medium text-[var(--text-primary)] truncate block">{sub.plan}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Billing</span>
                  <span className="font-medium font-mono text-[var(--text-primary)]">{sub.amount}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[var(--border-default)] flex justify-between items-center text-[12px]">
                <span className="text-[var(--text-muted)]">Renewal: {sub.nextBilling}</span>
                <Button variant="ghost" className="text-[11px] py-1 px-2.5">Manage</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
