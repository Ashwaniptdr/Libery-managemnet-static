import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';
import React, { type ReactNode } from 'react';

interface ReportLayoutProps {
  title?: string;
  subtitle?: number | string;
  heading?: string;
  caption?: string;
  className?: string;
  children?: ReactNode;
}

const DisplayLayout: React.FC<ReportLayoutProps> = ({
  title,
  subtitle,
  heading,
  caption,
  className,
  children,
}) => {
  return (
    <Card className={classNames('mt-4 border-none shadow-none', className)}>
      <div className="report-container">
        <header className="flex flex-column align-items-center mb-5 text-center">
          {(title || subtitle) && (
            <h2
              className="uppercase m-0 p-0"
              style={{
                fontSize: '1.3rem',
                fontWeight: '800',
                color: '#000000',
                lineHeight: '1.2',
                letterSpacing: '0.5px',
              }}
            >
              {title} {subtitle ? `[${subtitle}]` : ''}
            </h2>
          )}

          {heading && (
            <div className="w-full mt-2">
              <h1
                className="uppercase m-0"
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  color: '#000000',
                  lineHeight: '1.2',
                }}
              >
                {heading}
              </h1>
            </div>
          )}

          {caption && (
            <p
              className="uppercase m-0 mt-2"
              style={{
                fontSize: '1.3rem',
                fontWeight: '800',
                color: '#000000',
                lineHeight: '1.2',
              }}
            >
              {caption}
            </p>
          )}
        </header>

        <main className="report-content w-full">{children}</main>
      </div>
    </Card>
  );
};

export default DisplayLayout;
