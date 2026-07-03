import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CITATIONS,
  DELIVERABLES,
  MILESTONES,
  BUDGET,
  DOC_PAGES,
  extractionStats,
} from "../lib/review-fixture.ts";
import {
  DEMO_ONBOARDINGS,
  byStage,
  getOnboarding,
  totalTimeSaved,
} from "../lib/demo-data.ts";
import { cn } from "../lib/utils.ts";

test("extraction stats match the brand copy: 23 items, 21 verified, 2 in tray", () => {
  const s = extractionStats();
  assert.equal(s.items, 23);
  assert.equal(s.verified, 21);
  assert.equal(s.needsReview, 2);
});

test("every citeId used by plan items exists in CITATIONS", () => {
  const used = [
    ...DELIVERABLES.map((d) => d.citeId),
    ...MILESTONES.map((m) => m.citeId),
    ...BUDGET.map((b) => b.citeId),
  ].filter(Boolean) as string[];
  for (const id of used) assert.ok(CITATIONS[id], `missing citation ${id}`);
});

test("grounding: every citation quote appears verbatim on its cited page (mini Pass-B)", () => {
  for (const c of Object.values(CITATIONS)) {
    const page = DOC_PAGES.find((p) => p.n === c.page);
    assert.ok(page, `citation ${c.id} points to missing page ${c.page}`);
    const pageText = page!.paras
      .map((para) => para.map((s) => s.text).join(""))
      .join(" ");
    assert.ok(
      pageText.toLowerCase().includes(c.quote.toLowerCase()),
      `quote for ${c.id} not found on page ${c.page}`
    );
  }
});

test("every citation id has a rendered highlight segment in the document", () => {
  const segIds = new Set(
    DOC_PAGES.flatMap((p) =>
      p.paras.flatMap((para) => para.map((s) => s.citeId).filter(Boolean))
    )
  );
  for (const id of Object.keys(CITATIONS))
    assert.ok(segIds.has(id), `no doc segment for citation ${id}`);
});

test("exactly one inferred deliverable and one low-confidence budget item feed the tray", () => {
  assert.equal(DELIVERABLES.filter((d) => !d.citeId).length, 1);
  assert.equal(
    BUDGET.filter((b) => b.citeId && CITATIONS[b.citeId].confidence === "low").length,
    1
  );
});

test("pipeline stages cover all demo onboardings exactly once", () => {
  const total =
    byStage("parsing").length +
    byStage("review").length +
    byStage("cleared").length +
    byStage("in_progress").length +
    byStage("wheels_up").length;
  assert.equal(total, DEMO_ONBOARDINGS.length);
});

test("demo seed lookups + time-saved ticker sum", () => {
  assert.ok(getOnboarding("acme-seo"));
  assert.equal(getOnboarding("nope"), undefined);
  assert.ok(Math.abs(totalTimeSaved() - 83.8) < 0.001);
});

test("cn merges conflicting tailwind classes (last wins)", () => {
  assert.equal(cn("p-2", "p-4"), "p-4");
  assert.equal(cn("text-text", false && "hidden"), "text-text");
});
