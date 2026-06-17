export interface SubscriptionPlanDTO {
code: string;
name: string;
description: string;
amount: number;
durationDays: number;
features: string[];
}

export interface SubscriptionCheckoutRequest {
planCode: string;
}

export interface SubscriptionCheckoutResponse {
restaurantId: number;
restaurantName: string;
planCode: string;
planName: string;
amount: number;
status: string;
paymentReference: string;
qrUrl: string;
paymentNote: string;
}

export interface MerchantSubscriptionDTO {
restaurantId: number;
restaurantName: string;
restaurantStatus: string;
planCode?: string;
planName?: string;
amount?: number;
durationDays?: number;
status: string;
paymentReference?: string;
qrUrl?: string;
startsAt?: string;
expiresAt?: string;
daysRemaining?: number;
active?: boolean;
}
