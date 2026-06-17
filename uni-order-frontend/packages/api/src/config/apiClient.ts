import axios from "axios";

const DEFAULT_URL = "http://localhost:8080";

export const apiClient = axios.create({
baseURL: DEFAULT_URL,
headers: {
"Content-Type": "application/json",
},
withCredentials: true,
});

let onUrlChangeCallback: ((newUrl: string) => void) | null = null;

export const _registerUrlChangeListener = (callback: (newUrl: string) => void) => {
onUrlChangeCallback = callback;
};

export const setApiGatewayUrl = (customUrl: string): void => {
if (customUrl) {
apiClient.defaults.baseURL = customUrl;

if (onUrlChangeCallback) {
onUrlChangeCallback(customUrl);
}
}
};

apiClient.interceptors.request.use((requestConfig) => {
if (typeof localStorage !== "undefined") {
const token = localStorage.getItem("accessToken");
if (token) {
requestConfig.headers = requestConfig.headers || {};
(requestConfig.headers as Record<string, string>).Authorization = `Bearer ${token}`;
}
}
return requestConfig;
});

apiClient.interceptors.response.use(
(response) => response,
(error) => {
if (error.response?.status === 401) {
window.location.href = "/login";
}
return Promise.reject(error);
}
);
