import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Stacklane | AI Spend Audit",
  description: "Audit AI tool spend, benchmark your stack, and uncover savings across seats, plans, and credits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="premium-shell min-h-full flex flex-col">
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/78 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-primary/25 bg-primary/12 text-sm font-bold text-primary shadow-[0_0_30px_-12px_rgba(94,255,197,0.55)]">
                S
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide text-foreground">Stacklane</div>
                <div className="text-xs text-muted-foreground">AI spend audit by Credex</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <Link href="/#how-it-works" className="transition hover:text-foreground">How it works</Link>
              <Link href="/#supported-tools" className="transition hover:text-foreground">Supported tools</Link>
              <Link href="/#faq" className="transition hover:text-foreground">FAQ</Link>
            </nav>

            <Link
              href="/#audit-form"
              className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Run audit
            </Link>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-border/80 bg-card/50 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.8fr_0.8fr] lg:px-8">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Stacklane</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                Audit what your team pays for AI tools, benchmark the stack, and surface
                where plan fit or discounted credits can cut real monthly spend.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Product</h3>
              <div className="mt-3 space-y-2 text-sm">
                <Link href="/#audit-form" className="block text-foreground transition hover:text-primary">Free audit</Link>
                <Link href="/#supported-tools" className="block text-foreground transition hover:text-primary">Pricing coverage</Link>
                <Link href="/#faq" className="block text-foreground transition hover:text-primary">FAQ</Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Use case</h3>
              <div className="mt-3 space-y-2 text-sm text-foreground">
                <p>Founders validating AI tooling budgets</p>
                <p>Engineering managers consolidating copilots</p>
                <p>Teams deciding when Credex is worth the conversation</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
