import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { ArrowDownToLine, Calendar } from 'lucide-react';

export default function PaymentsPage() {
  const handleExportCSV = () => {
    alert("Exporting payments transaction ledger as CSV format...");
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
          <div className="text-[14px] font-medium text-[var(--text-primary)] mt-2 leading-tight">Payment data unavailable</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Payment reporting is not connected.</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Collected This Month</div>
          <div className="text-[14px] font-medium text-[var(--text-primary)] mt-2 leading-tight">Payment data unavailable</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Payment reporting is not connected.</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Pending</div>
          <div className="text-[14px] font-medium text-[var(--text-primary)] mt-2 leading-tight">Payment data unavailable</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Payment reporting is not connected.</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Failed</div>
          <div className="text-[14px] font-medium text-[var(--text-primary)] mt-2 leading-tight">Payment data unavailable</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Payment reporting is not connected.</div>
        </Card>
      </div>

      {/* Date Range Selector bar */}
      <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)]">
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-[var(--text-muted)]" />
          <span className="text-[13px] text-[var(--text-secondary)]">Showing ledger for period: May 01 – May 31, 2026</span>
        </div>
        <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-mono">
          Settlement rate: Unavailable
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
              <tr>
                <td colSpan={7} className="py-8 text-center">
                  <div className="text-[14px] font-medium text-[var(--text-primary)]">No payment records available</div>
                  <div className="text-[12px] text-[var(--text-muted)] mt-1">Payment ledger data is not connected.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tablet/Mobile View */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="py-8 text-center col-span-full border border-[var(--border-default)] rounded-[var(--radius-lg)]">
            <div className="text-[14px] font-medium text-[var(--text-primary)]">No payment records available</div>
            <div className="text-[12px] text-[var(--text-muted)] mt-1">Payment ledger data is not connected.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
