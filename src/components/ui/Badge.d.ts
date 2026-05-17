import React from 'react';
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'healthy' | 'stable' | 'warning' | 'initializing' | 'gold' | 'muted';
}
export declare function Badge({ variant, children, style, className, ...props }: BadgeProps): import("react/jsx-runtime").JSX.Element;
export {};
