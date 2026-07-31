export type Severity = "P0" | "P1" | "P2";
export type Finding = { severity: Severity; file: string; line: number; title: string; why: string; fix: string };
export type Step = { name: string; status: "done" | "active" | "pending"; detail: string };
export type ReviewRun = { steps: Step[]; findings: Finding[]; patch: string; testLog: { before: string; after: string } };
