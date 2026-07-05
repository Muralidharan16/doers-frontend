import { useState, useEffect } from 'react';
import { 
  useBranchHours, 
  useUpdateBranchHours, 
  useBranchSpecialHours, 
  useUpdateBranchSpecialHours 
} from '@/features/gym/hooks/useBranchHours';
import type { OperatingHour, SpecialHour } from '@/features/gym/types/branchHours';
import { OperatingHoursDayRow } from './OperatingHoursDayRow';
import { SpecialHoursEditor } from './SpecialHoursEditor';
import { OperatingHoursStatusCard } from './OperatingHoursStatusCard';
import { Button } from '@/components/ui/Button';
import { Save, AlertCircle, CheckCircle, Copy, CalendarOff } from 'lucide-react';

interface BranchOperatingHoursSectionProps {
  branchId: string;
}

export function BranchOperatingHoursSection({ branchId }: BranchOperatingHoursSectionProps) {
  const { data: standardHours, isLoading: isLoadingStandard } = useBranchHours(branchId);
  const { data: specialHours, isLoading: isLoadingSpecial } = useBranchSpecialHours(branchId);
  
  const updateStandardHours = useUpdateBranchHours();
  const updateSpecialHours = useUpdateBranchSpecialHours();

  const [localStandardHours, setLocalStandardHours] = useState<OperatingHour[]>([]);
  const [localSpecialHours, setLocalSpecialHours] = useState<SpecialHour[]>([]);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync server data to local state initially
  useEffect(() => {
    if (standardHours) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalStandardHours(standardHours);
    }
  }, [standardHours]);

  useEffect(() => {
    if (specialHours) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalSpecialHours(specialHours);
    }
  }, [specialHours]);

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleCopyMondayToAll = () => {
    const mondaySlots = localStandardHours.filter(h => h.day_of_week === 0);
    setLocalStandardHours(prev => {
      const newSchedules = prev.filter(h => h.day_of_week === 0);
      for (let day = 1; day <= 6; day++) {
        newSchedules.push(...mondaySlots.map(s => ({ ...s, day_of_week: day })));
      }
      return newSchedules;
    });
  };

  const handleCopyMondayToWeekdays = () => {
    const mondaySlots = localStandardHours.filter(h => h.day_of_week === 0);
    setLocalStandardHours(prev => {
      const newSchedules = prev.filter(h => h.day_of_week === 0 || h.day_of_week === 5 || h.day_of_week === 6);
      for (let day = 1; day <= 4; day++) {
        newSchedules.push(...mondaySlots.map(s => ({ ...s, day_of_week: day })));
      }
      return newSchedules;
    });
  };

  const handleMarkWeekendsClosed = () => {
    setLocalStandardHours(prev => {
      const newSchedules = prev.filter(h => h.day_of_week !== 5 && h.day_of_week !== 6);
      const today = new Date().toISOString().split('T')[0];
      newSchedules.push({ day_of_week: 5, slot_index: 1, valid_from: today, is_closed: true, is_24_hours: false, open_time: null, close_time: null });
      newSchedules.push({ day_of_week: 6, slot_index: 1, valid_from: today, is_closed: true, is_24_hours: false, open_time: null, close_time: null });
      return newSchedules;
    });
  };


  const handleStandardHourChange = (dayOfWeek: number, schedules: OperatingHour[]) => {
    setLocalStandardHours(prev => {
      // Remove all existing slots for this day, then add the new ones
      const filtered = prev.filter(h => h.day_of_week !== dayOfWeek);
      return [...filtered, ...schedules];
    });
  };

  const validateStandardHours = (): boolean => {
    for (let day = 0; day <= 6; day++) {
      const schedules = localStandardHours.filter(h => h.day_of_week === day);
      if (schedules.length === 0) continue; // Unset days are implicitly closed
      
      const has24 = schedules.some(s => s.is_24_hours);
      const hasClosed = schedules.some(s => s.is_closed);
      if ((has24 || hasClosed) && schedules.length > 1) {
        setErrorMsg(`${DAY_NAMES[day]} cannot have both 24-hours/Closed and specific time slots.`);
        return false;
      }
      
      const activeSlots = schedules.filter(s => !s.is_closed && !s.is_24_hours);
      
      for (const schedule of activeSlots) {
        if (!schedule.open_time || !schedule.close_time) {
          setErrorMsg(`Missing open or close time for a slot on ${DAY_NAMES[day]}.`);
          return false;
        }
        
        const openStr = schedule.open_time.substring(0, 5);
        const closeStr = schedule.close_time.substring(0, 5);
        if (openStr >= closeStr) {
          setErrorMsg("Overnight hours are not supported yet. Split the schedule or use same-day time ranges.");
          return false;
        }
      }
      
      const sorted = [...activeSlots].sort((a, b) => (a.open_time || '').localeCompare(b.open_time || ''));
      for (let i = 0; i < sorted.length - 1; i++) {
        const currentClose = sorted[i].close_time || '';
        const nextOpen = sorted[i+1].open_time || '';
        if (currentClose > nextOpen) {
          setErrorMsg(`Time slots overlap on ${DAY_NAMES[day]}.`);
          return false;
        }
      }
    }
    return true;
  };

  const validateSpecialHours = (): boolean => {
    const grouped: Record<string, SpecialHour[]> = {};
    for (const sh of localSpecialHours) {
      if (!grouped[sh.special_date]) {
        grouped[sh.special_date] = [];
      }
      grouped[sh.special_date].push(sh);
    }
    
    for (const dateStr in grouped) {
      const slots = grouped[dateStr];
      const has24 = slots.some(s => s.is_24_hours);
      const hasClosed = slots.some(s => s.is_closed);
      if ((has24 || hasClosed) && slots.length > 1) {
        setErrorMsg(`Special date ${dateStr} cannot have both 24-hours/Closed and specific time slots.`);
        return false;
      }
      
      const activeSlots = slots.filter(s => !s.is_closed && !s.is_24_hours);
      for (const sh of activeSlots) {
        if (!sh.open_time || !sh.close_time) {
          setErrorMsg(`Missing open or close time for special date ${sh.special_date}.`);
          return false;
        }
        
        const openStr = sh.open_time.substring(0, 5);
        const closeStr = sh.close_time.substring(0, 5);
        if (openStr >= closeStr) {
          setErrorMsg("Overnight hours are not supported yet. Split the schedule or use same-day time ranges.");
          return false;
        }
      }
      
      const sorted = [...activeSlots].sort((a, b) => (a.open_time || '').localeCompare(b.open_time || ''));
      for (let i = 0; i < sorted.length - 1; i++) {
        const currentClose = sorted[i].close_time || '';
        const nextOpen = sorted[i+1].open_time || '';
        if (currentClose > nextOpen) {
          setErrorMsg(`Time slots overlap on special date ${dateStr}.`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!validateStandardHours() || !validateSpecialHours()) {
      return;
    }

    try {
      const standardSchedulesToSave = [];
      for (let day = 0; day <= 6; day++) {
        const daySlots = localStandardHours.filter(h => h.day_of_week === day);
        if (daySlots.length === 0) {
          standardSchedulesToSave.push({
            day_of_week: day,
            slot_index: 1,
            valid_from: new Date().toISOString().split('T')[0],
            is_closed: true,
            is_24_hours: false,
            open_time: null,
            close_time: null
          });
        } else {
          standardSchedulesToSave.push(...daySlots);
        }
      }

      await Promise.all([
        updateStandardHours.mutateAsync({ branchId, payload: { schedules: standardSchedulesToSave } }),
        updateSpecialHours.mutateAsync({ branchId, payload: { schedules: localSpecialHours } })
      ]);
      setSuccessMsg('Operating hours updated successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: unknown, message?: string } }, message?: string };
      let errMsg = 'Failed to update operating hours.';
      
      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          errMsg = detail.map((e: { msg?: string }) => e.msg).filter(Boolean).join(', ');
        } else if (typeof detail === 'string') {
          errMsg = detail;
        }
      } else if (error?.response?.data?.message) {
        errMsg = error.response.data.message;
      } else if (error?.message) {
        errMsg = error.message;
      }
      
      setErrorMsg(errMsg);
    }
  };

  const isSaving = updateStandardHours.isPending || updateSpecialHours.isPending;
  const isLoading = isLoadingStandard || isLoadingSpecial;

  if (isLoading) {
    return <div className="p-8 text-center text-[var(--text-muted)]">Loading operating hours...</div>;
  }

  return (
    <div className="space-y-6">
      <OperatingHoursStatusCard branchId={branchId} />
      
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Weekly Schedule</h3>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={handleCopyMondayToAll} className="inline-flex items-center text-[11px] py-1 px-2.5 rounded-md border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)] transition-colors">
              <Copy className="w-3 h-3 mr-1 flex-shrink-0" /> Mon → All
            </button>
            <button onClick={handleCopyMondayToWeekdays} className="inline-flex items-center text-[11px] py-1 px-2.5 rounded-md border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)] transition-colors">
              <Copy className="w-3 h-3 mr-1 flex-shrink-0" /> Mon → Weekdays
            </button>
            <button onClick={handleMarkWeekendsClosed} className="inline-flex items-center text-[11px] py-1 px-2.5 rounded-md border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)] transition-colors">
              <CalendarOff className="w-3 h-3 mr-1 flex-shrink-0" /> Weekends Closed
            </button>
          </div>
        </div>
        
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl px-4 sm:px-6 py-2 shadow-sm">
          {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => (
            <OperatingHoursDayRow
              key={dayOfWeek}
              dayOfWeek={dayOfWeek}
              schedules={localStandardHours.filter(h => h.day_of_week === dayOfWeek).sort((a, b) => (a.slot_index || 1) - (b.slot_index || 1))}
              onChange={handleStandardHourChange}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Special Hours / Holidays</h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Add holidays, maintenance days, or temporary schedule changes.</p>
        </div>
        
        <SpecialHoursEditor
          specialHours={localSpecialHours}
          onChange={setLocalSpecialHours}
        />
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 p-3 rounded-lg text-[13px] border" style={{ color: 'var(--red)', backgroundColor: 'color-mix(in srgb, var(--red) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--red) 20%, transparent)' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-start gap-2 p-3 rounded-lg text-[13px] border" style={{ color: 'var(--green)', backgroundColor: 'color-mix(in srgb, var(--green) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--green) 20%, transparent)' }}>
          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-[var(--border-default)]">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Operating Hours'}
        </Button>
      </div>
    </div>
  );
}
