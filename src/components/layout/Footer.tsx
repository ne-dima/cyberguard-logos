export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-muted">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-5 py-8 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} АНО ПО «Технический колледж „ЛОГОС“»</p>
        <p>КиберБезИнтенсив — отбор участников</p>
      </div>
    </footer>
  );
}
