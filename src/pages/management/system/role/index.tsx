import { Button, Card, Popconfirm, Tag } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

// import { ROLE_LIST } from "@/_mock/assets";
import { IconButton, Iconify } from "@/components/icon";

import { RoleModal, type RoleModalProps } from "./role-modal";

import type { Role } from "#/entity";
import { BaseStatus } from "#/enum";
import { roleListMutation } from "@/api/services/systemService";
import { CircleLoading } from "@/components/loading";
import { useTranslation } from "react-i18next";

const DEFAULE_ROLE_VALUE: Role = {
	id: 0,
	name: "",
	label: "",
	status: BaseStatus.ENABLE,
	permissions: [],
};
export default function RolePage() {
	const { t } = useTranslation();
	const [isLoading, setLoading] = useState<boolean>(false);
	const [roles, setRoles] = useState<Role[]>([]);

	const roleListCall = roleListMutation();

	useEffect(() => {
		if (roles.length === 0) {
			const fetchData = async () => {
				setLoading(true);
				try {
					const data = await roleListCall.mutateAsync();
					setRoles(data);
				} finally {
					setLoading(false);
				}
			};

			fetchData();
		}
	}, [roles, roleListCall.mutateAsync]);

	const [roleModalPros, setRoleModalProps] = useState<RoleModalProps>({
		formValue: { ...DEFAULE_ROLE_VALUE },
		title: "New",
		show: false,
		onOk: () => {
			setRoleModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setRoleModalProps((prev) => ({ ...prev, show: false }));
		},
	});
	const columns: ColumnsType<Role> = [
		{
			title: "Name",
			dataIndex: "name",
		},
		{
			title: "Label",
			dataIndex: "label",
		},
		{ title: "Order", dataIndex: "orderValue" },
		{
			title: "Status",
			dataIndex: "status",
			align: "center",
			render: (status) => (
				<Tag color={status === BaseStatus.DISABLE ? "error" : "success"}>
					{status === BaseStatus.DISABLE ? "Disable" : "Enable"}
				</Tag>
			),
		},
		{ title: "Description", dataIndex: "description" },
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray">
					<IconButton onClick={() => onEdit(record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm title="Delete the Role" okText="Yes" cancelText="No" placement="left">
						<IconButton>
							<Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
						</IconButton>
					</Popconfirm>
				</div>
			),
		},
	];

	const onCreate = () => {
		setRoleModalProps((prev) => ({
			...prev,
			show: true,
			title: "Create New",
			formValue: {
				...prev.formValue,
				...DEFAULE_ROLE_VALUE,
			},
		}));
	};

	const onEdit = (formValue: Role) => {
		setRoleModalProps((prev) => ({
			...prev,
			show: true,
			title: "Edit",
			formValue,
		}));
	};

	return (
		<Card
			title={t("sys.menu.management.role")}
			extra={
				<Button type="primary" onClick={onCreate} disabled={isLoading}>
					New
				</Button>
			}
		>
			{isLoading ? <CircleLoading /> : <Table rowKey="id" pagination={false} columns={columns} dataSource={roles} />}
			<RoleModal {...roleModalPros} />
		</Card>
	);
}
