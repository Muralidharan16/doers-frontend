import type { OperatingHour } from '@/features/gym/types/branchHours';
interface OperatingHoursDayRowProps {
    dayOfWeek: number;
    schedules: OperatingHour[];
    onChange: (dayOfWeek: number, schedules: OperatingHour[]) => void;
}
export declare function OperatingHoursDayRow({ dayOfWeek, schedules, onChange }: OperatingHoursDayRowProps): import("react/jsx-runtime").JSX.Element;
export {};
