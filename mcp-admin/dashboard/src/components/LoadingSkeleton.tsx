import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 4 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: Math.min(rows, 8) }).map((_, i) => (
          <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-xl"></div>
        ))}
      </div>
      <div className="h-64 bg-slate-900 border border-slate-800 rounded-xl"></div>
    </div>
  );
};

