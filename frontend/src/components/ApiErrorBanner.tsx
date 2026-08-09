import { AlertTriangle } from "lucide-react";

export default function ApiErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-critical/30 bg-critical/10 px-4 py-3 text-sm text-ink">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-critical" />
      <div>
        <p className="font-medium text-critical">API connection error</p>
        <p className="mt-0.5 text-ink-muted">{message}</p>
      </div>
    </div>
  );
}
