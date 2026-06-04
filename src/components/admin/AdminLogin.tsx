"use client";

import { useState } from "react";
import { USER_MESSAGES } from "@/lib/messages/userMessages";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormField";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Ошибка входа");
      }

      onSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : USER_MESSAGES.adminLoginFailed,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass-card rounded-[20px] p-8">
        <span className="section-label">Админ-панель</span>
        <h1 className="mt-3 font-heading text-2xl font-bold text-text">Вход для администратора</h1>
        <p className="mt-2 text-sm text-text-muted">
          Используйте учётные данные администратора для доступа к заявкам.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <InputField
            id="admin-username"
            label="Логин"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
          <InputField
            id="admin-password"
            label="Пароль"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error ? (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Входим..." : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
}
