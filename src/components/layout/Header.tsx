"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="ЛОГОС" width={120} height={36} priority />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-text-muted sm:flex">
          <a href="#about" className="transition-colors hover:text-accent">
            Об интенсиве
          </a>
          <a href="#program" className="transition-colors hover:text-accent">
            Программа
          </a>
        </nav>
      </div>
    </header>
  );
}
