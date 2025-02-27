import { useNavigate } from "react-router";
import { notifySuccess } from "@/utils/api-utils";
import { loginMutation, logoutMutation } from "@/api/services/systemService";
import { AuthenticationType } from "#/enum";
import type { SignInRequest } from "#/entity";
import { useUserActions } from "@/store/userStore";
import { useRouter } from "@/router/hooks";
import { type LoginStateData, LoginStateEnum, useLoginStateContext } from "@/pages/login/providers/LoginStateProvider";
import { useSettingActions } from "@/store/settingStore";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

export function useAuth() {
	const navigate = useNavigate();
	const { replace } = useRouter();
	const { setUserToken, setUserInfo, clearUserInfoAndToken } = useUserActions();
	const { setLoginState, setLoginData, backToLogin } = useLoginStateContext();
	const { clearNotifications } = useSettingActions();

	const signInMutationCall = loginMutation();
	const logoutMutationCall = logoutMutation();

	const signIn = async (data: SignInRequest) => {
		try {
			const res = await signInMutationCall.mutateAsync(data);

			if (res.isAuthenticated && res.token) {
				setUserToken({ accessToken: res.token });
				setUserInfo(res);
				clearNotifications();

				navigate(HOMEPAGE, { replace: true });
				notifySuccess(
					`Giriş başarılı, hoşgeldin ${res.email}. ${res.authType !== AuthenticationType.NONE ? `(${res.authType.toString().toLocaleLowerCase()})` : ""}`,
				);
			} else if (res.authType === AuthenticationType.OTP) {
				setLoginState(LoginStateEnum.OTP);
				const loginData = {
					email: data.email,
					password: data.password,
					qrCode: res.twoFactorQrCode,
				} as LoginStateData;
				setLoginData(loginData);
			} else if (res.authType === AuthenticationType.EMAIL) {
				const loginData = {
					email: data.email,
					password: data.password,
				} as LoginStateData;
				setLoginState(LoginStateEnum.EMAIL);
				setLoginData(loginData);
			}
		} catch (err) {}
	};

	const logout = async () => {
		try {
			try {
				await logoutMutationCall.mutateAsync();
			} catch (err) {}

			clearUserInfoAndToken();
			backToLogin();
			clearNotifications();
		} catch (err) {
		} finally {
			replace("/login");
		}
	};

	return { signIn, logout };
}
