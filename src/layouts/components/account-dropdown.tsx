import { Divider, type MenuProps } from "antd";
import Dropdown, { type DropdownProps } from "antd/es/dropdown/dropdown";
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

import { IconButton, Iconify } from "@/components/icon";
import { useLoginStateContext } from "@/pages/login/providers/LoginStateProvider";
import { useRouter } from "@/router/hooks";
import { useUserActions, useUserInfo } from "@/store/userStore";
import { useTheme } from "@/theme/hooks";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

export default function AccountDropdown() {
	const { replace } = useRouter();
	const { username } = useUserInfo();
	const { clearUserInfoAndToken } = useUserActions();
	const { backToLogin } = useLoginStateContext();
	const { t } = useTranslation();
	const logout = () => {
		try {
			clearUserInfoAndToken();
			backToLogin();
		} catch (error) {
			console.log(error);
		} finally {
			replace("/login");
		}
	};
	const {
		themeVars: { colors, borderRadius, shadows },
	} = useTheme();

	const contentStyle: React.CSSProperties = {
		backgroundColor: colors.background.default,
		borderRadius: borderRadius.lg,
		boxShadow: shadows.dropdown,
	};

	const menuStyle: React.CSSProperties = {
		boxShadow: "none",
	};

	const dropdownRender: DropdownProps["dropdownRender"] = (menu) => (
		<div style={contentStyle}>
			<div className="flex flex-col items-start p-4">
				<div>
					<b>{t("sys.login.welcome")}</b>
					{`, ${username}.`}
				</div>
				{/* <div className="text-gray">{email}</div> */}
			</div>
			<Divider style={{ margin: 0 }} />
			{React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
		</div>
	);

	const items: MenuProps["items"] = [
		{
			label: <NavLink to="/user/profile">{t("sys.menu.user.profile")}</NavLink>,
			key: "0",
		},
		{
			label: <NavLink to="/user/account">{t("sys.menu.user.account")}</NavLink>,
			key: "1",
		},
		{ type: "divider" },
		{
			label: (
				<NavLink to={HOMEPAGE}>
					<b>{t("sys.settings_label")}</b>
				</NavLink>
			),
			key: "2",
		},
		{ type: "divider" },
		{
			label: (
				<button className="font-bold text-warning" type="button">
					{t("sys.login.logout")}
				</button>
			),
			key: "3",
			onClick: logout,
		},
	];

	return (
		<Dropdown menu={{ items }} trigger={["click"]} dropdownRender={dropdownRender}>
			<IconButton className="h-10 w-10 transform-none px-0 scale-105 hover:scale-110 transition-transform">
				<Iconify icon="solar:user-circle-bold-duotone" className="h-8 w-8" />
			</IconButton>
		</Dropdown>
	);
}
