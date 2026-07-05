export function generatePlatformBillingIdempotencyKey(): string {
  // Produce a safe idempotency key matching backend constraints: 16-160 chars, [A-Za-z0-9_-]
  const prefix = "pb_";
  const uuid =
    typeof globalThis?.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  // ensure only allowed chars and reasonable length
  const key = `${prefix}${uuid}`.slice(0, 60).replace(/[^A-Za-z0-9_-]/g, "_");
  if (key.length < 16) {
    return (key + "0".repeat(16)).slice(0, 16);
  }
  return key;
}
