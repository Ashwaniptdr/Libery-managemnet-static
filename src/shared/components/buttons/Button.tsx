import { Button as PrimeButton } from 'primereact/button';
import React from 'react';
import './Button.css';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant =
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'outlined'
  | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  type?: ButtonType;
  icon?: string;
  label?: string;
  title?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  size?: ButtonSize;
  isActive?: boolean;
}

const CLASS_BASE = 'p-button p-component';

export default function Button({
  label,
  icon,
  title,
  onClick,
  isLoading,
  className,
  variant,
  type = 'button',
  disabled = false,
  size = 'medium',
  isActive,
}: React.PropsWithChildren<ButtonProps>) {
  const cssVariant: ButtonVariant =
    isActive !== undefined
      ? isActive
        ? 'success'
        : 'danger'
      : type === 'reset'
        ? 'outlined'
        : type === 'submit' && !variant
          ? 'primary'
          : (variant ?? 'primary');

  const classNameFull = [
    CLASS_BASE,
    `button-variant-${cssVariant}`,
    `button-size-${size}`,
    disabled ? 'button-disabled' : '',
    className ?? '',
  ]
    .join(' ')
    .trim();

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const rippleSize = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - rippleSize / 2;
    const y = e.clientY - rect.top - rippleSize / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${rippleSize}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <PrimeButton
      type={type}
      className={classNameFull}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      icon={icon ? (icon.startsWith('pi ') ? icon : `pi pi-${icon}`) : undefined}
      label={label}
      loading={isLoading}
      disabled={disabled}
      title={title}
    />
  );
}
