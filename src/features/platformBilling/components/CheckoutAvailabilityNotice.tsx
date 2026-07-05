import { AlertCircle, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { PlatformBillingCheckoutAvailability } from "../types";

const SAFE_REASON_COPY: Partial<
  Record<
    NonNullable<PlatformBillingCheckoutAvailability["reason_code"]>,
    string
  >
> = {
  ACTION_NOT_PERMITTED:
    "You do not have permission to start a Doers platform subscription.",
  CHECKOUT_FEATURE_DISABLED:
    "Platform Billing checkout is not currently available.",
  ENVIRONMENT_DENIED:
    "Platform Billing checkout is not available in this environment.",
  PROVIDER_MODE_UNAVAILABLE: "Platform Billing checkout is not ready yet.",
  PROVIDER_CUSTOMER_MISSING:
    "Platform Billing checkout is not ready for this organization.",
  CURRENT_SUBSCRIPTION_EXISTS:
    "A current Doers platform subscription already exists.",
  ACTIVE_SUBSCRIPTION_EXISTS:
    "An active Doers platform subscription already exists.",
  TRIAL_SUBSCRIPTION_EXISTS:
    "A trial Doers platform subscription already exists.",
  CANCELLATION_SCHEDULED:
    "A Doers platform subscription cancellation is already scheduled.",
  NO_AVAILABLE_PLANS: "No Doers platform plans are currently available.",
  CATALOG_TERMS_UNAVAILABLE:
    "Doers platform catalog terms are not currently available.",
  CATALOG_PRICE_AMBIGUOUS:
    "Doers platform prices are not currently unambiguous.",
};

export function CheckoutAvailabilityNotice({
  availability,
}: {
  availability: PlatformBillingCheckoutAvailability;
}) {
  const message = availability.available
    ? "A subscription checkout option is available."
    : (SAFE_REASON_COPY[availability.reason_code ?? "NO_AVAILABLE_PLANS"] ??
      availability.message);
  const Icon = availability.available ? Info : AlertCircle;

  return (
    <Card className="space-y-2" role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        <Icon
          size={18}
          className={
            availability.available
              ? "text-[var(--accent)] mt-0.5"
              : "text-[var(--red)] mt-0.5"
          }
        />
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
            {availability.available
              ? "Checkout option available"
              : "Checkout is currently unavailable"}
          </h2>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            {message}
          </p>
          {availability.available && (
            <p className="mt-2 text-[12px] text-[var(--text-muted)]">
              Start checkout is available in interactive phases.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
