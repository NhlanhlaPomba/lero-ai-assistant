import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "openai/gpt-5.5";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
  return createLovableAiGatewayProvider(key)(MODEL);
}

// ---------- Email ----------
const EmailInput = z.object({
  context: z.string().min(1),
  tone: z.enum(["Formal", "Informal", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EmailInput.parse(data))
  .handler(async ({ data }) => {
    const system = `You are a professional email writing assistant. Draft a complete email in a ${data.tone.toLowerCase()} tone. Include a clear subject line prefixed with "Subject:" on the first line, then a blank line, then the email body with greeting, body paragraphs, and sign-off. Keep it concise, natural, and ready-to-send. Do not include commentary or markdown formatting.`;
    const user = `Purpose / context:\n${data.context}`;
    const { text } = await generateText({
      model: getModel(),
      system,
      prompt: user,
    });
    return {
      output: text,
      promptUsed: `SYSTEM:\n${system}\n\nUSER:\n${user}`,
    };
  });

// ---------- Task Planner ----------
const PlanInput = z.object({
  tasks: z.string().min(1),
  planType: z.enum(["Daily", "Weekly"]),
  priorityStyle: z.enum(["Urgency-based", "Importance-based"]),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PlanInput.parse(data))
  .handler(async ({ data }) => {
    const system = `You are a productivity planning assistant. Build a ${data.planType.toLowerCase()} plan that prioritizes tasks using a ${data.priorityStyle.toLowerCase()} approach. Return a markdown table with columns: Priority | Task | Suggested Time Slot | Notes. ${data.planType === "Daily" ? "Time slots should be specific hours (e.g. 09:00–10:30)." : "Time slots should be days of the week with a time window."} Order rows from highest to lowest priority. After the table, add a short "Focus tips" section with 2-3 bullet points. Do not include any other commentary.`;
    const user = `Tasks / goals:\n${data.tasks}`;
    const { text } = await generateText({
      model: getModel(),
      system,
      prompt: user,
    });
    return {
      output: text,
      promptUsed: `SYSTEM:\n${system}\n\nUSER:\n${user}`,
    };
  });

// ---------- Research ----------
const ResearchInput = z.object({
  query: z.string().min(1),
  attachment: z
    .object({
      name: z.string(),
      mimeType: z.string(),
      dataBase64: z.string(),
    })
    .nullable()
    .optional(),
});

export const researchSummarize = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ResearchInput.parse(data))
  .handler(async ({ data }) => {
    const system = `You are a research assistant. Read the user's topic and any attached document, then produce a concise, well-structured summary. Structure:

1. **Overview** — 2–3 sentence high-level summary.
2. **Key Points** — 4–8 bullets covering the most important facts, arguments, or findings.
3. **Context & Analysis** — brief interpretation, background, or implications.
4. **Sources** — bullet list of relevant links (with real URLs when you can cite them) or "Based on attached document" when working from a file. If you cannot cite real sources, say so explicitly rather than fabricating URLs.

Be factual, neutral, and clear. Do not invent citations.`;

    const userText = `Topic / request:\n${data.query}`;
    const userContent: Array<Record<string, unknown>> = [{ type: "text", text: userText }];

    if (data.attachment) {
      const { mimeType, dataBase64, name } = data.attachment;
      if (mimeType.startsWith("image/")) {
        userContent.push({
          type: "image",
          image: `data:${mimeType};base64,${dataBase64}`,
        });
      } else {
        userContent.push({
          type: "file",
          data: `data:${mimeType};base64,${dataBase64}`,
          mediaType: mimeType,
          filename: name,
        });
      }
    }

    const { text } = await generateText({
      model: getModel(),
      system,
      messages: [
        {
          role: "user",
          // AI SDK message parts
          content: userContent as never,
        },
      ],
    });

    const promptUsed = `SYSTEM:\n${system}\n\nUSER:\n${userText}${data.attachment ? `\n[Attached file: ${data.attachment.name} (${data.attachment.mimeType})]` : ""}`;

    return { output: text, promptUsed };
  });
