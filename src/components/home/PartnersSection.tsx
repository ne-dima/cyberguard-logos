import Image from "next/image";
import partnersData from "../../../data/partners.json";
import type { Partner } from "@/content/intensive";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const partners = partnersData as Partner[];

function PartnerCard({ partner }: { partner: Partner }) {
  const content = (
    <div className="flex h-full min-h-[140px] flex-col items-center justify-center rounded-[20px] border border-border bg-surface px-6 py-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent/25 hover:shadow-md">
      <div className="flex flex-1 items-center justify-center py-2">
        <Image
          src={partner.logoPath}
          alt=""
          width={280}
          height={56}
          className="h-11 w-auto max-w-[220px] object-contain object-center sm:h-12 sm:max-w-[240px]"
          aria-hidden
        />
      </div>
      <p className="mt-3 text-center text-sm font-semibold leading-snug text-text">{partner.name}</p>
    </div>
  );

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
        aria-label={`Партнёр: ${partner.name}`}
      >
        {content}
      </a>
    );
  }

  return content;
}

export function PartnersSection() {
  return (
    <section id="partners" className="border-t border-border">
      <div className="mx-auto max-w-[1180px] px-5 py-16">
        <ScrollReveal className="max-w-xl">
          <span className="section-label">Партнёры</span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-text">
            Компании-партнёры
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-muted">
            КиберСтраж проходит при поддержке ведущих IT-компаний.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner, index) => (
            <ScrollReveal key={partner.id} delay={index * 70}>
              <PartnerCard partner={partner} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
