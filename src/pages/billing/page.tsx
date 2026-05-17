import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { ArrowDownToLine, Calendar, RefreshCw } from 'lucide-react';

const MOCK_PAYMENTS = [
  { id: '1', member: 'Devon Lane', amount: '₹12,500', plan: 'Studio Gold Annual', date: '12 May 2026', method: 'UPI (GPay)', status: 'paid' },
  { id: '2', member: 'Kathryn Murphy', amount: '₹1,800', plan: 'Studio Premium Monthly', date: '10 May 2026', method: 'Card (Visa)', status: 'paid' },
  { id: '3', member: 'Albert Flores', amount: '₹12,500', plan: 'Studio Gold Annual', date: '08 May 2026', method: 'Netbanking', status: 'pending' },
  { id: '4', member: 'Eleanor Pena', amount: '₹1,800', plan: 'Studio Premium Monthly', date: '05 May 2026', method: 'UPI (PhonePe)', status: 'failed' },
  { id: '5', member: 'Jenny Wilson', amount: '₹1,800', plan: 'Studio Premium Monthly', date: '03 May 2026', method: 'Card (Master)', status: 'refunded' },
  { id: '6', member: 'Guy Hawkins', amount: '₹1,800', plan: 'Studio Premium Monthly', date: '01 May 2026', method: 'UPI (Paytm)', status: 'failed' },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [retryingIds, setRetryingIds] = useState<Record<string, string>>({});

  const handleExportCSV = () => {
    alert("Exporting payments transaction ledger as CSV format...");
  };

  const handleRetry = (id: string) => {
    setRetryingIds(prev => ({ ...prev, [id]: 'Retrying...' }));
    
    // Simulate API retry call
    setTimeout(() => {
      setRetryingIds(prev => ({ ...prev, [id]: 'Success!' }));
      setTimeout(() => {
        setPayments(prev => 
          prev.map(p => p.id === id ? { ...p, status: 'paid' } : p)
        );
        // Clear state
        setRetryingIds(prev => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }, 1000);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="healthy">Paid</Badge>;
      case 'pending':
        return <Badge variant="gold">Pending</Badge>;
      case 'failed':
        return <Badge variant="warning">Failed</Badge>;
      case 'refunded':
      default:
        return <Badge variant="muted">Refunded</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Payments & Ledger" 
        category="Finance"
        action={
          <Button variant="secondary" onClick={handleExportCSV} className="gap-2">
            <ArrowDownToLine size={14} />
            <span>Export CSV</span>
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Total Revenue</div>
          <div className="text-[32px] font-light text-[var(--text-primary)] mt-2 leading-none">₹29,700</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">All Time Receipts</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Collected This Month</div>
          <div className="text-[32px] font-light text-[var(--green)] mt-2 leading-none">₹16,100</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">May 2026 Collection</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Pending</div>
          <div className="text-[32px] font-light text-[var(--accent)] mt-2 leading-none">₹12,500</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Awaiting settlement</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Failed</div>
          <div className="text-[32px] font-light text-[var(--red)] mt-2 leading-none">
            {payments.filter(p => p.status === 'failed').length}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Requires reconciliation</div>
        </Card>
      </div>

      {/* Date Range Selector bar */}
      <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)]">
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-[var(--text-muted)]" />
          <span className="text-[13px] text-[var(--text-secondary)]">Showing ledger for period: May 01 – May 31, 2026</span>
        </div>
        <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-mono">
          Settlement rate: 82%
        </div>
      </div>

      {/* Ledger Table */}
      <div className="space-y-4">
        <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
          TRANSACTION LEDGER
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-hidden border border-[var(--border-default)] rounded-[var(--radius-lg)]">
          <table className="w-full text-left border-collapse bg-[var(--bg-surface)]">
            <thead>
              <tr className="bg-[var(--bg-page)] text-[10px] tracking-[0.1em] text-[var(--text-muted)] uppercase font-semibold border-b border-[var(--border-default)]">
                <th className="py-4 px-6">Member</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Plan</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)] text-[13px] text-[var(--text-primary)]">
              {payments.map((pay) => {
                const isFailed = pay.status === 'failed';
                const retryText = retryingIds[pay.id];
                return (
                  <tr 
                    key={pay.id} 
                    style={{
                      backgroundColor: isFailed ? 'rgba(226,75,74,0.04)' : 'transparent'
                    }}
                    className="hover:bg-[var(--bg-hover)] transition-colors duration-150"
                  >
                    <td className="py-4 px-6 font-medium">{pay.member}</td>
                    <td className="py-4 px-6 font-semibold font-mono text-[var(--text-primary)]">{pay.amount}</td>
                    <td className="py-4 px-6 text-[var(--text-secondary)]">{pay.plan}</td>
                    <td className="py-4 px-6 text-[var(--text-muted)]">{pay.date}</td>
                    <td className="py-4 px-6 text-[var(--text-muted)] font-mono text-[11px]">{pay.method}</td>
                    <td className="py-4 px-6 text-center">{getStatusBadge(pay.status)}</td>
                    <td className="py-4 px-6 text-right">
                      {isFailed ? (
                        <Button
                          variant="ghost"
                          onClick={() => handleRetry(pay.id)}
                          className="text-[11px] p-2 hover:text-[var(--accent)] font-semibold gap-1.5 transition-all text-[var(--red)] border border-transparent hover:border-[var(--red)]/25"
                          style={{ minWidth: '80px', minHeight: '36px' }}
                          disabled={!!retryText}
                        >
                          {retryText ? (
                            <>
                              <RefreshCw size={11} className="animate-spin text-[var(--accent)]" />
                              <span>{retryText}</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw size={11} />
                              <span>RETRY</span>
                            </>
                          )}
                        </Button>
                      ) : (
                        <span className="text-[11px] text-[var(--text-muted)]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tablet/Mobile View */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {payments.map((pay) => {
            const isFailed = pay.status === 'failed';
            const retryText = retryingIds[pay.id];
            return (
              <Card 
                key={pay.id} 
                style={{
                  backgroundColor: isFailed ? 'rgba(226,75,74,0.04)' : 'var(--bg-surface)',
                  border: isFailed ? '0.5px solid var(--red)' : '0.5px solid var(--border-default)'
                }}
                className="flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[14px] text-[var(--text-primary)]">{pay.member}</span>
                  {getStatusBadge(pay.status)}
                </div>
                <div className="pt-2 border-t border-[var(--border-default)] grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Plan</span>
                    <span className="font-medium text-[var(--text-primary)] truncate block">{pay.plan}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Billing</span>
                    <span className="font-medium font-mono text-[var(--text-primary)]">{pay.amount}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[var(--border-default)] flex justify-between items-center text-[12px]">
                  <span className="text-[var(--text-muted)]">Date: {pay.date}</span>
                  {isFailed ? (
                    <Button 
                      variant="ghost" 
                      onClick={() => handleRetry(pay.id)}
                      className="text-[11px] py-1 px-3 text-[var(--red)]"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                      disabled={!!retryText}
                    >
                      {retryText || 'Retry'}
                    </Button>
                  ) : (
                    <span className="text-[11px] text-[var(--text-muted)]">{pay.method}</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
