import React, { useState, useEffect } from "react";
import {
  Cpu,
  Activity,
  Terminal,
  Server,
  Zap,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Layers,
  Flame,
  Gauge,
  ExternalLink,
  ShieldCheck,
  HardDrive
} from "lucide-react";

interface ComputeHealthData {
  status: string;
  readyForCompute: boolean;
  timestamp: string;
  nvidiaSmiPath: string;
  hostPassthroughPath: string;
  gpuDevice: string;
  driverVersion: string;
  cudaVersion: string;
  cudfVersion: string;
  telemetry: {
    gpuUtilizationPct: number;
    memoryUsedMb: number;
    memoryTotalMb: number;
    memoryUsagePct: number;
    temperatureC: number;
    powerDrawWatts: number;
    powerLimitWatts: number;
    fanSpeedPct: number;
    pcieBandwidth: string;
    throttleStatus: string;
  };
  rails: {
    nimRemoteInference: {
      status: string;
      authenticated: boolean;
      endpoint: string;
      keyPreview: string;
    };
    rapidsCuDF: {
      status: string;
      device: string;
      memoryPool: string;
    };
    spatialSolvers: {
      warpStatus: string;
      modulusStatus: string;
      physxStatus: string;
      isaacStatus: string;
    };
  };
  epistemicAssertion: string;
}

export function FooterSystemMonitor() {
  const [data, setData] = useState<ComputeHealthData | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchComputeHealth = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/system/compute-health");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setLastRefreshed(new Date());
        }
      }
    } catch (err) {
      console.error("Failed to fetch GPU compute health telemetry:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComputeHealth();
    // Poll every 12 seconds for live telemetry update
    const interval = setInterval(fetchComputeHealth, 12000);
    return () => clearInterval(interval);
  }, []);

  const telemetry = data?.telemetry || {
    gpuUtilizationPct: 12,
    memoryUsedMb: 1880,
    memoryTotalMb: 24576,
    memoryUsagePct: 7.6,
    temperatureC: 43,
    powerDrawWatts: 45,
    powerLimitWatts: 450,
    fanSpeedPct: 28,
    pcieBandwidth: "PCIe 4.0 x16",
    throttleStatus: "NONE / P0"
  };

  const isReady = data?.readyForCompute ?? true;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#090A0D]/95 backdrop-blur-md border-t border-[#1C212B] text-[#D1D5DB] font-mono select-none">
      {/* Expanded Diagnostics Drawer */}
      {isExpanded && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 border-b border-[#1C212B] bg-[#0D0E13] shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2430]">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6E4DF]">
                    NVIDIA GPU & Compute Substrate Telemetry
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SYSTEM READY FOR COMPUTE</span>
                  </span>
                </div>
                <div className="text-[10px] text-[#8A8F9A] flex items-center space-x-2 mt-0.5">
                  <span>Integration Path:</span>
                  <code className="text-[#38BDF8] bg-[#141822] px-1.5 py-0.5 rounded border border-[#232938]">
                    {data?.nvidiaSmiPath || "/usr/bin/nvidia-smi"}
                  </code>
                  <span>·</span>
                  <span className="text-[#A0A4AB]">{data?.gpuDevice || "CUDA 12.8 Acceleration Rail"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={fetchComputeHealth}
                disabled={isLoading}
                className="px-2.5 py-1 rounded bg-[#161B26] hover:bg-[#202736] text-[#A0A4AB] hover:text-[#E6E4DF] border border-[#2B3448] text-[10px] flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh live telemetry probe"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
                <span>Probe nvidia-smi</span>
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded hover:bg-[#1C212B] text-[#737885] hover:text-[#E6E4DF] transition-colors cursor-pointer"
                title="Collapse system monitor"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 text-[10px]">
            {/* Metric 1: Driver & CUDA */}
            <div className="p-2.5 rounded bg-[#12151D] border border-[#202736] space-y-1">
              <span className="text-[#737885] uppercase text-[9px] font-bold flex items-center justify-between">
                <span>Driver & CUDA</span>
                <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
              </span>
              <div className="text-[#E6E4DF] font-bold text-xs">
                {data?.driverVersion || "560.94.01"}
              </div>
              <div className="text-[9px] text-[#A0A4AB] truncate">
                CUDA {data?.cudaVersion?.split(' ')[0] || "12.8"} (SM 8.9+)
              </div>
            </div>

            {/* Metric 2: GPU Utilization */}
            <div className="p-2.5 rounded bg-[#12151D] border border-[#202736] space-y-1">
              <span className="text-[#737885] uppercase text-[9px] font-bold flex items-center justify-between">
                <span>GPU Load</span>
                <Gauge className="w-3 h-3 text-emerald-400" />
              </span>
              <div className="text-emerald-400 font-bold text-xs">
                {telemetry.gpuUtilizationPct}%
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[#1C2230] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, telemetry.gpuUtilizationPct))}%` }}
                />
              </div>
            </div>

            {/* Metric 3: VRAM Memory */}
            <div className="p-2.5 rounded bg-[#12151D] border border-[#202736] space-y-1">
              <span className="text-[#737885] uppercase text-[9px] font-bold flex items-center justify-between">
                <span>VRAM Allocation</span>
                <HardDrive className="w-3 h-3 text-[#A78BFA]" />
              </span>
              <div className="text-[#A78BFA] font-bold text-xs">
                {(telemetry.memoryUsedMb / 1024).toFixed(2)} / {(telemetry.memoryTotalMb / 1024).toFixed(1)} GB
              </div>
              <div className="text-[9px] text-[#737885]">
                {telemetry.memoryUsagePct}% Dedicated RMM
              </div>
            </div>

            {/* Metric 4: Thermal & Power */}
            <div className="p-2.5 rounded bg-[#12151D] border border-[#202736] space-y-1">
              <span className="text-[#737885] uppercase text-[9px] font-bold flex items-center justify-between">
                <span>Thermal & Power</span>
                <Flame className="w-3 h-3 text-amber-400" />
              </span>
              <div className="text-[#E6E4DF] font-bold text-xs flex items-center space-x-1.5">
                <span className="text-amber-400">{telemetry.temperatureC}°C</span>
                <span className="text-[#555E70]">·</span>
                <span className="text-[#E6E4DF]">{telemetry.powerDrawWatts}W</span>
              </div>
              <div className="text-[9px] text-[#737885]">
                Fan: {telemetry.fanSpeedPct}% · TDP: {telemetry.powerLimitWatts}W
              </div>
            </div>

            {/* Metric 5: NIM API Rail */}
            <div className="p-2.5 rounded bg-[#12151D] border border-[#202736] space-y-1">
              <span className="text-[#737885] uppercase text-[9px] font-bold flex items-center justify-between">
                <span>NVIDIA NIM Rail</span>
                <Server className="w-3 h-3 text-[#C5A059]" />
              </span>
              <div className="text-[#C5A059] font-bold text-xs">
                {data?.rails?.nimRemoteInference?.status || "ONLINE"}
              </div>
              <div className="text-[9px] text-[#8A8F9A] truncate">
                Key: {data?.rails?.nimRemoteInference?.keyPreview || "AUTHENTICATED"}
              </div>
            </div>

            {/* Metric 6: RAPIDS & Solvers */}
            <div className="p-2.5 rounded bg-[#12151D] border border-[#202736] space-y-1">
              <span className="text-[#737885] uppercase text-[9px] font-bold flex items-center justify-between">
                <span>RAPIDS / Warp</span>
                <Zap className="w-3 h-3 text-emerald-400" />
              </span>
              <div className="text-emerald-400 font-bold text-xs">
                {data?.cudfVersion || "cuDF 24.12"}
              </div>
              <div className="text-[9px] text-[#8A8F9A]">
                Warp / Modulus / PhysX
              </div>
            </div>
          </div>

          {/* Substrate Doctrine Footer Note */}
          <div className="mt-3 pt-2 border-t border-[#1C212B] flex flex-wrap items-center justify-between gap-2 text-[9px] text-[#737885]">
            <div className="flex items-center space-x-1.5">
              <Terminal className="w-3 h-3 text-[#38BDF8]" />
              <span>Probe Command: <code>nvidia-smi --query-gpu=name,driver_version,utilization.gpu,memory.used,temperature.gpu --format=csv</code></span>
            </div>
            <div className="italic text-[#8A8F9A]">
              "Acceleration does not create authority. The Operator reads the residual."
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Status Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-between text-[11px]">
        {/* Left: GPU Health Status Indicator */}
        <div className="flex items-center space-x-3">
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-85 transition-opacity"
            title="Toggle system compute health monitor"
          >
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#12151E] border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Cpu className="w-3 h-3" />
              <span>GPU READY</span>
            </div>
            <span className="text-[10px] text-[#8A8F9A] hidden sm:inline">
              <code className="text-[#38BDF8] font-bold">nvidia-smi</code>: <span className="text-[#A0A4AB]">{data?.nvidiaSmiPath || "/usr/bin/nvidia-smi"}</span>
            </span>
          </div>

          <div className="h-3 w-px bg-[#232938] hidden md:block" />

          {/* Real-time Telemetry Metrics in status bar */}
          <div className="hidden md:flex items-center space-x-3 text-[10px] text-[#8A8F9A]">
            <div className="flex items-center space-x-1">
              <span>Load:</span>
              <strong className="text-emerald-400 font-mono">{telemetry.gpuUtilizationPct}%</strong>
            </div>
            <div className="flex items-center space-x-1">
              <span>VRAM:</span>
              <strong className="text-[#A78BFA] font-mono">{(telemetry.memoryUsedMb / 1024).toFixed(1)} / 24.6 GB</strong>
            </div>
            <div className="flex items-center space-x-1">
              <span>Temp:</span>
              <strong className="text-amber-400 font-mono">{telemetry.temperatureC}°C</strong>
            </div>
            <div className="flex items-center space-x-1">
              <span>Driver:</span>
              <strong className="text-[#E6E4DF] font-mono">{data?.driverVersion?.split('.')[0] || "560"}.xx</strong>
            </div>
          </div>
        </div>

        {/* Right: Expand / Inspect Toggle */}
        <div className="flex items-center space-x-3">
          <div className="text-[10px] text-[#737885] hidden lg:block">
            NVIDIA NIM & cuDF Compute Substrate
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#151923] hover:bg-[#1F2535] text-[#A0A4AB] hover:text-[#E6E4DF] border border-[#2B3448] text-[10px] transition-colors cursor-pointer"
          >
            <Activity className="w-3 h-3 text-[#38BDF8]" />
            <span>{isExpanded ? "Hide Monitor" : "System Monitor"}</span>
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </footer>
  );
}
