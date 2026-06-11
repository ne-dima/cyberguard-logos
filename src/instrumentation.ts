export async function register() {
  if (process.env.NODE_ENV === "production") {
    const { assertProductionRuntime } = await import("@/lib/config/production");
    assertProductionRuntime();
  }
}
