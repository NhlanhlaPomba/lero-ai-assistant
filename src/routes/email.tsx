import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Mail, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PromptUsed } from "@/components/prompt-used";
import { OutputPanel } from "@/components/output-panel";
import { generateEmail } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — LERO" },
      {
        name: "description",
        content:
          "Draft professional emails from a short brief. Choose formal, informal, or persuasive tone.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Informal" | "Persuasive";

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [promptUsed, setPromptUsed] = useState("");
  const [loading, setLoading] = useState(false);

  async function onGenerate() {
    if (!context.trim()) {
      toast.error("Add some context first");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { context, tone } });
      setOutput(res.output);
      setPromptUsed(res.promptUsed);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Smart Email Generator"
        description="Describe what you need to say — LERO drafts the email in your chosen tone."
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="context">Purpose / context</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Follow up with a client about the Q3 proposal I sent last Tuesday, and gently ask when we can expect feedback."
              rows={5}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger id="tone" className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Informal">Informal</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={onGenerate} disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </div>
        </div>
      </div>

      <OutputPanel
        value={output}
        onChange={setOutput}
        placeholder="Your generated email will appear here — fully editable before you copy."
      />

      <PromptUsed prompt={promptUsed} />

      <AiDisclaimer />
    </div>
  );
}

function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-2">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        <Mail className="h-3.5 w-3.5" />
        Email
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {title}
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
