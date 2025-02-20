import apiClient from "../apiClient";

import type { LoginInfo } from "#/entity";

export interface SignInReq {
	email: string;
	password: string;
}

export interface SignUpReq {
	email: string;
	username: string;
	password: string;
}
export type SignInRes = LoginInfo;

export enum UserApi {
	SignIn = "/auth/login",
	SignUp = "/auth/register",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });

export default {
	signin,
	signup,
	logout,
};
