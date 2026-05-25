# Pricing Data

Verified on `2026-05-24`. Every URL below points to an official vendor page or official vendor documentation.

## Cursor

- Hobby: `$0/month` — https://cursor.com/pricing — verified 2026-05-24
- Pro: `$20/month` — https://cursor.com/pricing — verified 2026-05-24
- Business (public page labels this as Teams): `$40/user/month` — https://cursor.com/pricing — verified 2026-05-24
- Enterprise: `Custom / contact sales` — https://cursor.com/pricing — verified 2026-05-24

## GitHub Copilot

- Individual (mapped to Copilot Pro for this audit): `$10/month` — https://docs.github.com/en/copilot/get-started/plans — verified 2026-05-24
- Business: `$19/granted-seat/month` — https://docs.github.com/en/copilot/get-started/plans — verified 2026-05-24
- Enterprise: `$39/granted-seat/month` — https://docs.github.com/en/copilot/get-started/plans — verified 2026-05-24

## Claude

- Free: `$0/month` — https://claude.com/pricing — verified 2026-05-24
- Pro: `$20/month` — https://claude.com/pricing — verified 2026-05-24
- Max: `$100/month` for the 5x tier — https://support.claude.com/en/articles/11014257-about-claude-s-max-plan-usage — verified 2026-05-24
- Team Standard seat: `$25/member/month billed monthly` — https://support.claude.com/en/articles/9266767-what-is-the-team-plan — verified 2026-05-24
- Team Premium seat: `$125/member/month billed monthly` — https://support.claude.com/en/articles/9266767-what-is-the-team-plan — verified 2026-05-24
- Team minimum: `5 members` — https://support.claude.com/en/articles/9266767-what-is-the-team-plan — verified 2026-05-24
- Enterprise: `Seat-based Enterprise starts at $20 plus usage credits` — https://claude.com/pricing — verified 2026-05-24
- API direct reference model used for reasoning: `Claude Sonnet 4 at $3/M input tokens and $15/M output tokens` — https://docs.anthropic.com/en/docs/about-claude/pricing — verified 2026-05-24

## ChatGPT

- Plus: `$20/month` — https://openai.com/chatgpt/pricing — verified 2026-05-24
- Team: `$30/user/month billed monthly` — https://openai.com/chatgpt/pricing — verified 2026-05-24
- Team annual option: `$25/user/month billed annually` — https://openai.com/chatgpt/pricing — verified 2026-05-24
- Enterprise: `Custom / contact sales` — https://openai.com/chatgpt/pricing — verified 2026-05-24
- API direct reference model used for reasoning: `GPT-5.4 mini at $0.75/M input tokens and $4.50/M output tokens` — https://openai.com/api/pricing/ — verified 2026-05-24

## Anthropic API direct

- Claude Sonnet 4 input: `$3/M tokens` — https://docs.anthropic.com/en/docs/about-claude/pricing — verified 2026-05-24
- Claude Sonnet 4 output: `$15/M tokens` — https://docs.anthropic.com/en/docs/about-claude/pricing — verified 2026-05-24

## OpenAI API direct

- GPT-5.4 mini input: `$0.75/M tokens` — https://openai.com/api/pricing/ — verified 2026-05-24
- GPT-5.4 mini output: `$4.50/M tokens` — https://openai.com/api/pricing/ — verified 2026-05-24

## Gemini

- Google AI Pro: `$19.99/month` — https://gemini.google/us/subscriptions/?hl=en — verified 2026-05-24
- Google AI Ultra: `Starting at $99.99/month` for the 5x tier — https://gemini.google/us/subscriptions/?hl=en — verified 2026-05-24
- Google AI Ultra higher tier: `$199.99/month` for the 20x tier — https://gemini.google/us/subscriptions/?hl=en — verified 2026-05-24

## Windsurf

- Free: `$0/month` — https://windsurf.com/redirect/windsurf/learn-pricing — verified 2026-05-24
- Pro: `$20/month` — https://windsurf.com/redirect/windsurf/learn-pricing — verified 2026-05-24
- Teams: `$40/user/month` — https://windsurf.com/redirect/windsurf/learn-pricing — verified 2026-05-24

## Notes on modeling choices

- Some enterprise plans are publicly listed as custom-priced. In those cases the audit engine does not invent fake sticker prices. Instead, it treats the user's entered monthly spend as the source of truth and compares it against lower published tiers.
- For API-direct products, the audit engine uses official token pricing as a benchmark input but does not pretend it knows the user's exact request mix or token distribution.
