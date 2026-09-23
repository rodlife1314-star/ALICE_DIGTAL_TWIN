'use client';

import React from 'react';
import {
  EpistemicClass,
  ProvenanceSource,
  TelemetryContractItem,
} from '@/lib/physics-engine';
import ProvenanceBadge from './ProvenanceBadge';

interface GovernedTelemetryWidgetProps {
  item: TelemetryContractItem;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  highlight?: boolean;
}

export const GovernedTelemetryWidget: React.FC<GovernedTelemetryWidgetProps> = ({
  item,
  size = 'md',
  className = '',
  highlight = false,
}) => {
  // Structural governance verification: ensure item has required governance fields
  if (!item || !item.epistemicClass || !item.provenanceSource) {
    return (
      <div className="p-2 rounded bg-rose-950/60 border border-rose-600 text-rose-300 font-mono text-xs">
        [GOVERNANCE FAULT: Telemetry widget missing epistemicClass or provenanceSource]
      </div>
    );
  }

  const {
    label,
    formattedValue,
    unit,
    epistemicClass,
    provenanceSource,
    derivationId,
    toleranceOrCondition,
    governanceNote,
  } = item;

  return (
    <div
      className={`p-3 rounded-lg border font-mono transition-all ${
        highlight
          ? 'bg-slate-900/90 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/20'
          : 'bg-slate-950/80 border-slate-850 hover:border-slate-800'
      } ${className}`}
    >
      {/* Top Header: Label & Provenance Badges */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate" title={label}>
          {label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <ProvenanceBadge
            epistemicClass={epistemicClass}
            provenanceSource={provenanceSource}
            derivationId={derivationId}
            showSource={true}
            size="xs"
          />
        </div>
      </div>

      {/* Main Value Display */}
      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-bold tracking-tight ${
            size === 'lg'
              ? 'text-xl sm:text-2xl text-white'
              : size === 'sm'
              ? 'text-sm text-cyan-300'
              : 'text-base sm:text-lg text-slate-100'
          }`}
        >
          {formattedValue}
        </span>
        {unit && <span className="text-xs text-slate-400 font-normal">{unit}</span>}
      </div>

      {/* Footer Condition or Derivation ID */}
      {(toleranceOrCondition || derivationId || governanceNote) && (
        <div className="mt-1.5 pt-1 border-t border-slate-850/80 text-[9px] text-slate-400 flex items-center justify-between gap-2">
          {toleranceOrCondition ? (
            <span className="truncate text-amber-300/90" title={`Condition: ${toleranceOrCondition}`}>
              {toleranceOrCondition}
            </span>
          ) : (
            <span className="truncate text-slate-400" title={`Law: ${derivationId}`}>
              {derivationId}
            </span>
          )}
          {governanceNote && (
            <span className="text-[8px] text-slate-400 truncate max-w-[120px]" title={governanceNote}>
              {governanceNote}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default GovernedTelemetryWidget;
