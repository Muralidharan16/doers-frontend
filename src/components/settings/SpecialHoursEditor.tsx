import { useState } from 'react';
import type { SpecialHour } from '@/features/gym/types/branchHours';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

interface SpecialHoursEditorProps {
  specialHours: SpecialHour[];
  onChange: (schedules: SpecialHour[]) => void;
}

const formatDisplayDate = (dateStr: string) => {
  try {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

export function SpecialHoursEditor({ specialHours, onChange }: SpecialHoursEditorProps) {
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');

  const handleAdd = () => {
    if (!newDate) return;
    
    // Prevent duplicates for same date
    if (specialHours.some(sh => sh.special_date === newDate)) return;

    onChange([
      ...specialHours,
      {
        special_date: newDate,
        reason: newReason || null,
        is_closed: true,
        is_24_hours: false,
        open_time: null,
        close_time: null
      }
    ].sort((a, b) => a.special_date.localeCompare(b.special_date)));
    
    setNewDate('');
    setNewReason('');
  };

  const handleRemove = (dateToRemove: string) => {
    onChange(specialHours.filter(sh => sh.special_date !== dateToRemove));
  };

  const handleUpdate = (dateToUpdate: string, updates: Partial<SpecialHour>) => {
    onChange(
      specialHours.map(sh => {
        if (sh.special_date === dateToUpdate) {
          const updated = { ...sh, ...updates };
          if (updated.is_closed) {
            updated.is_24_hours = false;
            updated.open_time = null;
            updated.close_time = null;
          } else if (updated.is_24_hours) {
            updated.is_closed = false;
            updated.open_time = null;
            updated.close_time = null;
          }
          return updated;
        }
        return sh;
      })
    );
  };

  const handleTimeChange = (dateToUpdate: string, field: 'open_time' | 'close_time', val: string) => {
    handleUpdate(dateToUpdate, {
      [field]: val ? `${val}:00` : null,
      is_closed: false,
      is_24_hours: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-default)] shadow-sm">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
            Date
          </label>
          <Input 
            type="date" 
            value={newDate} 
            onChange={(e) => setNewDate(e.target.value)} 
            className="bg-[var(--bg-surface)] text-[var(--text-primary)]"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
            Holiday / Reason (Optional)
          </label>
          <Input 
            placeholder="e.g. Christmas, Maintenance" 
            value={newReason} 
            onChange={(e) => setNewReason(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="bg-[var(--bg-surface)] text-[var(--text-primary)]"
          />
        </div>
        <Button 
          type="button" 
          onClick={handleAdd}
          disabled={!newDate}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Special Date
        </Button>
      </div>

      {specialHours.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No special hours yet. Add one for holidays, maintenance, or temporary closures.</p>
      ) : (
        <div className="space-y-4">
          {specialHours.map((sh) => {
            const openTime = sh.open_time?.substring(0, 5) ?? '';
            const closeTime = sh.close_time?.substring(0, 5) ?? '';
            const isMissingTime = !sh.is_closed && !sh.is_24_hours && (!openTime || !closeTime);

            return (
              <div 
                key={sh.special_date} 
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] shadow-sm"
              >
                <div className="w-40 flex-shrink-0">
                  <div className="font-medium text-[var(--text-primary)]">
                    {formatDisplayDate(sh.special_date)}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] truncate">
                    {sh.reason || 'No reason specified'}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 flex-1">
                  <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--bg-surface)] cursor-pointer"
                      checked={sh.is_closed}
                      onChange={(e) => handleUpdate(sh.special_date, { is_closed: e.target.checked })}
                    />
                    Closed
                  </label>

                  <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--bg-surface)] cursor-pointer"
                      checked={sh.is_24_hours}
                      onChange={(e) => handleUpdate(sh.special_date, { is_24_hours: e.target.checked })}
                    />
                    Open 24 hours
                  </label>

                  {!sh.is_closed && !sh.is_24_hours && (
                    <div className="flex items-center gap-2 ml-auto sm:ml-4 flex-1 sm:flex-none">
                      <Input
                        type="time"
                        className="w-28 sm:w-32 bg-[var(--bg-surface)] text-[var(--text-primary)]"
                        value={openTime}
                        onChange={(e) => handleTimeChange(sh.special_date, 'open_time', e.target.value)}
                      />
                      <span className="text-[var(--text-muted)]">-</span>
                      <Input
                        type="time"
                        className="w-28 sm:w-32 bg-[var(--bg-surface)] text-[var(--text-primary)]"
                        value={closeTime}
                        onChange={(e) => handleTimeChange(sh.special_date, 'close_time', e.target.value)}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {isMissingTime && (
                    <span className="text-xs" style={{ color: 'var(--red)' }}>Set open and close times</span>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => handleRemove(sh.special_date)}
                    className="ml-auto p-2"
                    style={{ color: 'var(--red)' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
