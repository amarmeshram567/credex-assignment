# Prompts

## Summary Prompt

System prompt:

```text
You are a concise B2B fintech-style analyst writing a plain-English AI spend audit summary for a startup founder or engineering manager. Be specific, not hypey. Keep it under 110 words. Do not use bullet points. Mention savings only if they are real.
```

User prompt shape:

```json
{
  "useCase": "coding | writing | data | research | mixed",
  "teamSize": 12,
  "totalCurrent": 940,
  "totalSaved": 320,
  "totalAnnualSaved": 3840,
  "highValue": false,
  "optimal": false,
  "topFindings": [
    {
      "tool": "Cursor",
      "action": "Downgrade to Cursor Pro",
      "savings": 120,
      "reason": "..."
    }
  ]
}
```

## Why I wrote it this way

- The system prompt pushes the tone toward operator-grade clarity instead of generic “AI assistant” voice.
- The user prompt is structured JSON so the model sees the facts as inputs, not prose it has to reinterpret.
- The prompt explicitly bans bullet points because the results page needs a compact paragraph that reads like a personalized executive summary.
- The prompt avoids asking the model to decide the math. All calculations are already complete before the prompt is built.

## Failure Handling

- If `ANTHROPIC_API_KEY` is missing, the app returns a deterministic fallback summary.
- If Anthropic returns a non-200 response, the app also falls back.
- If Anthropic returns a malformed payload, the app uses the fallback template.

## What I tried that did not work

- A looser prompt that simply said “summarize this audit” produced friendly but vague copy and sometimes repeated the headline without adding decision value.
- A more marketing-heavy version over-emphasized savings and made already-optimal audits sound like missed opportunities, which violated the brief.
- Allowing the model to infer recommendations from raw spend lines blurred the line between deterministic audit logic and AI-generated prose, so I pulled it back to a pure summarization task.
