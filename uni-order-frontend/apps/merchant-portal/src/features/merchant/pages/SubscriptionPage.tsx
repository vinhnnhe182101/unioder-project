import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { subscriptionApiClient } from "@uniorder/api";
import type { MerchantSubscriptionDTO, SubscriptionCheckoutResponse, SubscriptionPlanDTO } from "@uniorder/api";
import { PATHS } from "../../../routes/paths";

export const SubscriptionPage = () => {
const [searchParams, setSearchParams] = useSearchParams();
const [subscriptions, setSubscriptions] = useState<MerchantSubscriptionDTO[]>([]);
const [plans, setPlans] = useState<SubscriptionPlanDTO[]>([]);
const [loading, setLoading] = useState(true);
const [actionLoading, setActionLoading] = useState(false);
const [checkoutResult, setCheckoutResult] = useState<SubscriptionCheckoutResponse | null>(null);
const [selectedPlanCode, setSelectedPlanCode] = useState<string>("");

const selectedRestaurantId = useMemo(() => {
const queryId = Number(searchParams.get("restaurantId") || 0);
if (queryId) {
return queryId;
}
return subscriptions[0]?.restaurantId || 0;
}, [searchParams, subscriptions]);

const selectedSubscription = subscriptions.find((item) => item.restaurantId === selectedRestaurantId) || subscriptions[0] || null;

useEffect(() => {
const load = async () => {
setLoading(true);
try {
const [subscriptionsResponse, plansResponse] = await Promise.all([
subscriptionApiClient.getMySubscriptions(),
subscriptionApiClient.getPlans(),
]);
setSubscriptions(subscriptionsResponse.data || []);
setPlans(plansResponse.data || []);
setSelectedPlanCode((current) => current || plansResponse.data?.[0]?.code || "");
if (!searchParams.get("restaurantId") && subscriptionsResponse.data?.[0]?.restaurantId) {
setSearchParams({ restaurantId: String(subscriptionsResponse.data[0].restaurantId) }, { replace: true });
}
} catch (error) {
console.error(error);
toast.error("Không tải được dữ liệu subscription");
} finally {
setLoading(false);
}
};

load();
}, []);

useEffect(() => {
if (plans.length > 0 && !selectedPlanCode) {
setSelectedPlanCode(plans[0].code);
}
}, [plans, selectedPlanCode]);

const refresh = async () => {
const response = await subscriptionApiClient.getMySubscriptions();
setSubscriptions(response.data || []);
};

const handleCheckout = async () => {
if (!selectedRestaurantId) {
toast.error("Chưa có nhà hàng để thanh toán");
return;
}
if (!selectedPlanCode) {
toast.error("Vui lòng chọn gói subscription");
return;
}

setActionLoading(true);
try {
const response = await subscriptionApiClient.checkout(selectedRestaurantId, { planCode: selectedPlanCode });
setCheckoutResult(response.data);
toast.success("Đã tạo mã thanh toán subscription");
await refresh();
} catch (error: any) {
console.error(error);
toast.error(error?.response?.data?.message || "Không thể tạo checkout");
} finally {
setActionLoading(false);
}
};

const handleActivate = async () => {
if (!selectedRestaurantId) {
return;
}
setActionLoading(true);
try {
await subscriptionApiClient.activate(selectedRestaurantId);
toast.success("Subscription đã được kích hoạt");
setCheckoutResult(null);
await refresh();
} catch (error: any) {
console.error(error);
toast.error(error?.response?.data?.message || "Không thể kích hoạt subscription");
} finally {
setActionLoading(false);
}
};

return (
<div className="min-h-screen bg-bg-main p-6 sm:p-10">
<div className="mx-auto max-w-7xl space-y-6">
<div className="flex items-center justify-between gap-4">
<div>
<p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">UniOrder Billing</p>
<h1 className="text-3xl font-black text-slate-900">Thanh toán và subscription</h1>
</div>
<Link to={PATHS.MERCHANT_HOME} className="text-sm font-bold text-brand hover:underline">Quay lại dashboard</Link>
</div>

{loading ? (
<div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Đang tải dữ liệu...</div>
) : (
<div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
<h2 className="text-lg font-bold text-slate-900">Nhà hàng của bạn</h2>
<div className="mt-4 grid gap-4">
{subscriptions.map((item) => (
<button
key={item.restaurantId}
type="button"
onClick={() => setSearchParams({ restaurantId: String(item.restaurantId) })}
className={`rounded-2xl border p-4 text-left transition ${selectedRestaurantId === item.restaurantId ? 'border-brand bg-brand/5' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}
>
<div className="flex items-center justify-between gap-3">
<div>
<p className="font-bold text-slate-900">{item.restaurantName}</p>
<p className="text-sm text-slate-500">{item.restaurantStatus}</p>
</div>
<span className={`rounded-full px-3 py-1 text-xs font-bold ${item.active ? 'bg-emerald-100 text-emerald-700' : item.status === 'PENDING_PAYMENT' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{item.status}</span>
</div>
<p className="mt-2 text-sm text-slate-600">{item.planName || 'Chưa có gói'}</p>
</button>
))}
</div>
</div>

<div className="space-y-6">
<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
<h2 className="text-lg font-bold text-slate-900">Chọn gói</h2>
<p className="mt-1 text-sm text-slate-500">{selectedSubscription ? selectedSubscription.restaurantName : 'Chọn một nhà hàng'}</p>
<div className="mt-4 grid gap-3">
{plans.map((plan) => (
<button
key={plan.code}
type="button"
onClick={() => setSelectedPlanCode(plan.code)}
className={`rounded-2xl border p-4 text-left transition ${selectedPlanCode === plan.code ? 'border-brand bg-brand/5' : 'border-slate-200 hover:bg-slate-50'}`}
>
<div className="flex items-start justify-between gap-3">
<div>
<p className="font-bold text-slate-900">{plan.name}</p>
<p className="text-sm text-slate-500">{plan.description}</p>
</div>
<span className="text-sm font-black text-brand">{plan.amount.toLocaleString('vi-VN')} đ</span>
</div>
</button>
))}
</div>

<div className="mt-5 flex gap-3">
<button type="button" onClick={handleCheckout} disabled={actionLoading} className="flex-1 rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
Tạo mã thanh toán
</button>
<button type="button" onClick={handleActivate} disabled={actionLoading || !checkoutResult} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-60">
Đã chuyển khoản
</button>
</div>
</div>

{checkoutResult && (
<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
<h2 className="text-lg font-bold text-slate-900">Thông tin thanh toán</h2>
<p className="mt-2 text-sm text-slate-500">{checkoutResult.paymentNote}</p>
<div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr]">
<img src={checkoutResult.qrUrl} alt="QR thanh toán" className="w-full rounded-2xl border border-slate-200 bg-white p-2" />
<div className="space-y-2 text-sm text-slate-600">
<p><span className="font-semibold text-slate-900">Mã tham chiếu:</span> {checkoutResult.paymentReference}</p>
<p><span className="font-semibold text-slate-900">Gói:</span> {checkoutResult.planName}</p>
<p><span className="font-semibold text-slate-900">Số tiền:</span> {checkoutResult.amount.toLocaleString('vi-VN')} đ</p>
<p><span className="font-semibold text-slate-900">Trạng thái:</span> {checkoutResult.status}</p>
</div>
</div>
</div>
)}
</div>
</div>
)}
</div>
</div>
);
};
