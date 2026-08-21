import React, { useState, useEffect } from "react";
import {
  GitCommit,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Terminal,
  Shield,
  Clock,
  Lock,
  Compass,
  AlertTriangle
} from "lucide-react";

interface CommitLog {
  hash: string;
  author: string;
  email: string;
  date: string;
  message: string;
}

interface GitRemote {
  name: string;
  url: string;
  type: string;
}

interface GitStatus {
  branch: string;
  clean: boolean;
  changesCount: number;
  modifiedCount: number;
  untrackedCount: number;
  stagedCount: number;
  statusRaw: string;
  remotes: GitRemote[];
  lastCommit: {
    hash: string;
    author: string;
    date: string;
    message: string;
  } | null;
}

export function RepositorySettings() {
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [commits, setCommits] = useState<CommitLog[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);

  const fetchGitStatus = async () => {
    setLoadingStatus(true);
    setRepoError(null);
    try {
      const res = await fetch("/api/git/status");
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setGitStatus(data);
      } else {
        setGitStatus(null);
        setRepoError(data.message || data.error || "Git repository state is unavailable. Automated repair is prohibited.");
      }
    } catch (err: any) {
      setGitStatus(null);
      setRepoError(err.message || "Failed to contact Git status endpoint. Execution halted.");
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchGitLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch("/api/git/logs?limit=15");
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success && Array.isArray(data.commits)) {
        setCommits(data.commits);
      } else {
        setCommits([]);
      }
    } catch (err: any) {
      setCommits([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchGitStatus();
    fetchGitLogs();
  }, []);

  return (
    <div className="bg-[#111317] border border-[#22252D] rounded-lg p-6 space-y-6 text-[#E6E4DF]">
      {/* Header / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22252D] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase font-mono text-[#C5A059] tracking-wider font-semibold">
            <GitCommit className="w-4 h-4 text-[#C5A059]" />
            <span>LOCAL REPOSITORY & PROVENANCE CONTROL</span>
          </div>
          <h2 className="text-xl font-light text-[#E6E4DF] mt-1 tracking-tight">
            Repository Provenance & Checkpoint Ledger
          </h2>
          <p className="text-xs text-[#8A8F9A] mt-1">
            Local-first deterministic Git inspection and sovereign operator authority boundary (zero mutation authority).
          </p>
        </div>

        <button
          onClick={() => {
            fetchGitStatus();
            fetchGitLogs();
          }}
          disabled={loadingStatus || loadingLogs}
          className="flex items-center space-x-1.5 bg-[#181A20] hover:bg-[#232732] border border-[#2B303C] text-xs text-[#E6E4DF] px-3 py-1.5 rounded transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus || loadingLogs ? "animate-spin text-[#C5A059]" : "text-[#737885]"}`} />
          <span>Refresh Git State</span>
        </button>
      </div>

      {/* Repo Error / Failure Banner (Fail-Closed) */}
      {repoError && (
        <div className="p-4 rounded border bg-[#201213] border-[#421A1C] text-[#EF4444] text-xs flex items-start space-x-3 font-mono">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold uppercase tracking-wider">Repository Status Unavailable (Halted)</div>
            <div className="text-[#FCA5A5] leading-relaxed">{repoError}</div>
            <div className="text-[11px] text-[#A0A4AB]">
              In accordance with Pathfinder Sovereign Governance: The application will never attempt automated repair or repository reconstruction. Repository inspection or repair must be performed directly by the Operator.
            </div>
          </div>
        </div>
      )}

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Branch & Working Directory Cleanliness */}
        <div className="bg-[#15171E] border border-[#222630] rounded p-4 space-y-2">
          <div className="text-[10px] uppercase font-mono text-[#737885] tracking-wider">
            Active Branch / Working Tree
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-mono font-semibold text-[#509EE3]">
              {gitStatus?.branch || (repoError ? "UNAVAILABLE" : "—")}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                gitStatus?.clean
                  ? "bg-[#111A16] border-[#1C3527] text-[#4ADE80]"
                  : gitStatus
                  ? "bg-[#20180F] border-[#3B2815] text-[#F59E0B]"
                  : "bg-[#181A22] border-[#282C38] text-[#8A8F9A]"
              }`}
            >
              {gitStatus ? (gitStatus.clean ? "Tree Clean" : `${gitStatus.changesCount} Uncommitted`) : "Status Unknown"}
            </span>
          </div>
          <div className="text-xs text-[#8A8F9A]">
            {gitStatus
              ? gitStatus.clean
                ? "All files committed to local repository."
                : `Modified: ${gitStatus.modifiedCount} | Untracked: ${gitStatus.untrackedCount} | Staged: ${gitStatus.stagedCount}`
              : "Read-only inspection active."}
          </div>
        </div>

        {/* Sovereign Boundary Status */}
        <div className="bg-[#15171E] border border-[#222630] rounded p-4 space-y-2">
          <div className="text-[10px] uppercase font-mono text-[#737885] tracking-wider">
            Authority Boundary
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#4ADE80]">
            <Shield className="w-4 h-4 text-[#4ADE80]" />
            <span className="font-semibold uppercase tracking-wide">Local-First Sovereign</span>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-[#8A8F9A]">
            <Lock className="w-3 h-3 text-[#C5A059]" />
            <span>Zero Mutation Authority (Push & Auto-Repair Disabled)</span>
          </div>
        </div>

        {/* Latest Local Checkpoint */}
        <div className="bg-[#15171E] border border-[#222630] rounded p-4 space-y-2">
          <div className="text-[10px] uppercase font-mono text-[#737885] tracking-wider">
            Latest Checkpoint HEAD
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-[#C5A059] bg-[#1C1D24] px-1.5 py-0.5 rounded border border-[#2D303A]">
              {gitStatus?.lastCommit?.hash || "NONE"}
            </span>
            <span className="text-xs text-[#E6E4DF] truncate max-w-[180px]">
              {gitStatus?.lastCommit?.message || "No commit record retrieved"}
            </span>
          </div>
          <div className="text-[11px] text-[#737885] font-mono">
            Author: {gitStatus?.lastCommit?.author || "—"}
          </div>
        </div>
      </div>

      {/* Authority Boundary & Pipeline Doctrine */}
      <div className="bg-[#14161C] border border-[#232732] rounded p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#22252D] pb-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#C5A059] uppercase font-semibold">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>Authority Doctrine & External Boundary</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181B22] border border-[#2B303C] text-[#C5A059] uppercase">
            Acceleration ≠ Authority
          </span>
        </div>

        <div className="space-y-2 text-xs text-[#8A8F9A] leading-relaxed">
          <p>
            <strong className="text-[#E6E4DF]">Deterministic Workflow Architecture:</strong>
          </p>
          <div className="p-3 bg-[#0D0E12] border border-[#1E222A] rounded font-mono text-[11px] text-[#C5A059] flex flex-wrap items-center gap-2">
            <span className="text-[#E6E4DF]">Pathfinder workspace</span>
            <span className="text-[#737885]">→</span>
            <span className="text-[#509EE3]">Evidence observation & deterministic recomputation</span>
            <span className="text-[#737885]">→</span>
            <span className="text-[#EF4444] font-bold">STOP</span>
            <span className="text-[#737885]">→</span>
            <span className="text-[#4ADE80]">Operator-controlled external terminal Git management</span>
          </div>
          <p className="pt-1 text-[11px] text-[#737885]">
            Remote repository mutations, credentials, and Git write commands are strictly excluded from application authority. All checkpointing, branching, and remote synchronization actions remain exclusively manual, external operations governed by the Operator.
          </p>
        </div>
      </div>

      {/* Recent Commit History Logs */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-[#22252D] pb-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8A8F9A] uppercase font-semibold">
            <Terminal className="w-4 h-4 text-[#C5A059]" />
            <span>Local Filesystem Provenance History</span>
          </div>
          <span className="text-[10px] text-[#737885] font-mono">
            {commits.length} Checkpoints Retrieved
          </span>
        </div>

        <div className="bg-[#0E1014] border border-[#1E222A] rounded divide-y divide-[#1A1D24]">
          {commits.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#737885] font-mono">
              {repoError ? "Repository unreadable. No commits retrieved." : "No commit logs retrieved."}
            </div>
          ) : (
            commits.map((commit) => (
              <div
                key={commit.hash}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#12141B] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-[#C5A059] font-bold bg-[#181A22] px-1.5 py-0.5 rounded border border-[#282C38]">
                      {commit.hash}
                    </span>
                    <span className="text-xs font-medium text-[#E6E4DF]">
                      {commit.message}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-[#737885] font-mono">
                    <span>Author: {commit.author} &lt;{commit.email}&gt;</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-[#737885] font-mono self-start sm:self-auto">
                  <Clock className="w-3 h-3 text-[#737885]" />
                  <span>{commit.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
