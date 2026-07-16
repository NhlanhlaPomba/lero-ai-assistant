import { ChevronRight, Terminal } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function PromptUsed({ prompt }: { prompt: string }) {
  if (!prompt) return null;
  return (
    <Collapsible className="rounded-lg border border-border bg-card/50">
      <CollapsibleTrigger className="group flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground">
        <Terminal className="h-4 w-4" />
        <span>Prompt used</span>
        <span className="ml-auto text-xs text-muted-foreground/70">
          Prompt engineering
        </span>
        <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap border-t border-border bg-background/60 px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
          {prompt}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}
