import type { ChangeEvent } from 'react';
import type { OperatingHour } from '@/features/gym/types/branchHours';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface OperatingHoursDayRowProps {
  dayOfWeek: number; // 0-6
  schedules: OperatingHour[];
  onChange: (dayOfWeek: number, schedules: OperatingHour[]) => void;
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function OperatingHoursDayRow({ dayOfWeek, schedules, onChange }: OperatingHoursDayRowProps) {
  const dayName = DAY_NAMES[dayOfWeek];

  // We determine the day's meta state from the first slot (if any).
  const isClosed = schedules.length > 0 ? schedules[0].is_closed : false;
  const is24Hours = schedules.length > 0 ? schedules[0].is_24_hours : false;

  const handleToggleClosed = (e: ChangeEvent<HTMLInputElement>) => {
    const closed = e.target.checked;
    if (closed) {
      onChange(dayOfWeek, [{
        day_of_week: dayOfWeek,
        slot_index: 1,
        valid_from: new Date().toISOString().split('T')[0],
        is_closed: true,
        is_24_hours: false,
        open_time: null,
        close_time: null
      }]);
    } else {
      // Revert to one empty slot
      onChange(dayOfWeek, [{
        day_of_week: dayOfWeek,
        slot_index: 1,
        valid_from: new Date().toISOString().split('T')[0],
        is_closed: false,
        is_24_hours: false,
        open_time: null,
        close_time: null
      }]);
    }
  };

  const handleToggle24Hours = (e: ChangeEvent<HTMLInputElement>) => {
    const _is24 = e.target.checked;
    if (_is24) {
      onChange(dayOfWeek, [{
        day_of_week: dayOfWeek,
        slot_index: 1,
        valid_from: new Date().toISOString().split('T')[0],
        is_closed: false,
        is_24_hours: true,
        open_time: null,
        close_time: null
      }]);
    } else {
      // Revert to one empty slot
      onChange(dayOfWeek, [{
        day_of_week: dayOfWeek,
        slot_index: 1,
        valid_from: new Date().toISOString().split('T')[0],
        is_closed: false,
        is_24_hours: false,
        open_time: null,
        close_time: null
      }]);
    }
  };

  const handleTimeChange = (slotIndex: number, field: 'open_time' | 'close_time', val: string) => {
    const updated = schedules.map(s => {
      if (s.slot_index === slotIndex) {
        return {
          ...s,
          [field]: val ? `${val}:00` : null,
          is_closed: false,
          is_24_hours: false
        };
      }
      return s;
    });
    onChange(dayOfWeek, updated);
  };

  const handleAddSlot = () => {
    const maxIndex = schedules.length > 0 ? Math.max(...schedules.map(s => s.slot_index || 1)) : 0;
    const newSlot: OperatingHour = {
      day_of_week: dayOfWeek,
      slot_index: maxIndex + 1,
      valid_from: new Date().toISOString().split('T')[0],
      is_closed: false,
      is_24_hours: false,
      open_time: null,
      close_time: null
    };
    onChange(dayOfWeek, [...schedules, newSlot]);
  };

  const handleRemoveSlot = (slotIndex: number) => {
    if (schedules.length === 1) {
      // Can't remove the last slot directly via trash icon. They should use "Closed".
      return;
    }
    const updated = schedules.filter(s => s.slot_index !== slotIndex);
    // Re-index slots
    const reindexed = updated.map((s, idx) => ({ ...s, slot_index: idx + 1 }));
    onChange(dayOfWeek, reindexed);
  };

  return (
    <div className="flex flex-col py-4 border-b border-[var(--border-default)] last:border-0 gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="w-32 flex-shrink-0 font-medium text-[var(--text-primary)]">
          {dayName}
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--bg-surface)] cursor-pointer"
              checked={isClosed}
              onChange={handleToggleClosed}
            />
            Closed
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--bg-surface)] cursor-pointer"
              checked={is24Hours}
              onChange={handleToggle24Hours}
            />
            Open 24 hours
          </label>
        </div>
      </div>

      {!isClosed && !is24Hours && (
        <div className="sm:pl-32 pl-0 space-y-3 mt-1 sm:mt-0">
          {schedules.map((slot) => {
            const openTime = slot.open_time?.substring(0, 5) ?? '';
            const closeTime = slot.close_time?.substring(0, 5) ?? '';
            const isMissingTime = !openTime || !closeTime;

            return (
              <div key={slot.slot_index} className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    className="w-28 sm:w-32 bg-[var(--bg-surface)] text-[var(--text-primary)]"
                    value={openTime}
                    onChange={(e) => handleTimeChange(slot.slot_index || 1, 'open_time', e.target.value)}
                  />
                </div>
                <span className="text-[var(--text-muted)]">-</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    className="w-28 sm:w-32 bg-[var(--bg-surface)] text-[var(--text-primary)]"
                    value={closeTime}
                    onChange={(e) => handleTimeChange(slot.slot_index || 1, 'close_time', e.target.value)}
                  />
                </div>
                
                {schedules.length > 1 && (
                  <Button 
                    variant="ghost" 
                    type="button"
                    onClick={() => handleRemoveSlot(slot.slot_index || 1)}
                    className="p-2"
                    style={{ color: 'var(--red)' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                
                {isMissingTime && (
                  <p className="text-xs" style={{ color: 'var(--red)' }}>Set open and close times</p>
                )}
              </div>
            );
          })}
          
          <Button 
            variant="ghost" 
            type="button" 
            onClick={handleAddSlot}
            className="text-xs text-[var(--accent)] hover:text-[var(--accent)]/80 p-0 h-auto font-medium"
          >
            <Plus className="w-3 h-3 mr-1" /> Add time slot
          </Button>
        </div>
      )}
    </div>
  );
}
