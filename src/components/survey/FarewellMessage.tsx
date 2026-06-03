"use client";

import { Button } from "@/components/ui/Button";
import { FAREWELL_MESSAGES } from "@/lib/survey/constants";
import type { FarewellKey } from "@/lib/survey/types";

interface FarewellMessageProps {
  farewell: FarewellKey;
  onClose: () => void;
}

export function FarewellMessage({ farewell, onClose }: FarewellMessageProps) {
  return (
    <div className="glass-card rounded-[20px] p-6 text-center sm:p-8">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-light text-2xl">
        👋
      </div>
      <h2 className="font-heading text-xl font-bold text-text sm:text-2xl">
        {FAREWELL_MESSAGES[farewell]}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        Спасибо, что заглянул! Следи за новостями колледжа «ЛОГОС» — возможно, увидимся в другой раз.
      </p>
      <Button className="mt-6" fullWidth onClick={onClose}>
        Закрыть
      </Button>
    </div>
  );
}
