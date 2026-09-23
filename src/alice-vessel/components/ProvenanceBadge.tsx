'use client';

import React from 'react';
import {
  ProvenanceTag,
  SemanticLayer,
  EpistemicClass,
  ProvenanceSource,
} from '@/lib/physics-engine';

interface ProvenanceBadgeProps {
  tag?: ProvenanceTag | string;
  epistemicClass?: EpistemicClass;
  provenanceSource?: ProvenanceSource;
  derivationId?: string;
  layer?: SemanticLayer;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  showLayer?: boolean;
  showSource?: boolean;
}

type CanonicalTag = 'MEASURED' | 'DERIVED' | 'SIMULATED' | 'HYPOTHESIS' | 'INFERRED' | 'OPERATOR_DOCTRINE' | 'CONFIGURED_INPUT';

const CANONICAL_MAP: Record<string, CanonicalTag> = {
  MEASURED: 'MEASURED',
  DERIVED: 'DERIVED',
  SIMULATED: 'SIMULATED',
  HYPOTHESIS: 'HYPOTHESIS',
  OPERATOR_DOCTRINE: 'OPERATOR_DOCTRINE',
  CONFIGURED_INPUT: 'CONFIGURED_INPUT',
  HYPOTHETICAL: 'HYPOTHESIS',
  INFERRED: 'INFERRED',
  STATIC: 'DERIVED',
};

const TAG_STYLES: Record<CanonicalTag, { bg: string; text: string; border: string; tooltip: string }> = {
  MEASURED: {
    bg: 'bg-emerald-950/70',
    text: 'text-emerald-300',
    border: 'border-emerald-500/50',
    tooltip: 'MEASURED: Verified physical telemetry with hardware acquisition proof',
  },
  DERIVED: {
    bg: 'bg-sky-950/70',
    text: 'text-sky-300',
    border: 'border-sky-500/50',
    tooltip: 'DERIVED: Mathematical Maxwell/Poynting/boundary geometric invariant',
  },
  SIMULATED: {
    bg: 'bg-cyan-950/70',
    text: 'text-cyan-300',
    border: 'border-cyan-500/50',
    tooltip: 'SIMULATED: Discretized real-time simulation kernel result',
  },
  INFERRED: {
    bg: 'bg-violet-950/70',
    text: 'text-violet-300',
    border: 'border-violet-500/50',
    tooltip: 'INFERRED: Cognitive hypothesis or model interpretation (requires promotion)',
  },
  HYPOTHESIS: {
    bg: 'bg-amber-950/70',
    text: 'text-amber-300',
    border: 'border-amber-500/50',
    tooltip: 'HYPOTHESIS: Theoretical construct or proposed model mechanism',
  },
  OPERATOR_DOCTRINE: {
    bg: 'bg-purple-950/70',
    text: 'text-purple-300',
    border: 'border-purple-500/50',
    tooltip: 'OPERATOR_DOCTRINE: Operational rule, flight procedure, or design heuristic',
  },
  CONFIGURED_INPUT: {
    bg: 'bg-orange-950/70',
    text: 'text-orange-300',
    border: 'border-orange-500/50',
    tooltip: 'CONFIGURED_INPUT: Operator touch, gesture, slider, or parameter configuration',
  },
};

const SOURCE_STYLES: Record<ProvenanceSource, { badge: string; label: string }> = {
  DETERMINISTIC_KERNEL: { badge: 'bg-blue-950 text-blue-300 border-blue-500/40', label: 'KERNEL' },
  GEMINI: { badge: 'bg-indigo-950 text-indigo-300 border-indigo-500/40', label: 'GEMINI' },
  OPENAI: { badge: 'bg-emerald-950 text-emerald-300 border-emerald-500/40', label: 'OPENAI' },
  NVIDIA: { badge: 'bg-lime-950 text-lime-300 border-lime-500/40', label: 'NVIDIA' },
};

const LAYER_LABELS: Record<SemanticLayer, { text: string; bg: string; border: string; color: string }> = {
  ESTABLISHED_PHYSICS: {
    text: 'Established Physics',
    bg: 'bg-emerald-950/50',
    border: 'border-emerald-500/30',
    color: 'text-emerald-300',
  },
  MODEL_HYPOTHESIS: {
    text: 'Model Hypothesis',
    bg: 'bg-amber-950/50',
    border: 'border-amber-500/30',
    color: 'text-amber-300',
  },
  OPERATOR_DOCTRINE: {
    text: 'Operator Doctrine',
    bg: 'bg-cyan-950/50',
    border: 'border-cyan-500/30',
    color: 'text-cyan-300',
  },
};

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  tag,
  epistemicClass,
  provenanceSource,
  derivationId,
  layer,
  size = 'xs',
  className = '',
  showLayer = false,
  showSource = false,
}) => {
  const activeClass = epistemicClass || (tag ? CANONICAL_MAP[String(tag).toUpperCase()] : 'HYPOTHESIS');
  const normTag = CANONICAL_MAP[String(activeClass).toUpperCase()] || 'HYPOTHESIS';
  const style = TAG_STYLES[normTag];

  const sizeClasses =
    size === 'xs'
      ? 'text-[8px] px-1 py-0.2 tracking-wider'
      : size === 'sm'
      ? 'text-[9px] px-1.5 py-0.5 tracking-wider'
      : 'text-[10px] px-2 py-0.5 tracking-wider font-semibold';

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {showLayer && layer && (
        <span
          className={`font-mono text-[8px] uppercase px-1 py-0.2 rounded border ${LAYER_LABELS[layer].bg} ${LAYER_LABELS[layer].color} ${LAYER_LABELS[layer].border}`}
          title={`Semantic Layer: ${LAYER_LABELS[layer].text}`}
        >
          {LAYER_LABELS[layer].text}
        </span>
      )}
      <span
        className={`inline-flex items-center font-mono font-bold uppercase rounded border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}
        title={`${style.tooltip}${derivationId ? ` | Law: ${derivationId}` : ''}`}
      >
        [{normTag}]
      </span>
      {showSource && provenanceSource && (
        <span
          className={`font-mono text-[8px] uppercase px-1 py-0.2 rounded border font-semibold ${SOURCE_STYLES[provenanceSource].badge}`}
          title={`Computational Engine: ${provenanceSource}`}
        >
          {SOURCE_STYLES[provenanceSource].label}
        </span>
      )}
    </span>
  );
};

export default ProvenanceBadge;
