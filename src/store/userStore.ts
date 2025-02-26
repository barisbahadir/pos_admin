import { useNavigate } from "react-router";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { faker } from "@faker-js/faker";

import type { LoginInfo, SignInRequest, UserToken } from "#/entity";
import { StorageEnum } from "#/enum";
import { loginMutation } from "@/api/services/systemService";
import { notifySuccess } from "@/utils/api-utils";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

type UserStore = {
	userInfo: Partial<LoginInfo>;
	userToken: UserToken;
	isLoading: boolean;
	actions: {
		setUserInfo: (userInfo: LoginInfo) => void;
		setUserToken: (token: UserToken) => void;
		clearUserInfoAndToken: () => void;
	};
};

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			userInfo: {},
			userToken: {},
			isLoading: false,
			actions: {
				setUserInfo: (userInfo) => {
					set({ userInfo });
				},
				setUserToken: (userToken) => {
					set({ userToken });
				},
				clearUserInfoAndToken() {
					set({ userInfo: {}, userToken: {} });
				},
				setIsLoading: (isLoading: boolean) => {
					set({ isLoading });
				},
			},
		}),
		{
			name: "userStore", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
			partialize: (state) => ({
				[StorageEnum.UserInfo]: state.userInfo,
				[StorageEnum.UserToken]: state.userToken,
				[StorageEnum.IsLoading]: state.isLoading,
			}),
		},
	),
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
export const useUserActions = () => useUserStore((state) => state.actions);
export const useLoading = () => useUserStore((state) => state.isLoading);

export const useSignIn = () => {
	const navigate = useNavigate();
	const { setUserToken, setUserInfo } = useUserActions();

	const signInMutation = loginMutation();

	const signIn = async (data: SignInRequest) => {
		try {
			const res = await signInMutation.mutateAsync(data);
			const token = res.token;
			setUserToken({ accessToken: token });
			if (!res.avatar) {
				res.avatar = faker.image.avatarGitHub();
			}
			setUserInfo(res);
			navigate(HOMEPAGE, { replace: true });
			notifySuccess(`Giriş başarılı, hoşgeldin ${res.email}.`);
		} catch (err) {}
	};

	return signIn;
};

export default useUserStore;
