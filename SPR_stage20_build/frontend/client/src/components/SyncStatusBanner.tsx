import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export function SyncStatusBanner(props: {
  totalPrompts: number;
  lastIngestAt: string | null;
  extPending?: number;
  extFailed?: number;
  extSending?: number;
  extLastSeenAt?: string | null;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onRetryFailed?: () => void;
}) {
  const { totalPrompts, lastIngestAt, extPending, extFailed, extSending, extLastSeenAt, isLoading, isError, onRetry, onRetryFailed } = props;

  const lastText = lastIngestAt ? new Date(lastIngestAt).toLocaleString() : "Never";
  const extLast = extLastSeenAt ? new Date(extLastSeenAt).toLocaleString() : null;
  const stateIcon = isError ? <AlertTriangle className="w-4 h-4" /> : isLoading ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border border-border/60 rounded-2xl px-4 py-3 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{stateIcon}</div>
        <div className="text-sm">
          <div className="font-semibold">Data Status</div>
          <div className="text-muted-foreground">
            Total prompts: <span className="font-mono">{totalPrompts}</span> · Last ingest: <span className="font-mono">{lastText}</span>
          </div>
          {typeof extPending === "number" && typeof extFailed === "number" ? (
            <div className="text-muted-foreground">
              Extension queue: <span className="font-mono">{extPending}</span> pending · <span className="font-mono">{extFailed}</span> failed · <span className="font-mono">{extSending ?? 0}</span> sending
              {extLast ? (
                <> · Last seen: <span className="font-mono">{extLast}</span></>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {typeof extFailed === "number" && extFailed > 0 && onRetryFailed ? (
          <button
            className="text-sm px-3 py-1.5 rounded-xl border border-border/60 hover:bg-accent transition"
            onClick={onRetryFailed}
          >
            Retry failed
          </button>
        ) : null}
        {isError && onRetry ? (
          <button
            className="text-sm px-3 py-1.5 rounded-xl border border-border/60 hover:bg-accent transition"
            onClick={onRetry}
          >
            Retry
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}
