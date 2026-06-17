import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { subscriptionApiClient } from "@uniorder/api";
import type { MerchantSubscriptionDTO } from "@uniorder/api";
import { PATHS } from "../../../routes/paths";

export const MerchantHome = () => {
const [subscriptions, setSubscriptions] = useState<MerchantSubscriptionDTO[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const load = async () => {
try {
const response = await subscriptionApiClient.getMySubscriptions();
setSubscriptions(response.data || []);
} catch (error) {
console.error(error);
toast.error("Không tải được danh sách nhà hàng");
} finally {
setLoading(false);
}
};

load();
}, []);

const activeCount = useMemo(() => subscriptions.filter((item) => item.active).length, [subscriptions]);

return (
<div className="min-h-screen bg-bg-main p-6 sm:p-10">
<div className="mx-auto max-w-6xl space-y-6">
<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
<div>
<p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">UniOrder Merchant</p>
<h1 className="text-3xl font-black text-slate-900">Quản lý nhà hàng và subscription</h1>
<p className="mt-2 text-sm text-slate-500">Tổng số nhà hàng: {subscriptions.length} • Gói còn hiệu lực: {activeCount}</p>
</div>
<Link to={PATHS.SUBSCRIPTIONS} className="inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark">
Quản lý thanh toán
</Link>
</div>

{loading ? (
<div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Đang tải dữ liệu...</div>
) : subscriptions.length === 0 ? (
<div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
Bạn chưa có nhà hàng nào. Hãy tạo nhà hàng trước rồi mới đăng ký gói subscription.
</div>
) : (
<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
{subscriptions.map((item) => (
<div key={item.restaurantId} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
<div className="flex items-start justify-between gap-4">
<div>
<h2 className="text-lg font-bold text-slate-900">{item.restaurantName}</h2>
<p className="text-sm text-slate-500">{item.restaurantStatus}</p>
</div>
<span className={`rounded-full px-3 py-1 text-xs font-bold ${item.active ? 'bg-emerald-100 text-emerald-700' : item.status === 'PENDING_PAYMENT' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
{item.status}
</span>
</div>

<div className="mt-4 space-y-2 text-sm text-slate-600">
<p><span className="font-semibold text-slate-900">Gói:</span> {item.planName || 'Chưa có gói'}</p>
<p><span className="font-semibold text-slate-900">Hết hạn:</span> {item.expiresAt || 'Chưa xác định'}</p>
<p><span className="font-semibold text-slate-900">Ngày còn lại:</span> {item.daysRemaining ?? '-'}</p>
</div>

<div className="mt-6 flex gap-3">
<Link to={`${PATHS.SUBSCRIPTIONS}?restaurantId=${item.restaurantId}`} className="inline-flex flex-1 items-center justify-center rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark">
Thanh toán
</Link>
</div>
</div>
))}
</div>
)}
</div>
</div>
);
};
