import { describe, expect, it } from "vitest";
import { applySingleHunk } from "../lib/patch";
describe("patch applier", () => it("replaces removed content with additions", () => { expect(applySingleHunk("const unsafe = true;", "-const unsafe = true;\n+const safe = true;")).toBe("const safe = true;"); }));
