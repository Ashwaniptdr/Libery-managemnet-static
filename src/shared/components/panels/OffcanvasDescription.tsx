import { type ReactNode } from 'react';

interface OffcanvasDescriptionProps {
  children: ReactNode;
}

export function OffcanvasDescription({ children }: OffcanvasDescriptionProps) {
  return <div className="offcanvas-description-content">{children}</div>;
}

interface SectionProps {
  title?: string;
  children: ReactNode;
}

export function OffcanvasSection({ title, children }: SectionProps) {
  return (
    <div className="offcanvas-section">
      {title && <h4 className="offcanvas-section-title">{title}</h4>}
      {children}
    </div>
  );
}

interface ListProps {
  type?: 'numbered' | 'bulleted';
  children: ReactNode;
}

export function OffcanvasList({ type = 'bulleted', children }: ListProps) {
  const className = `offcanvas-list ${type}`;
  return type === 'numbered' ? (
    <ol className={className}>{children}</ol>
  ) : (
    <ul className={className}>{children}</ul>
  );
}

interface ItemProps {
  children: ReactNode;
}

export function OffcanvasListItem({ children }: ItemProps) {
  return <li>{children}</li>;
}

export function OffcanvasSubList({ children }: { children: ReactNode }) {
  return <ul className="offcanvas-sub-list">{children}</ul>;
}
