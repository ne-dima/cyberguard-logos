import Link from "next/link";

const LEGAL_LINKS = [
  { href: "/personal-data-consent", label: "Согласие на обработку ПДн" },
  { href: "/privacy-policy", label: "Политика конфиденциальности" },
  { href: "/photo-consent", label: "Согласие на фото" },
  { href: "/parent-consent", label: "Согласие представителя" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-muted">
      <div className="mx-auto max-w-[1180px] px-5 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-text-muted">
              © {new Date().getFullYear()} АНО ПО &quot;Технический колледж&quot;
            </p>
            <p className="mt-1 text-sm text-text-muted">КиберСтраж: отбор участников</p>
          </div>

          <nav aria-label="Юридические документы">
            <ul className="flex flex-col gap-2 text-sm">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-accent hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}