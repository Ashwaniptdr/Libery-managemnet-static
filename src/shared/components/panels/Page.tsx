import React, { type ReactNode } from 'react';
import './Page.css';
import PageHeader from './PageHeader';

interface PageProps extends React.PropsWithChildren {
  header: string;
  subHeader?: string;
  className?: string;
  /** Optional buttons displayed on the right side of the sticky title bar */
  headerActions?: ReactNode;
}

export default function Page({
  children,
  className = '',
  headerActions,
  header,
  subHeader,
}: PageProps) {
  return (
    <div className={`main-page ${className}`.trim()}>
      <div className="page-sticky-header">
        <PageHeader header={header} subHeader={subHeader} />
        {headerActions && (
          <div className="page-header-actions">{headerActions}</div>
        )}
      </div>
      <div className="page-body">{children}</div>
    </div>
  );
}
