import { parseUnifiedDiff } from "./diff";
import type { Finding, ReviewRun } from "./types";

const finding = (severity: Finding["severity"], file: string, line: number, title: string, why: string, fix: string): Finding => ({ severity, file, line, title, why, fix });

export function heuristicReview(diff: string): ReviewRun {
  const findings: Finding[] = [];
  const files = parseUnifiedDiff(diff);
  for (const file of files) for (const add of file.additions) {
    if (/console\.(log|debug).*password|password.*console\.(log|debug)/i.test(add.text)) findings.push(finding("P0", file.path, add.line, "Sensitive data in logs", "A password can persist in application logs.", "Remove the log or redact all secrets."));
    if (/SELECT .*\$\{|query\(.*\+|query\(`.*\$\{/i.test(add.text)) findings.push(finding("P0", file.path, add.line, "Possible SQL injection", "User input is interpolated into a database query.", "Use parameterized queries or the ORM."));
    if (/\beval\s*\(/.test(add.text)) findings.push(finding("P0", file.path, add.line, "Dynamic code execution", "eval executes input as code.", "Use a safe parser or a fixed allow-list."));
  }
  if (!findings.length) findings.push(finding("P2", files[0]?.path ?? "diff", 1, "No obvious heuristic risk", "This lightweight pass found no known patterns.", "Add focused tests and request a human review."));
  return { steps: ["Plan", "Analyse", "Propose patch", "Run tests", "Summarise"].map(name => ({ name, status: "done", detail: name === "Run tests" ? "Simulated heuristic result; no repository code executed." : "Completed by local review heuristics." })), findings, patch: "# Patch generation needs live mode for arbitrary diffs.\n# Review the findings above and apply the suggested fixes.", testLog: { before: "SIMULATED · heuristic scan: FAIL\n  " + findings.filter(x => x.severity !== "P2").length + " risk(s) found", after: "SIMULATED · no code execution on Vercel\n  Apply proposed changes, then run tests locally." } };
}

export function toMarkdown(run: ReviewRun): string {
  const verdict = run.findings.some(f => f.severity === "P0") ? "BLOCK — P0 security issue(s) found." : "REVIEW — no P0 issue found.";
  const findings = run.findings.map(f => "- **" + f.severity + "** `" + f.file + ":" + f.line + "` — **" + f.title + "**: " + f.why + "\n  - Fix: " + f.fix).join("\n");
  return "# Fix-It review report\n\n## Verdict\n" + verdict + "\n\n## Findings\n" + findings + "\n\n## Proposed patch\n\n```diff\n" + run.patch + "\n```\n\n## Simulated test log\n\n```\n" + run.testLog.after + "\n```";
}
