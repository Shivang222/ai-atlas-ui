import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            className = '',
            ...props
        },
        ref
    ) => {
        const classNames = [
            'ui-button',
            `variant-${variant}`,
            `size-${size}`,
            fullWidth ? 'full-width' : '',
            isLoading ? 'loading' : '',
            className
        ].filter(Boolean).join(' ');

        return (
            <button ref={ref} className={classNames} disabled={isLoading || props.disabled} {...props}>
                {isLoading && <span className="loader"></span>}
                {!isLoading && leftIcon && <span className="icon-left">{leftIcon}</span>}
                <span className="content">{children}</span>
                {!isLoading && rightIcon && <span className="icon-right">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';
