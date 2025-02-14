import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";

import { t } from "@/locales/i18n";
import userStore from "@/store/userStore";

import { toast } from "sonner";
import type { Result } from "#/api";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

const getAuthToken = () => {
	const token = localStorage.getItem("token");
	if (!token) {
		return null;
	}
	return token;
};

// Token'ı header'a ekleyerek istek yapma işlemi
axiosInstance.interceptors.request.use(
	(config) => {
		// LocalStorage'dan token alınıyor
		const token = getAuthToken();
		if (token) {
			// Eğer token varsa, Authorization header'ına ekleniyor
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	// (res: AxiosResponse<Result>) => {
	// 	if (!res.data) throw new Error(t("sys.api.apiRequestFailed"));

	// 	const { status, data, message } = res.data;
	// 	console.log("res", res);

	// 	const hasSuccess = res.data && res.status === 200;
	// 	if (hasSuccess) {
	// 		return data;
	// 	}

	// 	throw new Error(message || t("sys.api.apiRequestFailed"));
	// },
	(response) => {
		return response.data;
	},
	(error: AxiosError<Result>) => {
		const { response, message } = error || {};

		if (error.response && (error.response.status === 401 || error.response.status === 403)) {
			userStore.getState().actions.clearUserInfoAndToken();
			// window.location.href = "/logout";
		} else {
			const errMsg = response?.data?.message || message || t("sys.api.errorMessage");
			toast.error(errMsg, {
				position: "top-center",
			});
		}
		return Promise.reject(error);
	},
);

class APIClient {
	get<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "GET" });
	}

	post<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "POST" });
	}

	put<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "PUT" });
	}

	delete<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "DELETE" });
	}

	request<T = any>(config: AxiosRequestConfig): Promise<T> {
		return new Promise((resolve, reject) => {
			axiosInstance
				.request<any, AxiosResponse<Result>>(config)
				.then((res: AxiosResponse<Result>) => {
					resolve(res as unknown as Promise<T>);
				})
				.catch((e: Error | AxiosError) => {
					reject(e);
				});
		});
	}
}
export default new APIClient();
