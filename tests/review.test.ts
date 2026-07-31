import { describe, expect, it } from "vitest";
import { heuristicReview } from "../lib/review";
describe("review engine", () => it("flags password logging and interpolated SQL", () => { const run=heuristicReview("+++ b/src/a.ts\n@@ -0,0 +1,2 @@\n+console.log(password)\n+const q = `SELECT * FROM x WHERE id = ${id}`"); expect(run.findings.map(x=>x.severity)).toEqual(["P0","P0"]); expect(run.testLog.before).toContain("SIMULATED"); }));
