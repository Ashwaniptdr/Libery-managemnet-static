import Button from './Button';

interface StatusButtonProps {
  value: boolean;
  onClick: () => void;
  className?: string;
}

export default function StatusButton({
  value,
  onClick,
  className,
}: StatusButtonProps) {
  const label = value ? 'Active' : 'Inactive';
  const variant = value ? 'success' : 'danger';

  return (
    <Button
      label={label}
      variant={variant}
      onClick={onClick}
      className={className}
    />
  );
}
