import { Button } from '../buttons';

interface ButtonColumnProps {
  caption: string;
  icon?: string;
  onClick?: () => void;
}

export default function ButtonColumn(props: ButtonColumnProps) {
  return (
    <Button
      type="button"
      variant="text"
      icon={props.icon}
      label={props.caption}
      onClick={props.onClick}
      size="small"
      className="w-full"
    />
  );
}
