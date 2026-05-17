import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { ShieldCheck } from 'lucide-react';

const MOCK_CHECKINS = [
  { id: '1', name: 'Devon Lane', time: '08:42 AM', duration: '52 mins', status: 'healthy' },
  { id: '2', name: 'Kathryn Murphy', time: '08:15 AM', duration: '1 hr 12 mins', status: 'healthy' },
  { id: '3', name: 'Eleanor Pena', time: '07:50 AM', duration: '45 mins', status: 'healthy' },
  { id: '4', name: 'Jenny Wilson', time: '07:30 AM', duration: '1 hr 30 mins', status: 'healthy' },
  { id: '5', name: 'Guy Hawkins', time: '07:12 AM', duration: '1 hr 05 mins', status: 'healthy' },
  { id: '6', name: 'Savannah Nguyen', time: '06:45 AM', duration: '50 mins', status: 'healthy' },
  { id: '7', name: 'Arlene McCoy', time: '06:30 AM', duration: '1 hr 15 mins', status: 'healthy' },
  { id: '8', name: 'Cody Fisher', time: '06:15 AM', duration: '40 mins', status: 'healthy' },
  { id: '9', name: 'Esther Howard', time: '06:00 AM', duration: '1 hr 10 mins', status: 'healthy' },
  { id: '10', name: 'Ronald Richards', time: '05:45 AM', duration: '55 mins', status: 'healthy' },
];

export default function AttendancePage() {
  const [logs] = useState(MOCK_CHECKINS);
  const [pulse, setPulse] = useState(true);

  // Auto-pulse the LIVE indicator dot
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 7 columns (Mon-Sun) x 12 rows (time slots)
  const mockHeatmap = Array.from({ length: 7 }, () =>
    Array.from({ length: 12 }, () => Math.floor(Math.random() * 100))
  );

  const getHeatmapColor = (val: number) => {
    if (val < 25) return 'var(--bg-hover)';
    if (val < 55) return 'rgba(184,115,51,0.3)'; // var(--accent) at 30%
    if (val < 85) return 'rgba(184,115,51,0.7)'; // var(--accent) at 70%
    return 'var(--accent)';
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Attendance & Occupancy" 
        category="Operations" 
      />

      {/* Live Occupancy Card */}
      <Card className="relative overflow-hidden space-y-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span 
              className={`w-2 h-2 rounded-full bg-[var(--green)] transition-all duration-500 ${
                pulse ? 'scale-125 opacity-100' : 'scale-90 opacity-60'
              }`}
            />
            <span className="text-[10px] font-bold tracking-[0.15em] text-[var(--green)] uppercase">
              LIVE SYSTEM STATE
            </span>
          </div>
          <Badge variant="healthy">
            18 Active Members
          </Badge>
        </div>

        {/* Big Metrics Display */}
        <div className="flex items-baseline gap-2">
          <span 
            className="font-light tracking-tighter"
            style={{ fontSize: '48px', color: 'var(--accent)', lineHeight: 1 }}
          >
            42%
          </span>
          <span className="text-[13px] text-[var(--text-secondary)]">current studio capacity load</span>
        </div>

        {/* Capacity Loading Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full h-1 bg-[var(--border-default)] rounded-[2px]">
            <div className="h-full bg-[var(--accent)] rounded-[2px]" style={{ width: '42%' }} />
          </div>
          <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
            <span>Minimum</span>
            <span>Peak capacity (45 coaches maximum)</span>
          </div>
        </div>
      </Card>

      {/* Heatmap & Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Heatmap Card (xl-8) */}
        <Card className="xl:col-span-8 space-y-6">
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Heatmap Distribution</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Analyze weekly check-in occupancy frequencies across hours.</p>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[480px] space-y-3">
              {/* Day Columns Map */}
              <div className="flex items-center">
                {/* Space for time axis */}
                <div className="w-14" />
                <div className="flex-1 flex justify-between px-1">
                  {days.map((day) => (
                    <div key={day} className="w-7 text-center text-[11px] text-[var(--text-muted)] font-medium font-mono uppercase">
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Rows (Time slots) */}
              <div className="space-y-1.5">
                {Array.from({ length: 12 }).map((_, r) => {
                  const hourLabel = r === 0 ? '6 AM' : r === 3 ? '12 PM' : r === 6 ? '3 PM' : r === 9 ? '7 PM' : r === 11 ? '9 PM' : '';
                  return (
                    <div key={r} className="flex items-center">
                      {/* Time Slot Label */}
                      <div className="w-14 text-[10px] text-[var(--text-muted)] font-mono uppercase">
                        {hourLabel}
                      </div>

                      {/* Mon-Sun Cell Row */}
                      <div className="flex-1 flex justify-between px-1">
                        {Array.from({ length: 7 }).map((_, c) => {
                          const cellVal = mockHeatmap[c][r];
                          return (
                            <div 
                              key={c}
                              style={{ 
                                width: '28px', 
                                height: '28px', 
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: getHeatmapColor(cellVal)
                              }}
                              className="transition-colors duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                              title={`Hour ${r + 6}:00 - Intensity: ${cellVal}%`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex items-center justify-end gap-3 text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider pt-2 border-t border-[var(--border-default)]">
            <span>Low</span>
            <div className="w-3.5 h-3.5 rounded-[2px] bg-[var(--bg-hover)]" />
            <div className="w-3.5 h-3.5 rounded-[2px]" style={{ backgroundColor: 'rgba(184,115,51,0.3)' }} />
            <div className="w-3.5 h-3.5 rounded-[2px]" style={{ backgroundColor: 'rgba(184,115,51,0.7)' }} />
            <div className="w-3.5 h-3.5 rounded-[2px] bg-[var(--accent)]" />
            <span>Peak</span>
          </div>
        </Card>

        {/* Metrics/Operational Hours Card */}
        <Card className="xl:col-span-4 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">System Diagnostics</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Key performance indicators of today's attendance logs.</p>
          </div>

          <div className="divide-y divide-[var(--border-default)] text-[12px] flex-1">
            <div className="py-3 flex items-center justify-between">
              <span className="text-[var(--text-secondary)] font-medium">Average Stay Duration</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">64 minutes</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-[var(--text-secondary)] font-medium">Peak Hour Today</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">07:00 – 08:30 AM</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-[var(--text-secondary)] font-medium">Total Check-ins Today</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">128 members</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-[var(--text-secondary)] font-medium">System Compliance</span>
              <span className="font-mono font-semibold text-[var(--green)]">99.8% Healthy</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-default)] flex items-center gap-2 text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-mono">
            <ShieldCheck size={14} className="text-[var(--green)]" />
            <span>Secure biometric sync enabled</span>
          </div>
        </Card>
      </div>

      {/* Check-in Log Table */}
      <div className="space-y-4 pt-4">
        <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
          REAL-TIME ENTRY LEDGER
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-hidden border border-[var(--border-default)] rounded-[var(--radius-lg)]">
          <table className="w-full text-left border-collapse bg-[var(--bg-surface)]">
            <thead>
              <tr className="bg-[var(--bg-page)] text-[10px] tracking-[0.1em] text-[var(--text-muted)] uppercase font-semibold border-b border-[var(--border-default)]">
                <th className="py-4 px-6">Member</th>
                <th className="py-4 px-6">Check-in Time</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)] text-[13px] text-[var(--text-primary)]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--bg-hover)] transition-colors duration-150">
                  <td className="py-3.5 px-6 font-medium">{log.name}</td>
                  <td className="py-3.5 px-6 font-mono text-[var(--text-secondary)]">{log.time}</td>
                  <td className="py-3.5 px-6 text-[var(--text-secondary)]">{log.duration}</td>
                  <td className="py-3.5 px-6 text-center">
                    <Badge variant="healthy">Verified</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tablet/Mobile View */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {logs.map((log) => (
            <Card key={log.id} className="flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[14px] text-[var(--text-primary)]">{log.name}</span>
                <Badge variant="healthy">Verified</Badge>
              </div>
              <div className="pt-2 border-t border-[var(--border-default)] grid grid-cols-2 gap-2 text-[12px]">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Time</span>
                  <span className="font-medium font-mono text-[var(--text-primary)]">{log.time}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Duration</span>
                  <span className="font-medium text-[var(--text-primary)]">{log.duration}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
