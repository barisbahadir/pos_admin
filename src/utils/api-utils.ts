import type { ApiNotification } from "#/entity";
import { ApiNotificationType } from "#/enum";
import useSettingStore from "@/store/settingStore";
import { toast } from "sonner";

export function getApiNotification(type: ApiNotificationType, message: string, detailedMessage?: string | undefined) {
	const notify = {
		id: Math.random().toString(),
		message: message,
		detailedMessage: detailedMessage,
		type: type,
		timestamp: Date.now(),
		isViewed: false,
	} as ApiNotification;

	return notify;
}
// Başarı mesajı göster ve store'a ekle
export const notifySuccess = (message: string, hideToast?: boolean) => {
	const notify = getApiNotification(ApiNotificationType.Success, message);
	useSettingStore.getState().actions.addNotification(notify);

	if (!hideToast) toast.success(message);
};

// Hata mesajı göster ve store'a ekle
export const notifyError = (message: string, detailedMessage: string | undefined, hideToast?: boolean) => {
	const notify = getApiNotification(ApiNotificationType.Error, message, detailedMessage);
	useSettingStore.getState().actions.addNotification(notify);

	if (!hideToast)
		toast.error(message, {
			duration: 7000,
		});
};
// Bilgilendirme mesajı göster ve store'a ekle
export const notifyInfo = (message: string, hideToast?: boolean) => {
	const notify = getApiNotification(ApiNotificationType.Info, message);
	useSettingStore.getState().actions.addNotification(notify);

	if (!hideToast) toast.info(message);
};

// Uyarı mesajı göster ve store'a ekle
export const notifyWarning = (message: string, hideToast?: boolean) => {
	const notify = getApiNotification(ApiNotificationType.Warning, message);
	useSettingStore.getState().actions.addNotification(notify);

	if (!hideToast) toast.warning(message);
};

export const convertTimestampToDateTime = (timestamp: number) => {
	const date = new Date(timestamp);

	const year = date.getFullYear();
	const month = date.getMonth() + 1; // Ay 0'dan başlar, o yüzden +1 ekliyoruz
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};
