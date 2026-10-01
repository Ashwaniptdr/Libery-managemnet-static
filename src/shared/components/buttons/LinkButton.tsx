import { Link } from 'react-router';
import './Button.css';

type ButtonSize = 'small' | 'medium' | 'large';

interface LinkButtonProps {
  to: string;
  label: string;
  icon?: string;
  size?: ButtonSize;
  className?: string;
}

export default function LinkButton(props: LinkButtonProps) {
  const { size = 'medium', className: customClassName } = props;
  const hasIcon = !!props.icon;
  const className = `p-component p-button p-button-outlined button-size-${size}${hasIcon ? ' p-button-icon-left' : ''} ${customClassName !== undefined ? customClassName : 'mb-2'}`;
  return (
    <Link to={props.to} className={className}>
      {hasIcon ? (
        <span className={`p-button-icon pi pi-${props.icon}`}></span>
      ) : undefined}
      {props.label}
    </Link>
  );
}
