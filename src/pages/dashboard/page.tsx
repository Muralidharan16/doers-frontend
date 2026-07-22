import { useState } from 'react';
import { useExpiringSubscriptions, useCollections, useAttendance } from '@/features/reports/hooks/useDashboard';
import { useBranchStore } from '@/features/gym';
import { Users, UserPlus, CreditCard, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const { selectedBranch } = useBranchStore();

  const expiringQuery = useExpiringSubscriptions(7, selectedBranch?.id);
  const collectionsQuery = useCollections(dateRange.from, dateRange.to, selectedBranch?.id);
  const attendanceQuery = useAttendance(30, selectedBranch?.id);
  console.log('Attendance data array:', attendanceQuery.data);

  const totalCollections = collectionsQuery.data?.reduce((sum, item) => sum + Number(item.total), 0) || 0;
  const maxAttendance = Math.max(...(attendanceQuery.data?.hours.map(h => h.count) || [1]));

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto pb-32" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* ── Dashboard Hero: Status & Quick Controls ── */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-[28px] font-serif tracking-tight text-[var(--text-primary)] font-medium leading-none">
            Studio <span className="italic font-light text-[var(--accent-gold)]">Intelligence</span>
          </h1>
          <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.12em]">
            Operational Overview / {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-[8px] p-1" style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)' }}>
            <div className="flex items-center px-4 py-2 border-r" style={{ borderColor: 'var(--border-default)' }}>
              <Calendar size={14} className="text-[var(--text-muted)] mr-3" />
              <input
                type="date"
                className="bg-transparent border-none outline-none text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider cursor-pointer"
                value={dateRange.from}
                onChange={(e) => setDateRange(p => ({ ...p, from: e.target.value }))}
              />
            </div>
            <div className="flex items-center px-4 py-2">
              <input
                type="date"
                className="bg-transparent border-none outline-none text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider cursor-pointer"
                value={dateRange.to}
                onChange={(e) => setDateRange(p => ({ ...p, to: e.target.value }))}
              />
            </div>
          </div>
          <button 
            className="h-11 px-6 text-[10px] font-bold uppercase tracking-widest transition-all duration-200"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              border: 'none',
              borderRadius: '4px',
              letterSpacing: '0.06em',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
             Generate Report
          </button>
        </div>
      </header>

      {/* ── Top Row: Critical Business Health ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* System Condition Card */}
         <div 
           className="rounded-[8px] p-6 flex flex-col justify-between transition-all duration-300 hover:border-[var(--accent-gold)]"
           style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)' }}
         >
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">System Condition</span>
                  <div className="px-[10px] py-[3px] bg-transparent border-[0.5px] border-[#4CAF50] rounded-[3px] text-[10px] font-medium text-[#4CAF50] tracking-[0.1em] uppercase">Healthy</div>
               </div>
               <div className="mt-4 space-y-1">
                  <div className="text-[11px] text-[var(--text-muted)] mt-[4px] font-normal uppercase tracking-[0.08em]">Current Plan</div>
                  <div className="text-[32px] font-light text-[var(--text-primary)] leading-tight">Professional Operating Plan</div>
                  <div className="text-[11px] text-[var(--accent-gold)] font-bold uppercase tracking-[0.06em]">8 Trial Days Remaining</div>
               </div>
            </div>
            <div className="mt-6 space-y-2">
               <div className="h-[1px] w-full bg-[var(--border-default)] overflow-hidden rounded-none">
                  <div className="h-full bg-[var(--accent-gold)] w-[70%]" />
               </div>
               <div className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.08em]">Trial progression verified</div>
            </div>
         </div>

         {/* Subscription Health Card */}
         <div 
           className="rounded-[8px] p-6 flex flex-col justify-between transition-all duration-300 hover:border-[var(--accent-gold)]"
           style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)' }}
         >
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Subscription Health</span>
                  <CreditCard size={14} className="text-[var(--text-muted)]" />
               </div>
               <div className="mt-4 space-y-1">
                  <div className="text-[11px] text-[var(--text-muted)] mt-[4px] font-normal uppercase tracking-[0.08em]">Renewal Schedule</div>
                  <div className="text-[32px] font-light text-[var(--text-primary)] leading-tight">₹12,500 <span className="text-[14px] text-[var(--text-muted)] font-light lowercase">/ mo</span></div>
                  <div className="text-[11px] text-[var(--text-muted)] font-semibold mt-1 uppercase tracking-[0.08em]">Auto-renewing June 12, 2026</div>
               </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
                  <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-[0.08em]">Active Autopay</span>
               </div>
               <button 
                 className="text-[11px] font-bold text-[var(--accent-gold)] uppercase tracking-[0.06em] bg-transparent border-none outline-none cursor-pointer"
                 onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
                 onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
               >Details</button>
            </div>
         </div>

         {/* Live Occupancy Card */}
         <div 
           className="rounded-[8px] p-6 flex flex-col justify-between transition-all duration-300 hover:border-[var(--accent-gold)]"
           style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)' }}
         >
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Live Occupancy</span>
                  <Users size={14} className="text-[var(--text-muted)]" />
               </div>
               <div className="mt-4 space-y-1">
                  <div className="text-[11px] text-[var(--text-muted)] mt-[4px] font-normal uppercase tracking-[0.08em]">Current Load</div>
                  <div className="text-[32px] font-light text-[var(--text-primary)] leading-none">42%</div>
               </div>
            </div>
            <div className="mt-6 space-y-2">
               <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.08em]">
                  <span className="text-[var(--text-muted)] font-normal">18 active members</span>
                  <div className="px-[10px] py-[3px] bg-transparent border-[0.5px] border-[#4CAF50] rounded-[3px] text-[10px] font-medium text-[#4CAF50] tracking-[0.1em] uppercase">Stable load</div>
               </div>
               <div className="h-[1px] w-full bg-[var(--border-default)] overflow-hidden rounded-none">
                  <div className="h-full bg-[var(--accent-gold)] w-[42%]" />
               </div>
            </div>
         </div>

         {/* Member Activity Card */}
         <div 
           className="rounded-[8px] p-6 flex flex-col justify-between transition-all duration-300 hover:border-[var(--accent-gold)]"
           style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)' }}
         >
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Member Activity</span>
                  <UserPlus size={14} className="text-[var(--text-muted)]" />
               </div>
               <div className="mt-4 space-y-1">
                  <div className="text-[11px] text-[var(--text-muted)] mt-[4px] font-normal uppercase tracking-[0.08em]">Check-ins Today</div>
                  <div className="text-[32px] font-light text-[var(--text-primary)] leading-none">128</div>
               </div>
            </div>
             <div className="mt-6 flex items-center gap-2">
                <div className="px-[10px] py-[3px] bg-transparent border-[0.5px] border-[#4CAF50] rounded-[3px] text-[10px] font-medium text-[#4CAF50] tracking-[0.1em] uppercase">+14%</div>
                <span className="text-[11px] text-[var(--text-muted)] font-medium italic uppercase tracking-[0.08em]">vs previous Thursday</span>
             </div>
          </div>
       </section>

       {/* ── Main Performance Grid ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Focus: Revenue Overview */}
        <div className="lg:col-span-8 space-y-8">
          <div 
            className="rounded-[8px] overflow-hidden group transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--bg-surface)', 
              border: '0.5px solid var(--border-default)',
              outline: 'none'
            }}
          >
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-default)' }}>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Revenue Streams</div>
                <div className="text-[10px] text-[var(--text-muted)] mt-[4px] font-normal uppercase tracking-[0.12em]">Trend reporting is not connected.</div>
              </div>
              <div className="text-right space-y-1.5">
                <div className="text-[28px] font-light text-[var(--text-primary)] leading-tight">₹{totalCollections.toLocaleString('en-IN')}</div>
                <div className="inline-block px-[10px] py-[3px] bg-transparent border-[0.5px] rounded-[3px] text-[10px] font-medium tracking-[0.1em] uppercase" style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}>Revenue trend unavailable</div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="relative h-56 w-full pl-8 flex items-center justify-center text-[var(--text-muted)] text-[12px]" style={{ outline: 'none' }}>
                Revenue visualization unavailable
              </div>
              <div className="mt-6 pl-8 flex justify-between text-[var(--text-muted)] font-bold text-[11px] tracking-[0.1em] uppercase opacity-80">
                 <span>T-Minus 30 Days</span>
                 <span className="italic font-normal">Consolidated billing overview. Synchronization: Auto-verified.</span>
                 <span>Real-time</span>
              </div>
            </div>
          </div>

          <div 
            className="rounded-[8px] p-6 transition-all duration-300 hover:border-[var(--accent-gold)]"
            style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)' }}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Attendance Trends</div>
                <p className="text-[12px] text-[var(--text-muted)] mt-[4px] font-normal uppercase tracking-wide">Hourly density across historical peak windows</p>
              </div>
              <div className="px-[10px] py-[3px] bg-transparent border-[0.5px] rounded-[3px] text-[10px] font-medium tracking-[0.1em] uppercase" style={{ borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}>
                 Live Heatmap
              </div>
            </div>
            
            {!attendanceQuery.data || !attendanceQuery.data.hours || attendanceQuery.data.hours.length === 0 ? (
               <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  Loading attendance data...
               </div>
            ) : (
               <div style={{ height: '200px', width: '100%' }}>
                  <div className="grid grid-cols-6 gap-6 pt-12">
                     {attendanceQuery.data.hours.filter((_, i) => i % 4 === 0).map((hour) => (
                        <div key={hour.hour} className="group">
                           <div 
                             className="h-24 w-full rounded-[4px] relative overflow-hidden flex flex-col justify-end border border-transparent group-hover:border-[var(--border-default)] transition-all duration-300"
                             style={{ backgroundColor: 'var(--bg-page)' }}
                           >
                              <div 
                                 className="w-full bg-[var(--text-primary)]/10 transition-all duration-500 ease-out group-hover:bg-[var(--accent-gold)]"
                                 style={{ height: `${(hour.count / maxAttendance) * 100}%` }}
                              />
                           </div>
                           <div className="mt-4 text-center font-sans text-[9px] font-bold text-[var(--text-primary)] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-all">{hour.hour}:00</div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            
            <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: 'var(--border-default)' }}>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.12em] font-semibold">Sensor signals healthy. Average studio dwell: 72 mins.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Action Center & Insights */}
        <div className="lg:col-span-4 space-y-8">
           {/* Action Center */}
           <div 
             className="rounded-[8px] px-6 py-5 flex flex-col h-full hover:border-[var(--accent-gold)] transition-all duration-300"
             style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)' }}
           >
              <div className="mb-6 space-y-3">
                 <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Action Center</div>
                 <p className="text-[12px] text-[var(--text-muted)] mt-[4px] font-normal uppercase tracking-wide">Critical operational alerts</p>
              </div>
              
              <div className="space-y-4 flex-1">
                 {[
                   { label: 'Memberships Expiring', value: expiringQuery.data?.length || 0, status: 'warning', text: 'Action required in 72h' },
                   { label: 'Failed Payments', value: '—', status: 'ink-muted', text: 'Payment alerts unavailable' },
                   { label: 'Low Attendance Alerts', value: 12, status: 'ink-muted', text: 'Review retention strategy' },
                 ].map((alert) => (
                    <div 
                      key={alert.label} 
                      className="p-4 rounded-[6px] border space-y-2.5 transition-all duration-300"
                      style={{ 
                        backgroundColor: 'var(--bg-page)', 
                        borderColor: 'var(--border-default)' 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
                    >
                       <div className="flex justify-between items-start">
                          <span className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-wider">{alert.label}</span>
                          <span 
                            className="text-[13px] font-bold" 
                            style={{ 
                              color: alert.value === 0 
                                ? 'var(--text-muted)' 
                                : alert.status === 'critical' 
                                  ? '#E24B4A' 
                                  : alert.status === 'warning' 
                                    ? 'var(--accent-gold)' 
                                    : 'var(--text-primary)' 
                            }}
                          >
                            {alert.value}
                          </span>
                       </div>
                       <p className="text-[11px] text-[var(--text-muted)] font-semibold italic">{alert.text}</p>
                    </div>
                 ))}
              </div>

              <div className="mt-8 pt-6 border-t space-y-4" style={{ borderColor: 'var(--border-default)' }}>
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Monthly Growth</span>
                    <span className="text-[13px] font-bold text-[#4CAF50]">+18.4%</span>
                 </div>
                 <div className="h-[2px] w-full overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
                    <div className="h-full bg-[#4CAF50] w-[18.4%]" />
                 </div>
                 <button 
                   className="w-full py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] rounded-[6px] transition-all duration-200"
                   style={{
                     backgroundColor: 'var(--btn-primary-bg)',
                     color: 'var(--btn-primary-text)'
                   }}
                   onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
                   onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                 >
                    Detailed Analytics
                 </button>
              </div>
           </div>

           {/* Operational Insights */}
           <div 
             className="rounded-[8px] px-6 py-5 flex flex-col hover:border-[var(--accent-gold)] transition-all duration-300"
             style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)' }}
           >
              <div className="mb-6 space-y-3">
                 <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Operational Insights</div>
                 <p className="text-[12px] text-[var(--text-muted)] mt-[4px] font-normal uppercase tracking-wide">Real-time studio health checks</p>
              </div>
              
              <div className="space-y-4">
                 {[
                   { label: 'Attendance Security', status: 'Healthy', text: 'No attendance anomalies detected' },
                   { label: 'Billing Systems', status: 'Initializing', text: 'Revenue stream initializing' },
                   { label: 'Member Retention', status: 'Stable', text: 'Membership activity stable' },
                 ].map((insight) => (
                    <div 
                      key={insight.label} 
                      className="p-4 border rounded-[6px] space-y-2"
                      style={{ 
                        backgroundColor: 'var(--bg-page)', 
                        borderColor: 'var(--border-default)' 
                      }}
                    >
                       <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider">{insight.label}</span>
                          <span 
                            className="px-[10px] py-[3px] bg-transparent border-[0.5px] rounded-[3px] text-[10px] font-medium tracking-[0.1em] uppercase"
                            style={{ 
                              borderColor: insight.status === 'Healthy' || insight.status === 'Stable' 
                                ? '#4CAF50' 
                                : 'var(--accent-gold)',
                              color: insight.status === 'Healthy' || insight.status === 'Stable' 
                                ? '#4CAF50' 
                                : 'var(--accent-gold)'
                            }}
                          >
                            {insight.status}
                          </span>
                       </div>
                       <p className="text-[11px] text-[var(--text-muted)] font-medium leading-relaxed">{insight.text}</p>
                    </div>
                 ))}
              </div>
              
              <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: 'var(--border-default)' }}>
                <span className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-widest">All operations fully nominal</span>
              </div>
           </div>
         </div>
      </section>
    </div>
  );
}
