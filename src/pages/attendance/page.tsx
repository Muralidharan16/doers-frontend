import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAttendance } from '@/features/reports/hooks/useDashboard';
import { useMemo } from 'react';

export default function AttendancePage() {
  const attendanceQuery = useAttendance(30);

  const highestHour = useMemo(() => {
    if (!attendanceQuery.data?.hours || attendanceQuery.data.hours.length === 0) return null;
    let max = attendanceQuery.data.hours[0];
    for (const h of attendanceQuery.data.hours) {
      if (h.count > max.count) max = h;
    }
    return max.count > 0 ? max : null;
  }, [attendanceQuery.data?.hours]);

  const maxCount = useMemo(() => {
    if (!attendanceQuery.data?.hours || attendanceQuery.data.hours.length === 0) return 0;
    return Math.max(...attendanceQuery.data.hours.map(h => h.count));
  }, [attendanceQuery.data?.hours]);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Attendance & Occupancy" 
        category="Operations" 
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Heatmap & Distribution Card */}
        <Card className="xl:col-span-8 space-y-6">
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Attendance Distribution</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Hourly attendance activity across the reporting period.</p>
          </div>

          <div className="min-h-[200px] flex flex-col justify-center">
            {attendanceQuery.isPending || attendanceQuery.isLoading ? (
              <div className="text-center text-[var(--text-muted)] text-[12px]">
                Loading attendance distribution
              </div>
            ) : attendanceQuery.isError ? (
              <div className="text-center text-[var(--text-muted)] text-[12px] flex flex-col items-center">
                <span className="font-bold">Attendance distribution unavailable</span>
                <span className="mt-1">Attendance reporting could not be loaded.</span>
              </div>
            ) : !attendanceQuery.data || attendanceQuery.data.hours.length === 0 ? (
              <div className="text-center text-[var(--text-muted)] text-[12px] flex flex-col items-center">
                <span className="font-bold">No attendance distribution recorded</span>
                <span className="mt-1">No attendance activity was returned for this reporting period.</span>
              </div>
            ) : maxCount === 0 ? (
              <div className="text-center text-[var(--text-muted)] text-[12px] flex flex-col items-center">
                <span className="font-bold">No attendance activity recorded</span>
                <span className="mt-1">All returned hourly buckets contain zero recorded check-ins.</span>
              </div>
            ) : (
              <div className="w-full flex-1 pt-8 flex items-end justify-between gap-2 overflow-x-auto">
                {attendanceQuery.data.hours.map((hour) => {
                  const percentage = maxCount > 0 ? (hour.count / maxCount) * 100 : 0;
                  const formattedHour = `${hour.hour.toString().padStart(2, '0')}:00`;
                  return (
                    <div
                      key={hour.hour}
                      className="flex-1 min-w-[24px] flex flex-col justify-end items-center"
                      aria-label={`${formattedHour}: ${hour.count} recorded check-ins`}
                    >
                      <span className="text-[10px] text-[var(--text-muted)] mb-1">{hour.count}</span>
                      <div
                        className="w-full bg-[var(--text-primary)]/10 transition-all duration-500 ease-out hover:bg-[var(--accent-gold)] rounded-t-[2px]"
                        style={{ height: `${percentage}%` }}
                      />
                      <span className="mt-2 text-[9px] font-mono text-[var(--text-muted)]">{formattedHour}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider pt-2 border-t border-[var(--border-default)]">
            {attendanceQuery.data?.days_analyzed ? (
              <span>Aggregated across the last {attendanceQuery.data.days_analyzed} days.</span>
            ) : (
              <span />
            )}
          </div>
        </Card>

        {/* Attendance Summary */}
        <Card className="xl:col-span-4 flex flex-col space-y-6">
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Attendance Summary</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Derived from aggregated attendance data for the reporting period.</p>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6 text-[12px]">
            {highestHour && (
              <div>
                <div className="text-[var(--text-secondary)] font-medium mb-1">Highest recorded hour</div>
                <div className="font-mono font-semibold text-[var(--text-primary)]">{highestHour.hour.toString().padStart(2, '0')}:00</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-1">{highestHour.count} recorded check-ins</div>
              </div>
            )}

            <div className="pt-4 border-t border-[var(--border-default)]">
              <h4 className="font-semibold text-[var(--text-primary)] mb-1">Occupancy and Visit Duration</h4>
              <p className="text-[var(--text-muted)] font-bold mb-1">Occupancy analytics unavailable</p>
              <p className="text-[11px] text-[var(--text-muted)] italic">Real-time occupancy and visit-duration reporting are not connected.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Verification Status */}
        <Card className="space-y-4">
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Verification Status</h3>
          </div>
          <div>
             <p className="text-[var(--text-muted)] font-bold mb-1 text-[12px]">Verification status unavailable</p>
             <p className="text-[11px] text-[var(--text-muted)] italic">Biometric and device-health reporting are not connected.</p>
          </div>
        </Card>

        {/* Attendance Records */}
        <Card className="space-y-4">
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Attendance Records</h3>
          </div>
          <div>
             <p className="text-[var(--text-muted)] font-bold mb-1 text-[12px]">Individual attendance records unavailable</p>
             <p className="text-[11px] text-[var(--text-muted)] italic">Member-level check-in reporting is not connected.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
