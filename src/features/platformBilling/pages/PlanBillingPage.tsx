import {
  PLATFORM_BILLING_ENABLE_FAKE_SIMULATOR,
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
  useCreateFakeCheckoutSimulation,
  useCreatePlatformBillingCheckoutSession,
  usePlatformBillingCheckoutOperation,
} from "../hooks/usePlatformBillingCheckoutSession";
import type {
  FakeCheckoutSimulationOutcome,
  PlatformBillingCheckoutOptions,
  PlatformBillingPlanOption,
} from "../schemas/platformBillingSchemas";
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
                  fakeSimulation={
                    optionsQuery.data.diagnostics.fake_checkout_simulation
                  }
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
  fakeSimulation,
  pollingOverride,
}: {
  plans: PlatformBillingPlanOption[];
  fakeSimulation: PlatformBillingCheckoutOptions["diagnostics"]["fake_checkout_simulation"];
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
  const isTerminalOperation = Boolean(
    operationQuery.data &&
      ["succeeded", "failed"].includes(operationQuery.data.operation_status),
  );
  const canShowFakeSimulator =
    PLATFORM_BILLING_ENABLE_FAKE_SIMULATOR &&
    fakeSimulation.available &&
    fakeSimulation.allowed_outcomes.length > 0 &&
    Boolean(operationId);

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
      ) : isTerminalOperation ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Checkout operation reached a terminal state
        </p>
      ) : null}

      {canShowFakeSimulator ? (
        <DeveloperFakeCheckoutSimulator
          operationId={operationId}
          allowedOutcomes={fakeSimulation.allowed_outcomes}
          onSimulationAccepted={async () => {
            await operationQuery.refetch();
          }}
        />
      ) : null}
    </div>
  );
}

function DeveloperFakeCheckoutSimulator({
  operationId,
  allowedOutcomes,
  onSimulationAccepted,
}: {
  operationId: string | null;
  allowedOutcomes: FakeCheckoutSimulationOutcome[];
  onSimulationAccepted: (outcome: FakeCheckoutSimulationOutcome) => Promise<void>;
}) {
  const { simulate, mutation } = useCreateFakeCheckoutSimulation();
  const [lastOutcome, setLastOutcome] =
    useState<FakeCheckoutSimulationOutcome | null>(null);

  const getErrorMessage = () => {
    const error = mutation.error as unknown as { kind?: string } | null;
    if (!error) return null;
    if (error.kind === "denied") {
      return "You do not have permission to run the simulator.";
    }
    if (error.kind === "rate_limited") {
      return "Simulator request is rate limited. Please try again.";
    }
    if (error.kind === "validation") {
      return "Simulator request could not be submitted. Please retry.";
    }
    return "Simulator request temporarily failed. Please retry.";
  };

  const handleSimulation = async (outcome: FakeCheckoutSimulationOutcome) => {
    if (!operationId) return;
    setLastOutcome(null);
    const response = await simulate({
      checkoutOperationId: operationId,
      requestedOutcome: outcome,
      idempotencyKey: generatePlatformBillingIdempotencyKey(),
    });
    if (response?.outcome_status === "outcome_pending") {
      setLastOutcome("pending");
      await onSimulationAccepted("pending");
    }
    if (response?.outcome_status === "outcome_succeeded") {
      setLastOutcome("succeeded");
      await onSimulationAccepted("succeeded");
    }
    if (response?.outcome_status === "outcome_failed") {
      setLastOutcome("failed");
      await onSimulationAccepted("failed");
    }
  };

  const renderButton = (
    outcome: FakeCheckoutSimulationOutcome,
    label: string,
  ) => (
    <button
      type="button"
      disabled={
        !operationId ||
        mutation.isPending ||
        !allowedOutcomes.includes(outcome)
      }
      onClick={() => void handleSimulation(outcome)}
      className="px-3 py-2 rounded border border-[var(--border)] text-[var(--text)] disabled:opacity-50"
    >
      {label}
    </button>
  );

  return (
    <div className="mt-4 space-y-2 border border-[var(--border)] p-3 rounded">
      <p className="text-sm font-medium text-[var(--text)]">
        Developer checkout simulator
      </p>
      <p className="text-sm text-[var(--text-muted)]">
        Development/test only. The browser requests a fake outcome; the backend remains authoritative.
      </p>
      <div className="flex flex-wrap gap-2">
        {renderButton("pending", "Simulate pending")}
        {renderButton("succeeded", "Simulate success")}
        {renderButton("failed", "Simulate failure")}
      </div>
      {mutation.isPending ? (
        <p className="text-sm text-[var(--text-muted)]">
          Simulator request submitted
        </p>
      ) : lastOutcome ? (
        <p className="text-sm text-[var(--text-muted)]">
          Simulator outcome recorded: {lastOutcome}
        </p>
      ) : getErrorMessage() ? (
        <p className="text-sm text-[var(--text-warn)]">{getErrorMessage()}</p>
      ) : null}
    </div>
  );
}

export default PlanBillingPage;
