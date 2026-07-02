export type {
  PlatformBillingActionOption,
  PlatformBillingCheckoutAvailability,
  PlatformBillingCheckoutOptions,
  PlatformBillingPlanOption,
  PlatformBillingPriceOption,
  PlatformBillingSummary,
} from '../schemas/platformBillingSchemas';

import type { PlatformBillingSummary } from '../schemas/platformBillingSchemas';

export type PlatformAccessMode = PlatformBillingSummary['access']['mode'];
export type PlatformBillingAccessSummary = PlatformBillingSummary['access'];
export type PlatformBillingPlanSummary = PlatformBillingSummary['plan'];
export type PlatformBillingPeriodSummary = PlatformBillingSummary['billing_period'];
export type PlatformBillingEntitlementSummary = PlatformBillingSummary['entitlements'][number];
export type PlatformBillingUsageSummary = PlatformBillingSummary['usage'][number];
