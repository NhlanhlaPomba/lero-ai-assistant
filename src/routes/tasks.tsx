import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ListChecks, Loader2, Wand2 } from "lucide-react";
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
import { generatePlan } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — LERO" },
      {
        name: "description",
        content:
          "Turn a list of tasks into a prioritized daily or weekly plan with suggested time slots.",
      },
    ],
  }),
  component: TasksPage,
});

type PlanType = "Daily" | "Weekly";
type PriorityStyle = "Urgency-based" | "Importance-based";

function TasksPage() {
  const run = useServerFn(generatePlan);
  const [tasks, setTasks] = useState("");
  const [planType, setPlanType] = useState<PlanType>("Daily");
  const [priorityStyle, setPriorityStyle] =
    useState<PriorityStyle>("Importance-based");
  const [output, setOutput] = useState("");
  const [promptUsed, setPromptUsed] = useState("");
  const [loading, setLoading] = useState(false);

  async function onGenerate() {
    if (!tasks.trim()) {
      toast.error("Add at least one task");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { tasks, planType, priorityStyle } });
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
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <ListChecks className="h-3.5 w-3.5" />
          Planner
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          AI Task Planner
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Paste your tasks below. LERO organizes them into a prioritized schedule with
          suggested time slots.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="tasks">Tasks & goals</Label>
            <Textarea
              id="tasks"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"e.g.\n- Finish Q3 report\n- Reply to legal about contract redlines\n- Prep slides for Friday review\n- 30-min gym session"}
              rows={7}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plan-type">Plan type</Label>
              <Select value={planType} onValueChange={(v) => setPlanType(v as PlanType)}>
                <SelectTrigger id="plan-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority style</Label>
              <Select
                value={priorityStyle}
                onValueChange={(v) => setPriorityStyle(v as PriorityStyle)}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Urgency-based">Urgency-based</SelectItem>
                  <SelectItem value="Importance-based">Importance-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onGenerate} disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              {loading ? "Planning…" : "Generate Plan"}
            </Button>
          </div>
        </div>
      </div>

      <OutputPanel
        value={output}
        onChange={setOutput}
        placeholder="Your prioritized plan will appear here as an editable markdown table."
        rows={16}
      />

      <PromptUsed prompt={promptUsed} />

      <AiDisclaimer />
    </div>
  );
}
