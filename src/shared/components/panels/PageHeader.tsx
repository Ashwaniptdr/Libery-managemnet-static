import './Page.css';

interface Props {
  header: string;
  subHeader?: string;
  offCanvas?: any;
  showInfoIcon?: boolean;
}

export default function PageHeader({
  header,
  subHeader,
}: Props) {
  return (
    <div className="page-header-block">
      <h1 className="page-title">{header}</h1>
      {subHeader && <p className="page-subtitle">{subHeader}</p>}
    </div>
  );
}
