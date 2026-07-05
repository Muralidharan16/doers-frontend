import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderOptions & { route?: string; queryClient?: QueryClient } = {}
) {
  const {
    route = '/settings/plan-billing',
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = options;

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </QueryClientProvider>,
      renderOptions
    ),
  };
}
