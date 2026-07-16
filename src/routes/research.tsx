import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef } from "react";
import { BookOpen, Loader2, Paperclip, Wand2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PromptUsed } from "@/components/prompt-used";
import { OutputPanel } from "@/components/output-panel";
import { researchSummarize } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — LERO" },
      {
        name: "description",
        content:
          "Summarize articles, documents, or topics into structured notes with sources.",
      },
    ],
  }),
  component: ResearchPage,
});

type Attachment = { name: string; mimeType: string; dataBase64: string; size: number };

function ResearchPage() {
  const run = useServerFn(researchSummarize);
  const [query, setQuery] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [output, setOutput] = useState("");
  const [promptUsed, setPromptUsed] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("File too large (max 8 MB)");
      return;
    }
    const buf = await file.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const dataBase64 = btoa(binary);
    setAttachment({
      name: file.name,
      mimeType: file.type || "application/octet-stream",
      dataBase64,
      size: file.size,
    });
  }

  function clearFile() {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onGenerate() {
    if (!query.trim() && !attachment) {
      toast.error("Enter a topic or attach a file");
      return;
    }
    setLoading(true);
    try {
      const res = await run({
        data: {
          query: query.trim() || "Summarize the attached document.",
          attachment: attachment
            ? {
                name: attachment.name,
                mimeType: attachment.mimeType,
                dataBase64: attachment.dataBase64,
              }
            : null,
        },
      });
      setOutput(res.output);
      setPromptUsed(res.promptUsed);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Research failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <BookOpen className="h-3.5 w-3.5" />
          Research
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          AI Research Assistant
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Paste a topic, an article, or attach a document. LERO returns a structured
          summary with key points and sources.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="query">Topic, article text, or question</Label>
            <Textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Summarize the current state of solid-state batteries and their commercial timelines."
              rows={6}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,image/*"
              onChange={onFile}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Paperclip className="h-4 w-4" />
              Attach document
            </Button>
            {attachment && (
              <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground">
                <span className="max-w-[240px] truncate font-medium text-foreground">
                  {attachment.name}
                </span>
                <span>({(attachment.size / 1024).toFixed(0)} KB)</span>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Remove attachment"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <div className="ml-auto">
              <Button onClick={onGenerate} disabled={loading} className="gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                {loading ? "Researching…" : "Summarize / Research"}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports PDF, text, and image files (max 8 MB). Sources are best-effort — the
            model will note when it cannot cite real links.
          </p>
        </div>
      </div>

      <OutputPanel
        value={output}
        onChange={setOutput}
        placeholder="Your structured research summary will appear here — fully editable."
        rows={18}
      />

      <PromptUsed prompt={promptUsed} />

      <AiDisclaimer />
    </div>
  );
}
