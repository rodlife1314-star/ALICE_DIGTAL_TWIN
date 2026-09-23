'use client';

import React, { useState, useEffect } from 'react';
import {
  SimulationParameters,
  GEOMETRY_DEFINITIONS,
} from '@/lib/physics-engine';
import { Sparkles, X, Send, Cpu, CheckCircle2, AlertCircle, Loader2, Bot, ShieldCheck } from 'lucide-react';

interface ProviderStatus {
  provider: 'gemini' | 'openai' | 'nvidia';
  name: string;
  configured: boolean;
  defaultModel: string;
  description: string;
}

interface TheoreticalSynthesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: SimulationParameters;
  nodalTelemetry: { powers: number[]; efficiency: number; uniformity: number };
}

export default function TheoreticalSynthesisModal({
  isOpen,
  onClose,
  params,
  nodalTelemetry,
}: TheoreticalSynthesisModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'openai' | 'nvidia'>('gemini');
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [activeProviderUsed, setActiveProviderUsed] = useState<string | null>(null);
  const [providersStatus, setProvidersStatus] = useState<ProviderStatus[]>([
    {
      provider: 'gemini',
      name: 'Google Gemini',
      configured: false,
      defaultModel: 'gemini-3.8-flash',
      description: 'Google GenAI engine',
    },
    {
      provider: 'openai',
      name: 'OpenAI',
      configured: false,
      defaultModel: 'gpt-4o',
      description: 'OpenAI GPT-4o frontier reasoning',
    },
    {
      provider: 'nvidia',
      name: 'NVIDIA NIM',
      configured: false,
      defaultModel: 'meta/llama-3.3-70b-instruct',
      description: 'NVIDIA AI Foundation / Llama-3.3-70B',
    },
  ]);

  // Fetch status on modal open
  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/gemini/analyze')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.providers)) {
          setProvidersStatus(data.providers);
          setSelectedProvider((prev) => {
            const prevConfigured = data.providers.find(
              (p: ProviderStatus) => p.provider === prev
            )?.configured;
            if (prevConfigured) return prev;
            const firstAvailable = data.providers.find((p: ProviderStatus) => p.configured);
            return firstAvailable ? firstAvailable.provider : prev;
          });
        }
      })
      .catch((err) => {
        console.warn('Could not query AI provider status:', err);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const currentGeom = GEOMETRY_DEFINITIONS[params.geometry];

  const handleRunAnalysis = async (customPrompt?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geometryId: params.geometry,
          geometryName: currentGeom.name,
          sourceHeight: params.sourceHeight,
          efficiency: nodalTelemetry.efficiency,
          uniformity: nodalTelemetry.uniformity,
          powers: nodalTelemetry.powers,
          permittivity: params.permittivity,
          conductivity: params.conductivity,
          boundaryReflection: params.boundaryReflection,
          question: customPrompt || query,
          provider: selectedProvider,
        }),
      });

      if (!res.ok) {
        let errMessage = `HTTP ${res.status}`;
        try {
          const errData = await res.json();
          if (errData.analysis) {
            setAnalysisText(errData.analysis);
            setActiveModel(errData.model || null);
            setActiveProviderUsed(errData.provider || selectedProvider);
            return;
          }
          if (errData.error) errMessage = errData.error;
        } catch {
          // ignore non-json error
        }
        setAnalysisText(`Theoretical Synthesis Note: ${errMessage}. Poynting theorem equations active.`);
        return;
      }

      const data = await res.json();
      setAnalysisText(data.analysis || data.text || 'Analysis completed.');
      setActiveModel(data.model || null);
      setActiveProviderUsed(data.provider || selectedProvider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network request failure';
      setAnalysisText(`Unable to reach synthesis service (${msg}). Local Poynting conservation theorems active.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        id="operator-synthesis-modal"
        className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-slate-100">
                Operator Theoretical Synthesis
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Evaluating {currentGeom.name} • S = E × H Topology
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-mono">
          {/* Multi-Provider Selection Bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                Select AI Engine Provider:
              </span>
              <span className="text-[10px] text-slate-500">
                Managed via AI Studio Secrets
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {providersStatus.map((p) => {
                const isSelected = selectedProvider === p.provider;
                return (
                  <button
                    key={p.provider}
                    type="button"
                    onClick={() => setSelectedProvider(p.provider)}
                    className={`p-2.5 rounded-lg border text-left transition-all relative ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <Cpu className={`w-3 h-3 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`} />
                        {p.name}
                      </span>
                      {p.configured ? (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Key Active
                        </span>
                      ) : (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-0.5">
                          Physics Fallback
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      {p.defaultModel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Prompts */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">
              Theoretical Operator Query Templates:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Why does G6 have optimal hexagonal coupling?',
                'Analyze Poynting vector vortex formation in odd polygons (G3, G5).',
                'How does source elevation z0 alter standing wave interference?',
                'Evaluate the asymptotic convergence toward continuous circle G_inf.',
              ].map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(template);
                    handleRunAnalysis(template);
                  }}
                  className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:border-purple-500/40 hover:text-purple-300 text-[11px] transition-colors text-left"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Output Container */}
          <div className="min-h-[180px] p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2.5 text-purple-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-mono">
                  Synthesizing with {providersStatus.find(p => p.provider === selectedProvider)?.name || selectedProvider}...
                </span>
              </div>
            ) : analysisText ? (
              <div>
                {activeModel && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Provider: <strong className="text-slate-200 capitalize">{activeProviderUsed || selectedProvider}</strong>
                    </span>
                    <span className="font-mono text-purple-300">
                      Model: {activeModel}
                    </span>
                  </div>
                )}
                <div className="whitespace-pre-line text-slate-200">
                  {analysisText}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 italic py-8 text-center">
                Select an engine above (Google Gemini, OpenAI, or NVIDIA NIM) and click a template or submit a custom inquiry.
              </div>
            )}
          </div>

          {/* Custom Input */}
          <div className="flex items-center gap-2">
            <input
              id="input-synthesis-query"
              suppressHydrationWarning
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Ask ${providersStatus.find(p => p.provider === selectedProvider)?.name || 'AI'} about Poynting field topology...`}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-xs font-mono"
              onKeyDown={e => {
                if (e.key === 'Enter') handleRunAnalysis();
              }}
            />
            <button
              onClick={() => handleRunAnalysis()}
              disabled={loading}
              className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors flex items-center gap-1.5 text-xs shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              Analyze
            </button>
          </div>

          {/* Secrets Configuration Guidance Footnote */}
          <div className="p-2 rounded bg-slate-950/60 border border-slate-850 flex items-start gap-2 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Secrets Management:</strong> API keys for <code className="text-slate-400">GEMINI_API_KEY</code>, <code className="text-slate-400">OPENAI_API_KEY</code>, and <code className="text-slate-400">NVIDIA_API_KEY</code> are injected securely via the <strong>Settings &gt; Secrets</strong> panel in the Google AI Studio menu.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
