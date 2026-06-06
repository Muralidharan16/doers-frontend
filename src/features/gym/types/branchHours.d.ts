export interface OperatingHour {
    id?: string;
    day_of_week: number;
    slot_index?: number;
    valid_from: string;
    open_time?: string | null;
    close_time?: string | null;
    is_closed: boolean;
    is_24_hours: boolean;
}
export interface SpecialHour {
    id?: string;
    special_date: string;
    open_time?: string | null;
    close_time?: string | null;
    is_closed: boolean;
    is_24_hours: boolean;
    reason?: string | null;
}
export interface SaveOperatingHoursPayload {
    schedules: OperatingHour[];
}
export interface SaveSpecialHoursPayload {
    schedules: SpecialHour[];
}
export interface BranchHoursProjection {
    branch_id: string;
    projection_version: number;
    last_rebuilt_at: string;
    timezone: string;
    current_status: 'OPEN' | 'CLOSED' | 'HOLIDAY' | 'NOT_CONFIGURED' | string;
    next_open_at: string | null;
    next_close_at: string | null;
    weekly_schedule: Record<string, unknown>;
    upcoming_exceptions: Record<string, unknown>[];
}
