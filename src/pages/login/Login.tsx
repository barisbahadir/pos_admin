import { Layout, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router";

import DashboardImg from "@/assets/images/background/dashboard.png";
import Overlay from "@/assets/images/background/overlay.jpg";
import LocalePicker from "@/components/locale-picker";
import { useUserToken } from "@/store/userStore";

import SettingButton from "@/layouts/components/setting-button";
import { themeVars } from "@/theme/theme.css";
import { rgbAlpha } from "@/utils/theme";
import LoginForm from "./LoginForm";
import EmailOtpForm from "./MobileForm";
import QrCodeFrom from "./QrCodeForm";
import RegisterForm from "./RegisterForm";
import ResetForm from "./ResetForm";
import { down, useMediaQuery } from "@/hooks";
import { LoginStateProvider } from "./providers/LoginStateProvider";
import NoticeButton from "@/layouts/components/notice";

const { VITE_APP_HOMEPAGE: HOMEPAGE, VITE_APP_NAME: APP_NAME } = import.meta.env;

function Login() {
	const { t } = useTranslation();
	const { accessToken } = useUserToken();
	const mobileOrTablet = useMediaQuery(down("md"));

	if (accessToken) {
		return <Navigate to={HOMEPAGE} replace />;
	}

	const gradientBg = rgbAlpha(themeVars.colors.background.defaultChannel, 0.9);
	const bg = `linear-gradient(${gradientBg}, ${gradientBg}) center center / cover no-repeat,url(${Overlay})`;

	return (
		<Layout className="relative flex !min-h-screen !w-full !flex-row">
			<div
				className="hidden grow flex-col items-center justify-center gap-[20px] bg-center  bg-no-repeat md:flex"
				style={{
					background: bg,
				}}
			>
				{!mobileOrTablet && (
					<div className="text-3xl font-bold leading-normal lg:text-4xl xl:text-5xl text-primary">{APP_NAME}</div>
				)}
				<img className="max-w-[560px] xl:max-w-[7000px]" src={DashboardImg} alt="" />
				<Typography.Text className="flex flex-row gap-[16px] text-2xl font-bold">
					{t("sys.login.signInSecondTitle")}
				</Typography.Text>
			</div>

			<div className="m-auto flex !h-screen w-full max-w-[480px] flex-col justify-center px-[16px] lg:px-[64px]">
				{mobileOrTablet && (
					<div className="text-4xl font-bold leading-normal lg:text-4xl xl:text-5xl text-primary mb-11">{APP_NAME}</div>
				)}
				<LoginStateProvider>
					<LoginForm />
					<EmailOtpForm />
					<QrCodeFrom />
					<RegisterForm />
					<ResetForm />
				</LoginStateProvider>
			</div>

			<div className="absolute right-2 top-0 flex flex-row mt-2 mr-2">
				<LocalePicker />
				<NoticeButton />
				<SettingButton />
			</div>
		</Layout>
	);
}
export default Login;
