import { Badge, Button, Drawer, Modal, Space, Tabs, type TabsProps, Tag } from "antd";
import { type CSSProperties, useState } from "react";

import CyanBlur from "@/assets/images/background/cyan-blur.png";
import RedBlur from "@/assets/images/background/red-blur.png";
import { IconButton, Iconify, SvgIcon } from "@/components/icon";
import { themeVars } from "@/theme/theme.css";
import { useNotifications, useSettingActions, useSettings } from "@/store/settingStore";
import type { ApiNotification } from "#/entity";
import { ApiNotificationType, ThemeMode } from "#/enum";
import { useTranslation } from "react-i18next";
import { CloseOutlined } from "@ant-design/icons";
import type { TFunction } from "i18next";
import { convertTimestampToDateTime } from "@/utils/api-utils";

export default function NoticeButton() {
	const { t } = useTranslation();
	const notifications = useNotifications();
	const { markAllNotificationsAsViewed } = useSettingActions();

	const unreadNotifyList = notifications.filter((n) => !n.isViewed);

	const [drawerOpen, setDrawerOpen] = useState(false);

	const style: CSSProperties = {
		backdropFilter: "blur(20px)",
		backgroundImage: `url("${CyanBlur}"), url("${RedBlur}")`,
		backgroundRepeat: "no-repeat, no-repeat",
		backgroundColor: `rgba(${themeVars.colors.background.paperChannel}, 0.9)`,
		backgroundPosition: "right top, left bottom",
		backgroundSize: "50, 50%",
	};

	return (
		<div>
			<IconButton onClick={() => setDrawerOpen(true)}>
				<Badge
					count={unreadNotifyList.length}
					styles={{
						root: { color: "inherit" },
						indicator: { color: themeVars.colors.common.white },
					}}
				>
					<Iconify icon="solar:bell-bing-bold-duotone" size={24} />
				</Badge>
			</IconButton>
			<Drawer
				placement="right"
				title={t("sys.notifications")}
				onClose={() => setDrawerOpen(false)}
				open={drawerOpen}
				closable={false}
				width={420}
				styles={{
					body: { padding: 0, height: "100%" },
					mask: { backgroundColor: "rgba(0, 0, 0, 0.2)" },
				}}
				style={style}
				extra={
					<Button type="link" icon={<CloseOutlined />} onClick={() => setDrawerOpen(false)}>
						{t("common.closeText")}
					</Button>
				}
				footer={
					<div
						style={{
							color: themeVars.colors.text.primary,
							cursor: "pointer",
						}}
						className="flex h-10 w-full items-center justify-center font-semibold"
						onClick={() => markAllNotificationsAsViewed()}
					>
						{t("sys.notifications_mark_read")}
					</div>
				}
			>
				<NoticeTab notifications={notifications} t={t} />
			</Drawer>
		</div>
	);
}

interface NoticeTabProps {
	notifications: ApiNotification[];
	t: TFunction<"translation", undefined>;
}

const NoticeTab: React.FC<NoticeTabProps> = ({ notifications, t }) => {
	const { themeMode } = useSettings();
	const backgroundColor = themeMode === ThemeMode.Light ? "rgb(244, 246, 248)" : "rgba(145, 158, 171, 0.12)";

	const [notifyDetail, setNotifyDetail] = useState<ApiNotification>();

	const unreadNotifyList = notifications.filter((n) => !n.isViewed);
	const readNotifyList = notifications.filter((n) => n.isViewed);

	const getNotificationRow = (notify: ApiNotification) => {
		let icon = <SvgIcon icon="ic_chat" size={35} />;
		if (notify.type === ApiNotificationType.Error)
			icon = <Iconify icon="line-md:alert-circle" size={35} color={themeVars.colors.palette.error.default} />;
		else if (notify.type === ApiNotificationType.Info)
			icon = <Iconify icon="line-md:chat-round-alert" size={35} color={themeVars.colors.palette.info.default} />;
		else if (notify.type === ApiNotificationType.Warning)
			icon = <Iconify icon="line-md:bell" size={35} color={themeVars.colors.palette.warning.default} />;

		return (
			<div
				key={notify.id}
				className="flex flex-col mb-4 pt-2 pb-2"
				style={{
					// border: "1px solid #f0f0f0",
					borderRadius: "12px",
					maxWidth: "100%",
					overflowX: "hidden",
					backgroundColor: backgroundColor,
				}}
			>
				<div className="flex" style={{ maxWidth: "100%" }}>
					<div className="flex justify-center" style={{ width: "20%" }}>
						{icon}
					</div>
					<div className="flex flex-col" style={{ width: "80%" }}>
						<span className="font-medium line-clamp-2">{notify.message}</span>
						<span className="text-xs font-light opacity-60">{convertTimestampToDateTime(notify.timestamp)}</span>
					</div>
				</div>
				{notify.detailedMessage && (
					<>
						<div className="mt-2 flex items-center rounded-lg bg-bg-neutral p-4" style={{ maxWidth: "100%" }}>
							<div className="ml-2 flex flex-col text-gray" style={{ maxWidth: "100%" }}>
								<span className="text-xs line-clamp-4">{notify.detailedMessage}</span>
							</div>
						</div>
						<div className="mt-2" style={{ textAlign: "center", maxWidth: "100%" }}>
							<Space>
								<Button type="default" onClick={() => setNotifyDetail(notify)}>
									View
								</Button>
							</Space>
						</div>
					</>
				)}
			</div>
		);
	};

	const emptyNotificationsText = () => {
		return (
			<>
				<div
					className="empty-cart text-text-secondary"
					style={{
						display: "flex",
						height: "50vh",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						textAlign: "center",
					}}
				>
					<Iconify icon="line-md:chat-off" size={60} />
					<p className="text-xl font-semibold text-text-secondary mt-2">{"Yeni bildiriminiz bulunmamaktadır."}</p>
				</div>
			</>
		);
	};

	const items: TabsProps["items"] = [
		{
			key: "1",
			label: (
				<div className="flex">
					<span>Tümü</span>
					<Tag color="processing">{notifications.length}</Tag>
				</div>
			),
			children: (
				<div style={{ flex: 1, overflowY: "auto" }}>
					{notifications.length > 0
						? notifications.map((notify) => getNotificationRow(notify))
						: emptyNotificationsText()}
				</div>
			),
		},
		{
			key: "2",
			label: (
				<div className="flex">
					<span>Okunmamış</span>
					<Tag color="error">{unreadNotifyList.length}</Tag>
				</div>
			),
			children: (
				<div style={{ flex: 1, overflowY: "auto" }}>
					{unreadNotifyList.length > 0
						? unreadNotifyList.map((notify) => getNotificationRow(notify))
						: emptyNotificationsText()}
				</div>
			),
		},
		{
			key: "3",
			label: (
				<div className="flex">
					<span>Arşiv</span>
					<Tag color="green">{readNotifyList.length}</Tag>
				</div>
			),
			children: (
				<div style={{ flex: 1, overflowY: "auto" }}>
					{readNotifyList.length > 0
						? readNotifyList.map((notify) => getNotificationRow(notify))
						: emptyNotificationsText()}
				</div>
			),
		},
	];
	return (
		<div className="flex flex-col px-6">
			<Tabs defaultActiveKey="1" items={items} />

			<Modal
				title={notifyDetail?.message}
				open={!!notifyDetail}
				centered={true}
				onCancel={() => setNotifyDetail(undefined)}
				footer={
					<div style={{ textAlign: "center", marginTop: "16px" }}>
						<Button type="primary" onClick={() => setNotifyDetail(undefined)}>
							{t("common.closeText")}
						</Button>
					</div>
				}
				width="50vw" // Modal genişliği ekranın %80'i
				style={{ maxHeight: "60vh", overflowY: "auto", alignItems: "center" }} // Modal yüksekliği ekranın %90'ı
			>
				<div style={{ maxHeight: "calc(60vh - 120px)", overflowY: "auto" }}>
					<p>{notifyDetail?.detailedMessage}</p>
				</div>
			</Modal>
		</div>
	);
};
