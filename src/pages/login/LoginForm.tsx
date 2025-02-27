import { Alert, Button, Checkbox, Col, Divider, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";

import { DEFAULT_USER, TEST_USER } from "@/_mock/assets";

import { LoginStateEnum, useLoginStateContext } from "./providers/LoginStateProvider";
import type { SignInRequest } from "#/entity";
import { useAuth } from "@/router/hooks/use-auth";
import { useState } from "react";

export default function LoginForm() {
	const { t } = useTranslation();
	const { setLoginState, loginState } = useLoginStateContext();
	const { signIn } = useAuth();

	const [isLoading, setLoading] = useState(false);

	if (loginState !== LoginStateEnum.LOGIN) return null;

	const handleFinish = async ({ email, password }: SignInRequest) => {
		setLoading(true);
		try {
			await signIn({ email, password });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="mb-4 text-2xl font-bold xl:text-3xl">{t("sys.login.signInFormTitle")}</div>
			<Form
				name="login"
				size="large"
				disabled={isLoading}
				initialValues={{
					remember: true,
					email: DEFAULT_USER.email,
					password: DEFAULT_USER.password,
				}}
				onFinish={handleFinish}
			>
				<div className="mb-4 flex flex-col">
					<Alert
						description={
							<div className="flex flex-col">
								<div className="flex">
									<span className="flex-shrink-0 text-text-disabled">{t("sys.login.email")}:</span>
									<span className="ml-1 text-text-secondary">
										{DEFAULT_USER.email} / {TEST_USER.email}
									</span>
								</div>
								<div className="flex">
									<span className="flex-shrink-0 text-text-disabled">{t("sys.login.password")}:</span>
									<span className="ml-1 text-text-secondary">
										{DEFAULT_USER.password} / {TEST_USER.password}
									</span>
								</div>
							</div>
						}
						showIcon
					/>
				</div>
				<Form.Item name="email" rules={[{ required: true, message: t("sys.login.accountPlaceholder") }]}>
					<Input placeholder={t("sys.login.email")} />
				</Form.Item>
				<Form.Item name="password" rules={[{ required: true, message: t("sys.login.passwordPlaceholder") }]}>
					<Input.Password type="password" placeholder={t("sys.login.password")} />
				</Form.Item>
				<Form.Item>
					<Row align="middle">
						<Col span={12}>
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox>{t("sys.login.rememberMe")}</Checkbox>
							</Form.Item>
						</Col>
						<Col span={12} className="text-right">
							<Button
								type="link"
								className="!underline"
								onClick={() => setLoginState(LoginStateEnum.RESET_PASSWORD)}
								size="small"
							>
								{t("sys.login.forgetPassword")}
							</Button>
						</Col>
					</Row>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" className="w-full" loading={isLoading}>
						{t("sys.login.loginButton")}
					</Button>
				</Form.Item>

				<Divider className="!text-sm">{t("sys.login.otherSignIn")}</Divider>

				<Row align="middle">
					<Col flex="1" onClick={() => setLoginState(LoginStateEnum.REGISTER)}>
						<Button className="w-full !text-sm">
							<b>{t("sys.login.signUpFormTitle")}</b>
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}
