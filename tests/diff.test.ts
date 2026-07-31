import { describe, expect, it } from "vitest";
import { parseUnifiedDiff } from "../lib/diff";
describe("unified diff parser", () => it("tracks added lines and their new-file positions", () => { const result=parseUnifiedDiff("--- a/a.ts\n+++ b/a.ts\n@@ -1,1 +1,2 @@\n keep\n+added"); expect(result[0]).toEqual({path:"a.ts",additions:[{line:2,text:"added"}]}); }));
