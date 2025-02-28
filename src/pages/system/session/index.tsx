import { Button, Card, Col, Form, Row, Select, Space, Tag } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleLoading } from "@/components/loading";
import type { UserSession } from "#/api";
import { sessionListMutation } from "@/api/services/systemService";
import { formatApiDate } from "@/utils/api-utils";

enum SessionStatusFilter {
	All = "All",
	Active = "Active",
	Passive = "Passive",
}

export default function SessionListPage() {
	const { t } = useTranslation();
	const [isLoading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<UserSession[]>([]);
	const [filteredData, setFilteredData] = useState<UserSession[]>([]);
	const [searchForm] = Form.useForm();
	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
	const defaultStatusFilter = SessionStatusFilter.Active;

	const dataCall = sessionListMutation();

	useEffect(() => {
		const fetchData = async () => {
			await handleData();
		};

		fetchData();
	}, []);

	const handleData = async () => {
		setLoading(true);
		try {
			const data = await dataCall.mutateAsync();
			setData(data);
			setFilteredData(data.filter((item) => !item.logoutDate));
		} finally {
			setLoading(false);
		}
	};

	const handleFilteredData = (status: SessionStatusFilter) => {
		let filteredData = [];
		if (status === SessionStatusFilter.Active) {
			filteredData = data.filter((item) => !item.logoutDate);
		} else if (status === SessionStatusFilter.Passive) {
			filteredData = data.filter((item) => item.logoutDate);
		} else {
			filteredData = data;
		}
		setFilteredData(filteredData);
	};

	const onSearchFormReset = () => {
		searchForm.resetFields();
		handleFilteredData(defaultStatusFilter);
	};

	const columns: ColumnsType<UserSession> = [
		{
			title: "User",
			dataIndex: "email",
			key: "email",
			align: "left",
			// responsive: ["lg"],
			render: (text) => <span>{text || "-"}</span>,
		},
		{
			title: "Login Date",
			dataIndex: "loginDate",
			key: "loginDate",
			align: "center",
			render: (text) => <span>{formatApiDate(text)}</span>,
		},
		{
			title: "Planned Expire Date",
			dataIndex: "tokenExpireDate",
			key: "tokenExpireDate",
			align: "center",
			render: (text) => <span>{formatApiDate(text)}</span>,
		},
		{
			title: "Session End Date",
			dataIndex: "statusCode",
			key: "statusCode",
			// responsive: ["lg"],
			render: (_, record) => {
				return record.logoutDate ? (
					<span className="font-semibold">{formatApiDate(record.logoutDate)}</span>
				) : (
					<Tag color="green">{SessionStatusFilter.Active.toString()}</Tag>
				);
			},
		},
	];

	const handleExpand = (expanded: boolean, record: any) => {
		if (expanded) {
			setExpandedRowKeys([...expandedRowKeys, record.id]);
		} else {
			setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.id));
		}
	};

	return (
		<Space direction="vertical" size="large" className="w-full">
			<Card>
				<Form
					form={searchForm}
					onFinish={(values) => handleFilteredData(values?.status || "")}
					initialValues={{ status: defaultStatusFilter }}
				>
					<Row gutter={[16, 16]}>
						{/* <Col span={24} lg={6}>
							<Form.Item label="Name" name="name" className="!mb-0">
								<Input />
							</Form.Item>
						</Col> */}
						<Col span={24} lg={8}>
							<Form.Item label={<b>Session Status</b>} name="status" className="!mb-0">
								<Select>
									<Select.Option value={SessionStatusFilter.Active}>
										<Tag color="green">{SessionStatusFilter.Active.toString()}</Tag>
									</Select.Option>
									<Select.Option value={SessionStatusFilter.Passive}>
										<Tag color="error">{SessionStatusFilter.Passive.toString()}</Tag>
									</Select.Option>
									<Select.Option value={SessionStatusFilter.All}>
										<Tag color="blue">{SessionStatusFilter.All.toString()}</Tag>
									</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={24} lg={16}>
							<div className="flex justify-end">
								<Button onClick={onSearchFormReset} disabled={isLoading}>
									{t("common.resetText")}
								</Button>
								<Button type="primary" className="ml-4" disabled={isLoading} htmlType="submit">
									{t("common.filterText")}
								</Button>
							</div>
						</Col>
					</Row>
				</Form>
			</Card>

			<Card title={t("sys.menu.system.session")}>
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
						dataSource={filteredData}
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
									<p>{record.token}</p>
								</div>
							),
						}}
					/>
				)}
			</Card>
		</Space>
	);
}
