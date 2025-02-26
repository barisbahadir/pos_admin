import { notifyError, notifySuccess } from "@/utils/api-utils";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Context tipi
type MutationContext = {
	loadingToastId: ReturnType<typeof toast.loading>;
};

// Genel bir mutation hook'u
export const useCustomMutation = <TData = unknown, TError = unknown, TVariables = void>(
	mutationFn: (variables: TVariables) => Promise<TData>,
	options?: Omit<UseMutationOptions<TData, TError, TVariables, MutationContext>, "mutationFn"> & {
		showToast?: boolean;
	},
) => {
	const { t } = useTranslation();

	return useMutation<TData, TError, TVariables, MutationContext>({
		mutationFn,
		onMutate: () => {
			if (options?.showToast) {
				// Loading toast aç ve ID'yi kaydet
				const loadingToastId = toast.loading(t("sys.api.data_loading"));
				return { loadingToastId }; // TypeScript artık bunun MutationContext olduğunu biliyor
			}
		},
		onSuccess: (data, variables, context) => {
			if (options?.showToast) {
				if (context?.loadingToastId) {
					toast.dismiss(context.loadingToastId); // Loading tostu kapat
				}
				notifySuccess(t("sys.api.data_load_success"));
				// notificationSuccess(t("sys.api.data_load_success"));
			}
			options?.onSuccess?.(data, variables, context);
		},
		onError: (error: any, variables, context) => {
			if (options?.showToast) {
				if (context?.loadingToastId) {
					toast.dismiss(context.loadingToastId); // Loading tostu kapat
				}
				notifyError(
					error?.response?.data?.message || t("sys.api.data_load_error"),
					error?.response?.data?.detailedMessage || "",
				);
				// notificationError(error?.response?.data?.message || t("sys.api.data_load_error"), error?.response?.data?.detailedMessage || "");
			}

			options?.onError?.(error, variables, context);
		},
		onSettled: (data, error, variables, context) => {
			if (options?.showToast) {
				if (context?.loadingToastId) {
					toast.dismiss(context.loadingToastId); // Loading tostu kapat
				}
			}
			options?.onSettled?.(data, error, variables, context); // Eğer onSettled varsa çağırıyoruz
		},
		...options,
	});
};
