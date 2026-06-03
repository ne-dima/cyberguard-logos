"use client";

import { Button } from "@/components/ui/Button";

interface RegistrationFormStubProps {
  onClose: () => void;
}

export function RegistrationFormStub({ onClose }: RegistrationFormStubProps) {
  return (
    <div className="glass-card rounded-[20px] p-6 sm:p-8">
      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Отлично!
      </span>
      <h2 className="mt-4 font-heading text-xl font-bold text-text sm:text-2xl">
        Ты прошёл отбор — пора подать заявку!
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        Форма регистрации будет доступна на следующем этапе разработки. Здесь ты сможешь
        указать ФИО, контакты, мотивационное письмо и загрузить фото.
      </p>
      <Button className="mt-6" fullWidth onClick={onClose}>
        Понятно, жду форму!
      </Button>
    </div>
  );
}
