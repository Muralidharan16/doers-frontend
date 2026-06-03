import { RefObject } from 'react';
export declare function useFocalPoint(containerRef: RefObject<HTMLDivElement>): {
    focalY: number;
    setFocalY: import("react").Dispatch<import("react").SetStateAction<number>>;
    handleMouseDown: (e: React.MouseEvent) => void;
    handleTouchStart: (e: React.TouchEvent) => void;
};
