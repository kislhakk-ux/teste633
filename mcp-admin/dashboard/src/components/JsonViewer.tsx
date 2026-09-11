import React from 'react';

interface JsonViewerProps {
  data: any;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  return (
    <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto selection:bg-emerald-900 selection:text-white max-h-96">
      <code>{jsonString}</code>
    </pre>
  );
};
