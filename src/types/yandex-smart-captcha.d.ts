export {};

declare global {
  interface Window {
    smartCaptcha?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          hl?: string;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => number;
      reset?: (widgetId: number) => void;
      destroy?: (widgetId: number) => void;
      getResponse?: (widgetId: number) => string;
    };
  }
}
