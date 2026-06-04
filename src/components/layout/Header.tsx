"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { handleSectionNavClick } from "@/lib/navigation/smoothScroll";

const SECTION_LINKS = [
  { sectionId: "about", label: "О КиберСтраже" },
  { sectionId: "program", label: "Программа" },
  { sectionId: "partners", label: "Партнёры" },
  { sectionId: "guests", label: "Гости" },
];

interface HeaderProps {
  variant?: "default" | "admin";
  onLogout?: () => void;
}

export function Header({ variant = "default", onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (variant === "admin") {
    return (
      <header className="sticky top-0 z-40 border-b border-border/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="ЛОГОС" width={120} height={36} priority />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/">
              <Button variant="secondary" size="sm">
                На сайт
              </Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={onLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>
    );
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <Image src="/logo.svg" alt="ЛОГОС" width={120} height={36} priority />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-text-muted md:flex">
          {SECTION_LINKS.map((link) => (
            <Link
              key={link.sectionId}
              href={`/#${link.sectionId}`}
              className="transition-colors hover:text-accent"
              onClick={(event) => handleSectionNavClick(event, link.sectionId)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/status" className="transition-colors hover:text-accent">
            Статус заявки
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">Меню</span>
          {menuOpen ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen ? (
        <nav className="border-t border-border bg-white px-5 py-4 md:hidden">
          <ul className="space-y-1">
            {SECTION_LINKS.map((link) => (
              <li key={link.sectionId}>
                <Link
                  href={`/#${link.sectionId}`}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-text hover:bg-accent-light hover:text-accent"
                  onClick={(event) => handleSectionNavClick(event, link.sectionId, closeMenu)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/status"
                className="block rounded-xl px-3 py-3 text-sm font-medium text-text hover:bg-accent-light hover:text-accent"
                onClick={closeMenu}
              >
                Статус заявки
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
