import { Button, Card, Popconfirm, Tag } from "antd";
import Table, { type ColumnsType } from "antd/es/table";

// import { USER_LIST } from "@/_mock/assets";
import { IconButton, Iconify } from "@/components/icon";
import { usePathname, useRouter } from "@/router/hooks";

import type { LoginInfo, Role } from "#/entity";
import { BaseStatus } from "#/enum";
import { useEffect, useState } from "react";
import { userListMutation } from "@/api/services/systemService";
import { CircleLoading } from "@/components/loading";

export default function RolePage() {
	const { push } = useRouter();
	const pathname = usePathname();

	const [isLoading, setLoading] = useState<boolean>(false);
	const [users, setUsers] = useState<LoginInfo[]>([]);

	const userListCall = userListMutation();

	useEffect(() => {
		if (users.length === 0) {
			const fetchData = async () => {
				setLoading(true);
				try {
					const data = await userListCall.mutateAsync();
					setUsers(data);
				} finally {
					setLoading(false);
				}
			};

			fetchData();
		}
	}, [users, userListCall.mutateAsync]);

	const columns: ColumnsType<LoginInfo> = [
		{
			title: "Name",
			dataIndex: "name",
			width: 300,
			render: (_, record) => {
				return (
					<div className="flex">
						{record?.avatar && <img alt="" src={record?.avatar || ""} className="h-10 w-10 rounded-full" />}
						<div className="ml-2 flex flex-col">
							<span className="text-sm">{record.username}</span>
							<span className="text-xs text-text-secondary">{record.email}</span>
						</div>
					</div>
				);
			},
		},
		{
			title: "Role",
			dataIndex: "role",
			align: "center",
			width: 120,
			render: (role: Role) => <Tag color="cyan">{role.name}</Tag>,
		},
		{
			title: "Status",
			dataIndex: "status",
			align: "center",
			width: 120,
			render: (status) => (
				<Tag color={status === BaseStatus.DISABLE ? "error" : "success"}>
					{status === BaseStatus.DISABLE ? "Disable" : "Enable"}
				</Tag>
			),
		},
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray-500">
					<IconButton
						onClick={() => {
							push(`${pathname}/${record.id}`);
						}}
					>
						<Iconify icon="mdi:card-account-details" size={18} />
					</IconButton>
					<IconButton onClick={() => {}}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm title="Delete the User" okText="Yes" cancelText="No" placement="left">
						<IconButton>
							<Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
						</IconButton>
					</Popconfirm>
				</div>
			),
		},
	];

	return (
		<Card
			title="User List"
			extra={
				<Button type="primary" disabled={isLoading} onClick={() => {}}>
					New
				</Button>
			}
		>
			{isLoading ? (
				<CircleLoading />
			) : (
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					pagination={false}
					columns={columns}
					dataSource={users}
				/>
			)}
		</Card>
	);
}
