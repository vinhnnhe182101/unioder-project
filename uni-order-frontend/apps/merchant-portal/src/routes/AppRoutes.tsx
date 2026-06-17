import {Navigate, Route, Routes} from "react-router-dom";
import {PATHS} from "./paths";
import {RegisterPage} from "../features/auth/pages/RegisterPage";
import {LoginPage} from "../features/auth/pages/LoginPage";
import {ForgotPasswordPage} from "../features/auth/pages/ForgotPasswordPage";
import {MerchantHome} from "../features/merchant/pages/MerchantHome";
import {SubscriptionPage} from "../features/merchant/pages/SubscriptionPage";

export const AppRoutes = () => {
return (
<Routes>
<Route path="/" element={<Navigate to={PATHS.LOGIN} replace/>}/>

<Route path={PATHS.LOGIN} element={<LoginPage/>}/>
<Route path={PATHS.REGISTER} element={<RegisterPage/>}/>
<Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage/>}/>
<Route path={PATHS.RESET_PASSWORD} element={<ForgotPasswordPage/>}/>
<Route path={PATHS.MERCHANT_HOME} element={<MerchantHome/>}/>
<Route path={PATHS.SUBSCRIPTIONS} element={<SubscriptionPage/>}/>

<Route path={PATHS.NOT_FOUND} element={<Navigate to={PATHS.LOGIN} replace/>}/>
</Routes>
);
};
