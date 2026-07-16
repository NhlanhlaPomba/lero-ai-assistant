import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ListChecks, BookOpen, ArrowRight } from "lucide-react";
import { AiDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — LERO Workplace Assistant" },
      {
        name: "description",
        content:
          "Pick a tool: draft emails, plan your day, or research any topic with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const cards = [
  {
    to: "/email" as const,
    title: "Smart Email Generator",
    description:
      "Turn a rough idea into a polished, ready-to-send email in the tone you need.",
    icon: Mail,
    accent: "from-indigo-500/20 to-blue-500/10",
  },
  {
    to: "/tasks" as const,
    title: "AI Task Planner",
    description:
      "Convert a messy to-do list into a prioritized daily or weekly plan with time slots.",
    icon: ListChecks,
    accent: "from-violet-500/20 to-indigo-500/10",
  },
  {
    to: "/research" as const,
    title: "AI Research Assistant",
    description:
      "Summarize articles, documents, or topics into structured notes with sources.",
    icon: BookOpen,
    accent: "from-sky-500/20 to-cyan-500/10",
  },
];

function Dashboard() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Welcome back
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Automate the busywork.{" "}
          <span className="text-muted-foreground">Focus on the work that matters.</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          LERO gives you three focused AI tools for the tasks that eat your day — writing
          emails, planning work, and researching topics. Pick one to get started.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 transition-opacity group-hover:opacity-100`}
              aria-hidden
            />
            <div className="relative flex flex-col gap-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
                <card.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {card.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open tool
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <AiDisclaimer />
    </div>
  );
}
