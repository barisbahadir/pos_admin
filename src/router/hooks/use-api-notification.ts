import { ApiNotificationType } from "#/enum";
import { toast } from "sonner";
import { useSettingActions } from "@/store/settingStore";
import { getApiNotification } from "@/utils/api-utils";

export const useApiNotification = () => {
	const { addNotification } = useSettingActions(); // actions içindeki fonksiyonu al

	const success = (type: ApiNotificationType, message: string, hideToast?: boolean) => {
		const notify = getApiNotification(type, message);
		addNotification(notify);

		if (!hideToast) toast.success(message);
	};

	const error = (type: ApiNotificationType, message: string, detailedMessage: string, hideToast?: boolean) => {
		const notify = getApiNotification(type, message, detailedMessage);
		addNotification(notify);

		if (!hideToast) toast.error(message);
	};

	const warning = (type: ApiNotificationType, message: string, hideToast?: boolean) => {
		const notify = getApiNotification(type, message);
		addNotification(notify);

		if (!hideToast) toast.warning(message);
	};

	const info = (type: ApiNotificationType, message: string, hideToast?: boolean) => {
		const notify = getApiNotification(type, message);
		addNotification(notify);

		if (!hideToast) toast.info(message);
	};

	return {
		notificationSuccess: (message: string, hideToast?: boolean) =>
			success(ApiNotificationType.Success, message, hideToast),
		notificationError: (message: string, detailedMessage: string, hideToast?: boolean) =>
			error(ApiNotificationType.Error, message, detailedMessage, hideToast),
		notificationWarning: (message: string, hideToast?: boolean) =>
			warning(ApiNotificationType.Warning, message, hideToast),
		notificationInfo: (message: string, hideToast?: boolean) => info(ApiNotificationType.Info, message, hideToast),
	};
};
