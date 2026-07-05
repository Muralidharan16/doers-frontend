import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  createFakeCheckoutSimulation,
  createPlatformBillingCheckoutSession,
  fetchFakeCheckoutSimulation,
  fetchPlatformBillingCheckoutOperation,
} from "../api/platformBillingApi";
import type {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  CreateFakeCheckoutSimulationRequest,
  FakeCheckoutSimulationOutcome,
  FakeCheckoutSimulationResponse,
  GetCheckoutOperationResponse,
} from "../schemas/platformBillingSchemas";

const TERMINAL_OPERATION_STATUSES = new Set(["succeeded", "failed"]);
const POLLING_OPERATION_STATUSES = new Set(["pending", "in_progress"]);

export function useCreatePlatformBillingCheckoutSession() {
  const idempotencyRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);

  const mutation = useMutation<
    CreateCheckoutSessionResponse,
    Error,
    { payload: CreateCheckoutSessionRequest; idempotencyKey: string }
  >({
    mutationFn: async ({ payload, idempotencyKey }) => {
      return createPlatformBillingCheckoutSession(payload, idempotencyKey);
    },
  });

  const start = async (
    payload: CreateCheckoutSessionRequest,
    idempotencyKey: string,
  ) => {
    if (!idempotencyRef.current) idempotencyRef.current = idempotencyKey;
    if (inFlightRef.current) return undefined;
    inFlightRef.current = true;
    try {
      return await mutation.mutateAsync({
        payload,
        idempotencyKey: idempotencyRef.current,
      });
    } finally {
      inFlightRef.current = false;
    }
  };

  const clearKey = () => {
    idempotencyRef.current = null;
  };

  return { start, mutation, clearKey };
}

export function useCreateFakeCheckoutSimulation() {
  const queryClient = useQueryClient();
  const inFlightRef = useRef(false);

  const mutation = useMutation<
    FakeCheckoutSimulationResponse,
    Error,
    {
      checkoutOperationId: string;
      requestedOutcome: FakeCheckoutSimulationOutcome;
      idempotencyKey: string;
    }
  >({
    mutationFn: async ({
      checkoutOperationId,
      requestedOutcome,
      idempotencyKey,
    }) => {
      const payload: CreateFakeCheckoutSimulationRequest = {
        checkout_operation_id: checkoutOperationId,
        requested_outcome: requestedOutcome,
      };
      return createFakeCheckoutSimulation(payload, idempotencyKey);
    },
    onSuccess: (response) => {
      const operationQueryKey = [
        "platform-billing",
        "checkout-operation",
        response.checkout_operation_id,
      ];
      void queryClient.invalidateQueries({ queryKey: operationQueryKey });
      void queryClient.refetchQueries({ queryKey: operationQueryKey });
      if (
        response.outcome_status === "outcome_succeeded" ||
        response.outcome_status === "outcome_failed"
      ) {
        void queryClient.invalidateQueries({ queryKey: ["platform-billing", "summary"] });
        void queryClient.invalidateQueries({
          queryKey: ["platform-billing", "checkout-options"],
        });
      }
    },
  });

  const simulate = async (variables: {
    checkoutOperationId: string;
    requestedOutcome: FakeCheckoutSimulationOutcome;
    idempotencyKey: string;
  }) => {
    if (inFlightRef.current) return undefined;
    inFlightRef.current = true;
    try {
      return await mutation.mutateAsync(variables);
    } finally {
      inFlightRef.current = false;
    }
  };

  return { simulate, mutation };
}

export function useFakeCheckoutSimulation(
  simulationOperationId: string | null,
) {
  return useQuery({
    queryKey: [
      "platform-billing",
      "fake-checkout-simulation",
      simulationOperationId,
    ],
    queryFn: ({ signal }: { signal?: AbortSignal }) =>
      fetchFakeCheckoutSimulation(simulationOperationId as string, signal),
    enabled: Boolean(simulationOperationId),
    retry: false,
  });
}

export function usePlatformBillingCheckoutOperation(
  operationId: string | null,
  opts?: { pollIntervalMs?: number; maxAttempts?: number },
) {
  const queryClient = useQueryClient();
  const attemptsRef = useRef(0);
  const invalidatedOperationRef = useRef<string | null>(null);
  const [timedOutOperationId, setTimedOutOperationId] = useState<string | null>(null);
  const { pollIntervalMs = 2000, maxAttempts = 30 } = opts ?? {};

  useEffect(() => {
    attemptsRef.current = 0;
    invalidatedOperationRef.current = null;
  }, [operationId, maxAttempts]);

  const options = {
    queryKey: ["platform-billing", "checkout-operation", operationId],
    queryFn: ({ signal }: { signal?: AbortSignal }) =>
      fetchPlatformBillingCheckoutOperation(operationId as string, signal),
    enabled: Boolean(operationId),
    retry: false,
    refetchInterval: (query) => {
      const data = query.state.data as GetCheckoutOperationResponse | undefined;
      const status = data?.operation_status;
      if (!status || !POLLING_OPERATION_STATUSES.has(status)) return false;
      attemptsRef.current += 1;
      if (attemptsRef.current > maxAttempts) {
        setTimedOutOperationId(operationId);
        return false;
      }
      return pollIntervalMs;
    },
  } satisfies UseQueryOptions<
    GetCheckoutOperationResponse,
    Error,
    GetCheckoutOperationResponse,
    readonly unknown[]
  >;

  const query = useQuery(options);

  useEffect(() => {
    const data = query.data;
    if (!data || !TERMINAL_OPERATION_STATUSES.has(data.operation_status)) return;
    if (invalidatedOperationRef.current === data.operation_id) return;

    invalidatedOperationRef.current = data.operation_id;
    attemptsRef.current = 0;
    setTimedOutOperationId(null);
    void queryClient.invalidateQueries({ queryKey: ["platform-billing", "summary"] });
    void queryClient.invalidateQueries({
      queryKey: ["platform-billing", "checkout-options"],
    });
  }, [query.data, queryClient]);

  useEffect(() => {
    if (query.isError) {
      attemptsRef.current = 0;
    }
  }, [query.isError]);

  return { ...query, timeoutReached: timedOutOperationId === operationId };
}
