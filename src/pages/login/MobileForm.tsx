import { Button, Form, Input, Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ReturnButton } from "./components/ReturnButton";
import { LoginStateEnum, useLoginStateContext } from "./providers/LoginStateProvider";
import { useAuth } from "@/router/hooks/use-auth";

export default function EmailOtpForm() {
	const { t } = useTranslation();
	const { signIn } = useAuth();

	const { loginState, backToLogin, loginData } = useLoginStateContext();

	const [isLoading, setLoading] = useState(false);

	if (loginState !== LoginStateEnum.EMAIL) return null;

	const onFinish = async (values: any) => {
		setLoading(true);
		try {
			await signIn({
				email: loginData?.email || "",
				password: loginData?.password || "",
				authValue: values.authValue,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="mb-4 text-2xl font-bold xl:text-3xl">{t("sys.login.mobileSignInFormTitle")}</div>
			<Form name="normal_login" size="large" disabled={isLoading} initialValues={{ authValue: "" }} onFinish={onFinish}>
				{loginData?.qrCode && (
					<div className="flex w-full flex-col items-center justify-center">
						<img
							src={`data:image/png;base64,${loginData?.qrCode}`}
							alt="QR Code"
							width={250}
							height={250}
							style={{ border: "1px solid text-gray", borderRadius: "12px" }}
						/>
					</div>
				)}
				<Row justify="center" className="mt-2 mb-4">
					<Form.Item
						name="authValue"
						rules={[
							{ required: true, message: "Lütfen OTP kodunu girin!" },
							{ len: 6, message: "OTP kodu 6 haneli olmalıdır!" },
						]}
					>
						<Input.OTP formatter={(str) => str.toUpperCase()} />
					</Form.Item>
				</Row>
				<Form.Item>
					<Button type="primary" htmlType="submit" className="w-full" loading={isLoading}>
						{t("sys.login.loginButton")}
					</Button>
				</Form.Item>

				{/* <div className="mb-2 text-xs text-gray">
					<span>{t("sys.login.registerAndAgree")}</span>
					<a href="./" className="text-sm !underline">
						{t("sys.login.termsOfService")}
					</a>
					{" & "}
					<a href="./" className="text-sm !underline">
						{t("sys.login.privacyPolicy")}
					</a>
				</div> */}

				<ReturnButton onClick={backToLogin} />
			</Form>
		</>
	);
}
