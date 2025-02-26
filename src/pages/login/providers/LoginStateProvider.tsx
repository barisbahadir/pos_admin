import { type PropsWithChildren, createContext, useContext, useMemo, useState } from "react";

export interface LoginStateData {
	email: string;
	password: string;
	authValue?: string;
	qrCode?: string;
}

export enum LoginStateEnum {
	LOGIN = 0,
	REGISTER = 1,
	RESET_PASSWORD = 2,
	EMAIL = 3,
	OTP = 4,
}

interface LoginStateContextType {
	isLoginLoading: boolean;
	loginState: LoginStateEnum;
	loginData: LoginStateData | undefined;
	setLoginLoading: (isLoading: boolean) => void;
	setLoginState: (loginState: LoginStateEnum) => void;
	setLoginData: (loginData: LoginStateData) => void;
	backToLogin: () => void;
}
const LoginStateContext = createContext<LoginStateContextType>({
	isLoginLoading: false,
	loginState: LoginStateEnum.LOGIN,
	loginData: undefined,
	setLoginLoading: () => {},
	setLoginState: () => {},
	setLoginData: () => {},
	backToLogin: () => {},
});

export function useLoginStateContext() {
	const context = useContext(LoginStateContext);
	return context;
}

export function LoginStateProvider({ children }: PropsWithChildren) {
	const [isLoginLoading, setLoginLoading] = useState(false);
	const [loginState, setLoginState] = useState(LoginStateEnum.LOGIN);
	const [loginData, setLoginData] = useState<LoginStateData | undefined>(undefined);

	function backToLogin() {
		setLoginState(LoginStateEnum.LOGIN);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const value: LoginStateContextType = useMemo(
		() => ({ isLoginLoading, setLoginLoading, loginState, setLoginState, loginData, setLoginData, backToLogin }),
		[loginState],
	);

	return <LoginStateContext.Provider value={value}>{children}</LoginStateContext.Provider>;
}
