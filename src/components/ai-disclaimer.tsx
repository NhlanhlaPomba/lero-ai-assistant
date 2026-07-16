import { AlertTriangle } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div
      role="note"
      className="mt-8 flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning-foreground/90"
      style={{ color: "var(--color-warning)" }}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="leading-relaxed">
        <span className="font-semibold">Responsible AI notice:</span> AI-generated content
        may contain errors, omissions, or fabricated details. Always review, verify, and
        edit before sharing or acting on it.
      </p>
    </div>
  );
}
