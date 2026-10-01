import { Skeleton } from 'primereact/skeleton';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  type:
    | 'stat-card'
    | 'metric-card'
    | 'stat-grid-card'
    | 'chart-card'
    | 'chart-rows';
  count?: number;
}

const StatCardSkeleton: React.FC = () => (
  <div className="skeleton-card ems-card p-4 shadow-1 border-round-xl h-full flex flex-column justify-content-between">
    <div className="flex justify-content-between align-items-start mb-3">
      <Skeleton
        shape="rectangle"
        width="3rem"
        height="3rem"
        borderRadius="12px"
      />
    </div>
    <div className="flex flex-column gap-2">
      <Skeleton width="60%" height="0.85rem" />
      <Skeleton width="40%" height="1.6rem" />
      <Skeleton width="75%" height="0.75rem" />
    </div>
  </div>
);

const MetricCardSkeleton: React.FC = () => (
  <div
    className="skeleton-card border-round-xl p-4 h-full flex flex-column justify-content-between gap-5"
    style={{ background: 'var(--surface-100)' }}
  >
    <div className="flex align-items-center gap-2">
      <Skeleton
        shape="rectangle"
        width="2.5rem"
        height="2.5rem"
        borderRadius="8px"
      />
      <Skeleton width="60%" height="0.8rem" />
    </div>
    <div>
      <Skeleton width="40%" height="1.4rem" />
    </div>
  </div>
);

const StatGridCardSkeleton: React.FC = () => (
  <div className="skeleton-card ems-stat-grid-card h-full flex flex-column justify-content-between gap-2">
    <Skeleton width="55%" height="0.7rem" />
    <Skeleton width="40%" height="1.5rem" />
  </div>
);

const BAR_HEIGHTS = ['60%', '85%', '45%', '70%', '90%', '55%', '75%', '40%'];

const ChartCardSkeleton: React.FC = () => (
  <div className="skeleton-card ems-card shadow-1 border-round-xl p-3 h-full min-h-30rem flex flex-column">
    {/* Header */}
    <div className="flex align-items-center gap-3 mb-3">
      <Skeleton
        shape="rectangle"
        width="2.75rem"
        height="2.75rem"
        borderRadius="8px"
      />
      <div className="flex flex-column gap-2 flex-1">
        <Skeleton width="45%" height="0.85rem" />
        <Skeleton width="60%" height="0.7rem" />
      </div>
    </div>
    {/* Legend dots */}
    <div className="flex gap-3 mb-3">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} width="3.5rem" height="0.65rem" borderRadius="4px" />
      ))}
    </div>
    {/* Fake bar chart */}
    <div
      className="flex-1 flex align-items-end gap-2 px-2 pb-2"
      style={{ minHeight: '280px' }}
    >
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="flex-1 flex flex-column justify-content-end"
          style={{ height: '100%' }}
        >
          <Skeleton width="100%" height={h} borderRadius="4px 4px 0 0" />
        </div>
      ))}
    </div>
  </div>
);

const ROW_WIDTHS = ['100%', '70%', '85%', '55%', '90%', '65%'];

const ChartRowsSkeleton: React.FC = () => (
  <div className="skeleton-card flex flex-column gap-3 h-full justify-content-center px-2">
    {ROW_WIDTHS.map((w, i) => (
      <div key={i} className="flex align-items-center gap-3">
        <Skeleton width="5rem" height="0.7rem" />
        <Skeleton width={w} height="1.4rem" borderRadius="0 4px 4px 0" />
      </div>
    ))}
  </div>
);

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'stat-card') {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} className="col-12 md:col-6 lg:col">
            <StatCardSkeleton />
          </div>
        ))}
      </>
    );
  }

  if (type === 'metric-card') {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} className="col-12 sm:col-6 lg:col p-2">
            <MetricCardSkeleton />
          </div>
        ))}
      </>
    );
  }

  if (type === 'stat-grid-card') {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} className="col-6">
            <StatGridCardSkeleton />
          </div>
        ))}
      </>
    );
  }

  if (type === 'chart-card') {
    return <ChartCardSkeleton />;
  }

  if (type === 'chart-rows') {
    return <ChartRowsSkeleton />;
  }

  return null;
};

export default SkeletonLoader;
