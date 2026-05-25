# Metrics

The North Star metric should be **qualified savings reports captured per week**. A plain “audit completed” metric is too shallow because it does not tell you whether the product is generating meaningful business value for Credex. A captured report is stronger than a casual visit, and “qualified” matters because a report showing $35/month in savings is not equivalent to one showing $900/month and a strong fit for discounted credits.

The three input metrics I would watch first are:

1. Landing visitor -> audit completion rate
2. Audit completion -> saved report rate
3. Shareable report -> Credex consultation booking rate for audits above the high-value threshold

These three numbers map directly to the product funnel. The first measures whether the landing page and form are clear enough. The second measures whether the audit creates enough value that users want to keep it. The third measures whether the product is actually surfacing commercial intent rather than just curiosity.

The first instrumentation I would add is event tracking around:

- landing page visit
- tool selected
- audit submitted
- audit generated
- report saved
- share link copied
- share link visited
- consultation CTA clicked

I would also record aggregate non-PII dimensions like use case, team size bucket, number of tools entered, and total savings bucket. Those make later funnel analysis much more useful.

The pivot number I would use is this: if after the first 100 completed audits fewer than 10 users save the report and fewer than 3 high-savings users click through to a Credex next step, I would revisit the product positioning hard. That would suggest the audit is interesting but not strong enough to create either trust or urgency, which means the wedge is not sharp enough yet.
