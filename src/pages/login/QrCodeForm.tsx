import { Button, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";

import { ReturnButton } from "./components/ReturnButton";
import { LoginStateEnum, useLoginStateContext } from "./providers/LoginStateProvider";
import { useAuth } from "@/router/hooks/use-auth";
import { useState } from "react";

export default function QrCodeFrom() {
	const { t } = useTranslation();
	const { signIn } = useAuth();

	const { loginState, backToLogin, loginData } = useLoginStateContext();

	const [isLoading, setLoading] = useState(false);

	if (loginState !== LoginStateEnum.OTP) return null;

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
			<div className="mb-4 text-2xl font-bold xl:text-3xl">{t("sys.login.qrSignInFormTitle")}</div>
			<Form name="normal_login" size="large" disabled={isLoading} initialValues={{ authValue: "" }} onFinish={onFinish}>
				{loginData?.qrCode && (
					<>
						{/* <div className="flex w-full flex-col items-center justify-center">
							<QRCode value={loginData?.qrCode} size={200} />
							<p className="my-4 text-sm">{"Kodu taratip giris islemini tamamlayabilirsiniz."}</p>
						</div> */}
						<div className="flex w-full flex-col items-center justify-center">
							<img
								src={`data:image/png;base64,${loginData?.qrCode}`}
								alt="QR Code"
								width={250}
								height={250}
								style={{ border: "1px solid text-gray", borderRadius: "12px" }}
							/>
						</div>
					</>
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

				<ReturnButton onClick={backToLogin} />
			</Form>
		</>
	);
}
