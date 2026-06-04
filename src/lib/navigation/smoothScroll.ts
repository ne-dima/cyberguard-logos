import type { MouseEvent } from "react";

const HEADER_OFFSET = 88;

export function scrollToSection(sectionId: string, behavior: ScrollBehavior = "smooth"): void {
  const element = document.getElementById(sectionId);
  if (!element) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : behavior,
    block: "start",
  });
}

export function handleSectionNavClick(
  event: MouseEvent<HTMLAnchorElement>,
  sectionId: string,
  onNavigate?: () => void,
): void {
  onNavigate?.();

  if (window.location.pathname !== "/") {
    return;
  }

  event.preventDefault();
  scrollToSection(sectionId);
}

export { HEADER_OFFSET };
