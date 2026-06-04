import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { ReactNode } from "react";

interface LegalPageLayoutProps {
  children: ReactNode;
}

export function LegalPageLayout({ children }: LegalPageLayoutProps) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-bg-muted py-10 sm:py-14">
        <div className="mx-auto max-w-[800px] px-5">
          <Link
            href="/"
            className="mb-6 inline-block text-sm font-medium text-accent hover:underline"
          >
            ← На главную
          </Link>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
