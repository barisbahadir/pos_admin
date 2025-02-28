import { Card, Tag } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleLoading } from "@/components/loading";
import type { SystemLog } from "#/api";
import { systemLogListMutation } from "@/api/services/systemService";
import { formatApiDate } from "@/utils/api-utils";

export default function SystemLogPage() {
	const { t } = useTranslation();
	const [isLoading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<SystemLog[]>([]);
	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

	const logListCall = systemLogListMutation();

	const handleExpand = (expanded: boolean, record: any) => {
		if (expanded) {
			setExpandedRowKeys([...expandedRowKeys, record.id]);
		} else {
			setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.id));
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			await handleData();
		};

		fetchData();
	}, []);

	const handleData = async () => {
		setLoading(true);
		try {
			const data = await logListCall.mutateAsync();
			setData(data);
		} finally {
			setLoading(false);
		}
	};

	const columns: ColumnsType<SystemLog> = [
		{
			title: "Status",
			dataIndex: "statusCode",
			key: "statusCode",
			align: "center",
			width: "10%",
			// responsive: ["lg"],
			render: (text) => <Tag color={text === 200 ? "blue" : "red"}>{text}</Tag>,
		},
		{
			title: "Log Date",
			dataIndex: "logDate",
			key: "logDate",
			align: "center",
			render: (text) => <span className="font-semibold">{formatApiDate(text)}</span>,
		},
		{
			title: "User",
			dataIndex: "email",
			key: "email",
			align: "left",
			// responsive: ["lg"],
			render: (text) => <span className="text-sm">{text || "-"}</span>,
		},
		{
			title: "Message",
			dataIndex: "errorMessage",
			key: "errorMessage",
			align: "left",
			// responsive: ["lg"],
			render: (text) => <span className="font-semibold text-sm">{text || "-"}</span>,
		},
	];

	return (
		<Card title={t("sys.menu.system.log")}>
			{isLoading ? (
				<CircleLoading />
			) : (
				<Table
					rowKey="id"
					pagination={{
						pageSize: 15,
						position: ["bottomCenter"],
					}}
					columns={columns}
					dataSource={data}
					expandable={{
						expandedRowKeys,
						onExpand: handleExpand,
						expandedRowRender: (record) => (
							<div
								style={{
									wordBreak: "break-word",
									maxWidth: "100%", // Satır genişliğini sınırlamak için
									overflowX: "auto", // Geniş veri olduğunda yatay kaydırma eklemek için
									margin: "5px",
								}}
							>
								<p>{record.errorDetailedMessage}</p>
							</div>
						),
					}}
				/>
			)}
		</Card>
	);
}
