import { useNavigate } from "react-router";
import { notifySuccess } from "@/utils/api-utils";
import { loginMutation } from "@/api/services/systemService";
import { AuthenticationType } from "#/enum";
import type { SignInRequest } from "#/entity";
import { useUserActions } from "@/store/userStore";
import { type LoginStateData, LoginStateEnum, useLoginStateContext } from "@/pages/login/providers/LoginStateProvider";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

export function useAuth() {
	const navigate = useNavigate();
	const { setUserToken, setUserInfo } = useUserActions();
	const { setLoginState, setLoginData } = useLoginStateContext();

	const signInMutation = loginMutation();

	const signIn = async (data: SignInRequest) => {
		try {
			const res = await signInMutation.mutateAsync(data);

			if (res.token) {
				setUserToken({ accessToken: res.token });
				setUserInfo(res);
				navigate(HOMEPAGE, { replace: true });
				notifySuccess(`Giriş başarılı, hoşgeldin ${res.email}.`);
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

	return { signIn };
}
