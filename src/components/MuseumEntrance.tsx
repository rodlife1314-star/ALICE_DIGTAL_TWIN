import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  HelpCircle,
  Activity,
  Layers,
  Shield,
  Zap,
  Info,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Database,
  Cpu,
  User,
  CheckCircle,
  Eye,
  Play,
  Activity as VelocityIcon
} from "lucide-react";

interface MuseumEntranceProps {
  onExplorePreset?: (presetDesc: string) => void;
  inlineView?: boolean;
}

export function MuseumEntrance({ onExplorePreset, inlineView = false }: MuseumEntranceProps) {
  const [activeTab, setActiveTab] = useState<"welcome" | "audit" | "vocabulary" | "doctrine" | "readme" | "cirq" | "cuml" | "cloudbuild" | "ngc">("welcome");
  
  // cuML Interactive Structural Perception Sandbox States
  const [cumlActiveAlgo, setCumlActiveAlgo] = useState<"umap" | "clustering" | "knn" | "regression">("umap");
  const [cumlSimulating, setCumlSimulating] = useState<boolean>(false);
  const [cumlLogs, setCumlLogs] = useState<string[]>([]);
  const [cumlParams, setCumlParams] = useState({
    nNeighbors: 15,
    minClusterSize: 5,
    kNeighbors: 3,
    decayDegree: 2
  });
  const cumlLogsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cumlLogsEndRef.current) {
      cumlLogsEndRef.current.scrollTop = cumlLogsEndRef.current.scrollHeight;
    }
  }, [cumlLogs]);

  // Cloud Build Simulation States
  const [buildStatus, setBuildStatus] = useState<"idle" | "installing" | "linting" | "docker_build" | "docker_push" | "deploying" | "finished">("idle");
  const [buildProgress, setBuildProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const terminalLogsEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (terminalLogsEndRef.current) {
      terminalLogsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Quantum Cirq Cognitive Simulator States
  const [cirqActiveStep, setCirqActiveStep] = useState<number>(-1);
  const [cirqSimulating, setCirqSimulating] = useState<boolean>(false);
  const [cirqLogs, setCirqLogs] = useState<string[]>([]);
  const cirqLogsEndRef = useRef<HTMLDivElement>(null);

  const getEntropyLabel = (step: number) => {
    if (step === -1) return "S = 1.0 (Superposed - Awaiting Observation)";
    if (step === 0) return "S = 1.0 (Superposed - Observation)";
    if (step === 1) return "S = 0.8 (Aperture Opened - Evidence Gathering)";
    if (step === 2) return "S = 0.6 (Entangled - Challenge Layer Active)";
    if (step === 3) return "S = 0.4 (Interpreted - Governance Substrate Alignment)";
    if (step === 4) return "S = 0.2 (Verified - Safe Bounds Verified)";
    if (step === 5) return "S = 0.1 (Decided - Operator Dispatch Pending)";
    if (step === 6) return "S = 0.0 (Collapsed - Sovereign Physical Action)";
    return "S = 1.0 (Superposed)";
  };

  useEffect(() => {
    if (cirqLogsEndRef.current) {
      cirqLogsEndRef.current.scrollTop = cirqLogsEndRef.current.scrollHeight;
    }
  }, [cirqLogs]);

  // NVIDIA NGC Catalog Exploration States
  const [ngcActiveBlock, setNgcActiveBlock] = useState<"triton" | "rapids" | "cuda" | "isaac" | "nim">("triton");
  const [ngcSimulating, setNgcSimulating] = useState<boolean>(false);
  const [ngcProgress, setNgcProgress] = useState<number>(0);
  const [ngcLogs, setNgcLogs] = useState<string[]>([]);
  const [ngcParams, setNgcParams] = useState({
    tritonInstances: 2,
    rapidsGpuMem: 32,
    cudaThreads: 512,
    isaacFrequency: 120,
    nimPrecision: "fp16" as "fp16" | "int8" | "int4"
  });
  const [ngcSelectedStack, setNgcSelectedStack] = useState<string[]>(["cuda", "rapids", "triton"]);
  const [ngcManifestType, setNgcManifestType] = useState<"docker" | "k8s">("docker");
  const ngcLogsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ngcLogsEndRef.current) {
      ngcLogsEndRef.current.scrollTop = ngcLogsEndRef.current.scrollHeight;
    }
  }, [ngcLogs]);

  // DFlash Speculative Decoding States
  const [selectedSubstrateLevel, setSelectedSubstrateLevel] = useState<number>(4);
  const [dflashMethod, setDflashMethod] = useState<"autoregressive" | "eagle" | "dflash">("dflash");
  const [dflashSimulating, setDflashSimulating] = useState<boolean>(false);
  const [dflashBlockSize, setDflashBlockSize] = useState<number>(6);
  const [dflashTokens, setDflashTokens] = useState<Array<{ id: number; text: string; type: "verified" | "draft" | "failed" | "pending" }>>([]);
  const [dflashLogs, setDflashLogs] = useState<string[]>([]);
  const dflashLogsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dflashLogsEndRef.current) {
      dflashLogsEndRef.current.scrollTop = dflashLogsEndRef.current.scrollHeight;
    }
  }, [dflashLogs]);

  const runDflashSimulation = async () => {
    if (dflashSimulating) return;
    setDflashSimulating(true);
    setDflashTokens([]);
    setDflashLogs([
      "Initializing Sovereign Speculative Decoding Simulation Substrate...",
      `Blackwell architecture initialized. Compute target: 15x serving capacity enhancement.`,
      `Configuration: Method = ${dflashMethod.toUpperCase()}, Block Size = ${dflashBlockSize}`
    ]);

    const sampleTokens = [
      "Path", "finder", " se", "par", "ates", " raw", " hard", "ware", " ac", "cel", 
      "er", "ation", " from", " cog", "ni", "tive", " au", "thor", "ity", "."
    ];

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    if (dflashMethod === "autoregressive") {
      setDflashLogs(prev => [...prev, "[SYSTEM] Starting traditional autoregressive sequence. Expecting bandwidth stalls."]);
      await sleep(600);
      
      const currentList: Array<{ id: number; text: string; type: "verified" | "draft" | "failed" | "pending" }> = [];
      for (let i = 0; i < sampleTokens.length; i++) {
        const token = sampleTokens[i];
        currentList.push({ id: i, text: token, type: "verified" });
        setDflashTokens([...currentList]);
        setDflashLogs(prev => [
          ...prev, 
          `[GPU-0] AutoRegressive Step ${i + 1}/20: Token "${token}" resolved. GPU stalled for HBM3e weight load. Core Occupancy: ~7.2%.`
        ]);
        await sleep(150);
      }
      setDflashLogs(prev => [
        ...prev, 
        `[SUCCESS] Autoregressive decoding complete. Total latency: 3120ms. Mean Throughput: 125 t/s.`,
        `[CONCLUSION] GPU spent 92.8% of clock cycles waiting for next sequential memory retrieval.`
      ]);

    } else if (dflashMethod === "eagle") {
      setDflashLogs(prev => [...prev, "[SYSTEM] Starting EAGLE-style draft-chain sequential speculative decoding."]);
      await sleep(600);
      
      const currentList: Array<{ id: number; text: string; type: "verified" | "draft" | "failed" | "pending" }> = [];
      const chainSize = 4;
      let tokenIndex = 0;

      while (tokenIndex < sampleTokens.length) {
        setDflashLogs(prev => [...prev, `[EAGLE] Spinning up draft model (10B params) for step index ${tokenIndex}...`]);
        await sleep(200);

        // Draft sequentially
        const draftIds: number[] = [];
        for (let d = 0; d < chainSize && tokenIndex + d < sampleTokens.length; d++) {
          const idx = tokenIndex + d;
          const token = sampleTokens[idx];
          currentList.push({ id: idx, text: token, type: "draft" });
          draftIds.push(idx);
          setDflashTokens([...currentList]);
          setDflashLogs(prev => [...prev, `[DRAFT-MODEL] Drafted token: "${token}" (Step ${d + 1}/${chainSize})`]);
          await sleep(60);
        }

        setDflashLogs(prev => [...prev, `[TARGET-MODEL] Launching parallel verification on main 70B target model...`]);
        await sleep(250);

        // Verify
        // In the second group, let's inject a draft mismatch/rejection at the last token
        const isSecondGroup = tokenIndex === 4;
        if (isSecondGroup && draftIds.length === 4) {
          // Reject the last drafted token "ware"
          for (let d = 0; d < 3; d++) {
            currentList[tokenIndex + d].type = "verified";
          }
          currentList[tokenIndex + 3].type = "failed";
          setDflashTokens([...currentList]);
          setDflashLogs(prev => [
            ...prev,
            `[TARGET-MODEL] Speculative verification: Mismatch detected on token "${sampleTokens[tokenIndex + 3]}".`,
            `[GOVERNANCE] Correcting draft branch and restoring evidence continuity. Executing corrector roll-back...`
          ]);
          await sleep(300);
          
          currentList[tokenIndex + 3].type = "verified";
          setDflashTokens([...currentList]);
          setDflashLogs(prev => [...prev, `[TARGET-MODEL] Branch aligned. Corrected token "${sampleTokens[tokenIndex + 3]}" validated.`]);
          tokenIndex += 4;
        } else {
          // All accepted
          for (let d = 0; d < draftIds.length; d++) {
            currentList[tokenIndex + d].type = "verified";
          }
          setDflashTokens([...currentList]);
          setDflashLogs(prev => [...prev, `[TARGET-MODEL] Speculative verification: All drafted tokens accepted. Speculative compression ratio: ${draftIds.length}.0x.`]);
          tokenIndex += draftIds.length;
        }
        await sleep(200);
      }
      setDflashLogs(prev => [
        ...prev,
        `[SUCCESS] EAGLE Speculative decoding completed. Total latency: 1980ms. Mean Throughput: 340 t/s.`,
        `[CONCLUSION] EAGLE pipeline bypassed sequential execution, but draft generation remained bandwidth-bound.`
      ]);

    } else {
      // DFlash (Block Diffusion Drafter)
      setDflashLogs(prev => [
        ...prev, 
        "[SYSTEM] Starting Blackwell-optimized DFlash Speculative Decoding.",
        "[BLACKWELL] Utilizing Block Diffusion Drafter to predict multiple tokens in parallel."
      ]);
      await sleep(600);

      const currentList: Array<{ id: number; text: string; type: "verified" | "draft" | "failed" | "pending" }> = [];
      let tokenIndex = 0;

      while (tokenIndex < sampleTokens.length) {
        const currentBlockSize = Math.min(dflashBlockSize, sampleTokens.length - tokenIndex);
        setDflashLogs(prev => [...prev, `[DFLASH] Diffusing block of size ${currentBlockSize} simultaneously in a single forward pass...`]);
        await sleep(200);

        // Draft all tokens in block simultaneously
        for (let b = 0; b < currentBlockSize; b++) {
          const idx = tokenIndex + b;
          currentList.push({ id: idx, text: sampleTokens[idx], type: "draft" });
        }
        setDflashTokens([...currentList]);
        setDflashLogs(prev => [...prev, `[DFLASH-DRAFTER] Multi-token diffusion block successfully loaded to Blackwell registers.`]);
        await sleep(100);

        setDflashLogs(prev => [...prev, `[TARGET-MODEL-VERIFY] Executing Blackwell parallel Tensor Core verification sweep...`]);
        await sleep(150);

        // Verify all at once
        for (let b = 0; b < currentBlockSize; b++) {
          currentList[tokenIndex + b].type = "verified";
        }
        setDflashTokens([...currentList]);
        setDflashLogs(prev => [
          ...prev, 
          `[TARGET-MODEL-VERIFY] Verification accepted entire block. Active Blackwell Core Utilization: 94.8%.`,
          `[DFLASH-TELEMETRY] Block verification speedup: 15.0x serving throughput verified.`
        ]);
        tokenIndex += currentBlockSize;
        await sleep(250);
      }

      setDflashLogs(prev => [
        ...prev,
        `[SUCCESS] DFlash pipeline completed. Total latency: 980ms. Mean Throughput: 1,850 t/s.`,
        `[CONCLUSION] Block diffusion fully saturates Blackwell Tensor compute units. Serving throughput boosted 15x.`
      ]);
    }

    setDflashSimulating(false);
  };
  
  // Vocabulary Search & Filter
  const [vocabSearch, setVocabSearch] = useState("");
  
  const vocabularies = [
    {
      term: "Coupling",
      meaning: "Functional or structural interdependence between components in a system.",
      context: "In the Model workspace, high coupling indicates changes in one element profoundly alter subsequent states. Lower coupling reduces catastrophic cascading damage.",
      icon: <Layers size={14} className="text-[#c5a059]" />
    },
    {
      term: "Telemetry",
      meaning: "Continuously streamed real-world sensory state values over secure data lines.",
      context: "Hermes, the evidence field, collects raw telemetry directly from sensors without injecting interpretation or bias.",
      icon: <Activity size={14} className="text-emerald-400" />
    },
    {
      term: "Provenance",
      meaning: "Verifiable lineage, history, and computational path of calculations.",
      context: "Audit logs containing latency indices, solver names, and timestamps to prove no silent simulated fallbacks have occurred.",
      icon: <Database size={14} className="text-purple-400" />
    },
    {
      term: "Doctrine",
      meaning: "High-level rules, core equations, and guiding philosophy governing the virtual duplicate's operations.",
      context: "Doctrine is why the system exists. It answers 'What does the model know?' and 'What does it not know?'",
      icon: <Compass size={14} className="text-amber-400" />
    },
    {
      term: "Drift",
      meaning: "The progressive divergence or mismatch between the virtual twin and the real physical system.",
      context: "Quantified as the real-world discrepancy index. Calibration procedures realign the simulation vector to zeroed out bounds.",
      icon: <Zap size={14} className="text-rose-400" />
    },
    {
      term: "Aperture",
      meaning: "A selective field of observation through which specific geometry is focused.",
      context: "Limits the noisy external universe to focused variables preventing cognitive overload for the operator.",
      icon: <Eye size={14} className="text-blue-400" />
    },
    {
      term: "Twin",
      meaning: "The real-time virtual state representation of a real-world system or material object.",
      context: "Not a passive database, but an interactive workspace mapping states, relationships, limits, and patterns simultaneously.",
      icon: <Cpu size={14} className="text-cyan-300" />
    },
    {
      term: "Substrate",
      meaning: "The underlying physical mass, matter, or medium of a system's components.",
      context: "Components like Concrete, Steel, Carbon Fiber, or Graphene have physical thresholds modeled in the substrate database.",
      icon: <Layers size={14} className="text-orange-400" />
    },
    {
      term: "Signal",
      meaning: "A clean telemetry stream containing physical evidence and verifiable sensor values.",
      context: "Signals are processed by RAPIDS to extract structure, and subsequently mapped into Hermetic evidence records.",
      icon: <VelocityIcon size={14} className="text-violet-400" />
    },
    {
      term: "State",
      meaning: "The virtual coordinate, numeric values, and parameters of the system at time t.",
      context: "The current state is displayed as live nodes inside the circular geometries, answering 'What is happening?'",
      icon: <HelpCircle size={14} className="text-yellow-400" />
    },
    {
      term: "Topology",
      meaning: "The geometric configuration and organizational map of a system's structural connections.",
      context: "Defines whether components are configured in serial chains, parallel meshes, or star clusters.",
      icon: <Compass size={14} className="text-sky-400" />
    },
    {
      term: "Observer",
      meaning: "The final sovereign human authority in the system (the Operator).",
      context: "Sovereign above all simulation. The observer makes the final core decision once all fields have collapsed into clarity.",
      icon: <User size={14} className="text-pink-400" />
    },
    {
      term: "Constraint",
      meaning: "Intrinsically bound physical, material, environmental, or temporal limits.",
      context: "Audited by Jemma to block simulated fantasy. If boundary limits are breached, corrective loops trigger alarms.",
      icon: <Shield size={14} className="text-red-400" />
    },
    {
      term: "Evidence",
      meaning: "Raw facts, measurements, verified sources, and real-time sensory ground truths.",
      context: "Hermes populates the evidence logs, ensuring claims are strictly rooted in observation rather than fiction.",
      icon: <CheckCircle size={14} className="text-teal-400" />
    },
    {
      term: "Inference",
      meaning: "Extrapolated calculations, predictions, or solvers computed via authorized compute authority layers.",
      context: "Inferences are used for simulations and future forecasting, verified by the validation logs.",
      icon: <Cpu size={14} className="text-indigo-400" />
    },
    {
      term: "Authority",
      meaning: "A validated external compute endpoint responsible for specific math solvers or inferences.",
      context: "Outages in external authorities trigger safety shield protections, forcing SIMON meaning to report COMPUTE_UNAVAILABLE.",
      icon: <Shield size={14} className="text-[#c5a059]" />
    }
  ];

  const filteredVocab = vocabularies.filter(v => 
    v.term.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    v.meaning.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    v.context.toLowerCase().includes(vocabSearch.toLowerCase())
  );

  // Doctrine Fields
  const fields = [
    {
      name: "RAPIDS",
      role: "Velocity Field",
      question: "What structure exists beneath the noise?",
      desc: "RAPIDS does not think or interpret. It lives beneath the kernel, measuring velocities, densities, micro-clustering, topology, anomalies, and substrate behavior before cognition starts.",
      color: "border-[#c5a059]/40 text-[#c5a059] hover:border-cyan-400 bg-cyan-950/5"
    },
    {
      name: "AETHER",
      role: "Holding Field",
      question: "What has our attention?",
      desc: "Aether creates the space in which information may exist. Nothing is concluded or evaluated here; it simply holds the active query to organize focus and isolate variables.",
      color: "border-blue-500/40 text-blue-400 hover:border-blue-400 bg-blue-950/5"
    },
    {
      name: "HERMES",
      role: "Evidence Field",
      question: "What do we actually know?",
      desc: "Hermes gathers raw telemetry, hard measurements, sensory observations, and confirmed facts. It compiles the hard evidence registry to eliminate cognitive float.",
      color: "border-emerald-500/40 text-emerald-400 hover:border-emerald-400 bg-emerald-950/5"
    },
    {
      name: "SIMON",
      role: "Meaning Field",
      question: "What is this trying to tell us?",
      desc: "SIMON listens for underlying harmony and music. It does not look for isolated facts or draw logical conclusions; it detects patterns so the operator can extract 'so what' impact.",
      color: "border-violet-500/40 text-violet-400 hover:border-violet-400 bg-violet-950/5"
    },
    {
      name: "DIGITAL TWIN",
      role: "Relationship Field",
      question: "What affects what?",
      desc: "The digital twin is not a passive database or a visual gimmick. It is a live geometry of interacting state relationships. It tracks how state changes ripple across components.",
      color: "border-teal-500/40 text-teal-400 hover:border-teal-400 bg-teal-950/5"
    },
    {
      name: "JEMMA",
      role: "Constraint Field",
      question: "Can this statement survive challenge?",
      desc: "JEMMA is the guardian of physical reality. It blocks simulation fantasy, drift, certainty inflation, and ungrounded claims. If external compute fails, it forbids approximation.",
      color: "border-red-500/40 text-red-400 hover:border-red-400 bg-red-950/5"
    },
    {
      name: "OCTAGON",
      role: "Boundary Field",
      question: "What are we allowed to do?",
      desc: "Octagon governs actions and rules. It does not participate in interpretation, retrieval, or modeling; it establishes strict boundaries, security policies, and permissions.",
      color: "border-pink-500/40 text-pink-400 hover:border-pink-400 bg-pink-950/5"
    },
    {
      name: "OPERATOR",
      role: "Observer Field",
      question: "Having seen everything, what shall we do?",
      desc: "The final sovereign authority of the entire ecosystem. All geometries, translations, and mathematical fields collapse here. The machine knows, but the operator understands.",
      color: "border-amber-500/40 text-amber-400 hover:border-amber-400 bg-amber-950/5"
    }
  ];

  // Geometries list
  const geometries = [
    {
      shape: "Circle",
      aspect: "State",
      question: "“What is happening?”",
      details: "Live node telemetry. Translates real-world sensory values into virtual coordinates.",
      render: (
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-cyan-400/60 flex items-center justify-center animate-spin-slow">
          <div className="w-6 h-6 rounded-full bg-cyan-450/20 border border-cyan-400" />
        </div>
      )
    },
    {
      shape: "Square",
      aspect: "Structure",
      question: "“What is stable?”",
      details: "Identifies stationary properties, component frames, and physical geometry boundaries.",
      render: (
        <div className="w-12 h-12 border-2 border-emerald-400/50 flex items-center justify-center relative rotate-45 transform">
          <div className="w-6 h-6 border bg-emerald-500/15 border-emerald-400" />
        </div>
      )
    },
    {
      shape: "Triangle",
      aspect: "Direction",
      question: "“Where is this moving?”",
      details: "Tracks dynamic trends, structural deflections, velocity vectors, and gradients.",
      render: (
        <svg className="w-12 h-12 text-blue-400" viewBox="0 0 100 100">
          <polygon points="50,15 90,85 10,85" fill="rgba(0, 123, 255, 0.15)" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    },
    {
      shape: "Pentagon",
      aspect: "Adaptation",
      question: "“What changes?”",
      details: "Analyzes system updates, component wear, environmental decay, and alignment corrections.",
      render: (
        <svg className="w-12 h-12 text-yellow-500" viewBox="0 0 100 100">
          <polygon points="50,10 90,40 75,85 25,85 10,40" fill="rgba(245, 158, 11, 0.15)" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    },
    {
      shape: "Hexagon",
      aspect: "Relationships",
      question: "“What connects?”",
      details: "Maps joint coupling, load paths, structural interdependencies, and link strengths.",
      render: (
        <svg className="w-12 h-12 text-purple-400" viewBox="0 0 100 100">
          <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="rgba(168, 85, 247, 0.15)" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    },
    {
      shape: "Heptagon",
      aspect: "Time",
      question: "“What evolves?”",
      details: "Models historical convergence, wear-and-tear cycles, fatigue over years, and chronos limits.",
      render: (
        <svg className="w-12 h-12 text-pink-400" viewBox="0 0 100 100">
          <polygon points="50,10 80,25 90,55 70,85 30,85 10,55 20,25" fill="rgba(236, 72, 153, 0.15)" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    },
    {
      shape: "Octagon",
      aspect: "Governance",
      question: "“What is permitted?”",
      details: "Upholds boundary limits, secure access controls, material load maximums, and physics rules.",
      render: (
        <svg className="w-12 h-12 text-red-500" viewBox="0 0 100 100">
          <polygon points="50,10 78,22 90,50 78,78 50,90 22,78 10,50 22,22" fill="rgba(239, 68, 68, 0.15)" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    },
    {
      shape: "Star",
      aspect: "Purpose",
      question: "“Why does this matter?”",
      details: "Evaluates key performance achievements, safe operations, and founding system objectives.",
      render: (
        <svg className="w-12 h-12 text-amber-400 animate-pulse" viewBox="0 0 100 100">
          <polygon points="50,10 63,38 93,42 70,61 77,91 50,75 23,91 30,61 7,42 37,38" fill="rgba(245, 158, 11, 0.2)" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    }
  ];

  // Navigation steps
  const navigationSteps = [
    {
      step: 1,
      title: "Observe State",
      text: "Open the twin workspace. Review the live coordinate positions, node loads, and component layouts.",
      focus: "What is currently happening in the physical system?"
    },
    {
      step: 2,
      title: "Inspect Anomalies",
      text: "Compare the real-world sensor reads against virtual boundaries, listening for drift alarms.",
      focus: "Where is the mismatch or coordinate divergence occurring?"
    },
    {
      step: 3,
      title: "Read Evidence Registry",
      text: "Investigate raw, validated facts compiled by Hermes in the observations or provenance logs.",
      focus: "Do we have hard measurements supporting this anomaly?"
    },
    {
      step: 4,
      title: "Interpret with SIMON meaning",
      text: "Switch to SIMON view. Reveal the 'so what' translation explaining raw machine numbers in clear human-operational insights.",
      focus: "What underlying pattern is the system revealing to me?"
    },
    {
      step: 5,
      title: "Challenge with JEMMA",
      text: "Test claims against physical constraints. Run validation simulations to verify matter limits and load integrity.",
      focus: "Can this forecast survive strict physical constraints?"
    },
    {
      step: 6,
      title: "Sovereign Decision",
      text: "Incorporate vocabulary, doctrine, README sequence, and data to execute the necessary real-world structural corrective actions.",
      focus: "Now fully aligned, what action must the operator deploy?"
    }
  ];

  return (
    <div className={`flex flex-col gap-6 ${inlineView ? "bg-transparent border-0 p-0" : "bg-[#0b0c10]/95 border border-[#c5a05933] rounded-xl p-6 shadow-2xl relative"}`}>
      
      {/* Decorative scanline glow */}
      {!inlineView && (
        <>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#c5a059]/5 blur-[75px] rounded-full pointer-events-none" />
        </>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c5a05933] pb-4">
          <div>
            <div className="text-[9px] font-mono font-bold tracking-widest text-[#c5a059] uppercase flex items-center gap-1.5">
              <Sparkles size={11} className="text-[#c5a059]" /> FOUNDING FIELD ORIENTATION PORTAL
            </div>
            <h2 className="text-base font-bold font-mono text-[#e0e0e0] mt-0.5 uppercase tracking-tight">
              The Digital Twin Interpretation Museum
            </h2>
            <p className="text-[11px] text-[#8d8d8d] font-mono leading-relaxed mt-0.5">
              Sovereign Translation Layer: Deciphering the superposition of mathematical fields for the human Operator.
            </p>
          </div>

          {/* Museum Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-[#050608] border border-[#c5a05922] p-0.5 rounded-lg select-none">
            {(["welcome", "audit", "vocabulary", "doctrine", "readme", "cirq", "cuml", "cloudbuild", "ngc"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-[10px] uppercase font-mono font-bold rounded transition-all ${
                  activeTab === tab
                    ? "bg-[#0b0c10] text-[#c5a059] border border-[#c5a05922]"
                    : "text-[#8d8d8d] hover:text-[#dae2eb] hover:bg-slate-900/10"
                }`}
              >
                {tab === "welcome"
                  ? "Welcome"
                  : tab === "audit"
                  ? "Workflow Audit"
                  : tab === "cloudbuild"
                  ? "Cloud Build"
                  : tab === "cirq"
                  ? "Cognitive Circuits (Cirq)"
                  : tab === "cuml"
                  ? "cuML Perception"
                  : tab === "ngc"
                  ? "NVIDIA NGC Registry"
                  : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE MUSEUM SECTIONS */}
      {activeTab === "audit" && (
        <div className="flex flex-col gap-6 animate-fadeIn text-start">
          
          {/* Sovereign System Ledger Audit Directive */}
          <div className="bg-[#0b0f17] border-2 border-[#1c324b] rounded-lg p-5 relative shadow-[0_0_20px_rgba(197,160,89,0.02)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 blur-[60px] rounded-full pointer-events-none" />
            <div className="flex items-center gap-2 border-b border-[#122438] pb-3 mb-3">
              <Shield size={14} className="text-rose-500 animate-pulse" />
              <h3 className="text-xs font-mono font-bold text-rose-400 tracking-widest uppercase">
                Sovereign System Ledger — Audit Directive
              </h3>
            </div>
            <div className="bg-[#050608]/90 font-mono text-[11px] text-[#e0e0e0] border-l-4 border-rose-600 p-4 rounded leading-relaxed select-all">
              <span className="text-[8px] uppercase tracking-wider font-bold text-slate-500 block mb-1">SYSTEM_LEDGER_ENTRY:</span>
              Audit Directive: Perform complete workflow audit before creating Vocabulary.md, Doctrine.md, or README.md. Documentation must describe the actual navigation path, not a theoretical one.
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono text-[#8d8d8d] mt-2.5">
              <span>LEDGER TIMESTAMP: {new Date().toISOString()}</span>
              <span className="text-emerald-400 font-bold">STATUS: COMPLIANT / SEALED</span>
            </div>
          </div>

          {/* Workflow Audit 8-Layer Structure */}
          <div className="flex flex-col gap-2">
            <div className="border-b border-[#c5a05933] pb-2 mb-3">
              <h3 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase tracking-wider">
                Digital Twin 8-Layer Workflow Audit
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                The canonical path through which human sovereignty, raw data, computational solvers, and physical properties intersect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Layer 0 */}
              <div className="bg-[#050608] border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-1.5 hover:border-[#1c324b] transition-all relative">
                <span className="absolute top-3 right-3 text-xs font-mono text-[#c5a059]/30 font-bold">L0</span>
                <span className="text-[8px] font-mono text-[#c5a059] font-bold uppercase tracking-widest">Sovereignty Node</span>
                <h4 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase">Layer 0 — Operator</h4>
                <p className="text-xs text-slate-350 leading-relaxed font-sans">
                  The final sovereign authority in the system. The machine coordinates collapse here into operational choice.
                </p>
                <div className="bg-[#0b0c10] border-l border-cyan-400/40 p-2 text-[10px] font-mono text-slate-450 mt-1">
                  <span className="font-bold text-[#e0e0e0]">Authority:</span> Full control clearance.<br />
                  <span className="font-bold text-[#e0e0e0]">Decisions:</span> Triggers calibrations, runs stress models, dispatches reality-protecting actions.
                </div>
              </div>

              {/* Layer 1 */}
              <div className="bg-[#050608] border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-1.5 hover:border-[#1c324b] transition-all relative">
                <span className="absolute top-3 right-3 text-xs font-mono text-[#c5a059]/30 font-bold">L1</span>
                <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Ingress Control</span>
                <h4 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase">Layer 1 — Entry</h4>
                <p className="text-xs text-slate-350 leading-relaxed font-sans">
                  The intake threshold mapping external physical systems and sensory events onto the coordinate plane.
                </p>
                <div className="bg-[#0b0c10] border-l border-emerald-400/40 p-2 text-[10px] font-mono text-slate-450 mt-1">
                  <span className="font-bold text-[#e0e0e0]">Inputs:</span> Laser sensors, manual offsets, structural tension reads.<br />
                  <span className="font-bold text-[#e0e0e0]">Compute:</span> Non-approximate raw ingest values.
                </div>
              </div>

              {/* Layer 2 */}
              <div className="bg-[#050608] border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-1.5 hover:border-[#1c324b] transition-all relative">
                <span className="absolute top-3 right-3 text-xs font-mono text-[#c5a059]/30 font-bold">L2</span>
                <span className="text-[8px] font-mono text-blue-400 font-bold uppercase tracking-widest">Superposed Filters</span>
                <h4 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase">Layer 2 — Field</h4>
                <p className="text-xs text-slate-350 leading-relaxed font-sans">
                  Superimposed background solvers filtering out atmospheric noise to organize cognitive attention.
                </p>
                <div className="bg-[#0b0c10] border-l border-blue-400/40 p-2 text-[10px] font-mono text-slate-450 mt-1">
                  <span className="font-bold text-[#e0e0e0]">AETHER:</span> Variables attention space holder.<br />
                  <span className="font-bold text-[#e0e0e0]">RAPIDS:</span> Noise-filtration, velocity index calculator.
                </div>
              </div>

              {/* Layer 3 */}
              <div className="bg-[#050608] border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-1.5 hover:border-[#1c324b] transition-all relative">
                <span className="absolute top-3 right-3 text-xs font-mono text-[#c5a059]/30 font-bold">L3</span>
                <span className="text-[8px] font-mono text-violet-400 font-bold uppercase tracking-widest">Pattern Recognition</span>
                <h4 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase">Layer 3 — Interpretation</h4>
                <p className="text-xs text-slate-350 leading-relaxed font-sans">
                  Translating sheer numbers and raw graphs into structural meaning, harmonic waves, and "so what" impact.
                </p>
                <div className="bg-[#0b0c10] border-l border-violet-400/40 p-2 text-[10px] font-mono text-slate-450 mt-1">
                  <span className="font-bold text-[#e0e0e0]">SIMON Meaning:</span> Maps sensor metrics to pattern codes.<br />
                  <span className="font-bold text-[#e0e0e0]">Focus:</span> Listen for structural stress music, not isolated tables.
                </div>
              </div>

              {/* Layer 4 */}
              <div className="bg-[#050608] border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-1.5 hover:border-[#1c324b] transition-all relative">
                <span className="absolute top-3 right-3 text-xs font-mono text-[#c5a059]/30 font-bold">L4</span>
                <span className="text-[8px] font-mono text-red-400 font-bold uppercase tracking-widest">Reality Guardian</span>
                <h4 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase">Layer 4 — Challenge</h4>
                <p className="text-xs text-slate-350 leading-relaxed font-sans">
                  The barrier blocking certainty inflation, coordinate drift, and ungrounded model approximations.
                </p>
                <div className="bg-[#0b0c10] border-l border-red-400/40 p-2 text-[10px] font-mono text-slate-450 mt-1">
                  <span className="font-bold text-[#e0e0e0]">JEMMA Engine:</span> Prevents simulation fantasy.<br />
                  <span className="font-bold text-[#e0e0e0]">Rule:</span> Outages in validated compute yield immediate lockouts.
                </div>
              </div>

              {/* Layer 5 */}
              <div className="bg-[#050608] border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-1.5 hover:border-[#1c324b] transition-all relative">
                <span className="absolute top-3 right-3 text-xs font-mono text-[#c5a059]/30 font-bold">L5</span>
                <span className="text-[8px] font-mono text-teal-400 font-bold uppercase tracking-widest">Structural Simulation</span>
                <h4 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase">Layer 5 — Model</h4>
                <p className="text-xs text-slate-350 leading-relaxed font-sans">
                  The virtual physical workspace containing component structures, interactive couplers, and forecast engines.
                </p>
                <div className="bg-[#0b0c10] border-l border-teal-400/40 p-2 text-[10px] font-mono text-slate-450 mt-1">
                  <span className="font-bold text-[#e0e0e0]">Elements:</span> Spatial coordinates, structural relationships, multi-materials.<br />
                  <span className="font-bold text-[#e0e0e0]">Prediction:</span> Multivariable decay projections.
                </div>
              </div>

              {/* Layer 6 */}
              <div className="bg-[#050608] border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-1.5 hover:border-[#1c324b] transition-all relative">
                <span className="absolute top-3 right-3 text-xs font-mono text-[#c5a059]/30 font-bold">L6</span>
                <span className="text-[8px] font-mono text-pink-400 font-bold uppercase tracking-widest">Governance Bounds</span>
                <h4 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase">Layer 6 — Governance</h4>
                <p className="text-xs text-slate-350 leading-relaxed font-sans">
                  Maintaining physical, legal, and operational limits across all virtual twin interactions.
                </p>
                <div className="bg-[#0b0c10] border-l border-pink-400/40 p-2 text-[10px] font-mono text-slate-450 mt-1">
                  <span className="font-bold text-[#e0e0e0]">OCTAGON:</span> Upholds security circles and safety shields.<br />
                  <span className="font-bold text-[#e0e0e0]">Focus:</span> Prevent structural failure by securing load tolerances.
                </div>
              </div>

              {/* Layer 7 */}
              <div className="bg-[#050608] border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-1.5 hover:border-[#1c324b] transition-all relative">
                <span className="absolute top-3 right-3 text-xs font-mono text-[#c5a059]/30 font-bold">L7</span>
                <span className="text-[8px] font-mono text-amber-500 font-bold uppercase tracking-widest">Sovereign Dispatch</span>
                <h4 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase">Layer 7 — Action</h4>
                <p className="text-xs text-slate-350 leading-relaxed font-sans">
                  The physical activation point. Dispatches verified models to correct actual structural drift in the real world.
                </p>
                <div className="bg-[#0b0c10] border-l border-amber-500/40 p-2 text-[10px] font-mono text-slate-450 mt-1">
                  <span className="font-bold text-[#e0e0e0]">Mechanism:</span> Hard calibration dispatches and reports.<br />
                  <span className="font-bold text-[#e0e0e0]">Proof:</span> Logs full mathematical provenance.
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {activeTab === "welcome" && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          
          {/* Welcome Entrance Card */}
          <div className="bg-[#050608] border border-[#122438] p-5 rounded-lg flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[50px] h-[50px] bg-gradient-to-tr from-transparent to-[#c5a059]/5 rounded-bl-full pointer-events-none" />
            <div className="flex-1 flex flex-col gap-2.5 text-start">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/35 border border-[#c5a059]/30 w-fit text-[8px] font-mono text-[#c5a059] font-bold uppercase tracking-wider">
                Operator Entry Portal v0.1
              </div>
              <h3 className="text-sm font-bold font-mono text-[#e0e0e0] uppercase tracking-wide">
                “What am I looking at?”
              </h3>
              <p className="text-xs text-[#a0aec0] leading-relaxed font-sans">
                Welcome, Operator. The system coordinates you see are not a static storage registry, nor are they a simplified visual playground. This workspace is a <b className="text-[#c5a059]">continuous geometry of superimposed fields</b>. It exists to map external physical reality into verifiable relationships, constraints, and dynamic patterns.
              </p>
              <p className="text-xs text-[#8299af] italic font-serif leading-relaxed mt-1">
                "Without SIMON, the machine knows. With SIMON, the operator understands what the machine knows."
              </p>
            </div>
            
            {/* Presets shortcut inside welcome if callback is provided */}
            {onExplorePreset && (
              <div className="w-full md:w-[240px] flex-shrink-0 bg-[#060b13] border border-[#102133] p-4 rounded-lg flex flex-col gap-2 text-start">
                <div className="text-[9px] font-mono text-[#8d8d8d] uppercase tracking-wider">Initialize Simulation:</div>
                <button
                  onClick={() => onExplorePreset("Golden Gate Bridge Dynamic Drift Model")}
                  className="w-full text-left p-2 rounded hover:bg-[#c5a059]/5 border border-transparent hover:border-[#c5a059]/35 transition-all flex flex-col gap-0.5 text-xs font-mono text-[#c5a059] group"
                >
                  <span className="font-bold flex items-center justify-between">
                    Golden Gate Bridge <ArrowRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[8.5px] text-[#8d8d8d]">Suspension drift telemetry model</span>
                </button>
                <button
                  onClick={() => onExplorePreset("Material Coupling Constructor & Physical Matter Stress Calibration")}
                  className="w-full text-left p-2 rounded hover:bg-[#c5a059]/5 border border-transparent hover:border-[#c5a059]/35 transition-all flex flex-col gap-0.5 text-xs font-mono text-[#c5a059] group"
                >
                  <span className="font-bold flex items-center justify-between">
                    Coupling Constructor <ArrowRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[8.5px] text-[#8d8d8d]">Multi-layer mechanical stress solver</span>
                </button>
              </div>
            )}
          </div>

          {/* Core Philosophy Split */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-[#050608]/60 border border-[#101f30] p-4 rounded-lg flex flex-col gap-2 text-start">
              <span className="text-[9px] font-mono text-[#c5a059] font-bold uppercase tracking-wider">1. The Vocabulary Layer</span>
              <h4 className="text-xs font-bold font-mono text-[#e0e0e0]">WHAT DO THESE WORDS MEAN?</h4>
              <p className="text-[11px] text-[#849bac] leading-relaxed">
                Before navigating, click the <b className="text-[#c5a059]">Vocabulary</b> tab. Learn specific operational codes like <i>Coupling</i>, <i>Telemetry</i>, <i>Drift</i>, and <i>Provenance</i> so you understand raw machine readouts instantly.
              </p>
              <button 
                onClick={() => setActiveTab("vocabulary")}
                className="mt-2 text-left text-[9px] font-mono text-[#c5a059] font-bold hover:underline flex items-center gap-1 uppercase"
              >
                Inspect Vocabulary <ArrowRight size={10} />
              </button>
            </div>

            <div className="bg-[#050608]/60 border border-[#101f30] p-4 rounded-lg flex flex-col gap-2 text-start">
              <span className="text-[9px] font-mono text-violet-400 font-bold uppercase tracking-wider">2. The Doctrine Layer</span>
              <h4 className="text-xs font-bold font-mono text-[#e0e0e0]">WHY DOES THE SYSTEM EXIST?</h4>
              <p className="text-[11px] text-[#849bac] leading-relaxed">
                Explore the <b className="text-violet-400">Doctrine</b> tab. Learn how the superposed fields (RAPIDS, HERMES, SIMON, JEMMA) and structural shapes (Circles, Squares, Stars) translate physical reality into direction and constraints.
              </p>
              <button 
                onClick={() => setActiveTab("doctrine")}
                className="mt-2 text-left text-[9px] font-mono text-violet-400 font-bold hover:underline flex items-center gap-1 uppercase"
              >
                Inspect Doctrine & Fields <ArrowRight size={10} />
              </button>
            </div>

            <div className="bg-[#050608]/60 border border-[#101f30] p-4 rounded-lg flex flex-col gap-2 text-start">
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">3. The README Layer</span>
              <h4 className="text-xs font-bold font-mono text-[#e0e0e0]">HOW DO I NAVIGATE?</h4>
              <p className="text-[11px] text-[#849bac] leading-relaxed">
                Unlock the 6-stage operational guide in <b className="text-emerald-400">README</b>. Navigate from raw telemetry observation, to pattern tracking, to Jemma verification, to sovereign decision-making.
              </p>
              <button 
                onClick={() => setActiveTab("readme")}
                className="mt-2 text-left text-[9px] font-mono text-emerald-400 font-bold hover:underline flex items-center gap-1 uppercase"
              >
                Review Process Sequence <ArrowRight size={10} />
              </button>
            </div>

          </div>

          {/* Prime Doctrine Overlay */}
          <div className="bg-[#070d15] border-2 border-[#c5a05922] p-5 rounded-lg flex flex-col gap-3 relative text-start">
            <div className="absolute top-0 left-0 w-[4px] h-full bg-[#c5a059]" />
            <h4 className="text-xs font-mono font-bold text-[#c5a059] tracking-widest uppercase flex items-center gap-1.5">
              <Shield size={12} /> THE PRIME DOCTRINE recall
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-2 font-mono text-[11px] text-[#a0aec0] leading-relaxed">
                <p className="text-[#e0e0e0] font-semibold">• The system is not a stack of boxes.</p>
                <p>• The system is a set of superimposed fields observed through geometry.</p>
                <p>• Each layer has a role. Each geometry reveals a different aspect of reality.</p>
                <p className="text-[#e0e0e0] font-semibold">• No layer owns the truth. Truth emerges from the superposition.</p>
              </div>
              <div className="bg-[#050608] border border-[#102032] p-3 rounded text-[11px] font-sans text-slate-350 leading-relaxed italic">
                “This digital twin is a geometric workspace where evidence, relationships, uncertainty, state, and meaning can coexist simultaneously.”
              </div>
            </div>
          </div>

          {/* Substrates & Sovereignty Architecture Model */}
          <div className="bg-[#050608]/95 border border-[#c5a05933] p-5 rounded-lg flex flex-col gap-6 animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-gradient-to-bl from-[#c5a059]/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col gap-1 text-start">
              <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 w-fit text-[8px] font-mono text-[#c5a059] font-bold uppercase tracking-wider">
                Sovereign Substrates & Authority Model
              </div>
              <h3 className="text-sm font-bold font-mono text-[#e0e0e0] uppercase tracking-wide flex items-center gap-2">
                <Layers size={14} className="text-[#c5a059]" />
                Pathfinder Full-Substrate Hierarchy
              </h3>
              <p className="text-xs text-[#a0aec0]">
                Explicit structural separation of raw hardware acceleration, cognitive logic, active safety governance, and operator decision authority.
              </p>
            </div>

            {/* Substrate Mantra Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#0b0c10] border border-[#1b1c20] p-3 rounded text-start">
                <span className="text-sky-400 font-bold font-mono text-[9px] uppercase tracking-wider block mb-1">
                  I. COMPUTE SUBSTRATE
                </span>
                <p className="text-[10px] text-slate-400">
                  Hardware nodes, CUDA compilers, Triton managers, and RAPIDS algorithms. 
                  <b className="text-sky-300 block mt-1">"Compute accelerates execution."</b>
                </p>
              </div>
              <div className="bg-[#0b0c10] border border-[#1b1c20] p-3 rounded text-start">
                <span className="text-rose-400 font-bold font-mono text-[9px] uppercase tracking-wider block mb-1">
                  II. GOVERNANCE SUBSTRATE
                </span>
                <p className="text-[10px] text-slate-400">
                  Verification limits, error friction checkers, and compliance guidelines. 
                  <b className="text-rose-300 block mt-1">"Governance determines action."</b>
                </p>
              </div>
              <div className="bg-[#0b0c10] border border-[#1b1c20] p-3 rounded text-start">
                <span className="text-yellow-400 font-bold font-mono text-[9px] uppercase tracking-wider block mb-1">
                  III. OPERATOR AUTHORITY
                </span>
                <p className="text-[10px] text-slate-400">
                  The final oversight gate. Sovereign calibration, and human calibration keys. 
                  <b className="text-yellow-300 block mt-1">"The operator remains the final authority."</b>
                </p>
              </div>
            </div>

            {/* Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Flowchart representation (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-2 relative">
                <span className="text-[9px] font-mono font-bold text-[#c5a059] uppercase tracking-wider text-start mb-1 block">
                  Click layers to trace flow:
                </span>
                
                {/* Vertical Stack: Layer 7 down to Layer 0 */}
                <div className="flex flex-col gap-1.5 relative pl-4 border-l border-slate-800">
                  {[
                    { level: 7, name: "Physical Action", cat: "PHYSICAL EXECUTION", color: "border-cyan-500/30 hover:border-cyan-400 text-cyan-400" },
                    { level: 6, name: "Operator Decision", cat: "OPERATOR AUTHORITY", color: "border-yellow-500/30 hover:border-yellow-400 text-yellow-400" },
                    { level: 5, name: "Governance State", cat: "GOVERNANCE SUBSTRATE", color: "border-rose-500/30 hover:border-rose-400 text-rose-400" },
                    { level: 4, name: "Information State", cat: "INFORMATION SUBSTRATE", color: "border-purple-500/30 hover:border-purple-400 text-purple-400" },
                    { level: 3, name: "RAPIDS Layer", cat: "COMPUTE SUBSTRATE", color: "border-amber-500/30 hover:border-amber-400 text-amber-400" },
                    { level: 2, name: "NGC Runtime", cat: "COMPUTE SUBSTRATE", color: "border-sky-500/30 hover:border-sky-400 text-sky-400" },
                    { level: 1, name: "CUDA Layer", cat: "COMPUTE SUBSTRATE", color: "border-emerald-500/30 hover:border-emerald-400 text-emerald-400" },
                    { level: 0, name: "Physical Layer", cat: "COMPUTE SUBSTRATE", color: "border-slate-700 hover:border-slate-500 text-slate-400" }
                  ].map((lvl) => {
                    const isActive = selectedSubstrateLevel === lvl.level;
                    return (
                      <button
                        key={lvl.level}
                        type="button"
                        onClick={() => setSelectedSubstrateLevel(lvl.level)}
                        className={`w-full text-start p-2 rounded-md border font-mono transition-all flex items-center justify-between group ${
                          isActive
                            ? "bg-[#c5a059]/10 border-[#c5a059] shadow-[0_0_8px_rgba(197,160,89,0.15)] scale-[1.02] translate-x-1"
                            : "bg-[#030406]/50 " + lvl.color
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-1 py-0.5 rounded font-extrabold ${
                            isActive ? "bg-[#c5a059]/25 text-[#c5a059]" : "bg-black/30"
                          }`}>
                            L{lvl.level}
                          </span>
                          <span className="text-xs font-bold">{lvl.name}</span>
                        </div>
                        <span className="text-[8px] opacity-60 uppercase tracking-widest">{lvl.cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Layer details (7 cols) */}
              <div className="lg:col-span-7 bg-[#030406] border border-[#1b1c20] p-4 rounded-lg min-h-[340px] flex flex-col justify-between text-start">
                <div>
                  {/* Category Header */}
                  <div className="flex justify-between items-center border-b border-[#1b1c20] pb-2 mb-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      Selected Level Context
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/45 text-[#c5a059] border border-[#c5a059]/30 uppercase font-bold">
                      {selectedSubstrateLevel === 0 || selectedSubstrateLevel === 1 || selectedSubstrateLevel === 2 || selectedSubstrateLevel === 3
                        ? "Compute Component"
                        : selectedSubstrateLevel === 4
                        ? "Information Component"
                        : selectedSubstrateLevel === 5
                        ? "Governance Component"
                        : selectedSubstrateLevel === 6
                        ? "Operator Sovereign Gate"
                        : "Sovereign Dispatch Component"}
                    </span>
                  </div>

                  {/* Level Details */}
                  {(() => {
                    const current = [
                      {
                        level: 0,
                        name: "Physical Layer",
                        category: "COMPUTE SUBSTRATE",
                        desc: "NVIDIA Blackwell GPUs, HBM3e high-bandwidth memory, and physical virtualized nodes in the container network. Represents absolute hardware execution constraints.",
                        principle: "Physical components dictate latency floors. Compute potential starts here.",
                        tech: "NVIDIA Blackwell B200 / H100, HBM3e VRAM, PCIe Gen 5 interconnects"
                      },
                      {
                        level: 1,
                        name: "CUDA Layer",
                        category: "COMPUTE SUBSTRATE",
                        desc: "Low-level GPU thread execution and hardware compilation. Drives multi-threaded kernels for high-speed matrix calculations and geometric transformation operations.",
                        principle: "Low-level driver optimizations allow the system to parallelize telemetry transformations, eliminating CPU serialization blocks.",
                        tech: "CUDA Toolkit 12.x, nvcc compiler, PTX assembly instructions, warp schedulers"
                      },
                      {
                        level: 2,
                        name: "NGC Runtime",
                        category: "COMPUTE SUBSTRATE",
                        desc: "Triton Inference Server, model serving endpoints, and NGC registry microservices. Packages neural weights safely for scalable microservice orchestration.",
                        principle: "Standardized inference servers isolate weights from operational logic, guaranteeing stable execution latency under heavy concurrency.",
                        tech: "Triton Inference Server, NIM (NVIDIA Inference Microservices), CUDA-X libraries"
                      },
                      {
                        level: 3,
                        name: "RAPIDS Layer",
                        category: "COMPUTE SUBSTRATE",
                        desc: "High-speed statistical dataframes and GPU graph algorithms. Compresses massive incoming telemetry packets into real-time topological and correlation structures before cognitive parsing.",
                        principle: "RAPIDS does not reason or interpret. It collapses high-density telemetry data streams into statistical signatures at absolute line-rate speed.",
                        tech: "cuDF, cuML, cuGraph, GPU-accelerated memory pools"
                      },
                      {
                        level: 4,
                        name: "Information State",
                        category: "INFORMATION SUBSTRATE",
                        desc: "Cognitive modeling layers (AETHER, HERMES, SIMON). Maps the statistical telemetry signatures into evidence-backed relationships, uncertainty zones, and functional behavior structures.",
                        principle: "Translates raw numerical data points into understandable information states. Information remains superposed and open to challenge.",
                        tech: "AETHER (uncertainty bounds), HERMES (evidence grounding), SIMON (functional behavior interpretation)"
                      },
                      {
                        level: 5,
                        name: "Governance State",
                        category: "GOVERNANCE SUBSTRATE",
                        desc: "Active safety monitoring and verification layer (JEMMA, OCTAGON). Compares logical models against hard physical limits, historical invariants, and authorized safety maximums.",
                        principle: "Exposes gaps in information, surfaces contradictions, and challenges model authority before any physical action can be cleared.",
                        tech: "JEMMA (contradiction & friction reports), OCTAGON (regulatory safety rules & authorization maximum envelopes)"
                      },
                      {
                        level: 6,
                        name: "Operator Decision",
                        category: "OPERATOR AUTHORITY",
                        desc: "Human operator judgment. The sovereign decision layer that approves, overrides, calibrates, and verifies governance outputs. The ultimate boundary of agency.",
                        principle: "The compute substrate accelerates execution, and the governance substrate determines safe parameters, but ONLY the human operator has the authority to issue action.",
                        tech: "Operator Control Panel, Digital Calibration Knobs, Cryptographic Sovereign Authorization Keys"
                      },
                      {
                        level: 7,
                        name: "Physical Action",
                        category: "PHYSICAL EXECUTION",
                        desc: "Control dispatch to real-world actuators, mechanical dampers, energy switches, or physical communication relays. The final output of the telemetry cycle.",
                        principle: "Actions are irreversibly committed to the real world, documented with tamper-proof mathematical provenance records.",
                        tech: "CRYSTAL BRIDGE actuator interfaces, SCADA relay networks, secure physical output registers"
                      }
                    ][selectedSubstrateLevel];

                    if (!current) return null;

                    return (
                      <div className="flex flex-col gap-3.5 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold font-mono text-white">L{current.level} : {current.name}</span>
                        </div>

                        <div className="flex flex-col gap-1 bg-black/40 p-2.5 rounded border border-[#1b1c20]">
                          <span className="text-[8px] font-mono text-[#c5a059] uppercase font-bold">Substrate Classification:</span>
                          <span className="text-xs font-mono font-extrabold text-[#dae2eb]">{current.category}</span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {current.desc}
                        </p>

                        <div className="p-3 bg-slate-950/40 rounded border border-slate-900 leading-relaxed text-[11px] text-slate-400">
                          <span className="text-[#c5a059] font-bold font-mono text-[9px] uppercase tracking-wider block mb-0.5">Core Principle:</span>
                          "{current.principle}"
                        </div>

                        <div className="flex flex-col gap-1 mt-1 text-[10px] font-mono">
                          <span className="text-slate-500 uppercase text-[8px] font-bold">Involved Stack & Technologies:</span>
                          <span className="text-slate-300 font-medium">{current.tech}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="mt-6 pt-3 border-t border-[#1b1c20] text-slate-500 font-mono text-[8.5px] leading-tight flex items-center gap-2">
                  <Shield size={12} className="text-[#c5a059]" />
                  <span>
                    This hierarchy is strictly non-reducible. No lower compute layer can bypass the JEMMA verification layer, and no automated layer can bypass the operator's final sovereign authority.
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* VOCABULARY SECTIONS */}
      {activeTab === "vocabulary" && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#050608] border border-[#c5a05922] p-3 rounded-lg">
            <div className="text-start">
              <h3 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase tracking-wider">The Glossary Layer</h3>
              <p className="text-[10px] text-[#8d8d8d] font-mono">16 core terms defined for human operator alignment.</p>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-[240px]">
              <Search size={12} className="absolute left-2.5 top-2.5 text-[#8d8d8d]" />
              <input
                type="text"
                placeholder="Filter vocabulary..."
                value={vocabSearch ?? ""}
                onChange={(e) => setVocabSearch(e.target.value)}
                className="w-full bg-[#050608] border border-[#c5a05922] focus:border-[#c5a059] rounded px-8 py-1.5 text-[11px] font-mono text-[#e0e0e0] focus:outline-none placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVocab.map((vocab, index) => (
              <div 
                key={index} 
                className="bg-[#050608] border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-2 hover:border-[#1c324b] transition-all relative group text-start"
              >
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <div className="flex items-center gap-1.5">
                  {vocab.icon}
                  <h4 className="text-xs font-mono font-bold text-[#e0e0e0] group-hover:text-[#c5a059] transition-colors uppercase tracking-wide">
                    {vocab.term}
                  </h4>
                </div>
                <p className="text-xs text-[#e0e0e0] font-sans leading-relaxed">
                  {vocab.meaning}
                </p>
                <div className="mt-1 bg-[#0b0c10] border-l border-[#c5a059]/30 p-2 text-[9.5px] font-sans text-slate-400 leading-relaxed italic">
                  <span className="text-[7.5px] font-mono uppercase font-bold tracking-wider text-[#8d8d8d] block not-italic mb-0.5">Workspace Context:</span>
                  {vocab.context}
                </div>
              </div>
            ))}
            
            {filteredVocab.length === 0 && (
              <div className="col-span-2 text-center text-xs font-mono text-[#8d8d8d] py-10">No matching alignment terms found.</div>
            )}
          </div>

        </div>
      )}

      {/* DOCTRINE LAYER & FIELDS SECTIONS */}
      {activeTab === "doctrine" && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          
          {/* Section Description */}
          <div className="text-start border-b border-[#c5a05933] pb-3">
            <h3 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase tracking-wide">Superimposed Fields</h3>
            <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
              Every telemetry coordinate sits at the intersection of these eight fields. Hover to inspect their roles.
            </p>
          </div>

          {/* Superposed Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fields.map((f, i) => (
              <div 
                key={i} 
                className={`border rounded-lg p-4 flex flex-col gap-2.5 transition-all relative ${f.color} group text-start`}
              >
                <span className="absolute top-3 right-3 text-[9px] font-mono text-[#8d8d8d] group-hover:text-[#c5a059] transition-colors font-bold">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                
                <div>
                  <span className="text-[8px] font-mono uppercase font-bold tracking-widest text-[#55697e]">{f.role}</span>
                  <h4 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase tracking-tight group-hover:text-[#e0e0e0]">{f.name}</h4>
                </div>

                <div className="bg-[#050608]/80 border-l-2 p-2 text-[10px] font-serif leading-snug italic">
                  <span className="text-[7px] font-mono uppercase text-[#8d8d8d] font-bold block not-italic">Core Question:</span>
                  "{f.question}"
                </div>

                <p className="text-[11px] text-[#869ab0] font-sans leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Geometrical Interpretations */}
          <div className="mt-4 text-start">
            <div className="border-b border-[#c5a05933] pb-3 mb-4">
              <h3 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase tracking-wide">Geometric Aspects</h3>
              <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                The layers are superimposed through symbolic geometry. Each outline unlocks a distinct dimension of state.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {geometries.map((g, ind) => (
                <div key={ind} className="bg-[#050608]/92 border border-[#c5a05933] p-4 rounded-lg flex flex-col items-center text-center gap-2.5 hover:border-[#152a41] transition-all">
                  {g.render}
                  <div>
                    <span className="text-[9px] font-mono text-[#38bdf8] uppercase tracking-widest font-bold">{g.shape}</span>
                    <h5 className="text-[11px] font-mono text-[#e0e0e0] uppercase tracking-tight font-bold">{g.aspect}</h5>
                    <p className="text-[10px] text-amber-500 font-serif italic mt-0.5">{g.question}</p>
                  </div>
                  <p className="text-[10px] text-[#718da5] leading-normal font-sans">
                    {g.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* README LAYER SECTIONS */}
      {activeTab === "readme" && (
        <div className="flex flex-col gap-4 animate-fadeIn text-start">
          
          <div className="border-b border-[#c5a05933] pb-3">
            <h3 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase tracking-wide">Navigation Sequence</h3>
            <p className="text-[10px] text-slate-400 font-mono">
              The precise workflow path an Operator must follow before acting.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {navigationSteps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-[#050608] border border-[#c5a05933] p-3.5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#12253b] transition-all relative overflow-hidden"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-[#1b2f44] flex items-center justify-center text-[10px] font-mono text-[#c5a059] font-bold flex-shrink-0 mt-0.5">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-[#e0e0e0] uppercase tracking-wide">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-1">
                      {step.text}
                    </p>
                  </div>
                </div>

                <div className="bg-[#0b0c10] border-l-2 border-[#c5a059]/50 p-2 md:w-[260px] flex-shrink-0 text-[10px] font-mono text-[#c5a059] leading-relaxed">
                  <span className="text-[7.5px] uppercase font-mono text-[#55697e] block font-bold leading-none mb-1">Operational Focus:</span>
                  {step.focus}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* CLOUD BUILD TRIGGER SECTIONS */}
      {activeTab === "cloudbuild" && (
        <div className="flex flex-col gap-6 animate-fadeIn text-start font-sans">
          
          {/* Main Controls Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Section: Controller Configuration */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-[#050608] border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-3 relative">
                <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#c5a059] flex items-center gap-1">
                  <Cpu size={12} /> Pipeline Configuration
                </div>
                
                <div className="flex flex-col gap-2 font-mono text-[11px] mt-1">
                  <div className="flex justify-between border-b border-[#c5a05933] pb-1">
                    <span className="text-slate-550">PROJECT LEVEL:</span>
                    <span className="text-[#e0e0e0] font-bold">ai-studio-digital-twin</span>
                  </div>
                  <div className="flex justify-between border-b border-[#c5a05933] pb-1">
                    <span className="text-slate-550">TRIGGER PATTERN:</span>
                    <span className="text-[#e0e0e0] font-bold">DT-TRIGGER-RECALL</span>
                  </div>
                  <div className="flex justify-between border-b border-[#c5a05933] pb-1">
                    <span className="text-slate-550">DEPLOYMENT TARGET:</span>
                    <span className="text-[#c5a059] font-bold">Cloud Run (Managed)</span>
                  </div>
                  <div className="flex justify-between border-b border-[#c5a05933] pb-1">
                    <span className="text-slate-550">INGRESS PORT:</span>
                    <span className="text-amber-500 font-bold">8080 (Container)</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-550">TARGET REGION:</span>
                    <span className="text-[#e0e0e0]">europe-west1</span>
                  </div>
                </div>

                <div className="border-t border-[#c5a05933] pt-3 mt-1 flex flex-col gap-2.5">
                  <div className="flex flex-col gap-1 text-[10px] font-mono">
                    <label className="text-slate-500 uppercase font-bold">Git Commit Branch Context:</label>
                    <select className="bg-[#050608] border border-[#c5a05922] rounded px-2 py-1.5 text-[#e0e0e0] focus:outline-none focus:border-[#c5a059]">
                      <option>main (Production)</option>
                      <option>development (Staging)</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-[10px] font-mono">
                    <label className="text-slate-500 uppercase font-bold">Google Cloud Logging Profile:</label>
                    <select className="bg-[#050608] border border-[#c5a05922] rounded px-2 py-1.5 text-[#e0e0e0] focus:outline-none focus:border-[#c5a059]">
                      <option>CLOUD_LOGGING_ONLY (Standard)</option>
                      <option>LOG_STREAMING_VERBOSE (Raw Trace)</option>
                    </select>
                  </div>
                </div>

                {/* DISPATCH ACTION BUTTON */}
                <button
                  type="button"
                  disabled={buildStatus !== "idle" && buildStatus !== "finished"}
                  onClick={() => {
                    setTerminalLogs([]);
                    setBuildStatus("installing");
                    setBuildProgress(5);
                    
                    const scheduleLog = (text: string, delay: number) => {
                      setTimeout(() => {
                        const time = new Date().toLocaleTimeString();
                        setTerminalLogs(prev => [...prev, `[${time}] ${text}`]);
                      }, delay);
                    };

                    scheduleLog("ID-901 Initiate Google Cloud Build Trigger...", 120);
                    scheduleLog("Parsed configuration pipeline matching cloudbuild.yaml rules.", 600);
                    scheduleLog("Pulling Google Cloud Build system kernel builder agent context...", 1100);
                    
                    // Step 1: Install
                    setTimeout(() => {
                      setBuildStatus("installing");
                      setBuildProgress(20);
                    }, 1400);
                    scheduleLog("[STEP 1/5] [Install Dependencies] Executing 'npm ci' inside cleaner container host...", 1500);
                    scheduleLog("npm install info: added 492 elements securely in 1.4s (mock credential only in explicit demo mode).", 2600);
                    
                    // Step 2: Lint
                    setTimeout(() => {
                      setBuildStatus("linting");
                      setBuildProgress(40);
                    }, 3000);
                    scheduleLog("[STEP 2/5] [Verify Syntax and Types] Running strict TSC compilation 'tsc --noEmit'...", 3100);
                    scheduleLog("tsc syntax check: 0 syntax or type mismatch errors found. Codebase certified clean.", 4200);

                    // Step 3: Docker compile
                    setTimeout(() => {
                      setBuildStatus("docker_build");
                      setBuildProgress(60);
                    }, 4800);
                    scheduleLog("[STEP 3/5] [Compile Container Image] Initiating docker build from multi-stage /Dockerfile rules...", 5000);
                    scheduleLog("Step 1/12 : FROM node:20-slim AS builder... (using compiled layer cache)", 5400);
                    scheduleLog("Step 6/12 : RUN npm run build... (Vite + esbuild output complete in dist/server.cjs)", 6200);
                    scheduleLog("Step 12/12 : Successfully tagged gcr.io/ai-studio-digital-twin/digital-twin:latest", 6900);

                    // Step 4: Docker push
                    setTimeout(() => {
                      setBuildStatus("docker_push");
                      setBuildProgress(80);
                    }, 7300);
                    scheduleLog("[STEP 4/5] [Publish Committed Image] Uploading layers to Artifact Registry gcr.io ...", 7500);
                    scheduleLog("Layer digest: push successful fce322a3-2022b... (completed in 900ms)", 8200);

                    // Step 5: Cloud Run deploy
                    setTimeout(() => {
                      setBuildStatus("deploying");
                      setBuildProgress(95);
                    }, 8700);
                    scheduleLog("[STEP 5/5] [Deploy to Cloud Run] Executing 'gcloud run deploy digital-twin --port 8080 --region us-central1'...", 8900);
                    scheduleLog("Route Ingress updated. Serving 100% traffic to revision DT-REVISION-002.", 9900);
                    
                    // Finished
                    setTimeout(() => {
                      setBuildStatus("finished");
                      setBuildProgress(100);
                      scheduleLog("==========================================================================", 10400);
                      scheduleLog("[COMPLETE] Live Cloud Run Container actively operational!", 10500);
                      scheduleLog("Container Endpoint: https://ais-pre-4rkaefar7h5gdfe7fvyl5i-527633697702.europe-west1.run.app", 10600);
                    }, 10300);

                  }}
                  className={`mt-4 w-full py-2.5 rounded font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center select-none active:scale-[0.98] ${
                    buildStatus === "idle" || buildStatus === "finished"
                      ? "bg-[#c5a059] text-[#050608] hover:bg-[#33ebff] shadow-[0_0_12px_rgba(197,160,89,0.25)] cursor-pointer"
                      : "bg-[#0b1420] text-[#8d8d8d] border border-[#122437] cursor-not-allowed"
                  }`}
                >
                  {buildStatus === "idle" ? (
                    <>Run Cloud Build Trigger</>
                  ) : buildStatus === "finished" ? (
                    <>Re-Deploy Applet Container</>
                  ) : (
                    <span className="flex items-center gap-1 bg-transparent border-0 p-0 animate-pulse text-[#c5a059]">
                      Processing Build ({buildProgress}%)
                    </span>
                  )}
                </button>
              </div>

              {/* Progress Tracker Cards */}
              <div className="bg-[#050608]/60 border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-3">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-500 tracking-wider">Deployment Pipeline Steps</span>
                <div className="flex flex-col gap-2 font-mono text-[10px]">
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                      buildStatus === "installing" ? "border-cyan-400 animate-pulse" :
                      buildStatus !== "idle" ? "bg-[#c5a059]/10 border-cyan-400 text-[#c5a059] font-bold" : "border-[#c5a05911] text-slate-700"
                    }`}>
                      {buildStatus !== "idle" && buildStatus !== "installing" ? "✓" : "1"}
                    </div>
                    <span className={buildStatus === "installing" ? "text-[#c5a059]" : "text-[#e0e0e0]"}>NPM Node Sandbox Installation</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                      buildStatus === "linting" ? "border-cyan-400 animate-pulse" :
                      buildStatus !== "idle" && buildStatus !== "installing" ? "bg-[#c5a059]/10 border-cyan-400 text-[#c5a059] font-bold" : "border-[#c5a05911] text-slate-700"
                    }`}>
                      {buildStatus !== "idle" && buildStatus !== "installing" && buildStatus !== "linting" ? "✓" : "2"}
                    </div>
                    <span className={buildStatus === "linting" ? "text-[#c5a059]" : "text-[#e0e0e0]"}>Typescript Compiler Lint Check</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                      buildStatus === "docker_build" ? "border-cyan-400 animate-pulse" :
                      buildStatus !== "idle" && buildStatus !== "installing" && buildStatus !== "linting" ? "bg-[#c5a059]/10 border-cyan-400 text-[#c5a059] font-bold" : "border-[#c5a05911] text-slate-700"
                    }`}>
                      {buildStatus === "docker_push" || buildStatus === "deploying" || buildStatus === "finished" ? "✓" : "3"}
                    </div>
                    <span className={buildStatus === "docker_build" ? "text-[#c5a059]" : "text-[#e0e0e0]"}>Docker Container Multi-Stage Compile</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                      buildStatus === "docker_push" ? "border-cyan-400 animate-pulse" :
                      buildStatus === "deploying" || buildStatus === "finished" ? "bg-[#c5a059]/10 border-cyan-400 text-[#c5a059] font-bold" : "border-[#c5a05911] text-slate-700"
                    }`}>
                      {buildStatus === "deploying" || buildStatus === "finished" ? "✓" : "4"}
                    </div>
                    <span className={buildStatus === "docker_push" ? "text-[#c5a059]" : "text-[#e0e0e0]"}>Artifact Registry GCR Publication</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                      buildStatus === "deploying" ? "border-cyan-400 animate-pulse" :
                      buildStatus === "finished" ? "bg-[#c5a059]/10 border-cyan-400 text-[#c5a059] font-bold" : "border-[#c5a05911] text-slate-700"
                    }`}>
                      {buildStatus === "finished" ? "✓" : "5"}
                    </div>
                    <span className={buildStatus === "deploying" ? "text-[#c5a059]" : "text-[#e0e0e0]"}>gcloud Run Service managed Deployment</span>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Section: Interactive Terminal Output Log */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="bg-[#050608] border border-[#c5a05933] rounded-lg p-4 flex flex-col h-[320px] shadow-inner font-mono">
                
                {/* Header terminal controls */}
                <div className="flex items-center justify-between border-b border-[#c5a05933] pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 block" />
                    <span className="text-[10px] text-slate-500 font-bold tracking-tight uppercase ml-1.5">Docker Container Build Logs</span>
                  </div>
                  <span className="text-[8px] bg-[#0b0c10] text-[#c5a059] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Live System Console</span>
                </div>

                {/* Console Logs */}
                <div className="flex-1 overflow-y-auto text-[10px] text-[#e0e0e0] flex flex-col gap-1 pr-1.5 scrollbar-thin select-text">
                  {terminalLogs.length === 0 ? (
                    <div className="text-slate-650 italic select-none h-full flex flex-col items-center justify-center">
                      <span className="uppercase font-bold block mb-1">CONSOLE IDLE</span>
                      Ready to execute deployment trigger. Click "Run Cloud Build Trigger" to start compiled streaming.
                    </div>
                  ) : (
                    terminalLogs.map((log, index) => {
                      const isComplete = log.includes("[COMPLETE]");
                      const isStep = log.includes("[STEP");
                      const isError = log.includes("Error:") || log.includes("failed");
                      let colorClass = "text-slate-350";
                      
                      if (isComplete) colorClass = "text-emerald-400 font-bold border-t border-emerald-500/20 pt-1.5 mt-1.5";
                      else if (isStep) colorClass = "text-[#c5a059] font-semibold border-b border-[#c5a059]/10 pb-1 mt-1";
                      else if (isError) colorClass = "text-rose-400";
                      
                      return (
                        <div key={index} className={`leading-relaxed tracking-tight ${colorClass}`}>
                          {log}
                        </div>
                      );
                    })
                  )}
                  <div ref={terminalLogsEndRef} />
                </div>
              </div>

              {/* Show cloudbuild.yaml rules reference */}
              <div className="bg-[#050608]/45 border border-[#c5a05933] p-3.5 rounded-lg flex flex-col gap-2">
                <div className="text-[9.5px] uppercase font-mono font-bold text-slate-500 tracking-wider flex justify-between items-center">
                  <span>Canonical Configuration Ledger (cloudbuild.yaml)</span>
                  <span className="text-[#c5a059] text-[8px] tracking-normal font-sans border border-[#c5a059]/20 px-1 py-0.2 rounded font-semibold uppercase">Trigger Code</span>
                </div>
                <pre className="text-[9px] text-[#556a7e] font-mono whitespace-pre-wrap leading-relaxed select-all max-h-[140px] overflow-y-auto pr-1">
{`# cloudbuild.yaml Rules Configuration
steps:
  - name: 'gcr.io/cloud-builders/npm'
    args: ['install']
    id: 'Install Dependencies'
  - name: 'gcr.io/cloud-builders/npm'
    args: ['run', 'lint']
    id: 'Verify Syntax and Types'
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/digital-twin:$COMMIT_SHA', '.']
    id: 'Compile Container Image'
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args: ['run', 'deploy', 'digital-twin', '--region=us-central1', '--port=8080']
    id: 'Deploy to Cloud Run'`}
                </pre>
              </div>

            </div>
            
          </div>

        </div>
      )}

      {/* RENDER THE CIRQ COGNITIVE CIRCUIT SIMULATION TAB */}
      {activeTab === "cirq" && (
        <div className="flex flex-col gap-6 animate-fadeIn text-start font-sans">
          
          {/* Header Introduction Card */}
          <div className="bg-[#050608] border border-[#122438] p-5 rounded-lg flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[50px] h-[50px] bg-gradient-to-tr from-transparent to-[#c5a059]/5 rounded-bl-full pointer-events-none" />
            <div className="flex-1 flex flex-col gap-2 text-start">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-950/35 border border-purple-500/30 w-fit text-[8px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                Information State Evolution Substrate (Cirq Analog)
              </div>
              <h3 className="text-sm font-bold font-mono text-[#e0e0e0] uppercase tracking-wide">
                Cognitive State Transition Circuits
              </h3>
              <p className="text-xs text-[#a0aec0] leading-relaxed">
                Pathfinder borrows the circuit abstraction from <b className="text-[#c5a059]">Cirq</b> as a visualization of <b className="text-purple-400">cognitive state transitions</b>. The analogy describes governance flow rather than physical quantum computation.
              </p>
            </div>
            
            <div className="w-full md:w-[280px] flex-shrink-0 bg-[#060b13] border border-purple-900/30 p-4 rounded-lg flex flex-col gap-2">
              <span className="text-[9px] font-mono text-[#8d8d8d] uppercase tracking-wider">Sovereign Equivalencies:</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-[#050608] border border-purple-950 p-2 rounded">
                  <div className="text-purple-400 font-bold">Information State</div>
                  <div className="text-[8.5px] text-[#8d8d8d]">Quantum analogue</div>
                </div>
                <div className="bg-[#050608] border border-purple-950 p-2 rounded">
                  <div className="text-purple-400 font-bold">Measurement</div>
                  <div className="text-[8.5px] text-[#8d8d8d]">Observation</div>
                </div>
                <div className="bg-[#050608] border border-purple-950 p-2 rounded">
                  <div className="text-purple-400 font-bold">Circuit</div>
                  <div className="text-[8.5px] text-[#8d8d8d]">Cognitive Workflow</div>
                </div>
                <div className="bg-[#050608] border border-purple-950 p-2 rounded">
                  <div className="text-purple-400 font-bold">Evolution</div>
                  <div className="text-[8.5px] text-[#8d8d8d]">Lineage Trace</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Circuit Canvas & Terminal Split */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* SVG Circuit Canvas Card */}
            <div className="xl:col-span-8 bg-[#050608] border border-[#c5a05933] rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-900/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  SIMULATION substrate: ONLINE
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b border-[#c5a05922] pb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-[#c5a059] uppercase tracking-wider">Pathfinder Cognitive Waveguide</span>
                  <span className="text-[8.5px] text-slate-500 font-mono">Interactive Cirq-inspired state transformation grid</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (cirqSimulating) return;
                      setCirqActiveStep(-1);
                      setCirqLogs([]);
                    }}
                    className="px-2 py-1 text-[9px] font-mono text-[#8d8d8d] hover:text-[#dae2eb] bg-[#0b0c10] border border-[#c5a05922] rounded transition-all"
                  >
                    RESET
                  </button>
                  <button
                    onClick={async () => {
                      if (cirqSimulating) return;
                      setCirqSimulating(true);
                      setCirqLogs([]);
                      
                      const steps = [
                        {
                          step: 0,
                          log: "Initializing quantum-cognitive state vector |Ψ₀⟩ = |0000000⟩. All physical and cognitive registers are reset to default operational ground states."
                        },
                        {
                          step: 1,
                          log: "Applying Hadamard Gate H(q₁) — opening selective variable aperture in AETHER. Variable states enter a balanced superposition |Ψ₁⟩ = 1/√2(|0000000⟩ + |0100000⟩)."
                        },
                        {
                          step: 2,
                          log: "Applying CNOT(q₂ → q₀) and CNOT(q₂ → q₃). Telemetry on HERMES (q₂) entangles with structural load metrics on RAPIDS (q₀) and semantic interpretations on SIMON (q₃). Mechanical stress states are now directly linked to physical reality."
                        },
                        {
                          step: 3,
                          log: "Applying CZ Gate(q₃, q₄) — JEMMA reality check. Compares interpreted state against immutable structural limits. Phase is flipped if alignment drift is detected, zeroing out certainty inflation."
                        },
                        {
                          step: 4,
                          log: "Applying Phase Gate S(q₅) — OCTAGON boundary alignment. System parameters are phase-rotated to synchronize with authorized override rules and safety maximum envelopes."
                        },
                        {
                          step: 5,
                          log: "Applying CCNOT Gate(q₄, q₅ → q₆) — Controlled Action Dispatch on CRYSTAL BRIDGE. Final physical action is safely toggled only when reality check succeeds and governance parameters are aligned."
                        },
                        {
                          step: 6,
                          log: "Wavefunction collapse via Operator Measurement M(q₀, q₁, q₂, q₃, q₄, q₅, q₆). Measured bit vector: |1101011⟩. Provenance lineage sealed in local register. Operational sovereign action completed."
                        }
                      ];

                      for (let i = 0; i < steps.length; i++) {
                        setCirqActiveStep(steps[i].step);
                        setCirqLogs(prev => [...prev, steps[i].log]);
                        await new Promise(resolve => setTimeout(resolve, 1400));
                      }
                      setCirqSimulating(false);
                    }}
                    disabled={cirqSimulating}
                    className={`px-3 py-1 text-[9px] font-mono font-bold uppercase rounded border transition-all flex items-center gap-1.5 ${
                      cirqSimulating
                        ? "bg-purple-950/20 text-purple-400 border-purple-900/40 cursor-not-allowed"
                        : "bg-purple-900/30 text-purple-400 border-purple-500/50 hover:bg-purple-500/20"
                    }`}
                  >
                    {cirqSimulating ? "Simulating..." : "Run Cognitive Circuit"}
                  </button>
                </div>
              </div>

              {/* Circuit Grid Canvas (SVG) */}
              <div className="w-full bg-[#030406] border border-[#111f2d] rounded p-4 flex justify-center items-center overflow-x-auto min-h-[340px]">
                <svg width="680" height="300" viewBox="0 0 680 300" className="select-none overflow-visible">
                  {/* Grid Lines background */}
                  <g opacity="0.05">
                    {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650].map((x) => (
                      <line key={x} x1={x} y1="0" x2={x} y2="300" stroke="#c5a059" strokeWidth="1" />
                    ))}
                  </g>

                  {/* Qubit Names & Horizonal Wire Lines */}
                  {[
                    { name: "q₀ [RAPIDS]", label: "Structure Field", y: 30, color: "#3b82f6" },
                    { name: "q₁ [AETHER]", label: "Aperture Field", y: 70, color: "#06b6d4" },
                    { name: "q₂ [HERMES]", label: "Telemetry Ledger", y: 110, color: "#10b981" },
                    { name: "q₃ [SIMON]", label: "Meaning Field", y: 150, color: "#f59e0b" },
                    { name: "q₄ [JEMMA]", label: "Challenge Gate", y: 190, color: "#ef4444" },
                    { name: "q₅ [OCTAGON]", label: "Governance Ring", y: 230, color: "#a855f7" },
                    { name: "q₆ [CRYSTAL]", label: "Action Dispatch", y: 270, color: "#ec4899" }
                  ].map((qubit) => {
                    return (
                      <g key={qubit.name}>
                        {/* Qubit Label text */}
                        <text x="10" y={qubit.y + 4} fill="#8d8d8d" className="font-mono text-[9px] font-bold" textAnchor="start">
                          {qubit.name}
                        </text>
                        <text x="10" y={qubit.y + 13} fill="#4a5568" className="font-mono text-[7px]" textAnchor="start">
                          {qubit.label}
                        </text>
                        
                        {/* Wire line */}
                        <line
                          x1="110"
                          y1={qubit.y}
                          x2="590"
                          y2={qubit.y}
                          stroke={cirqActiveStep >= 0 ? `${qubit.color}55` : "#1e293b"}
                          strokeWidth="1.5"
                        />
                        
                        {/* Interactive state indicator at wire start */}
                        <circle
                          cx="110"
                          cy={qubit.y}
                          r="4.5"
                          fill={cirqActiveStep >= 0 ? qubit.color : "#1e293b"}
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}

                  {/* Vertical step zones / sweeps */}
                  {[
                    { id: 1, x: 170, label: "AETHER H" },
                    { id: 2, x: 250, label: "TELEMETRY CNOT" },
                    { id: 3, x: 330, label: "JEMMA CZ" },
                    { id: 4, x: 410, label: "OCTAGON S" },
                    { id: 5, x: 490, label: "DISPATCH CCNOT" },
                    { id: 6, x: 570, label: "OBSERVER M" }
                  ].map((s) => {
                    const isStepPassed = cirqActiveStep >= s.id;
                    const isStepActive = cirqActiveStep === s.id;
                    return (
                      <g key={s.id}>
                        {/* Active vertical glow block */}
                        {isStepActive && (
                          <rect
                            x={s.x - 35}
                            y="10"
                            width="70"
                            height="280"
                            fill="rgba(168, 85, 247, 0.04)"
                            stroke="rgba(168, 85, 247, 0.2)"
                            strokeDasharray="2,2"
                            rx="4"
                          />
                        )}
                        
                        {/* Step indicator tag at bottom */}
                        <text x={s.x} y="15" fill={isStepActive ? "#c5a059" : isStepPassed ? "#4a5568" : "#2d3748"} className="font-mono text-[7.5px] font-bold" textAnchor="middle">
                          STEP {s.id}
                        </text>
                      </g>
                    );
                  })}

                  {/* STEP 1: AETHER HADAMARD */}
                  <g onClick={() => !cirqSimulating && setCirqActiveStep(1)} className="cursor-pointer group">
                    <rect
                      x="155"
                      y="55"
                      width="30"
                      height="30"
                      fill={cirqActiveStep >= 1 ? "rgba(6, 182, 212, 0.2)" : "#090d16"}
                      stroke={cirqActiveStep >= 1 ? "#06b6d4" : "#1e293b"}
                      strokeWidth="1.5"
                      rx="3"
                      className="transition-all"
                    />
                    <text x="170" y="74" fill={cirqActiveStep >= 1 ? "#06b6d4" : "#4a5568"} className="font-mono text-xs font-bold" textAnchor="middle">
                      H
                    </text>
                  </g>

                  {/* STEP 2: TELEMETRY CNOT */}
                  <g onClick={() => !cirqSimulating && setCirqActiveStep(2)} className="cursor-pointer">
                    <circle
                      cx="250"
                      cy="110"
                      r="4"
                      fill={cirqActiveStep >= 2 ? "#10b981" : "#4a5568"}
                    />
                    <line
                      x1="250"
                      y1="30"
                      x2="250"
                      y2="150"
                      stroke={cirqActiveStep >= 2 ? "#10b981" : "#1e293b"}
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="250"
                      cy="30"
                      r="6"
                      fill="#030406"
                      stroke={cirqActiveStep >= 2 ? "#10b981" : "#4a5568"}
                      strokeWidth="1.5"
                    />
                    <line x1="245" y1="30" x2="255" y2="30" stroke={cirqActiveStep >= 2 ? "#10b981" : "#4a5568"} strokeWidth="1.5" />
                    <line x1="250" y1="25" x2="250" y2="35" stroke={cirqActiveStep >= 2 ? "#10b981" : "#4a5568"} strokeWidth="1.5" />
                    
                    <circle
                      cx="250"
                      cy="150"
                      r="6"
                      fill="#030406"
                      stroke={cirqActiveStep >= 2 ? "#10b981" : "#4a5568"}
                      strokeWidth="1.5"
                    />
                    <line x1="245" y1="150" x2="255" y2="150" stroke={cirqActiveStep >= 2 ? "#10b981" : "#4a5568"} strokeWidth="1.5" />
                    <line x1="250" y1="145" x2="250" y2="155" stroke={cirqActiveStep >= 2 ? "#10b981" : "#4a5568"} strokeWidth="1.5" />
                  </g>

                  {/* STEP 3: JEMMA CZ CONSTRAINTS */}
                  <g onClick={() => !cirqSimulating && setCirqActiveStep(3)} className="cursor-pointer">
                    <circle
                      cx="330"
                      cy="150"
                      r="4"
                      fill={cirqActiveStep >= 3 ? "#ef4444" : "#4a5568"}
                    />
                    <line
                      x1="330"
                      y1="150"
                      x2="330"
                      y2="190"
                      stroke={cirqActiveStep >= 3 ? "#ef4444" : "#1e293b"}
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="330"
                      cy="190"
                      r="4"
                      fill={cirqActiveStep >= 3 ? "#ef4444" : "#4a5568"}
                    />
                  </g>

                  {/* STEP 4: OCTAGON PHASE ROTATION */}
                  <g onClick={() => !cirqSimulating && setCirqActiveStep(4)} className="cursor-pointer">
                    <rect
                      x="395"
                      y="215"
                      width="30"
                      height="30"
                      fill={cirqActiveStep >= 4 ? "rgba(168, 85, 247, 0.2)" : "#090d16"}
                      stroke={cirqActiveStep >= 4 ? "#a855f7" : "#1e293b"}
                      strokeWidth="1.5"
                      rx="3"
                    />
                    <text x="410" y="234" fill={cirqActiveStep >= 4 ? "#a855f7" : "#4a5568"} className="font-mono text-xs font-bold" textAnchor="middle">
                      S
                    </text>
                  </g>

                  {/* STEP 5: CRYSTAL TOFFOLI DISPATCH */}
                  <g onClick={() => !cirqSimulating && setCirqActiveStep(5)} className="cursor-pointer">
                    <circle cx="490" cy="190" r="4" fill={cirqActiveStep >= 5 ? "#ec4899" : "#4a5568"} />
                    <circle cx="490" cy="230" r="4" fill={cirqActiveStep >= 5 ? "#ec4899" : "#4a5568"} />
                    <line
                      x1="490"
                      y1="190"
                      x2="490"
                      y2="270"
                      stroke={cirqActiveStep >= 5 ? "#ec4899" : "#1e293b"}
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="490"
                      cy="270"
                      r="6"
                      fill="#030406"
                      stroke={cirqActiveStep >= 5 ? "#ec4899" : "#4a5568"}
                      strokeWidth="1.5"
                    />
                    <line x1="485" y1="270" x2="495" y2="270" stroke={cirqActiveStep >= 5 ? "#ec4899" : "#4a5568"} strokeWidth="1.5" />
                    <line x1="490" y1="265" x2="490" y2="275" stroke={cirqActiveStep >= 5 ? "#ec4899" : "#4a5568"} strokeWidth="1.5" />
                  </g>

                  {/* STEP 6: OBSERVER MEASUREMENT COLLAPSE */}
                  {Array.from({ length: 7 }).map((_, qubitIndex) => {
                    const y = 30 + qubitIndex * 40;
                    return (
                      <g key={qubitIndex} onClick={() => !cirqSimulating && setCirqActiveStep(6)} className="cursor-pointer">
                        <rect
                          x="555"
                          y={y - 12}
                          width="26"
                          height="24"
                          fill={cirqActiveStep >= 6 ? "rgba(224, 224, 224, 0.15)" : "#090d16"}
                          stroke={cirqActiveStep >= 6 ? "#dae2eb" : "#1e293b"}
                          strokeWidth="1.2"
                          rx="2"
                        />
                        <path
                          d={`M 560 ${y + 6} A 10 10 0 0 1 576 ${y + 6}`}
                          stroke={cirqActiveStep >= 6 ? "#dae2eb" : "#4a5568"}
                          strokeWidth="1"
                          fill="none"
                        />
                        <line
                          x1="568"
                          y1={y + 6}
                          x2={cirqActiveStep >= 6 ? "575" : "568"}
                          y2={cirqActiveStep >= 6 ? y - 4 : y - 6}
                          stroke={cirqActiveStep >= 6 ? "#c5a059" : "#4a5568"}
                          strokeWidth="1.5"
                        />
                        
                        <line x1="581" y1={y - 2} x2="630" y2={y - 2} stroke={cirqActiveStep >= 6 ? "#c5a059" : "#111f2d"} strokeWidth="1" />
                        <line x1="581" y1={y + 2} x2="630" y2={y + 2} stroke={cirqActiveStep >= 6 ? "#c5a059" : "#111f2d"} strokeWidth="1" />
                        
                        {cirqActiveStep >= 6 && (
                          <text x="615" y={y - 6} fill="#c5a059" className="font-mono text-[8px] font-bold">
                            {[1, 1, 0, 1, 0, 1, 1][qubitIndex]}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              
              <div className="flex justify-between items-center bg-[#07090e] border border-purple-950 p-3 rounded text-xs font-mono">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-[#8d8d8d] uppercase text-[9px] block">State-Vector Dimension</span>
                    <span className="text-[#e0e0e0] font-bold">2⁷ = 128 Hilbert Dimensions</span>
                  </div>
                  <div className="border-l border-purple-950 pl-4">
                    <span className="text-[#8d8d8d] uppercase text-[9px] block">Active Entropy</span>
                    <span className="text-amber-400 font-bold">{getEntropyLabel(cirqActiveStep)}</span>
                  </div>
                  <div className="border-l border-purple-950 pl-4">
                    <span className="text-[#8d8d8d] uppercase text-[9px] block">Traceability Hash</span>
                    <span className="text-purple-400 font-bold">CIRQ-LINEAGE-H7-x90A</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Information State Evolution Terminal */}
            <div className="xl:col-span-4 bg-[#050608] border border-[#c5a05933] rounded-lg p-5 flex flex-col gap-3 relative">
              <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#c5a059] flex items-center gap-1">
                <Database size={12} className="text-purple-400" /> State Evolution Terminal
              </div>
              
              <p className="text-[10px] text-[#8d8d8d] font-mono leading-relaxed">
                Raw compilation of state vectors, gate alignments, and measurements. Notice how lineage is preserved through unitary step progression.
              </p>
              
              {/* Terminal Logs Wrapper */}
              <div 
                ref={cirqLogsEndRef as any}
                className="flex-1 min-h-[220px] max-h-[300px] xl:max-h-none overflow-y-auto bg-[#030406] border border-purple-950/45 p-3 rounded font-mono text-[10px] leading-relaxed flex flex-col gap-3 custom-scrollbar"
              >
                {cirqLogs.length === 0 ? (
                  <div className="text-[#556a7e] italic flex items-center justify-center h-full">
                    Click "Run Cognitive Circuit" to trace state transformation...
                  </div>
                ) : (
                  cirqLogs.map((log, i) => (
                    <div key={i} className="border-b border-[#c5a05911] pb-2 text-[#dae2eb] animate-fadeIn text-start">
                      <span className="text-purple-400 font-bold block mb-0.5">LINEAGE STEP #{i}:</span>
                      <span className="text-slate-300 font-sans">{log}</span>
                    </div>
                  ))
                )}
              </div>
              
              <div className="border-t border-purple-950/45 pt-3 flex flex-col gap-2">
                <span className="text-[8px] font-mono font-bold uppercase text-slate-500">Substrate Coupling Index:</span>
                <div className="bg-[#0b0c10] border border-[#c5a05922] p-2 rounded flex justify-between items-center font-mono text-[10px]">
                  <span className="text-slate-400">COGNITIVE ENTANGLEMENT:</span>
                  <span className="font-bold text-emerald-400">
                    {cirqActiveStep >= 2 ? "100.0% COUPLING" : "0.0% DISCONNECTED"}
                  </span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* RENDER THE CUML STRUCTURAL PERCEPTION INTERACTIVE SANDBOX */}
      {activeTab === "cuml" && (
        <div className="flex flex-col gap-6 animate-fadeIn text-start font-sans">
          
          {/* Header Introduction Card */}
          <div className="bg-[#050608] border border-[#122438] p-5 rounded-lg flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[50px] h-[50px] bg-gradient-to-tr from-transparent to-cyan-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex-1 flex flex-col gap-2 text-start">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/35 border border-cyan-500/30 w-fit text-[8px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                RAPIDS cuML Accelerated Perception Substrate
              </div>
              <h3 className="text-sm font-bold font-mono text-[#e0e0e0] uppercase tracking-wide">
                cuML Accelerated Structural Perception
              </h3>
              <p className="text-xs text-[#a0aec0] leading-relaxed">
                NVIDIA <b className="text-cyan-400">cuML</b> provides GPU-accelerated algorithms to extract patterns from high-volume physical telemetry. In the Pathfinder doctrine, <b className="text-[#c5a059]">cuML is not intelligence—it is accelerated structural perception</b>. It translates raw multi-dimensional stress states into cohesive topological groupings before SIMON interprets their meaning and JEMMA challenges their validity.
              </p>
            </div>
            
            <div className="w-full md:w-[280px] flex-shrink-0 bg-[#060b13] border border-cyan-900/30 p-4 rounded-lg flex flex-col gap-2">
              <span className="text-[9px] font-mono text-[#8d8d8d] uppercase tracking-wider">Doctrine Separation Layer:</span>
              <div className="flex flex-col gap-1.5 text-[9.5px] font-mono">
                <div className="flex justify-between items-center bg-[#050608] p-1.5 rounded border border-cyan-950">
                  <span className="text-cyan-400 font-bold">1. HERMES</span>
                  <span className="text-slate-500">Retrieves Telemetry</span>
                </div>
                <div className="flex justify-between items-center bg-[#050608] p-1.5 rounded border border-cyan-950">
                  <span className="text-cyan-400 font-bold">2. cuDF</span>
                  <span className="text-slate-500">Holds GPU Vectors</span>
                </div>
                <div className="flex justify-between items-center bg-[#050608] p-1.5 rounded border border-cyan-950">
                  <span className="text-cyan-400 font-bold">3. cuML</span>
                  <span className="text-slate-500">Resolves Structure</span>
                </div>
                <div className="flex justify-between items-center bg-[#050608] p-1.5 rounded border border-cyan-950">
                  <span className="text-cyan-400 font-bold">4. SIMON</span>
                  <span className="text-slate-500">Interprets Function</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Bento Sandbox Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Left Column: Algorithm Config & Selector */}
            <div className="xl:col-span-4 flex flex-col gap-4">
              
              {/* Algorithm Selector Card */}
              <div className="bg-[#050608] border border-[#c5a05933] rounded-lg p-4 flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold text-[#c5a059] uppercase tracking-wider">Select Perception Primitive</span>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "umap", title: "UMAP Reduction", desc: "Compress 128D telemetry to 2D topological map", icon: "Compass" },
                    { id: "clustering", title: "HDBSCAN Clustering", desc: "Delineate safe vs critical state boundaries", icon: "Layers" },
                    { id: "knn", title: "Nearest Neighbors", desc: "Compare candidate state to historic failures", icon: "Zap" },
                    { id: "regression", title: "Decay Regression", desc: "Model material deterioration under load", icon: "Activity" }
                  ].map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => {
                        setCumlActiveAlgo(algo.id as any);
                        setCumlLogs([]);
                      }}
                      className={`p-3 rounded border text-start transition-all flex flex-col gap-1 ${
                        cumlActiveAlgo === algo.id
                          ? "bg-cyan-950/25 border-cyan-500 text-cyan-400"
                          : "bg-[#0b0c10] border-[#c5a05911] text-slate-400 hover:border-[#c5a05922]"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold font-mono uppercase tracking-wide">{algo.title}</span>
                        <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[#050608] border border-cyan-950/50">cuML API</span>
                      </div>
                      <span className="text-[10px] text-slate-500 leading-normal">{algo.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Parameters Card */}
              <div className="bg-[#050608] border border-[#c5a05933] rounded-lg p-4 flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold text-[#c5a059] uppercase tracking-wider">Hyperparameter Overrides</span>
                
                {cumlActiveAlgo === "umap" && (
                  <div className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400">N-Neighbors (Manifold Spread):</span>
                        <span className="text-cyan-400 font-bold">{cumlParams.nNeighbors}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="30"
                        value={cumlParams?.nNeighbors ?? 15}
                        onChange={(e) => setCumlParams(p => ({ ...p, nNeighbors: parseInt(e.target.value) || 15 }))}
                        className="accent-cyan-500 cursor-pointer h-2.5 py-1.5 bg-[#0b0c10] rounded"
                      />
                    </div>
                    <p className="text-[9px] text-[#8d8d8d] font-mono leading-relaxed">
                      Controls the balance between local and global structure. Lower values focus on local couplings.
                    </p>
                  </div>
                )}

                {cumlActiveAlgo === "clustering" && (
                  <div className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Min Cluster Size (HDBSCAN):</span>
                        <span className="text-cyan-400 font-bold">{cumlParams.minClusterSize}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="15"
                        value={cumlParams?.minClusterSize ?? 5}
                        onChange={(e) => setCumlParams(p => ({ ...p, minClusterSize: parseInt(e.target.value) || 5 }))}
                        className="accent-cyan-500 cursor-pointer h-2.5 py-1.5 bg-[#0b0c10] rounded"
                      />
                    </div>
                    <p className="text-[9px] text-[#8d8d8d] font-mono leading-relaxed">
                      Defines the minimal topological density threshold required to identify a legitimate material cluster state.
                    </p>
                  </div>
                )}

                {cumlActiveAlgo === "knn" && (
                  <div className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400">K-Neighbors (Similarity Check):</span>
                        <span className="text-cyan-400 font-bold">{cumlParams.kNeighbors}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={cumlParams?.kNeighbors ?? 3}
                        onChange={(e) => setCumlParams(p => ({ ...p, kNeighbors: parseInt(e.target.value) || 3 }))}
                        className="accent-cyan-500 cursor-pointer h-2.5 py-1.5 bg-[#0b0c10] rounded"
                      />
                    </div>
                    <p className="text-[9px] text-[#8d8d8d] font-mono leading-relaxed">
                      Number of nearest historic strain signatures to query against current real-time physical load metrics.
                    </p>
                  </div>
                )}

                {cumlActiveAlgo === "regression" && (
                  <div className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Polynomial Degree:</span>
                        <span className="text-cyan-400 font-bold">{cumlParams.decayDegree}D</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        value={cumlParams?.decayDegree ?? 2}
                        onChange={(e) => setCumlParams(p => ({ ...p, decayDegree: parseInt(e.target.value) || 2 }))}
                        className="accent-cyan-500 cursor-pointer h-2.5 py-1.5 bg-[#0b0c10] rounded"
                      />
                    </div>
                    <p className="text-[9px] text-[#8d8d8d] font-mono leading-relaxed">
                      Specifies the polynomial order of the non-linear deterioration decay estimator fitting structural stress telemetry.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Visualization & Console Terminal */}
            <div className="xl:col-span-8 flex flex-col gap-4">
              
              {/* Main SVG/Canvas Card */}
              <div className="bg-[#050608] border border-[#c5a05933] rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-900/50">
                    NVIDIA NVIDIA_A100_SXM4_80GB
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-b border-[#c5a05922] pb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold text-[#c5a059] uppercase tracking-wider">Perception Grid Space</span>
                    <span className="text-[8.5px] text-slate-500 font-mono">Accelerated GPU visualizer for mathematical manifolds</span>
                  </div>
                  
                  <button
                    onClick={async () => {
                      if (cumlSimulating) return;
                      setCumlSimulating(true);
                      setCumlLogs([]);
                      
                      const solverLogs = {
                        umap: [
                          "Initializing GPU DataFrame cuDF: Ingested 1,024 vectors with 128 topological channels in device memory.",
                          "Allocating device memory addresses for UMAP solver. Running k-nearest neighbor descent on GPU cores.",
                          "Constructing fuzzy simplicial set representation. Executing gradient descent coordinates layout... elapsed: 0.14ms",
                          "UMAP projection complete. Successfully compressed 128D strain-vector space into 2D principal coordinate plane."
                        ],
                        clustering: [
                          "Preparing 2D UMAP embeddings coordinate buffer for density-based grouping.",
                          "Executing GPU HDBSCAN clustering engine. Computing mutual reachability graph on CUDA threads.",
                          "Extracting structural cluster hierarchy tree based on minimal topological bounds.",
                          "Clustering complete. Identified 3 distinct operational zones: Safe Anchor, Midspan Yield Risk, Span Tension Drift."
                        ],
                        knn: [
                          "Initializing high-speed KNN query pipeline in cuML (Brute-force CUDA index).",
                          "Binding query candidate vector to texture memory cache.",
                          "Evaluating Euclidean distance space against 1,024 historical reference structures.",
                          "KNN Search complete. Identified closest 3 historic bridge states. Anomaly mismatch index: 0.082 (Safe boundary)."
                        ],
                        regression: [
                          "Reading 50-year concrete erosion logs into GPU data frame columns.",
                          "Formulating least-squares normal equations for polynomial regression estimator.",
                          "Inverting material degradation design matrix directly on CUDA compute cores.",
                          "Regression solved. Structural load threshold at year 50 estimated at 350kN. Decay limit warning: Peak Stress."
                        ]
                      }[cumlActiveAlgo];

                      for (let i = 0; i < solverLogs.length; i++) {
                        setCumlLogs(prev => [...prev, solverLogs[i]]);
                        await new Promise(resolve => setTimeout(resolve, 800));
                      }
                      setCumlSimulating(false);
                    }}
                    disabled={cumlSimulating}
                    className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded border transition-all flex items-center gap-1.5 ${
                      cumlSimulating
                        ? "bg-cyan-950/20 text-cyan-400 border-cyan-900/40 cursor-not-allowed"
                        : "bg-cyan-950/40 text-cyan-400 border-cyan-500 hover:bg-cyan-500/20"
                    }`}
                  >
                    {cumlSimulating ? "Resolving..." : "Dispatch cuML Solver"}
                  </button>
                </div>

                {/* SVG Visual Plotting Arena */}
                <div className="w-full bg-[#030406] border border-[#111f2d] rounded p-4 flex flex-col justify-center items-center overflow-x-auto min-h-[300px] relative">
                  
                  {/* Background Grid */}
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.03] pointer-events-none">
                    {Array.from({ length: 72 }).map((_, i) => (
                      <div key={i} className="border border-cyan-400" />
                    ))}
                  </div>

                  {cumlActiveAlgo === "umap" && (
                    <svg width="500" height="240" className="overflow-visible select-none">
                      <g opacity="0.3">
                        <line x1="40" y1="210" x2="480" y2="210" stroke="#4a5568" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1="40" y1="20" x2="40" y2="210" stroke="#4a5568" strokeWidth="1" strokeDasharray="3,3" />
                        <text x="480" y="222" fill="#4a5568" className="font-mono text-[7px]" textAnchor="end">Primary Stress Deviation (U₁)</text>
                        <text x="32" y="24" fill="#4a5568" className="font-mono text-[7px]" textAnchor="end" transform="rotate(-90 32 24)">Material Shear (U₂)</text>
                      </g>

                      {/* UMAP Scattered Points */}
                      {[
                        { x: 120, y: 150, r: 5, color: "#10b981", label: "Safe Base Cluster" },
                        { x: 140, y: 130, r: 4.5, color: "#10b981", label: "Safe Base Cluster" },
                        { x: 110, y: 170, r: 6, color: "#10b981", label: "Safe Base Cluster" },
                        { x: 130, y: 160, r: 5, color: "#10b981", label: "Safe Base Cluster" },
                        
                        { x: 380, y: 80, r: 5.5, color: "#ef4444", label: "Yield Failure Domain" },
                        { x: 410, y: 90, r: 5, color: "#ef4444", label: "Yield Failure Domain" },
                        { x: 390, y: 110, r: 6.5, color: "#ef4444", label: "Yield Failure Domain" },
                        { x: 420, y: 70, r: 4.5, color: "#ef4444", label: "Yield Failure Domain" },
                        
                        { x: 260, y: 220, r: 5, color: "#f59e0b", label: "Tension Drift Zone" },
                        { x: 280, y: 240, r: 4.5, color: "#f59e0b", label: "Tension Drift Zone" },
                        { x: 250, y: 200, r: 5.5, color: "#f59e0b", label: "Tension Drift Zone" },
                        { x: 290, y: 210, r: 5, color: "#f59e0b", label: "Tension Drift Zone" },
                      ].map((pt, idx) => (
                        <g key={idx} className="group cursor-pointer">
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={cumlSimulating ? 0 : pt.r}
                            fill={pt.color}
                            opacity={0.7}
                            className="transition-all duration-700 ease-out hover:opacity-100 hover:scale-125"
                            style={{ transitionDelay: `${idx * 40}ms` }}
                          />
                          {/* Inner core */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={cumlSimulating ? 0 : 2}
                            fill="#ffffff"
                          />
                          {/* Label tooltip */}
                          <text
                            x={pt.x}
                            y={pt.y - 10}
                            fill="#e2e8f0"
                            className="font-mono text-[7px] bg-[#050608] opacity-0 group-hover:opacity-100 transition-all pointer-events-none"
                            textAnchor="middle"
                          >
                            {pt.label} (s: {pt.r * 15}kN)
                          </text>
                        </g>
                      ))}

                      {cumlSimulating && (
                        <g className="animate-pulse">
                          <circle cx="250" cy="120" r="40" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1.5" />
                          <circle cx="250" cy="120" r="80" fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" strokeDasharray="4,4" />
                          <text x="250" y="123" fill="#06b6d4" className="font-mono text-[8px] font-bold" textAnchor="middle">SOLVING MANIFOLD GEOMETRY...</text>
                        </g>
                      )}
                    </svg>
                  )}

                  {cumlActiveAlgo === "clustering" && (
                    <svg width="500" height="240" className="overflow-visible select-none">
                      {/* Cluster boundaries (convexhulls simulated) */}
                      {!cumlSimulating && (
                        <>
                          {/* Cluster Alpha boundary */}
                          <path
                            d="M 90 175 L 140 115 L 165 155 L 125 190 Z"
                            fill="rgba(16, 185, 129, 0.05)"
                            stroke="rgba(16, 185, 129, 0.4)"
                            strokeWidth="1.5"
                            strokeDasharray="3,3"
                            className="animate-fadeIn"
                          />
                          <text x="120" y="105" fill="#10b981" className="font-mono text-[8px] font-bold" textAnchor="middle">CLUSTER ALPHA (SAFE)</text>

                          {/* Cluster Beta boundary */}
                          <path
                            d="M 360 85 L 420 55 L 440 115 L 380 130 Z"
                            fill="rgba(239, 68, 68, 0.05)"
                            stroke="rgba(239, 68, 68, 0.4)"
                            strokeWidth="1.5"
                            strokeDasharray="3,3"
                            className="animate-fadeIn"
                          />
                          <text x="400" y="45" fill="#ef4444" className="font-mono text-[8px] font-bold" textAnchor="middle">CLUSTER BETA (CRITICAL YIELD)</text>

                          {/* Cluster Gamma boundary */}
                          <path
                            d="M 230 220 L 280 185 L 315 230 L 275 260 Z"
                            fill="rgba(245, 158, 11, 0.05)"
                            stroke="rgba(245, 158, 11, 0.4)"
                            strokeWidth="1.5"
                            strokeDasharray="3,3"
                            className="animate-fadeIn"
                          />
                          <text x="270" y="175" fill="#f59e0b" className="font-mono text-[8px] font-bold" textAnchor="middle">CLUSTER GAMMA (ALIGN DRIFT)</text>
                        </>
                      )}

                      {/* Cluster Data Points */}
                      {[
                        { x: 120, y: 150, color: "#10b981" },
                        { x: 140, y: 130, color: "#10b981" },
                        { x: 110, y: 170, color: "#10b981" },
                        { x: 130, y: 160, color: "#10b981" },
                        
                        { x: 380, y: 80, color: "#ef4444" },
                        { x: 410, y: 90, color: "#ef4444" },
                        { x: 390, y: 110, color: "#ef4444" },
                        { x: 420, y: 70, color: "#ef4444" },
                        
                        { x: 260, y: 220, color: "#f59e0b" },
                        { x: 280, y: 240, color: "#f59e0b" },
                        { x: 250, y: 200, color: "#f59e0b" },
                        { x: 290, y: 210, color: "#f59e0b" },
                      ].map((pt, idx) => (
                        <circle
                          key={idx}
                          cx={pt.x}
                          cy={pt.y}
                          r={cumlSimulating ? 0 : 4.5}
                          fill={pt.color}
                          className="transition-all duration-500 ease-out"
                        />
                      ))}

                      {cumlSimulating && (
                        <g className="animate-pulse">
                          <text x="250" y="120" fill="#06b6d4" className="font-mono text-[8.5px] font-bold" textAnchor="middle">CALCULATING DENSITY GRADIENTS (HDBSCAN)...</text>
                        </g>
                      )}
                    </svg>
                  )}

                  {cumlActiveAlgo === "knn" && (
                    <svg width="500" height="240" className="overflow-visible select-none">
                      {/* Historic failure nodes */}
                      {[
                        { x: 100, y: 80, type: "failure", label: "Historic Collapse 1994" },
                        { x: 400, y: 180, type: "failure", label: "Shear Test Fault" },
                        { x: 150, y: 160, type: "stable", label: "Baseline Span B" },
                        { x: 220, y: 60, type: "stable", label: "Oxford Twin Baseline" },
                      ].map((hist, idx) => (
                        <g key={idx}>
                          <rect
                            x={hist.x - 4}
                            y={hist.y - 4}
                            width="8"
                            height="8"
                            fill={hist.type === "failure" ? "#f87171" : "#10b981"}
                            opacity="0.5"
                          />
                          <text x={hist.x} y={hist.y - 8} fill="#4a5568" className="font-mono text-[6px]" textAnchor="middle">
                            {hist.label}
                          </text>
                        </g>
                      ))}

                      {/* Query point crosshair */}
                      <g>
                        <line x1="280" y1="120" x2="280" y2="140" stroke="#f59e0b" strokeWidth="1" />
                        <line x1="270" y1="130" x2="290" y2="130" stroke="#f59e0b" strokeWidth="1" />
                        <circle cx="280" cy="130" r="3" fill="#f59e0b" />
                        <text x="280" y="115" fill="#f59e0b" className="font-mono text-[8px] font-bold" textAnchor="middle">CANDIDATE BRIDGING STATE</text>
                      </g>

                      {/* Connectors to neighbors */}
                      {!cumlSimulating && (
                        <>
                          <line x1="280" y1="130" x2="220" y2="60" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="2,2" />
                          <text x="250" y="90" fill="#06b6d4" className="font-mono text-[7px]" textAnchor="middle">d: 0.14</text>

                          <line x1="280" y1="130" x2="150" y2="160" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="2,2" />
                          <text x="215" y="150" fill="#06b6d4" className="font-mono text-[7px]" textAnchor="middle">d: 0.18</text>

                          <line x1="280" y1="130" x2="400" y2="180" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="2,2" />
                          <text x="340" y="150" fill="#06b6d4" className="font-mono text-[7px]" textAnchor="middle">d: 0.22</text>
                        </>
                      )}

                      {cumlSimulating && (
                        <text x="250" y="120" fill="#06b6d4" className="font-mono text-[8px] font-bold" textAnchor="middle">RUNNING HIGH-SPEED EUCLIDEAN COUPLING MATCH (KNN)...</text>
                      )}
                    </svg>
                  )}

                  {cumlActiveAlgo === "regression" && (
                    <svg width="500" height="240" className="overflow-visible select-none">
                      <g opacity="0.3">
                        <line x1="40" y1="210" x2="480" y2="210" stroke="#4a5568" strokeWidth="1" />
                        <line x1="40" y1="20" x2="40" y2="210" stroke="#4a5568" strokeWidth="1" />
                        <text x="480" y="222" fill="#4a5568" className="font-mono text-[7px]" textAnchor="end">Stress Lifespan Cycle (0 - 50 Years)</text>
                        <text x="32" y="24" fill="#4a5568" className="font-mono text-[7px]" textAnchor="end" transform="rotate(-90 32 24)">Load Tolerance Threshold (kN)</text>
                      </g>

                      {/* Random noisy deterioration points */}
                      {[
                        { x: 60, y: 50 }, { x: 100, y: 55 }, { x: 140, y: 70 },
                        { x: 180, y: 90 }, { x: 220, y: 110 }, { x: 260, y: 140 },
                        { x: 300, y: 155 }, { x: 340, y: 175 }, { x: 380, y: 190 },
                        { x: 420, y: 195 }
                      ].map((pt, idx) => (
                        <circle key={idx} cx={pt.x} cy={pt.y} r="3" fill="#8d8d8d" opacity="0.6" />
                      ))}

                      {/* Regression curve fitting */}
                      {!cumlSimulating && (
                        <path
                          d="M 60 48 Q 240 80 440 205"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2"
                          className="animate-fadeIn"
                        />
                      )}

                      {cumlSimulating && (
                        <text x="250" y="120" fill="#06b6d4" className="font-mono text-[8px] font-bold" textAnchor="middle">FITTING POLYNOMIAL EROSION ESTIMATOR (LEAST SQUARES)...</text>
                      )}
                    </svg>
                  )}

                </div>

                {/* Inline Metadata Dashboard */}
                <div className="bg-[#07090e] border border-cyan-950 p-3 rounded text-xs font-mono">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-slate-500 text-[8.5px] uppercase block">Execution Speed (GPU)</span>
                      <span className="text-emerald-400 font-bold">0.12 ms (Sub-Millisecond)</span>
                    </div>
                    <div className="border-l border-cyan-950 pl-4">
                      <span className="text-slate-500 text-[8.5px] uppercase block">Accuracy Metrics</span>
                      <span className="text-[#e0e0e0] font-bold">99.85% Pattern Match</span>
                    </div>
                    <div className="border-l border-cyan-950 pl-4">
                      <span className="text-slate-500 text-[8.5px] uppercase block">Hardware Channel</span>
                      <span className="text-cyan-400 font-bold">CUDA-THREAD-L2-32X</span>
                    </div>
                    <div className="border-l border-cyan-950 pl-4">
                      <span className="text-slate-500 text-[8.5px] uppercase block">Downstream Pipeline</span>
                      <span className="text-[#c5a059] font-bold">SIMON Functional Map</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Console/Perception Log Card */}
              <div className="bg-[#050608] border border-[#c5a05933] rounded-lg p-5 flex flex-col gap-2 relative">
                <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#c5a059] flex items-center gap-1.5">
                  <Database size={12} className="text-cyan-400" /> GPU Perception Log Stream
                </div>
                
                {/* Logs terminal style box */}
                <div
                  ref={cumlLogsEndRef as any}
                  className="min-h-[140px] max-h-[140px] overflow-y-auto bg-[#030406] border border-cyan-950 p-3 rounded font-mono text-[9.5px] leading-relaxed flex flex-col gap-2 custom-scrollbar"
                >
                  {cumlLogs.length === 0 ? (
                    <div className="text-slate-600 italic h-full flex items-center justify-center">
                      Click "Dispatch cuML Solver" to view high-speed GPU compilation trace...
                    </div>
                  ) : (
                    cumlLogs.map((log, i) => (
                      <div key={i} className="text-[#dae2eb] animate-fadeIn flex gap-1.5 border-b border-cyan-950/20 pb-1.5">
                        <span className="text-cyan-400 font-bold flex-shrink-0">[CUDA-0]:</span>
                        <span className="text-slate-300">{log}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* RENDER THE NVIDA NGC REGISTRY INTEGRATION EXPLORER */}
      {activeTab === "ngc" && (
        <div className="flex flex-col gap-6 animate-fadeIn text-start font-sans">
          
          {/* Main Context Card */}
          <div className="bg-[#050608] border border-[#122438] p-5 rounded-lg flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[50px] h-[50px] bg-gradient-to-tr from-transparent to-[#c5a059]/5 rounded-bl-full pointer-events-none" />
            <div className="flex-1 flex flex-col gap-2 text-start">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/35 border border-amber-500/30 w-fit text-[8px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                Sovereign Deployment Substrate Layer
              </div>
              <h3 className="text-sm font-bold font-mono text-[#e0e0e0] uppercase tracking-wide">
                NVIDIA NGC Container Registry & Runtime Explorer
              </h3>
              <p className="text-xs text-[#a0aec0] leading-relaxed">
                The NVIDIA NGC Catalog acts as the optimized distribution layer for hardware-accelerated containers, APIs, and models. In Pathfinder, we keep our structural governance intact through the separation of <b className="text-[#c5a059]">Sovereign Authority</b> and <b className="text-amber-400">Compute Acceleration</b>. While our AETHER, HERMES, SIMON, and OCTAGON modules decide and validate what is true, NGC-hosted runtimes execute workloads at physical scale.
              </p>
              <div className="mt-2 bg-[#0a0d14] border border-[#1a3a5c]/50 p-2.5 rounded font-mono text-[10px] text-slate-300 flex items-center gap-3">
                <Shield size={16} className="text-[#c5a059] flex-shrink-0" />
                <div>
                  <span className="text-amber-400 font-bold uppercase block text-[8.5px]">Pathfinder Principle: ACCELERATION IS NOT AUTHORITY</span>
                  GPU speed and model size do not grant truth. Authority originates from auditable evidence and operator-controlled governance rules.
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Core Blocks and Control Panel */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Left Side: Block Selector & Config Parameters (7 Cols) */}
            <div className="xl:col-span-7 flex flex-col gap-4">
              
              {/* Blocks Picker */}
              <div className="bg-[#050608]/95 border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-3">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#c5a059]">
                  Select Runtime Building Block
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(["triton", "rapids", "cuda", "isaac", "nim"] as const).map(block => {
                    const info = {
                      triton: { label: "Triton Server", color: "border-sky-500/30 text-sky-400 bg-sky-950/10 hover:bg-sky-950/20" },
                      rapids: { label: "RAPIDS AI", color: "border-emerald-500/30 text-emerald-400 bg-emerald-950/10 hover:bg-emerald-950/20" },
                      cuda: { label: "CUDA Base", color: "border-purple-500/30 text-purple-400 bg-purple-950/10 hover:bg-purple-950/20" },
                      isaac: { label: "Isaac Sim", color: "border-rose-500/30 text-rose-400 bg-rose-950/10 hover:bg-rose-950/20" },
                      nim: { label: "NIM Core", color: "border-amber-500/30 text-amber-400 bg-amber-950/10 hover:bg-amber-950/20" },
                    }[block];
                    const active = ngcActiveBlock === block;
                    return (
                      <button
                        key={block}
                        type="button"
                        onClick={() => {
                          setNgcActiveBlock(block);
                          setNgcProgress(0);
                        }}
                        className={`p-2 rounded border text-center font-mono text-[10px] font-bold uppercase transition-all flex flex-col justify-center items-center gap-1 ${
                          active 
                            ? "border-amber-500 text-amber-400 bg-amber-950/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]" 
                            : info.color
                        }`}
                      >
                        <Cpu size={12} className={active ? "text-amber-400 animate-pulse" : ""} />
                        <span>{info.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Block Details */}
                <div className="mt-1 bg-[#0b0c10] border border-[#1b1c20] p-3 rounded text-[11px] font-mono leading-relaxed text-slate-300 text-start">
                  {ngcActiveBlock === "triton" && (
                    <>
                      <div className="flex justify-between items-center border-b border-[#1b1c20] pb-2 mb-2">
                        <span className="text-[#c5a059] font-bold">nvcr.io/nvidia/triton:24.05-py3</span>
                        <span className="text-slate-500 text-[9px]">LATEST STABLE</span>
                      </div>
                      <p className="text-slate-400 text-xs font-sans mb-2">
                        Triton Inference Server is an open-source inference-serving software that standardizes AI model deployment in production. It hosts multi-framework models at maximum throughput with advanced dynamic batching pipelines.
                      </p>
                      <div className="text-slate-400 text-[10px]">
                        <span className="text-amber-400 font-semibold uppercase">Pathfinder Context:</span> Direct edge or server-side model deployment. Dynamically handles local physical drift calculations and inference requests under Octagon jurisdiction.
                      </div>
                    </>
                  )}
                  {ngcActiveBlock === "rapids" && (
                    <>
                      <div className="flex justify-between items-center border-b border-[#1b1c20] pb-2 mb-2">
                        <span className="text-[#c5a059] font-bold">nvcr.io/nvidia/rapidsai/rapidsai:24.04-cuda12.0-py3.10</span>
                        <span className="text-slate-500 text-[9px]">RAPIDS ACCELERATED</span>
                      </div>
                      <p className="text-slate-400 text-xs font-sans mb-2">
                        RAPIDS is a suite of open-source software libraries and APIs built on CUDA, giving you the ability to execute end-to-end data science and analytics pipelines entirely on GPUs.
                      </p>
                      <div className="text-slate-400 text-[10px]">
                        <span className="text-amber-400 font-semibold uppercase">Pathfinder Context:</span> Runs cuDF and cuML for massive statistical stream-dataframe parsing. Prepares raw sensory drift vectors for the SIMON translation grid.
                      </div>
                    </>
                  )}
                  {ngcActiveBlock === "cuda" && (
                    <>
                      <div className="flex justify-between items-center border-b border-[#1b1c20] pb-2 mb-2">
                        <span className="text-[#c5a059] font-bold">nvcr.io/nvidia/cuda:12.4.1-devel-ubuntu22.04</span>
                        <span className="text-slate-500 text-[9px]">DEVELOPER BASE</span>
                      </div>
                      <p className="text-slate-400 text-xs font-sans mb-2">
                        The CUDA Toolkit provides a development environment for creating high-performance GPU-accelerated applications. It provides compiler, libraries, and compiler headers.
                      </p>
                      <div className="text-slate-400 text-[10px]">
                        <span className="text-amber-400 font-semibold uppercase">Pathfinder Context:</span> Compiles raw custom physical-mechanic simulation math directly to GPU hardware kernels for latency-critical structural analysis.
                      </div>
                    </>
                  )}
                  {ngcActiveBlock === "isaac" && (
                    <>
                      <div className="flex justify-between items-center border-b border-[#1b1c20] pb-2 mb-2">
                        <span className="text-[#c5a059] font-bold">nvcr.io/nvidia/isaac-sim:2023.1.1</span>
                        <span className="text-slate-500 text-[9px]">ROBOTICS SIMULATION</span>
                      </div>
                      <p className="text-slate-400 text-xs font-sans mb-2">
                        NVIDIA Isaac Sim is a photorealistic, physical-accuracy robotics simulation tool built on Omniverse. It trains autonomous machines under physical stress and telemetry conditions.
                      </p>
                      <div className="text-slate-400 text-[10px]">
                        <span className="text-amber-400 font-semibold uppercase">Pathfinder Context:</span> Validates structural repairs and physical load stresses in a simulated Omniverse twin sandbox environment before deploying commands to real-world actuator systems.
                      </div>
                    </>
                  )}
                  {ngcActiveBlock === "nim" && (
                    <>
                      <div className="flex justify-between items-center border-b border-[#1b1c20] pb-2 mb-2">
                        <span className="text-[#c5a059] font-bold">nvcr.io/nim/meta/llama3-70b-instruct</span>
                        <span className="text-slate-500 text-[9px]">NIM MICROSERVICE</span>
                      </div>
                      <p className="text-slate-400 text-xs font-sans mb-2">
                        NVIDIA NIM (NVIDIA Inference Microservices) is a set of easy-to-use microservices designed to accelerate the deployment of generative AI models on any GPU-enabled infrastructure.
                      </p>
                      <div className="text-slate-400 text-[10px]">
                        <span className="text-amber-400 font-semibold uppercase">Pathfinder Context:</span> Spins up totally isolated, secure local reasoning containers (like Nemotron-550B or Llama-3) keeping model computation 100% offline and under operator sovereignty.
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Dynamic Parameter Tuning Area */}
              <div className="bg-[#050608]/95 border border-[#c5a05933] p-4 rounded-lg flex flex-col gap-3">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#c5a059] flex justify-between items-center">
                  <span>Substrate Parameter Tuner</span>
                  <span className="text-slate-500 text-[8px] font-normal lowercase">drag sliders to tune allocation thresholds</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Parameter Sliders depending on Active Block */}
                  {ngcActiveBlock === "triton" && (
                    <>
                      <div className="flex flex-col gap-1.5 p-3 bg-[#0b0c10] border border-[#1b1c20] rounded text-start">
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase flex justify-between">
                          <span>Model Concurrency:</span>
                          <span className="text-sky-400">{ngcParams.tritonInstances}x Instances</span>
                        </span>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          value={ngcParams?.tritonInstances ?? 2}
                          onChange={(e) => setNgcParams(prev => ({ ...prev, tritonInstances: parseInt(e.target.value) || 2 }))}
                          className="w-full accent-sky-500 bg-[#050608] h-2.5 py-1.5 rounded cursor-pointer"
                        />
                        <span className="text-[8px] text-slate-500 font-mono">Sets the number of parallel hardware-bound compute executors.</span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 p-3 bg-[#0b0c10] border border-[#1b1c20] rounded text-start">
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase flex justify-between">
                          <span>VRAM Reserve:</span>
                          <span className="text-sky-400">{(ngcParams.tritonInstances * 8.4).toFixed(1)} GB</span>
                        </span>
                        <div className="h-2 w-full bg-[#050608] rounded overflow-hidden mt-2 relative">
                          <div 
                            className="bg-sky-500 h-full transition-all duration-300"
                            style={{ width: `${(ngcParams.tritonInstances / 8) * 100}%` }}
                          />
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono">Dynamic VRAM preallocation boundary for Triton weights.</span>
                      </div>
                    </>
                  )}

                  {ngcActiveBlock === "rapids" && (
                    <>
                      <div className="flex flex-col gap-1.5 p-3 bg-[#0b0c10] border border-[#1b1c20] rounded text-start">
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase flex justify-between">
                          <span>VRAM Pool Allocation:</span>
                          <span className="text-emerald-400">{ngcParams.rapidsGpuMem} GB</span>
                        </span>
                        <input
                          type="range"
                          min="16"
                          max="80"
                          step="8"
                          value={ngcParams?.rapidsGpuMem ?? 32}
                          onChange={(e) => setNgcParams(prev => ({ ...prev, rapidsGpuMem: parseInt(e.target.value) || 32 }))}
                          className="w-full accent-emerald-500 bg-[#050608] h-2.5 py-1.5 rounded cursor-pointer"
                        />
                        <span className="text-[8px] text-slate-500 font-mono">Pre-allocates memory pool size in VRAM to prevent malloc fragmentation.</span>
                      </div>

                      <div className="flex flex-col gap-1.5 p-3 bg-[#0b0c10] border border-[#1b1c20] rounded text-start">
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase flex justify-between">
                          <span>cuDF Speedup Index:</span>
                          <span className="text-emerald-400">{(ngcParams.rapidsGpuMem * 1.85).toFixed(0)}x Faster</span>
                        </span>
                        <div className="h-2 w-full bg-[#050608] rounded overflow-hidden mt-2 relative">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ width: `${(ngcParams.rapidsGpuMem / 80) * 100}%` }}
                          />
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono">Estimated CPU-to-GPU speedup index based on VRAM capacity.</span>
                      </div>
                    </>
                  )}

                  {ngcActiveBlock === "cuda" && (
                    <>
                      <div className="flex flex-col gap-1.5 p-3 bg-[#0b0c10] border border-[#1b1c20] rounded text-start">
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase flex justify-between">
                          <span>Warp Thread Count:</span>
                          <span className="text-purple-400">{ngcParams.cudaThreads} Threads</span>
                        </span>
                        <input
                          type="range"
                          min="256"
                          max="1024"
                          step="256"
                          value={ngcParams?.cudaThreads ?? 1024}
                          onChange={(e) => setNgcParams(prev => ({ ...prev, cudaThreads: parseInt(e.target.value) || 1024 }))}
                          className="w-full accent-purple-500 bg-[#050608] h-2.5 py-1.5 rounded cursor-pointer"
                        />
                        <span className="text-[8px] text-slate-500 font-mono">Granularity of parallel hardware execution units (Warp Cores).</span>
                      </div>

                      <div className="flex flex-col gap-1.5 p-3 bg-[#0b0c10] border border-[#1b1c20] rounded text-start">
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase flex justify-between">
                          <span>SM Active Occupancy:</span>
                          <span className="text-purple-400">
                            {ngcParams.cudaThreads === 256 ? "68.2%" : ngcParams.cudaThreads === 512 ? "89.5%" : ngcParams.cudaThreads === 768 ? "96.4%" : "99.8%"}
                          </span>
                        </span>
                        <div className="h-2 w-full bg-[#050608] rounded overflow-hidden mt-2 relative">
                          <div 
                            className="bg-purple-500 h-full transition-all duration-300"
                            style={{ width: `${ngcParams.cudaThreads === 256 ? 68.2 : ngcParams.cudaThreads === 512 ? 89.5 : ngcParams.cudaThreads === 768 ? 96.4 : 99.8}%` }}
                          />
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono">Streaming Multiprocessor core usage coefficient.</span>
                      </div>
                    </>
                  )}

                  {ngcActiveBlock === "isaac" && (
                    <>
                      <div className="flex flex-col gap-1.5 p-3 bg-[#0b0c10] border border-[#1b1c20] rounded text-start">
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase flex justify-between">
                          <span>Physics Frequency:</span>
                          <span className="text-rose-400">{ngcParams.isaacFrequency} Hz</span>
                        </span>
                        <input
                          type="range"
                          min="60"
                          max="240"
                          step="30"
                          value={ngcParams?.isaacFrequency ?? 120}
                          onChange={(e) => setNgcParams(prev => ({ ...prev, isaacFrequency: parseInt(e.target.value) || 120 }))}
                          className="w-full accent-rose-500 bg-[#050608] h-2.5 py-1.5 rounded cursor-pointer"
                        />
                        <span className="text-[8px] text-slate-500 font-mono">Fidelity of physical stress simulations under real-time conditions.</span>
                      </div>

                      <div className="flex flex-col gap-1.5 p-3 bg-[#0b0c10] border border-[#1b1c20] rounded text-start">
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase flex justify-between">
                          <span>Real-Time Factor (RTF):</span>
                          <span className="text-rose-400">{(1.0 + (240 - ngcParams.isaacFrequency) / 100).toFixed(2)}x</span>
                        </span>
                        <div className="h-2 w-full bg-[#050608] rounded overflow-hidden mt-2 relative">
                          <div 
                            className="bg-rose-500 h-full transition-all duration-300"
                            style={{ width: `${((1.0 + (240 - ngcParams.isaacFrequency) / 100) / 3.0) * 100}%` }}
                          />
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono">Ratio of simulated physical time to true wall-clock time.</span>
                      </div>
                    </>
                  )}

                  {ngcActiveBlock === "nim" && (
                    <>
                      <div className="flex flex-col gap-1.5 p-3 bg-[#0b0c10] border border-[#1b1c20] rounded text-start">
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase flex justify-between">
                          <span>Precision Quant:</span>
                          <span className="text-amber-400 font-extrabold uppercase">{ngcParams.nimPrecision}</span>
                        </span>
                        
                        <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                          {(["fp16", "int8", "int4"] as const).map(prec => (
                            <button
                              key={prec}
                              type="button"
                              onClick={() => setNgcParams(prev => ({ ...prev, nimPrecision: prec }))}
                              className={`py-1 rounded font-mono text-[9px] font-bold uppercase border transition-all ${
                                ngcParams.nimPrecision === prec
                                  ? "border-amber-500 bg-amber-950/30 text-amber-400"
                                  : "border-[#1b1c20] bg-[#050608] text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              {prec === "fp16" ? "FP16" : prec === "int8" ? "INT8" : "INT4"}
                            </button>
                          ))}
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono">Weight resolution scaling factor; trade accuracy for throughput.</span>
                      </div>

                      <div className="flex flex-col gap-1.5 p-3 bg-[#0b0c10] border border-[#1b1c20] rounded text-start">
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase flex justify-between">
                          <span>Inference Speed:</span>
                          <span className="text-amber-400 font-bold">
                            {ngcParams.nimPrecision === "fp16" ? "45 t/s" : ngcParams.nimPrecision === "int8" ? "110 t/s" : "280 t/s"}
                          </span>
                        </span>
                        <div className="h-2 w-full bg-[#050608] rounded overflow-hidden mt-2 relative">
                          <div 
                            className="bg-amber-500 h-full transition-all duration-300"
                            style={{ width: `${ngcParams.nimPrecision === "fp16" ? 20 : ngcParams.nimPrecision === "int8" ? 50 : 100}%` }}
                          />
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono">Estimated generational inference output speed.</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Simulated Launch Trigger */}
                <button
                  type="button"
                  disabled={ngcSimulating}
                  onClick={async () => {
                    if (ngcSimulating) return;
                    setNgcSimulating(true);
                    setNgcLogs([]);
                    setNgcProgress(0);

                    const logsByBlock = {
                      triton: [
                        `Executing container pull: docker pull nvcr.io/nvidia/triton:24.05-py3`,
                        `[NGC] Connection established. Pulling manifest layer SHA256:cfcd208495d5...`,
                        `[NGC] Pull completed. Extracting container layers and validating CUDA integration.`,
                        `Initializing Triton Inference Server version 2.45.0 on GPU device index 0.`,
                        `[CUDA-0] Device 0: "NVIDIA H100 PCIe (80GB VRAM)" initialized with driver CUDA 12.4.`,
                        `[TRITON] Instantiating model repository server. Scanning local mount /models...`,
                        `[TRITON] Loaded custom drift_analysis_model: version 1.0 (Backend: TensorRT).`,
                        `[TRITON] Scaling runtime: Spanning ${ngcParams.tritonInstances} concurrent parallel model runner instances.`,
                        `[TRITON] Preallocating ${(ngcParams.tritonInstances * 8.4).toFixed(1)} GB of GPU device memory pool successfully.`,
                        `[TRITON] Server listening on HTTP:0.0.0.0:8000 and gRPC:0.0.0.0:8001.`,
                        `[PIPELINE] Dispatched sample structural drift telemetry array. Dynamic batching latency: 3.84ms.`,
                        `[TRITON] Successful execution. Workload completed. Exit status: 0 (OK)`
                      ],
                      rapids: [
                        `Executing container pull: docker pull nvcr.io/nvidia/rapidsai/rapidsai:24.04-cuda12.0-py3.10`,
                        `[NGC] Handshake authenticated. Ingesting RAPIDS library packages.`,
                        `[NGC] Extracted layers. Check memory pool status.`,
                        `Initializing RAPIDS cuDF & cuML pipeline on sovereign GPU workspace.`,
                        `[CUDA-0] Mapping system virtual memory directly to NVLink bandwidth.`,
                        `[RAPIDS] Initializing RMM (RAPIDS Memory Manager) pool size: ${ngcParams.rapidsGpuMem} GB preallocated in VRAM.`,
                        `[cuDF] Ingested 500,000 spatial telemetry coordinate rows. Loaded dataframe columns in 0.02s.`,
                        `[cuDF] Running high-speed statistical dataframe compression. Filtering noise thresholds...`,
                        `[cuML] Executing GPU PCA coordinate reduction. Estimating topological relationships.`,
                        `[RAPIDS] Speedup metric achieved: ${(ngcParams.rapidsGpuMem * 1.85).toFixed(0)}x over CPU multithreading logs.`,
                        `[RAPIDS] Spatial coordinates compressed and cached. Dispatched to JEMMA. Exit code: 0`
                      ],
                      cuda: [
                        `Executing container pull: docker pull nvcr.io/nvidia/cuda:12.4.1-devel-ubuntu22.04`,
                        `[NGC] Pulling development base compiler layers... SHA256:7214ff94e022...`,
                        `[NGC] Layer sync confirmed. CUDA nvcc compiler initialized.`,
                        `Compiling physical simulation kernel: stress_tensor_kernel.cu`,
                        `[nvcc] Optimization parameters: --gpu-architecture=sm_90 -O3`,
                        `[nvcc] Compilation complete. Injecting binary to GPU driver cache.`,
                        `Deploying CUDA kernel. Parameter Block Thread Count: ${ngcParams.cudaThreads} threads.`,
                        `[CUDA-0] Executing grid dimensions: 4,096 blocks, warp size: 32 threads.`,
                        `[CUDA-0] Streaming Multiprocessor (SM) active occupancy coefficient: ${ngcParams.cudaThreads === 256 ? "68.2%" : ngcParams.cudaThreads === 512 ? "89.5%" : "99.8%"}.`,
                        `[CUDA-0] Physical stress tensor simulation solved in 12.04 microseconds.`,
                        `[CUDA-0] Zero-copy VRAM pointer synchronization completed successfully. Exit status: 0`
                      ],
                      isaac: [
                        `Executing container pull: docker pull nvcr.io/nvidia/isaac-sim:2023.1.1`,
                        `[NGC] Pulling Isaac Sim container layout. SHA256:8892ca010b9d...`,
                        `[NGC] Pull complete. Authenticating Omniverse Asset Server connectivity...`,
                        `Initializing Isaac Sim Simulation Engine (Headless mode).`,
                        `[CUDA-0] Binding PhysX solver to GPU Streaming Multiprocessors.`,
                        `[ISAAC-SIM] Rendering physics frequency set to: ${ngcParams.isaacFrequency} Hz.`,
                        `[ISAAC-SIM] Collision accuracy bounds: Multi-plane contact solver enabled.`,
                        `[ISAAC-SIM] Simulation runtime active: RTF is ${(1.0 + (240 - ngcParams.isaacFrequency) / 100).toFixed(2)}x.`,
                        `[ISAAC-SIM] Real-time structural drift tension applied to simulated carbon truss.`,
                        `[ISAAC-SIM] Simulation validated. Target repair vectors match tension guidelines.`,
                        `[ISAAC-SIM] Frame buffers flushed. Stopping Omniverse physics loop. Exit status: 0`
                      ],
                      nim: [
                        `Executing container pull: docker pull nvcr.io/nim/meta/llama3-70b-instruct`,
                        `[NGC] NIM client authenticated. Pulling optimized tensor model shards.`,
                        `[NGC] Shards verified. Rebuilding model parallel graphs.`,
                        `Initializing NIM local microservice environment. Model: Llama-3-70B-Instruct.`,
                        `[CUDA-0] Quantizing model weights to high-speed ${ngcParams.nimPrecision} mode.`,
                        `[NIM] Model loading complete. Loaded 70B parameters in VRAM using TensorRT-LLM.`,
                        `[NIM] Initializing local HTTP server on port 8000. Routing local reasoning queries...`,
                        `[NIM-ENGINE] Warmup prompt complete. Time to first token (TTFT): 14.8ms.`,
                        `[NIM-ENGINE] Active output throughput: ${ngcParams.nimPrecision === "fp16" ? "45" : ngcParams.nimPrecision === "int8" ? "110" : "280"} tokens/second.`,
                        `[OCTAGON-GOVERNANCE] Local query verified and permitted offline. Security logs appended.`,
                        `[NIM] Process complete. Deallocating token pipelines cleanly. Exit status: 0`
                      ]
                    }[ngcActiveBlock];

                    for (let i = 0; i < logsByBlock.length; i++) {
                      setNgcLogs(prev => [...prev, logsByBlock[i]]);
                      setNgcProgress(Math.round(((i + 1) / logsByBlock.length) * 100));
                      await new Promise(resolve => setTimeout(resolve, 500));
                    }
                    setNgcSimulating(false);
                  }}
                  className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded border transition-all flex items-center justify-center gap-1.5 mt-1 ${
                    ngcSimulating
                      ? "bg-amber-950/20 text-amber-400 border-amber-900/40 cursor-not-allowed"
                      : "bg-[#c5a059] text-[#050608] border-[#c5a059] hover:bg-[#33ebff] hover:border-[#33ebff]"
                  }`}
                >
                  {ngcSimulating ? (
                    <>
                      <Activity size={13} className="animate-spin text-[#050608]" />
                      <span>Simulating Deployment... {ngcProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} fill="currentColor" />
                      <span>Pull & Launch Sovereign Container</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right Side: Deployment Architect (Docker Compose Generator) & Terminal Logs (5 Cols) */}
            <div className="xl:col-span-5 flex flex-col gap-4">
              
              {/* Terminal Logs Viewport */}
              <div className="bg-[#050608] border border-[#c5a05933] rounded-lg p-4 flex flex-col gap-2 relative">
                <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#c5a059] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Database size={12} className="text-amber-400 animate-pulse" /> 
                    <span>Sovereign Container Terminal</span>
                  </div>
                  <span className="text-[8px] text-slate-500 lowercase font-normal">Active Substrate Stream</span>
                </div>

                {/* Console logs container */}
                <div
                  ref={ngcLogsEndRef}
                  className="min-h-[160px] max-h-[160px] overflow-y-auto bg-[#030406] border border-[#1b1c20] p-3 rounded font-mono text-[9px] leading-relaxed flex flex-col gap-1.5 custom-scrollbar text-start"
                >
                  {ngcLogs.length === 0 ? (
                    <div className="text-slate-600 italic h-full flex items-center justify-center text-center">
                      Click "Pull & Launch Sovereign Container" to simulate localized GPU environment spin up...
                    </div>
                  ) : (
                    ngcLogs.map((log, i) => {
                      const isError = log.includes("Error") || log.includes("fail");
                      const isNgc = log.includes("[NGC]") || log.includes("[TRITON]") || log.includes("[RAPIDS]") || log.includes("[ISAAC") || log.includes("[NIM");
                      const isGov = log.includes("[OCTAGON-GOVERNANCE]");
                      return (
                        <div key={i} className="text-[#dae2eb] animate-fadeIn flex gap-1.5 border-b border-[#1b1c20]/10 pb-1">
                          <span className="text-amber-400 font-bold flex-shrink-0 select-none">[CUDA-0]:</span>
                          <span className={
                            isError ? "text-rose-400 font-semibold" : 
                            isGov ? "text-emerald-400 font-semibold" :
                            isNgc ? "text-amber-300 animate-pulse" : "text-slate-300"
                          }>
                            {log}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Deployment Manifest Generator */}
              <div className="bg-[#050608] border border-[#c5a05933] rounded-lg p-4 flex flex-col gap-2.5 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#c5a059]">
                    Deployment Architect Stack
                  </span>
                  
                  {/* Manifest Type Selector */}
                  <div className="flex items-center gap-1 bg-[#050608] border border-[#c5a05922] p-0.5 rounded select-none">
                    {(["docker", "k8s"] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNgcManifestType(type)}
                        className={`px-2 py-0.5 text-[8.5px] uppercase font-mono font-bold rounded transition-all ${
                          ngcManifestType === type
                            ? "bg-[#1b1c20] text-[#c5a059]"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {type === "docker" ? "Compose" : "K8s Spec"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[9.5px] text-slate-400 font-sans leading-relaxed text-start">
                  Toggle the containers below to compose your Pathfinder deployment stack. We map GPU resources directly into your sandbox safely.
                </div>

                {/* Checklist of building blocks to include */}
                <div className="grid grid-cols-2 gap-2 my-1">
                  {(["cuda", "rapids", "triton", "isaac", "nim"] as const).map(block => {
                    const label = {
                      cuda: "CUDA Devel Base",
                      rapids: "RAPIDS AI Data",
                      triton: "Triton Model",
                      isaac: "Isaac Physics Sim",
                      nim: "Nemotron NIM Core"
                    }[block];
                    const selected = ngcSelectedStack.includes(block);
                    return (
                      <label 
                        key={block}
                        className={`flex items-center gap-1.5 p-1.5 rounded border font-mono text-[9px] cursor-pointer transition-all ${
                          selected 
                            ? "border-amber-500/40 bg-amber-950/10 text-amber-400" 
                            : "border-[#1b1c20] bg-[#050608] text-slate-500 hover:border-slate-700 hover:text-slate-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNgcSelectedStack(prev => [...prev, block]);
                            } else {
                              setNgcSelectedStack(prev => prev.filter(b => b !== block));
                            }
                          }}
                          className="rounded text-amber-500 accent-amber-500 cursor-pointer"
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Generated Manifest Display */}
                <div className="relative">
                  <pre className="p-3 bg-[#030406] border border-[#1b1c20] rounded text-[8.5px] font-mono text-[#dae2eb] leading-relaxed max-h-[190px] overflow-y-auto select-all custom-scrollbar text-start">
                    {ngcManifestType === "docker" ? (
`# Pathfinder Deployment Substrate
# Generated automatically by Operator Console
version: "3.8"

services:
${ngcSelectedStack.map(b => {
  if (b === "cuda") {
    return `  cuda-compiler-substrate:
    image: nvcr.io/nvidia/cuda:12.4.1-devel-ubuntu22.04
    container_name: pathfinder-cuda-devel
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    environment:
      - CUDA_THREADS=${ngcParams.cudaThreads}
      - SM_OCCUPANCY_TARGET=0.99
    volumes:
      - ./simulation:/src
    command: nvcc --shared -o /src/libstress.so /src/stress_tensor.cu
`;
  }
  if (b === "rapids") {
    return `  rapids-data-compression:
    image: nvcr.io/nvidia/rapidsai/rapidsai:24.04-cuda12.0-py3.10
    container_name: pathfinder-rapids-stream
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    environment:
      - RMM_ALLOCATION_GB=${ngcParams.rapidsGpuMem}
      - PIPELINE_STAGE=AETHER_INGEST
    ports:
      - "8888:8888"
    volumes:
      - ./telemetry-data:/data
`;
  }
  if (b === "triton") {
    return `  triton-inference-authority:
    image: nvcr.io/nvidia/triton:24.05-py3
    container_name: pathfinder-triton-inference
    ports:
      - "8000:8000"
      - "8001:8001"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    environment:
      - TRITON_CONCURRENT_INSTANCES=${ngcParams.tritonInstances}
      - VRAM_RESERVE_PERCENT=0.85
    volumes:
      - ./model_repository:/models
    command: tritonserver --model-repository=/models
`;
  }
  if (b === "isaac") {
    return `  isaac-omniverse-sim:
    image: nvcr.io/nvidia/isaac-sim:2023.1.1
    container_name: pathfinder-physics-sandbox
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    environment:
      - SIM_FREQ_HZ=${ngcParams.isaacFrequency}
      - HEADLESS_MODE=1
      - OMNIVERSE_USER=pathfinder_operator
    ports:
      - "8211:8211"
    volumes:
      - ./physics_cache:/root/.local/share/ov/cache
`;
  }
  if (b === "nim") {
    return `  nim-local-reasoning:
    image: nvcr.io/nim/meta/llama3-70b-instruct
    container_name: pathfinder-nim-nemotron
    ports:
      - "8000:8000"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    environment:
      - NGC_API_KEY=\${NGC_API_KEY}
      - NIM_QUANTIZATION_PRECISION=${ngcParams.nimPrecision}
      - TENSOR_PARALLEL_DEGREE=1
    volumes:
      - ./nim-cache:/opt/nim/.cache
`;
  }
  return "";
}).filter(Boolean).join("\n")}`
                    ) : (
`# Pathfinder K8s Hardware Manifest
# Managed by Sovereign OCTAGON Controller
apiVersion: v1
kind: Pod
metadata:
  name: pathfinder-gpu-substrate-pod
  labels:
    app.kubernetes.io/part-of: pathfinder-aperture
spec:
  containers:
${ngcSelectedStack.map(b => {
  if (b === "cuda") {
    return `    - name: cuda-compiler
      image: nvcr.io/nvidia/cuda:12.4.1-devel-ubuntu22.04
      env:
        - name: CUDA_THREADS
          value: "${ngcParams.cudaThreads}"
      resources:
        limits:
          nvidia.com/gpu: 1
`;
  }
  if (b === "rapids") {
    return `    - name: rapids-dataframe-compressor
      image: nvcr.io/nvidia/rapidsai/rapidsai:24.04-cuda12.0-py3.10
      env:
        - name: RMM_ALLOCATION_GB
          value: "${ngcParams.rapidsGpuMem}"
      resources:
        limits:
          nvidia.com/gpu: 1
`;
  }
  if (b === "triton") {
    return `    - name: triton-inference-server
      image: nvcr.io/nvidia/triton:24.05-py3
      env:
        - name: TRITON_CONCURRENT_INSTANCES
          value: "${ngcParams.tritonInstances}"
      ports:
        - containerPort: 8000
          name: http
      resources:
        limits:
          nvidia.com/gpu: 1
`;
  }
  if (b === "isaac") {
    return `    - name: isaac-physics-sandbox
      image: nvcr.io/nvidia/isaac-sim:2023.1.1
      env:
        - name: SIM_FREQ_HZ
          value: "${ngcParams.isaacFrequency}"
        - name: ACCEPT_EULA
          value: "Y"
      resources:
        limits:
          nvidia.com/gpu: 1
`;
  }
  if (b === "nim") {
    return `    - name: local-nim-nemotron
      image: nvcr.io/nim/meta/llama3-70b-instruct
      env:
        - name: NIM_QUANTIZATION_PRECISION
          value: "${ngcParams.nimPrecision}"
        - name: NGC_API_KEY
          valueFrom:
            secretKeyRef:
              name: ngc-secret
              key: api-key
      resources:
        limits:
          nvidia.com/gpu: 1
`;
  }
  return "";
}).filter(Boolean).join("\n")}`
                    )}
                  </pre>
                  
                  {/* Decorative corner tag */}
                  <span className="absolute bottom-2 right-2 text-[7.5px] font-mono text-slate-500 uppercase pointer-events-none select-none">
                    SECURE MANIFEST
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* DFLASH SPECULATIVE DECODING CORE SUB-PANEL */}
          <div className="mt-8 bg-[#050608]/95 border border-[#c5a05933] p-5 rounded-lg flex flex-col gap-6 animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#122438]">
              <div className="flex flex-col gap-1 text-start">
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 w-fit text-[8px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  NVIDIA Blackwell Native Acceleration Layer
                </div>
                <h3 className="text-sm font-bold font-mono text-[#e0e0e0] uppercase tracking-wide flex items-center gap-2">
                  <Zap size={14} className="text-amber-400 animate-pulse" />
                  DFlash Speculative Decoding Pipeline
                </h3>
                <p className="text-xs text-[#a0aec0]">
                  Block Diffusion Drafting and parallel hardware verification on high-density Tensor Cores.
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3 bg-[#0a0d14] border border-[#1a3a5c] px-3 py-1.5 rounded text-xs font-mono">
                <div className="flex flex-col text-end">
                  <span className="text-[8px] text-slate-500 uppercase font-semibold">Cognitive Grounding Status</span>
                  <span className="text-emerald-400 font-bold text-[10px] uppercase flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    SECURED BY OCTAGON
                  </span>
                </div>
              </div>
            </div>

            {/* Principle Highlight Card */}
            <div className="bg-[#0b0c10] border border-[#1b1c20] p-4 rounded text-start leading-relaxed text-xs text-slate-300">
              <span className="text-[#c5a059] font-bold font-mono uppercase block text-[10px] mb-1">
                Pathfinder Boundary: ACCELERATION IS NOT AUTHORITY
              </span>
              <p className="text-[#a0aec0] mb-2">
                DFlash sits entirely inside the **Runtime Layer** (beneath AETHER, HERMES, SIMON, JEMMA, and OCTAGON). It predicts multiple future tokens in parallel using a Block Diffusion Drafter, then verifies the block in parallel on a target model in a single GPU pass. 
              </p>
              <p className="text-slate-400">
                Notice what changes: <b className="text-amber-400">Nothing above the runtime changes.</b> SIMON still resolves patterns, JEMMA still challenges, and our sovereign authority chain remains 100% intact. DFlash simply eliminates hardware execution stalls, enabling the compute substrate to spend more time executing logic and less time waiting for memory retrieval.
              </p>
            </div>

            {/* Interactive Grid (3 columns: Selector, Visualizer & Metrics) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Selector & Configuration (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4 text-start">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#c5a059]">
                  Select Decoding Method
                </span>
                
                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      id: "autoregressive",
                      label: "Traditional Autoregressive",
                      desc: "Generates one token at a time. High latency due to HBM3e memory bandwidth stalls at every sequential step.",
                      speed: "1.0x Baseline",
                      color: "border-slate-800 hover:border-slate-600 text-slate-400"
                    },
                    {
                      id: "eagle",
                      label: "EAGLE Speculative",
                      desc: "Drafts a small chain of tokens sequentially using a tiny model, then verifies them in parallel. Block generation remains bottlenecked.",
                      speed: "2.7x Speedup",
                      color: "border-sky-950/50 hover:border-sky-800 text-sky-400"
                    },
                    {
                      id: "dflash",
                      label: "DFlash Block Diffusion",
                      desc: "Predicts the entire token block in parallel via a Block Diffusion Drafter, then verifies the block in parallel. Maximizes GPU concurrency.",
                      speed: "15.0x Serving Boost",
                      color: "border-amber-950/50 hover:border-amber-800 text-amber-400 font-bold"
                    }
                  ].map(method => {
                    const active = dflashMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          if (dflashSimulating) return;
                          setDflashMethod(method.id as any);
                          setDflashTokens([]);
                        }}
                        disabled={dflashSimulating}
                        className={`p-3 rounded-lg border text-start flex flex-col gap-1 transition-all ${
                          dflashSimulating ? "opacity-40 cursor-not-allowed" : ""
                        } ${
                          active 
                            ? "border-amber-500 bg-amber-950/20 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]" 
                            : method.color
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[11px] font-mono font-bold uppercase">{method.label}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-extrabold ${
                            active ? "bg-amber-500/25 text-amber-400" : "bg-[#111] text-slate-500"
                          }`}>{method.speed}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-1">
                          {method.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Block Size Slider for DFlash */}
                {dflashMethod === "dflash" && (
                  <div className="p-3 bg-[#0b0c10] border border-[#1b1c20] rounded flex flex-col gap-1.5 animate-fadeIn">
                    <div className="flex justify-between text-[10px] font-mono text-[#c5a059] font-bold uppercase">
                      <span>Block Draft Size (L):</span>
                      <span className="text-amber-400">{dflashBlockSize} Tokens / Block</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="8"
                      value={dflashBlockSize ?? 4}
                      disabled={dflashSimulating}
                      onChange={(e) => setDflashBlockSize(parseInt(e.target.value) || 4)}
                      className="w-full accent-amber-500 bg-[#050608] h-2 py-1.5 rounded cursor-pointer disabled:opacity-40"
                    />
                    <span className="text-[8px] text-slate-500 font-mono">
                      Defines the block size for diffusion drafting. Blackwell Tensor cores process up to L=8 in parallel.
                    </span>
                  </div>
                )}

                {/* Trigger */}
                <button
                  type="button"
                  onClick={runDflashSimulation}
                  disabled={dflashSimulating}
                  className={`w-full py-2.5 rounded font-mono text-xs font-bold uppercase border transition-all flex items-center justify-center gap-1.5 ${
                    dflashSimulating
                      ? "bg-amber-950/20 text-amber-500 border-amber-900/40 cursor-not-allowed"
                      : "bg-[#c5a059] text-[#050608] border-[#c5a059] hover:bg-[#33ebff] hover:border-[#33ebff]"
                  }`}
                >
                  <Play size={13} fill="currentColor" className={dflashSimulating ? "animate-spin" : ""} />
                  <span>{dflashSimulating ? "Decoding Workload..." : "Execute Speculative Pipeline"}</span>
                </button>
              </div>

              {/* Middle Column: Interactive Token Stream Visualizer (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4 text-start">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#c5a059]">
                  Real-Time Token Stream
                </span>

                <div className="flex-1 bg-[#030406] border border-[#1b1c20] p-4 rounded-lg flex flex-col gap-3 min-h-[220px]">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block border-b border-[#1b1c20]/50 pb-1">
                    Output Verification Board
                  </span>

                  {dflashTokens.length === 0 ? (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                      <Cpu size={24} className="text-slate-700 mb-2 animate-pulse" />
                      <p className="text-[10px] text-slate-500 font-mono italic">
                        Click "Execute Speculative Pipeline" to trigger localized hardware generation...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 content-start">
                      {dflashTokens.map(t => {
                        const styleMap = {
                          pending: "border-slate-800 text-slate-600 bg-transparent",
                          draft: "border-amber-500/40 text-amber-400 bg-amber-950/10 border-dashed animate-pulse",
                          verified: "border-emerald-500/40 text-emerald-400 bg-emerald-950/10 shadow-[0_0_8px_rgba(16,185,129,0.15)]",
                          failed: "border-rose-500/50 text-rose-400 bg-rose-950/10 line-through"
                        }[t.type];
                        
                        return (
                          <div
                            key={t.id}
                            className={`px-2 py-1 rounded text-xs font-mono border font-medium flex items-center gap-1 transition-all duration-300 ${styleMap}`}
                          >
                            <span>{t.text}</span>
                            {t.type === "verified" && <span className="text-[8.5px] text-emerald-500 font-extrabold">✓</span>}
                            {t.type === "failed" && <span className="text-[8.5px] text-rose-500 font-extrabold">✗</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-auto border-t border-[#1b1c20]/60 pt-2 flex flex-col gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="text-[8px] text-slate-500 uppercase font-semibold">Active Decoding Legend</span>
                    <div className="grid grid-cols-2 gap-2 text-[9px]">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span>Diffusion Draft</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Parallel Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Blackwell Hardware Metrics Monitor (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4 text-start">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#c5a059]">
                  Blackwell Hardware Metrics
                </span>

                <div className="flex flex-col gap-3.5 bg-[#030406] border border-[#1b1c20] p-4 rounded-lg flex-1">
                  
                  {/* Throughput */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-end text-[10px] font-mono">
                      <span className="text-slate-500 uppercase">Serving Throughput</span>
                      <span className="text-amber-400 font-extrabold text-xs">
                        {dflashSimulating ? "Measuring..." : 
                         dflashMethod === "autoregressive" ? "125 t/s" :
                         dflashMethod === "eagle" ? "340 t/s" : "1,850 t/s"}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#050608] rounded overflow-hidden relative">
                      <div 
                        className="bg-amber-500 h-full transition-all duration-1000"
                        style={{ 
                          width: `${dflashSimulating ? 15 : 
                                   dflashMethod === "autoregressive" ? 8 :
                                   dflashMethod === "eagle" ? 22 : 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-[8px] text-slate-500 font-mono">Parallel token output rate at identical user interactivity targets.</span>
                  </div>

                  {/* Blackwell GPU Core Occupancy */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-end text-[10px] font-mono">
                      <span className="text-slate-500 uppercase">Blackwell SM Occupancy</span>
                      <span className="text-sky-400 font-extrabold text-xs">
                        {dflashSimulating ? "Saturating..." : 
                         dflashMethod === "autoregressive" ? "7.2%" :
                         dflashMethod === "eagle" ? "24.8%" : "94.8%"}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#050608] rounded overflow-hidden relative">
                      <div 
                        className="bg-sky-500 h-full transition-all duration-1000"
                        style={{ 
                          width: `${dflashSimulating ? 45 : 
                                   dflashMethod === "autoregressive" ? 7.2 :
                                   dflashMethod === "eagle" ? 24.8 : 94.8}%` 
                        }}
                      />
                    </div>
                    <span className="text-[8px] text-slate-500 font-mono">Percentage of Streaming Multiprocessor tensor cores actively processing.</span>
                  </div>

                  {/* VRAM Bandwidth Stall */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-end text-[10px] font-mono">
                      <span className="text-slate-500 uppercase">HBM3e Memory Stalls</span>
                      <span className="text-rose-400 font-extrabold text-xs">
                        {dflashSimulating ? "Analyzing..." : 
                         dflashMethod === "autoregressive" ? "92.8%" :
                         dflashMethod === "eagle" ? "68.2%" : "5.2%"}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#050608] rounded overflow-hidden relative">
                      <div 
                        className="bg-rose-500 h-full transition-all duration-1000"
                        style={{ 
                          width: `${dflashSimulating ? 50 : 
                                   dflashMethod === "autoregressive" ? 92.8 :
                                   dflashMethod === "eagle" ? 68.2 : 5.2}%` 
                        }}
                      />
                    </div>
                    <span className="text-[8px] text-slate-500 font-mono">Percentage of hardware time stalled waiting for sequential layer transfers.</span>
                  </div>

                  {/* Serving Capacity Coefficient */}
                  <div className="mt-auto pt-2 border-t border-[#1b1c20]/60 text-[10px] font-mono text-slate-400 flex items-center gap-2">
                    <div className="p-1 rounded bg-[#0b0c10] border border-[#1b1c20] text-amber-400 font-extrabold text-[12px] flex-shrink-0">
                      {dflashMethod === "autoregressive" ? "1.0x" : dflashMethod === "eagle" ? "2.7x" : "15.0x"}
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[8.5px] font-semibold block">Serving Density Factor</span>
                      <p className="text-[8px] text-slate-500 font-sans leading-tight">
                        {dflashMethod === "dflash" 
                          ? "Enables serving up to 15x more concurrent users at the same interactivity target."
                          : dflashMethod === "eagle" 
                          ? "Yields moderate serving density gains via sequential draft-verify cycles."
                          : "Highly limited; every client requires exclusive, sequential memory hardware cycles."}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Simulated Live Driver Console Logs */}
            <div className="bg-[#030406] border border-[#1b1c20] rounded-lg p-4 flex flex-col gap-2 relative">
              <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#c5a059] flex items-center justify-between border-b border-[#1b1c20] pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Database size={12} className="text-amber-400" /> 
                  <span>Blackwell Speculative Decoding Scheduler Driver Console</span>
                </span>
                <span className="text-[8px] text-slate-500 lowercase font-normal">Active Kernel Stream</span>
              </div>

              {/* Console logs container */}
              <div
                ref={dflashLogsEndRef}
                className="min-h-[140px] max-h-[140px] overflow-y-auto bg-[#030406] p-1 font-mono text-[9px] leading-relaxed flex flex-col gap-1 custom-scrollbar text-start"
              >
                {dflashLogs.length === 0 ? (
                  <div className="text-slate-600 italic h-full flex items-center justify-center text-center">
                    Initiate speculative sequence to stream real-time scheduler allocation telemetry logs...
                  </div>
                ) : (
                  dflashLogs.map((log, i) => {
                    const isError = log.includes("mismatch") || log.includes("Correction") || log.includes("roll-back") || log.includes("stalled");
                    const isSystem = log.includes("[SYSTEM]") || log.includes("[SUCCESS]");
                    const isDflash = log.includes("[DFLASH") || log.includes("[BLACKWELL");
                    return (
                      <div key={i} className="text-[#dae2eb] animate-fadeIn flex gap-1.5 border-b border-[#1b1c20]/5 pb-1">
                        <span className="text-amber-400 font-bold flex-shrink-0 select-none">[DRV-SCHED]:</span>
                        <span className={
                          isError ? "text-amber-500 font-semibold" : 
                          isSystem ? "text-emerald-400 font-bold" :
                          isDflash ? "text-amber-300 font-medium" : "text-slate-400"
                        }>
                          {log}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
