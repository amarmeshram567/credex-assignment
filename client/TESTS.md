# Tests

## Automated tests written

- `tests/audit-engine.test.ts`
  Covers Claude Team minimum-seat downgrade logic.
- `tests/audit-engine.test.ts`
  Covers Cursor Business to Pro downgrade logic for tiny teams.
- `tests/audit-engine.test.ts`
  Covers high direct API spend recommendations toward discounted credits.
- `tests/audit-engine.test.ts`
  Covers Gemini Ultra downgrade logic for non-data workflows.
- `tests/audit-engine.test.ts`
  Covers over-list-price detection for seat-based plans.
- `tests/audit-engine.test.ts`
  Covers duplicate coding-assistant consolidation logic in portfolio-level audit output.

## How to run

```bash
npm run test
```

## Notes

- The test harness uses `tsc` plus Node's built-in test runner, so there is no extra test framework dependency.
- The current tests focus on the audit engine because that is the highest-risk logic in the assignment and the explicit minimum requirement.
