import {
  PLATFORM_BILLING_ENABLE_INTERACTIVE,
  PLATFORM_BILLING_FRONTEND_SHELL,
} from "@/config/flags";
import { PageHeader } from "@/components/ui/PageHeader";
import { AvailablePlatformPlans } from "../components/AvailablePlatformPlans";
import { CheckoutAvailabilityNotice } from "../components/CheckoutAvailabilityNotice";
import { CurrentPlatformPlanCard } from "../components/CurrentPlatformPlanCard";
import { PlatformBillingErrorState } from "../components/PlatformBillingErrorState";
import { PlatformBillingLoadingState } from "../components/PlatformBillingLoadingState";
import { PlatformBillingRecoveryPanel } from "../components/PlatformBillingRecoveryPanel";
import { PlatformBillingSummaryCard } from "../components/PlatformBillingSummaryCard";
import { PlatformBillingUsageCard } from "../components/PlatformBillingUsageCard";
import { usePlatformBillingCheckoutOptions } from "../hooks/usePlatformBillingCheckoutOptions";
import { usePlatformBillingSummary } from "../hooks/usePlatformBillingSummary";
import {
  useCreatePlatformBillingCheckoutSession,
  usePlatformBillingCheckoutOperation,
} from "../hooks/usePlatformBillingCheckoutSession";
import type { PlatformBillingPlanOption } from "../schemas/platformBillingSchemas";
import { generatePlatformBillingIdempotencyKey } from "../utils/idempotency";
import { useRef, useState } from "react";

export function PlanBillingPage({
  embedded = false,
  checkoutPollingOverride,
}: {
  embedded?: boolean;
  checkoutPollingOverride?: { pollIntervalMs?: number; maxAttempts?: number };
}) {
  const summaryQuery = usePlatformBillingSummary(
    PLATFORM_BILLING_FRONTEND_SHELL,
  );
  const optionsQuery = usePlatformBillingCheckoutOptions(
    PLATFORM_BILLING_FRONTEND_SHELL,
  );

  if (!PLATFORM_BILLING_FRONTEND_SHELL) return null;

  const isInitialLoading =
    (summaryQuery.isLoading || optionsQuery.isLoading) &&
    !summaryQuery.data &&
    !optionsQuery.data;

  return (
    <div className="space-y-6">
      {!embedded && (
        <PageHeader
          title="Doers Plan & Billing"
          category="Organization Settings"
        />
      )}

      {isInitialLoading && <PlatformBillingLoadingState />}

      {summaryQuery.data ? (
        <>
          <PlatformBillingSummaryCard summary={summaryQuery.data} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <PlatformBillingUsageCard usage={summaryQuery.data.usage} />
            <PlatformBillingRecoveryPanel
              actions={summaryQuery.data.access.recovery_actions}
            />
          </div>
        </>
      ) : summaryQuery.isError ? (
        <PlatformBillingErrorState
          title="Account summary unavailable"
          error={summaryQuery.error}
          onRetry={() => void summaryQuery.refetch()}
        />
      ) : null}

      {optionsQuery.data ? (
        <>
          <CurrentPlatformPlanCard
            currentSubscription={optionsQuery.data.current_subscription}
          />
          <AvailablePlatformPlans plans={optionsQuery.data.plans} />
          <CheckoutAvailabilityNotice
            availability={optionsQuery.data.checkout_availability}
          />
          {PLATFORM_BILLING_ENABLE_INTERACTIVE &&
            optionsQuery.data.checkout_availability.available &&
            optionsQuery.data.actions.some(
              (action) =>
                action.action_code === "start_subscription" &&
                action.is_available &&
                action.checkout_supported,
            ) &&
            optionsQuery.data.plans.length > 0 && (
              <div className="space-y-2">
                <StartCheckoutControls
                  plans={optionsQuery.data.plans}
                  pollingOverride={checkoutPollingOverride}
                />
              </div>
            )}
        </>
      ) : optionsQuery.isError ? (
        <PlatformBillingErrorState
          title="Doers plan options unavailable"
          error={optionsQuery.error}
          onRetry={() => void optionsQuery.refetch()}
        />
      ) : !isInitialLoading ? (
        <PlatformBillingLoadingState />
      ) : null}
    </div>
  );
}

function StartCheckoutControls({
  plans,
  pollingOverride,
}: {
  plans: PlatformBillingPlanOption[];
  pollingOverride?: { pollIntervalMs?: number; maxAttempts?: number };
}) {
  const [operationId, setOperationId] = useState<string | null>(null);
  const { start, mutation, clearKey } = useCreatePlatformBillingCheckoutSession();
  const operationQuery = usePlatformBillingCheckoutOperation(
    operationId,
    pollingOverride,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [selectedIntervalIndex, setSelectedIntervalIndex] = useState(0);
  const idempotencyRef = useRef<string | null>(null);

  const getErrorMessage = () => {
    const error = mutation.error as unknown as { kind?: string } | null;
    if (!error) return null;
    if (error.kind === "denied") {
      return "You do not have permission to start checkout.";
    }
    if (error.kind === "rate_limited") {
      return "Checkout request is rate limited. Please try again.";
    }
    if (error.kind === "temporary") {
      return "Checkout request temporarily failed. Please retry.";
    }
    if (error.kind === "validation") {
      return "Checkout request could not be submitted. Please verify your selection and try again.";
    }
    return "Checkout request failed. Please retry.";
  };

  const handleStart = async () => {
    const plan = plans[selectedPlanIndex];
    const price = plan?.prices?.[selectedIntervalIndex];
    if (!plan || !price) return;
    if (!idempotencyRef.current) {
      idempotencyRef.current = generatePlatformBillingIdempotencyKey();
    }
    setIsSubmitting(true);
    try {
      const res = await start(
        { plan_code: plan.plan_code, billing_interval: price.billing_interval },
        idempotencyRef.current!,
      );
      if (res?.operation_id) setOperationId(res.operation_id);
    } catch {
      // swallow; API surfaces map errors to safe messages upstream
    } finally {
      if (idempotencyRef.current) idempotencyRef.current = null;
      setIsSubmitting(false);
    }
  };

  const selectedPlan = plans[selectedPlanIndex];
  const selectedPrice = selectedPlan?.prices[selectedIntervalIndex];
  const hasSelection = Boolean(selectedPlan && selectedPrice);
  const isInFlight = mutation.isPending || operationQuery.isFetching;

  const errorMessage = getErrorMessage();

  return (
    <div>
      <div className="flex items-center gap-3">
        {plans.length > 1 ? (
          <select
            aria-label="Select plan"
            value={selectedPlanIndex}
            onChange={(e) => {
              setSelectedPlanIndex(Number(e.target.value));
              setSelectedIntervalIndex(0);
              clearKey();
            }}
          >
            {plans.map((p, idx) => (
              <option key={p.plan_code} value={idx}>
                {p.display_name}
              </option>
            ))}
          </select>
        ) : null}

        {plans[selectedPlanIndex]?.prices.length > 1 ? (
          <select
            aria-label="Select billing interval"
            value={selectedIntervalIndex}
            onChange={(e) => {
              setSelectedIntervalIndex(Number(e.target.value));
              clearKey();
            }}
          >
            {plans[selectedPlanIndex]?.prices.map((pr, idx) => (
              <option key={`${pr.billing_interval}-${idx}`} value={idx}>
                {pr.billing_interval}
              </option>
            ))}
          </select>
        ) : null}

        <button
          aria-live="polite"
          disabled={!hasSelection || isInFlight || isSubmitting}
          onClick={handleStart}
          className="px-3 py-2 rounded bg-[var(--accent)] text-white"
        >
          Start checkout
        </button>
      </div>

      {errorMessage ? (
        <p className="mt-2 text-sm text-[var(--text-warn)]">
          {errorMessage}
        </p>
      ) : null}
      {mutation.isPending && (
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Checkout request submitted
        </p>
      )}
      {operationQuery.timeoutReached ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Checkout operation is taking longer than expected. Please retry later.
        </p>
      ) : operationQuery.data &&
        ["pending", "in_progress"].includes(
          operationQuery.data.operation_status,
        ) ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Checkout operation pending
        </p>
      ) : operationQuery.data &&
        ["succeeded", "failed"].includes(
          operationQuery.data.operation_status,
        ) ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Checkout operation reached a terminal state
        </p>
      ) : null}
    </div>
  );
}

export default PlanBillingPage;
