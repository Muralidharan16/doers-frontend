import type { SpecialHour } from '@/features/gym/types/branchHours';
interface SpecialHoursEditorProps {
    specialHours: SpecialHour[];
    onChange: (schedules: SpecialHour[]) => void;
}
export declare function SpecialHoursEditor({ specialHours, onChange }: SpecialHoursEditorProps): import("react/jsx-runtime").JSX.Element;
export {};
