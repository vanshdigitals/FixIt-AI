export function applySingleHunk(source: string, patch: string): string {
  const removed = patch.split("\n").filter(line => line.startsWith("-") && !line.startsWith("---")).map(line => line.slice(1));
  const added = patch.split("\n").filter(line => line.startsWith("+") && !line.startsWith("+++")).map(line => line.slice(1));
  return removed.length ? source.replace(removed.join("\n"), added.join("\n")) : source;
}
