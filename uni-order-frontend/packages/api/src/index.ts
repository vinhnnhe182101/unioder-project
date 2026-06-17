import {_registerUrlChangeListener, apiClient, setApiGatewayUrl} from "./config/apiClient";
import type {AxiosResponse} from "axios";
import type {
	MerchantSubscriptionDTO,
	SubscriptionCheckoutRequest,
	SubscriptionCheckoutResponse,
	SubscriptionPlanDTO,
} from "./subscription-types";

import * as generated from './generated/user-service-api';

type MerchantAuthClient = {
	login: (payload: unknown) => Promise<any>;
	forgotPassword: (payload: unknown) => Promise<any>;
	resetPassword: (payload: unknown) => Promise<any>;
	refreshToken: (payload: unknown) => Promise<any>;
	registerMerchant: (payload: unknown) => Promise<AxiosResponse<unknown>>;
};

let apiConfig: any = null;
export let authApiClient: MerchantAuthClient = Object.assign(
	new generated.AuthControllerApi(
		new generated.Configuration({basePath: apiClient.defaults.baseURL}),
		apiClient.defaults.baseURL,
		apiClient
	),
	{
		registerMerchant: (payload: unknown) => apiClient.post('/api/auth/register/merchant', payload),
	}
);

export const subscriptionApiClient = {
	getPlans: () => apiClient.get<SubscriptionPlanDTO[]>("/api/catalog/subscriptions/plans"),
	getMySubscriptions: () => apiClient.get<MerchantSubscriptionDTO[]>("/api/catalog/subscriptions/me"),
	checkout: (restaurantId: number, payload: SubscriptionCheckoutRequest) =>
		apiClient.post<SubscriptionCheckoutResponse>(`/api/catalog/subscriptions/restaurants/${restaurantId}/checkout`, payload),
	activate: (restaurantId: number) =>
		apiClient.post<MerchantSubscriptionDTO>(`/api/catalog/subscriptions/restaurants/${restaurantId}/activate`),
};

_registerUrlChangeListener((newUrl) => {
	apiConfig = new generated.Configuration({
		basePath: newUrl,
	});

	authApiClient = Object.assign(
		new generated.AuthControllerApi(
			apiConfig,
			newUrl,
			apiClient
		),
		{
			registerMerchant: (payload: unknown) => apiClient.post('/api/auth/register/merchant', payload),
		}
	);

	console.log("⚙️ Package API: Đã đồng bộ cấu hình SDK mới thành công với URL:", newUrl);
});

export * from "./generated-types";
export * from "./types";
export * from "./subscription-types";
export {apiClient, setApiGatewayUrl};
