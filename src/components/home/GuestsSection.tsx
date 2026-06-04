"use client";

import Image from "next/image";
import { useState } from "react";
import guestsData from "../../../data/guests.json";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export interface Guest {
  id: string;
  name: string;
  role: string;
  photoPath: string;
}

const guests = guestsData as Guest[];

function GuestInitials({ name }: { name: string }) {
  const parts = name.split(/\s+/).filter(Boolean);
  const initials =
    parts.length >= 2
      ? `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
      : (parts[0]?.slice(0, 2) ?? "?").toUpperCase();

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-light to-accent/20 font-heading text-3xl font-bold text-accent sm:text-4xl">
      {initials}
    </div>
  );
}

function GuestPhoto({ guest }: { guest: Guest }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <GuestInitials name={guest.name} />;
  }

  return (
    <Image
      src={guest.photoPath}
      alt={guest.name}
      fill
      sizes="(max-width: 640px) 220px, 280px"
      className="object-cover object-center"
      onError={() => setHasError(true)}
    />
  );
}

function GuestCard({ guest }: { guest: Guest }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-md">
      <div className="bg-gradient-to-b from-accent-light/70 to-transparent px-6 pt-8 pb-2 sm:px-8 sm:pt-10">
        <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full border-[5px] border-surface shadow-lg ring-[3px] ring-accent/20 sm:h-56 sm:w-56 lg:h-60 lg:w-60">
          <GuestPhoto guest={guest} />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-7 pt-4 text-center sm:px-6">
        <h3 className="font-heading text-lg font-bold leading-snug text-text">{guest.name}</h3>
        {guest.role ? (
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{guest.role}</p>
        ) : null}
      </div>
    </article>
  );
}

export function GuestsSection() {
  return (
    <section id="guests" className="border-t border-border bg-bg-muted">
      <div className="mx-auto max-w-[1180px] px-5 py-16">
        <ScrollReveal className="max-w-xl">
          <span className="section-label">Спикеры</span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-text">
            Важные гости
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-muted">
            Эксперты из индустрии и госсектора — лекции, мастер-классы и ответы на вопросы
            участников КиберСтража.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guests.map((guest, index) => (
            <ScrollReveal key={guest.id} delay={index * 80}>
              <GuestCard guest={guest} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
