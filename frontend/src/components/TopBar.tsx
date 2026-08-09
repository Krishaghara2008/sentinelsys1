import { Menu, Wifi, WifiOff } from "lucide-react";
import { useAnalysis } from "../context/AnalysisContext";
import { useConnection } from "../context/ConnectionContext";
import { formatTimestamp } from "../lib/theme";

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span className="relative flex h-1.5 w-1.5">
      {ok && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-healthy opacity-60" />
      )}
      <span
        className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
          ok ? "bg-healthy" : "bg-critical"
        }`}
      />
    </span>
  );
}

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { connected, checking } = useConnection();
  const { result } = useAnalysis();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-void/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-ink-muted hover:bg-panel-raised hover:text-ink md:hidden"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-display text-base font-semibold text-ink">SentinelSys</h1>
          <p className="hidden text-xs text-ink-faint sm:block">Fuzzy Logic Predictive Maintenance</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="hidden items-center gap-1.5 text-ink-muted lg:flex">
          <StatusDot ok={connected} />
          System Status: <span className="text-ink">{connected ? "Online" : "Offline"}</span>
        </div>
        <div className="hidden items-center gap-1.5 text-ink-muted lg:flex">
          <StatusDot ok={connected} />
          Fuzzy Engine: <span className="text-ink">{connected ? "Active" : "Idle"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-ink-muted">
          {connected ? (
            <Wifi size={14} className="text-healthy" />
          ) : (
            <WifiOff size={14} className="text-critical" />
          )}
          <span className="hidden sm:inline">API:</span>
          <span className={connected ? "text-healthy" : "text-critical"}>
            {checking ? "Checking…" : connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="hidden items-center gap-1.5 text-ink-muted xl:flex">
          Last Analysis:{" "}
          <span className="tabular text-ink">{formatTimestamp(result?.timestamp)}</span>
        </div>
      </div>
    </header>
  );
}
