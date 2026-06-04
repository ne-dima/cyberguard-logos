"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AboutSection } from "@/components/home/AboutSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { GuestsSection } from "@/components/home/GuestsSection";
import { Hero } from "@/components/home/Hero";
import { PartnersSection } from "@/components/home/PartnersSection";
import { ProgramSection } from "@/components/home/ProgramSection";
import { SurveyWizard } from "@/components/survey/SurveyWizard";
import { SurveyProvider, useSurveyContext } from "@/context/SurveyContext";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { scrollToSection } from "@/lib/navigation/smoothScroll";

function HomePageContent() {
  const { openSurvey } = useSurveyContext();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      return;
    }

    const timer = window.setTimeout(() => {
      scrollToSection(hash);
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  function handleStartSurvey() {
    openSurvey();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero onStartSurvey={handleStartSurvey} />

        <AboutSection />

        <ProgramSection />
        <PartnersSection />
        <GuestsSection />

        <section className="mx-auto max-w-[1180px] px-5 py-12 sm:py-16">
          <ScrollReveal>
            <div className="cta-banner rounded-[20px] p-6 text-white sm:rounded-[28px] sm:p-10">
              <div className="relative z-10 max-w-xl">
                <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                  Готов проверить, подходишь ли ты?
                </h2>
                <p className="mt-3 text-sm leading-relaxed opacity-90 sm:text-base">
                  Опрос займёт пару минут. Ответы сохраняются, можно вернуться позже.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button size="lg" variant="inverse" onClick={handleStartSurvey}>
                    Пройти опрос
                  </Button>
                </div>
              </div>
              <Image
                src="/images/bot.png"
                alt=""
                width={520}
                height={293}
                aria-hidden
                className="pointer-events-none absolute -bottom-2 right-0 hidden h-44 w-auto sm:block lg:h-56 xl:h-64"
              />
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
      <SurveyWizard />
    </>
  );
}

export function HomePageClient() {
  return (
    <SurveyProvider>
      <HomePageContent />
    </SurveyProvider>
  );
}
