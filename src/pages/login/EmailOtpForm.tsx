import { Button, Form, Input, Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ReturnButton } from "./components/ReturnButton";
import { LoginStateEnum, useLoginStateContext } from "./providers/LoginStateProvider";
import { useAuth } from "@/router/hooks/use-auth";
import AuthTimer from "./components/AuthTimer";

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
			<div className="mb-4 text-2xl font-bold xl:text-3xl">{t("sys.login.emailSignInFormTitle")}</div>
			<Form name="normal_login" size="large" disabled={isLoading} initialValues={{ authValue: "" }} onFinish={onFinish}>
				<Row
					justify="center"
					style={{
						marginTop: "20px",
						marginBottom: "10px",
					}}
				>
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
				<Row
					justify="center"
					style={{
						marginTop: "10px",
						marginBottom: "30px",
					}}
				>
					<AuthTimer initialTime={300} />
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
