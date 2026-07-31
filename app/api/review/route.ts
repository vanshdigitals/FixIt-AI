import OpenAI from "openai";
import demo from "../../../data/demo-run.json";
import { heuristicReview } from "../../../lib/review";
import type { ReviewRun } from "../../../lib/types";
export const runtime = "nodejs";
const system = `You review unified git diffs. Return only valid JSON matching {findings:[{severity,file,line,title,why,fix}],patch:string}. Focus on concrete bugs, security, performance, and missing tests. Never claim tests ran; suggest a minimal unified patch.`;
export async function POST(request: Request) { try { const { diff } = await request.json(); if (typeof diff !== "string" || !diff.trim()) return Response.json({error:"Provide a unified diff."},{status:400});
  if (process.env.DEMO_MODE !== "false") return Response.json(demo as ReviewRun);
  if (!process.env.OPENAI_API_KEY) return Response.json({error:"Live mode needs OPENAI_API_KEY."},{status:503});
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY}); const completion=await client.chat.completions.create({model:process.env.OPENAI_MODEL||"gpt-4.1-mini",response_format:{type:"json_object"},messages:[{role:"system",content:system},{role:"user",content:diff}]}); const parsed=JSON.parse(completion.choices[0]?.message.content||"{}"); const fallback=heuristicReview(diff); const run:ReviewRun={...fallback,findings:Array.isArray(parsed.findings)?parsed.findings:fallback.findings,patch:typeof parsed.patch==="string"?parsed.patch:fallback.patch}; return Response.json(run);
} catch { return Response.json({error:"Review could not be completed. Check your diff and live-mode configuration."},{status:500}); } }
