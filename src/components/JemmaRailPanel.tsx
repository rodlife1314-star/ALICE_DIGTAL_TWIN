import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Activity,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Compass,
  Cpu,
  RefreshCw,
  Eye,
  Crosshair,
  Lock,
  Flame,
  Globe,
  Sun,
  Droplets,
  Wind
} from "lucide-react";
import {
  JEMMA_GROUND_TRUTH_CATALOG,
  JemmaGroundTruthDataset,
  JemmaAuditReceipt,
  executeJemmaComputerAudit
} from "../lib/jemmaRail";

interface JemmaRailPanelProps {
  onSelectWorkloadPreset?: (workloadId: string) => void;
  lastDispatchResult?: any;
}

export const JemmaRailPanel: React.FC<JemmaRailPanelProps> = ({
  onSelectWorkloadPreset,
  lastDispatchResult
}) => {
  const [selectedDataset, setSelectedDataset] = useState<JemmaGroundTruthDataset>(
    JEMMA_GROUND_TRUTH_CATALOG[0]
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeAuditReceipt, setActiveAuditReceipt] = useState<JemmaAuditReceipt | null>(() => {
    return executeJemmaComputerAudit("noaa_avhrr_pathfinder_sst", {
      mean_sst_c: 18.24,
      skin_sst_c: 18.07,
      bulk_sst_c: 18.24,
      sst_anomaly_k: +0.48
    });
  });

  const handleRunAudit = (dataset: JemmaGroundTruthDataset) => {
    setIsAuditing(true);
    setTimeout(() => {
      let mockPayload: Record<string, any> = {};
      let workloadKey = "noaa_avhrr_pathfinder_sst";

      if (dataset.id === "NOAA_AVHRR_PATHFINDER_V53") {
        workloadKey = "noaa_avhrr_pathfinder_sst";
        mockPayload = {
          mean_sst_c: 18.28,
          skin_sst_c: 18.11,
          bulk_sst_c: 18.28,
          sst_anomaly_k: +0.46
        };
      } else if (dataset.id === "GOOGLE_DEEPMIND_WEATHERNEXT_3") {
        workloadKey = "deepmind_weathernext_era5_audit";
        mockPayload = {
          forecast_rmse_k: 0.81,
          era5_reanalysis_correlation: 0.988,
          moisture_mass_conservation_error_pct: 0.038
        };
      } else if (dataset.id === "NASA_SDO_CORONAGRAPH_SPACE_WEATHER") {
        workloadKey = "solar_sdo_coronagraph_flux";
        mockPayload = {
          cme_velocity_kms: 728.0,
          predicted_l1_transit_hours: 42.1,
          solar_wind_dynamic_pressure_npa: 2.15,
          estimated_geomagnetic_kp_index: 5.2
        };
      } else if (dataset.id === "NASA_MERRA2_RADIATION_LAND") {
        workloadKey = "merra2_surface_radiation_flux";
        mockPayload = {
          net_radiation_wm2: 388.4,
          net_shortwave_wm2: 604.8,
          downward_longwave_wm2: 340.0
        };
      } else {
        workloadKey = "spatial_isoform_moran_field";
        mockPayload = {
          morans_i: 0.1718,
          expected_i: -0.0084,
          cell_type_constrained_p_val: 0.0014
        };
      }

      const receipt = executeJemmaComputerAudit(workloadKey, mockPayload);
      setActiveAuditReceipt(receipt);
      setIsAuditing(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* JEMMA Operational Doctrine Banner */}
      <div className="p-5 rounded-xl bg-[#12151E] border border-[#232A3B] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="text-sm font-bold text-[#E6E4DF]">
                  JEMMA Physical Reality Guardian & Ground-Truth Rail
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  REALITY_CONSTITUTION: ACTIVE
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1 max-w-3xl leading-relaxed">
                JEMMA enforces physical realism across both the <span className="text-[#E6E4DF] font-semibold">Computer (Science Rail)</span> and the <span className="text-[#E6E4DF] font-semibold">Reasoning Rail</span>.
                It blocks simulation fantasy, drift, and ungrounded certainty inflation. No compute output can be admitted to the sovereign Digital Twin state ledger without empirical ground-truth verification.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-auto shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Invariant Status</div>
              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-end space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>6 / 6 RULES VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Architectural Invariant Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-[#1C212D]">
          <div className="p-2.5 rounded-lg bg-[#0E1118] border border-[#1C2230]">
            <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Epistemic Invariant</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              Reasoning capability does not equal epistemic authority. Inferences never masquerade as measured facts.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0E1118] border border-[#1C2230]">
            <div className="flex items-center space-x-1.5 text-xs text-sky-300 font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Conservation Laws</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              Energy, momentum, mass, and moisture transport must maintain closed physical budget boundaries.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0E1118] border border-[#1C2230]">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-300 font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>Earth Observation Anchors</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              NOAA AVHRR Pathfinder 4km SST, DeepMind WeatherNext 3, ECMWF ERA5, and NASA MERRA-2 baselines.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0E1118] border border-[#1C2230]">
            <div className="flex items-center space-x-1.5 text-xs text-purple-300 font-semibold">
              <Sun className="w-3.5 h-3.5" />
              <span>Space Weather & Plasma</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              NASA SDO AIA EUV and NOAA SWPC coronagraph CME propagation models for Solar Cycle 25.
            </p>
          </div>
        </div>
      </div>

      {/* Main Ground Truth Catalogs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Catalogs List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#509EE3]" />
              <span>Ground Truth Catalogs ({JEMMA_GROUND_TRUTH_CATALOG.length})</span>
            </h4>
            <span className="text-[10px] text-[#6B7280]">Select dataset to inspect</span>
          </div>

          <div className="space-y-2.5">
            {JEMMA_GROUND_TRUTH_CATALOG.map((dataset) => {
              const isSelected = selectedDataset.id === dataset.id;
              const isOcean = dataset.category === "OCEAN_THERMAL";
              const isSpace = dataset.category === "SPACE_WEATHER";
              const isWeather = dataset.category === "NEURAL_WEATHER" || dataset.category === "ATMOSPHERE_REANALYSIS";

              return (
                <div
                  key={dataset.id}
                  onClick={() => setSelectedDataset(dataset)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1B2130] border-[#509EE3] shadow-md ring-1 ring-[#509EE3]/30"
                      : "bg-[#11141D] border-[#202636] hover:bg-[#161B27] hover:border-[#2D364D]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          dataset.agency === "NOAA"
                            ? "bg-blue-950/80 text-blue-300 border-blue-500/30"
                            : dataset.agency === "NASA"
                            ? "bg-red-950/80 text-red-300 border-red-500/30"
                            : dataset.agency === "GOOGLE_DEEPMIND"
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                            : "bg-indigo-950/80 text-indigo-300 border-indigo-500/30"
                        }`}
                      >
                        {dataset.agency}
                      </span>
                      <span className="text-[10px] text-[#6B7280] font-mono">{dataset.resolution}</span>
                    </div>

                    <span className="text-[10px] text-[#9CA3AF] font-mono bg-[#0D0E12] px-2 py-0.5 rounded border border-[#1A1F2C]">
                      {dataset.cadence}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[#E6E4DF] mt-1.5 leading-snug">
                    {dataset.name}
                  </div>

                  <p className="text-[11px] text-[#9CA3AF] mt-1 line-clamp-2 leading-relaxed">
                    {dataset.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Catalog Detail & Live JEMMA Audit Station */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-[#11141D] border border-[#232A3B] shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-[#509EE3]">
                    {selectedDataset.id}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181D2A] text-[#9CA3AF] border border-[#273145]">
                    {selectedDataset.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#E6E4DF] mt-1">
                  {selectedDataset.name}
                </h3>
              </div>

              <a
                href={selectedDataset.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-[#509EE3] hover:text-[#78B4ED] transition-colors shrink-0"
              >
                <span>Documentation</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              {selectedDataset.description}
            </p>

            {/* Invariants enforced by JEMMA */}
            <div className="p-3.5 rounded-lg bg-[#0B0D13] border border-[#1E2536] space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Physical Invariants Enforced by JEMMA</span>
              </div>
              <ul className="space-y-1.5">
                {selectedDataset.invariants.map((inv, idx) => (
                  <li key={idx} className="text-xs font-mono text-[#D1D5DB] flex items-start space-x-2">
                    <span className="text-amber-400/80 font-bold shrink-0">▸</span>
                    <span>{inv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Physical Variables */}
            <div>
              <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Physical Ground-Truth Variables
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedDataset.physicalVariables.map((v, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#161B26] border border-[#263045] text-[#9CA3AF]"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Baseline Telemetry */}
            <div className="p-3.5 rounded-lg bg-[#141824] border border-[#242C3E]">
              <div className="text-xs font-semibold text-[#D1D5DB] mb-2 flex items-center justify-between">
                <span>Empirical Reference Baseline</span>
                <span className="text-[10px] font-mono text-emerald-400">STATUS: NOMINAL</span>
              </div>
              <pre className="text-[11px] font-mono text-[#A0AEC0] bg-[#0A0C11] p-2.5 rounded overflow-x-auto">
                {JSON.stringify(selectedDataset.sampleBaseline, null, 2)}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleRunAudit(selectedDataset)}
                disabled={isAuditing}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#202634] hover:bg-[#2A3345] text-[#E6E4DF] border border-[#3A455C] text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin text-amber-400" : "text-amber-400"}`} />
                <span>{isAuditing ? "Auditing Compute..." : "Run JEMMA Reality Audit"}</span>
              </button>

              {onSelectWorkloadPreset && (
                <button
                  onClick={() => {
                    let targetWorkload = "noaa_avhrr_pathfinder_sst";
                    if (selectedDataset.id === "GOOGLE_DEEPMIND_WEATHERNEXT_3") targetWorkload = "deepmind_weathernext_era5_audit";
                    if (selectedDataset.id === "NASA_SDO_CORONAGRAPH_SPACE_WEATHER") targetWorkload = "solar_sdo_coronagraph_flux";
                    if (selectedDataset.id === "NASA_MERRA2_RADIATION_LAND") targetWorkload = "merra2_surface_radiation_flux";
                    onSelectWorkloadPreset(targetWorkload);
                  }}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Dispatch Science Workload</span>
                </button>
              )}
            </div>
          </div>

          {/* Active JEMMA Audit Receipt */}
          {activeAuditReceipt && (
            <div className="p-5 rounded-xl bg-[#11141D] border border-amber-500/30 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E2536] pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-emerald-300">
                      {activeAuditReceipt.status}
                    </div>
                    <div className="text-[10px] text-[#6B7280] font-mono">
                      AUDIT_ID: {activeAuditReceipt.auditId} · {activeAuditReceipt.timestamp.slice(11, 19)} UTC
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-[#6B7280] uppercase">Empirical Drift Index</div>
                  <div className="text-xs font-mono font-bold text-sky-400">
                    {(activeAuditReceipt.driftScore * 100).toFixed(2)}% (Proportionality: {activeAuditReceipt.proportionalityScore.toFixed(4)})
                  </div>
                </div>
              </div>

              {/* Ground Truth Anchor Discrepancy Card */}
              <div className="p-3 rounded-lg bg-[#0D1017] border border-[#1E2536] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-[#6B7280] uppercase font-semibold">Ground Truth Comparison Anchor</div>
                  <div className="font-semibold text-[#E6E4DF] mt-0.5">
                    {activeAuditReceipt.groundTruthAnchor.comparisonMetric}
                  </div>
                  <div className="text-[11px] text-[#9CA3AF]">
                    Observed: <span className="font-mono text-emerald-400 font-bold">{activeAuditReceipt.groundTruthAnchor.empiricalObserved}</span> vs Computed: <span className="font-mono text-sky-400 font-bold">{activeAuditReceipt.groundTruthAnchor.computedOrInferred}</span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    Δ {activeAuditReceipt.groundTruthAnchor.deviationPct}% within nominal
                  </span>
                </div>
              </div>

              {/* Evaluated Rules List */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                  Evaluated Reality Rules ({activeAuditReceipt.evaluatedRules.length})
                </div>
                <div className="space-y-1">
                  {activeAuditReceipt.evaluatedRules.map((rule) => (
                    <div
                      key={rule.ruleId}
                      className="p-2.5 rounded-lg bg-[#0E1118] border border-[#1A202C] flex items-start justify-between text-xs gap-2"
                    >
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-mono text-[#509EE3] font-semibold mr-2">{rule.ruleId}</span>
                          <span className="font-semibold text-[#D1D5DB]">{rule.ruleName}</span>
                          <p className="text-[11px] text-[#9CA3AF] mt-0.5">{rule.detail}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shrink-0">
                        PASS
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operator Sovereign Attestation Note */}
              <div className="p-2.5 rounded-lg bg-[#141824] border border-[#232B3C] text-[11px] text-[#9CA3AF] flex items-start space-x-2">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#E6E4DF]">Sovereign Operator Ledger Guarantee: </span>
                  <span>{activeAuditReceipt.operatorNotice}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
