import { Button, Card, Popconfirm, Tag } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { isNil } from "ramda";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { IconButton, Iconify, SvgIcon } from "@/components/icon";

import PermissionModal, { type PermissionModalProps } from "./permission-modal";

import type { Permission } from "#/entity";
import { BaseStatus, PermissionType } from "#/enum";
import { permissionListMutation } from "@/api/services/systemService";
import { CircleLoading } from "@/components/loading";

const defaultPermissionValue: Permission = {
	id: 0,
	parentId: "",
	name: "",
	label: "",
	route: "",
	component: "",
	icon: "",
	hide: false,
	status: BaseStatus.ENABLE,
	type: PermissionType.GROUP,
};
export default function PermissionPage() {
	const { t } = useTranslation();

	const [isLoading, setLoading] = useState<boolean>(false);
	const [permissions, setPermissions] = useState<Permission[]>([]);

	const permissionListCall = permissionListMutation();

	useEffect(() => {
		if (permissions.length === 0) {
			const fetchData = async () => {
				setLoading(true);
				try {
					const data = await permissionListCall.mutateAsync();
					setPermissions(data);
				} finally {
					setLoading(false);
				}
			};

			fetchData();
		}
	}, [permissions, permissionListCall.mutateAsync]);

	const [permissionModalProps, setPermissionModalProps] = useState<PermissionModalProps>({
		formValue: { ...defaultPermissionValue },
		title: "New",
		show: false,
		onOk: () => {
			setPermissionModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setPermissionModalProps((prev) => ({ ...prev, show: false }));
		},
	});
	const columns: ColumnsType<Permission> = [
		{
			title: "Name",
			dataIndex: "name",
			render: (_, record) => <div>{t(record.label)}</div>,
		},
		{
			title: "Type",
			dataIndex: "type",
			render: (_, record) => <Tag color="processing">{PermissionType[record.type]}</Tag>,
		},
		{
			title: "Icon",
			dataIndex: "icon",
			width: 60,
			responsive: ["lg"],
			render: (icon: string) => {
				if (isNil(icon)) return "";
				if (icon.startsWith("ic")) {
					return <SvgIcon icon={icon} size={18} className="ant-menu-item-icon" />;
				}
				return <Iconify icon={icon} size={18} className="ant-menu-item-icon" />;
			},
		},
		{
			title: "Component",
			dataIndex: "component",
			responsive: ["lg"],
		},
		{
			title: "Status",
			dataIndex: "status",
			align: "center",
			responsive: ["lg"],
			render: (status) => (
				<Tag color={status === BaseStatus.DISABLE ? "error" : "success"}>
					{status === BaseStatus.DISABLE ? "Disable" : "Enable"}
				</Tag>
			),
		},
		{ title: "Order", dataIndex: "orderValue", width: 60, responsive: ["lg"] },
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-end text-gray">
					{record?.type === PermissionType.GROUP && (
						<IconButton onClick={() => onCreate(record.id.toString())}>
							<Iconify icon="gridicons:add-outline" size={18} />
						</IconButton>
					)}
					<IconButton onClick={() => onEdit(record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm title="Delete the Permission" okText="Yes" cancelText="No" placement="left">
						<IconButton>
							<Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
						</IconButton>
					</Popconfirm>
				</div>
			),
		},
	];

	const onCreate = (parentId?: string) => {
		setPermissionModalProps((prev) => ({
			...prev,
			show: true,
			...defaultPermissionValue,
			title: "New",
			formValue: { ...defaultPermissionValue, parentId: parentId ?? "" },
		}));
	};

	const onEdit = (formValue: Permission) => {
		setPermissionModalProps((prev) => ({
			...prev,
			show: true,
			title: "Edit",
			formValue,
		}));
	};
	return (
		<Card
			title={t("sys.menu.management.permission")}
			extra={
				<Button type="primary" onClick={() => onCreate()} disabled={isLoading}>
					New
				</Button>
			}
		>
			{isLoading ? (
				<CircleLoading />
			) : (
				<Table rowKey="id" pagination={false} columns={columns} dataSource={permissions} />
			)}

			<PermissionModal {...permissionModalProps} />
		</Card>
	);
}
