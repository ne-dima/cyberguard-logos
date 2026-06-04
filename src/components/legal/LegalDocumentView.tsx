import type { LegalDocument } from "@/content/legal/types";

interface LegalDocumentViewProps {
  document: LegalDocument;
}

export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  return (
    <article className="glass-card rounded-[20px] p-6 sm:p-10">
      <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
        {document.title}
      </h1>

      {document.intro ? (
        <p className="mt-4 text-base leading-relaxed text-text-muted">{document.intro}</p>
      ) : null}

      <div className="mt-8 space-y-6">
        {document.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-heading text-lg font-bold text-text">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-2 text-base leading-relaxed text-text-muted">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      {document.footer ? (
        <p className="mt-8 rounded-xl border border-border bg-bg-muted/60 px-4 py-3 text-sm leading-relaxed text-text-muted">
          {document.footer}
        </p>
      ) : null}
    </article>
  );
}
