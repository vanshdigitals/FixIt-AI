export type DiffFile = { path: string; additions: { line: number; text: string }[] };
export function parseUnifiedDiff(diff: string): DiffFile[] {
  const files: DiffFile[] = []; let current: DiffFile | undefined; let newLine = 0;
  for (const row of diff.split("\n")) {
    if (row.startsWith("+++ b/")) { current = { path: row.slice(6), additions: [] }; files.push(current); }
    else if (row.startsWith("@@")) { const match = /\+(\d+)/.exec(row); newLine = match ? Number(match[1]) : 0; }
    else if (current && row.startsWith("+") && !row.startsWith("+++")) { current.additions.push({ line: newLine++, text: row.slice(1) }); }
    else if (current && !row.startsWith("-")) newLine++;
  } return files;
}
