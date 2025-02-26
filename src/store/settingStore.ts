import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { FontFamilyPreset, typographyTokens } from "@/theme/tokens/typography";
import { StorageEnum, ThemeColorPresets, ThemeLayout, ThemeMode } from "#/enum";
import type { ApiNotification } from "#/entity";

type SettingsType = {
	themeColorPresets: ThemeColorPresets;
	themeMode: ThemeMode;
	themeLayout: ThemeLayout;
	themeStretch: boolean;
	breadCrumb: boolean;
	multiTab: boolean;
	darkSidebar: boolean;
	fontFamily: string;
	fontSize: number;
	direction: "ltr" | "rtl";
};
type SettingStore = {
	settings: SettingsType;
	notifications: ApiNotification[];
	actions: {
		setSettings: (settings: SettingsType) => void;
		clearSettings: () => void;
		setNotifications: (notifications: ApiNotification[]) => void;
		addNotification: (notification: ApiNotification) => void;
		markAllNotificationsAsViewed: () => void;
		clearNotifications: () => void;
	};
};

const useSettingStore = create<SettingStore>()(
	persist(
		(set) => ({
			settings: {
				themeColorPresets: ThemeColorPresets.Blue,
				themeMode: ThemeMode.Light,
				themeLayout: ThemeLayout.Vertical,
				themeStretch: true,
				breadCrumb: true,
				multiTab: false,
				darkSidebar: true,
				fontFamily: FontFamilyPreset.inter,
				fontSize: Number(typographyTokens.fontSize.sm),
				direction: "ltr",
			},
			notifications: [],
			actions: {
				setSettings: (settings) => {
					set({ settings });
				},
				clearSettings() {
					useSettingStore.persist.clearStorage();
				},
				setNotifications: (notifications) => {
					set({ notifications });
				},
				addNotification: (notification) => {
					set((state) => ({
						notifications:
							state.notifications.length > 0 && state.notifications[0].message === notification.message
								? state.notifications
								: [notification, ...state.notifications],
					}));
				},
				markAllNotificationsAsViewed: () => {
					set((state) => ({
						notifications: state.notifications.map((notification) => ({ ...notification, isViewed: true })),
					}));
				},

				clearNotifications: () => {
					set({ notifications: [] });
				},
			},
		}),
		{
			name: StorageEnum.Settings, // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
			partialize: (state) => ({ [StorageEnum.Settings]: state.settings }),
		},
	),
);

export const useSettings = () => useSettingStore((state) => state.settings);
export const useSettingActions = () => useSettingStore((state) => state.actions);
export const useNotifications = () => useSettingStore((state) => state.notifications);

export default useSettingStore;
