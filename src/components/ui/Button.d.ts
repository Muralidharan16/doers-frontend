import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    fullWidth?: boolean;
}
export declare function Button({ variant, fullWidth, className, children, style, ...props }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
