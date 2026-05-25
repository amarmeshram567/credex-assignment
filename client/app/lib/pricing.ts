// Pricing data verified from official vendor pricing pages.
// See PRICING_DATA.md for source links and verification date.

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolPlan {
    id: string;
    name: string;
    pricePerSeat: number;
    notes?: string;
    isApi?: boolean;
    isCustomPriced?: boolean;
    minSeats?: number;
}

export interface Tool {
    id: string;
    name: string;
    vendor: string;
    category: "coding" | "chat" | "api";
    plans: ToolPlan[];
    pricingUrl: string;
}

export const TOOLS: Tool[] = [
    {
        id: "cursor",
        name: "Cursor",
        vendor: "Anysphere",
        category: "coding",
        pricingUrl: "https://cursor.com/pricing",
        plans: [
            { id: "hobby", name: "Hobby", pricePerSeat: 0 },
            { id: "pro", name: "Pro", pricePerSeat: 20 },
            { id: "business", name: "Business (Teams)", pricePerSeat: 40, notes: "Public page labels this plan Teams." },
            { id: "enterprise", name: "Enterprise", pricePerSeat: 0, isCustomPriced: true, notes: "Contact sales." },
        ],
    },
    {
        id: "copilot",
        name: "GitHub Copilot",
        vendor: "GitHub",
        category: "coding",
        pricingUrl: "https://docs.github.com/en/copilot/get-started/plans",
        plans: [
            { id: "individual", name: "Individual", pricePerSeat: 10, notes: "Officially Copilot Pro." },
            { id: "business", name: "Business", pricePerSeat: 19 },
            { id: "enterprise", name: "Enterprise", pricePerSeat: 39 },
        ],
    },
    {
        id: "claude",
        name: "Claude",
        vendor: "Anthropic",
        category: "chat",
        pricingUrl: "https://claude.com/pricing",
        plans: [
            { id: "free", name: "Free", pricePerSeat: 0 },
            { id: "pro", name: "Pro", pricePerSeat: 20 },
            { id: "max", name: "Max", pricePerSeat: 100, notes: "Using the 5x Max tier for comparison." },
            { id: "team", name: "Team", pricePerSeat: 25, minSeats: 5 },
            { id: "enterprise", name: "Enterprise", pricePerSeat: 20, notes: "Seat-based Enterprise starts at $20 plus usage credits.", minSeats: 5 },
            { id: "api-direct", name: "API direct", pricePerSeat: 0, isApi: true, notes: "Usage-based via Anthropic API pricing." },
        ],
    },
    {
        id: "chatgpt",
        name: "ChatGPT",
        vendor: "OpenAI",
        category: "chat",
        pricingUrl: "https://openai.com/chatgpt/pricing",
        plans: [
            { id: "plus", name: "Plus", pricePerSeat: 20 },
            { id: "team", name: "Team", pricePerSeat: 30, minSeats: 2 },
            { id: "enterprise", name: "Enterprise", pricePerSeat: 0, isCustomPriced: true, notes: "Contact sales." },
            { id: "api-direct", name: "API direct", pricePerSeat: 0, isApi: true, notes: "Usage-based via OpenAI API pricing." },
        ],
    },
    {
        id: "anthropic-api",
        name: "Anthropic API",
        vendor: "Anthropic",
        category: "api",
        pricingUrl: "https://docs.anthropic.com/en/docs/about-claude/pricing",
        plans: [
            {
                id: "usage",
                name: "Usage-based",
                pricePerSeat: 0,
                isApi: true,
                notes: "Reference model for audit assumptions: Claude Sonnet 4 at $3/M input tokens and $15/M output tokens.",
            },
        ],
    },
    {
        id: "openai-api",
        name: "OpenAI API",
        vendor: "OpenAI",
        category: "api",
        pricingUrl: "https://openai.com/api/pricing/",
        plans: [
            {
                id: "usage",
                name: "Usage-based",
                pricePerSeat: 0,
                isApi: true,
                notes: "Reference model for audit assumptions: GPT-5.4 mini at $0.75/M input tokens and $4.50/M output tokens.",
            },
        ],
    },
    {
        id: "gemini",
        name: "Gemini",
        vendor: "Google",
        category: "chat",
        pricingUrl: "https://gemini.google/us/subscriptions/?hl=en",
        plans: [
            { id: "pro", name: "Pro (Google AI Pro)", pricePerSeat: 19.99 },
            { id: "ultra", name: "Ultra", pricePerSeat: 99.99, notes: "Using the 5x usage starting tier." },
            { id: "api", name: "API direct", pricePerSeat: 0, isApi: true },
        ],
    },
    {
        id: "windsurf",
        name: "Windsurf",
        vendor: "Codeium",
        category: "coding",
        pricingUrl: "https://windsurf.com/redirect/windsurf/learn-pricing",
        plans: [
            { id: "free", name: "Free", pricePerSeat: 0 },
            { id: "pro", name: "Pro", pricePerSeat: 20 },
            { id: "teams", name: "Teams", pricePerSeat: 40 },
        ],
    },
];

export const TOOLS_BY_ID = Object.fromEntries(TOOLS.map((tool) => [tool.id, tool])) as Record<string, Tool>;

export const USE_CASES: { id: UseCase; label: string }[] = [
    { id: "coding", label: "Coding / engineering" },
    { id: "writing", label: "Writing / marketing" },
    { id: "data", label: "Data / analytics" },
    { id: "research", label: "Research" },
    { id: "mixed", label: "Mixed" },
];
