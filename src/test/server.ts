import { setupServer } from 'msw/node';
import { platformBillingHandlers } from './handlers/platformBillingHandlers';

export const server = setupServer(...platformBillingHandlers);
