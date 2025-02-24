import { Button, Card, Col, Form, Input, InputNumber, Modal, Popconfirm, Radio, Row, Select, Space, Tag } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { useEffect, useState } from "react";

import { organizationListMutation } from "@/api/services/systemService";
import { IconButton, Iconify } from "@/components/icon";

import OrganizationChart from "./organization-chart";

import type { Organization } from "#/entity";
import { BaseStatus } from "#/enum";
import { CircleLoading } from "@/components/loading";

type OrganizationModalProps = {
	formValue: Organization;
	title: string;
	show: boolean;
	onOk: VoidFunction;
	onCancel: VoidFunction;
};

type SearchFormFieldType = Pick<Organization, "name" | "status">;

export default function OrganizationPage() {
	const [modalForm] = Form.useForm();
	const [searchForm] = Form.useForm();

	const [isLoading, setLoading] = useState<boolean>(false);
	const [organizations, setOrganizations] = useState<Organization[]>([]);

	const organizationListCall = organizationListMutation();

	useEffect(() => {
		if (organizations.length === 0) {
			const fetchData = async () => {
				setLoading(true);
				try {
					const data = await organizationListCall.mutateAsync();
					setOrganizations(data);
				} finally {
					setLoading(false);
				}
			};

			fetchData();
		}
	}, [organizations, organizationListCall.mutateAsync]);

	const [organizationModalPros, setOrganizationModalProps] = useState<OrganizationModalProps>({
		formValue: {
			id: "",
			name: "",
			status: BaseStatus.ENABLE,
		},
		title: "New",
		show: false,
		onOk: () => {
			setOrganizationModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setOrganizationModalProps((prev) => ({ ...prev, show: false }));
		},
	});

	const columns: ColumnsType<Organization> = [
		{ title: "Name", dataIndex: "name", width: 300 },
		{ title: "Order", dataIndex: "orderValue", align: "center", width: 60 },
		{
			title: "Status",
			dataIndex: "status",
			align: "center",
			width: 120,
			render: (status) => <Tag color={status === BaseStatus.ENABLE ? "success" : "error"}>{status}</Tag>,
		},
		{ title: "Description", dataIndex: "description", align: "center", width: 300 },
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
					<Popconfirm title="Delete the Organization" okText="Yes" cancelText="No" placement="left">
						<IconButton>
							<Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
						</IconButton>
					</Popconfirm>
				</div>
			),
		},
	];

	// rowSelection objects indicates the need for row selection
	const rowSelection: TableRowSelection<Organization> = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
		},
		onSelect: (record, selected, selectedRows) => {
			console.log(record, selected, selectedRows);
		},
		onSelectAll: (selected, selectedRows, changeRows) => {
			console.log(selected, selectedRows, changeRows);
		},
	};

	const onSearchFormReset = () => {
		searchForm.resetFields();
	};

	const onCreate = () => {
		setOrganizationModalProps((prev) => ({
			...prev,
			show: true,
			title: "Create New",
			formValue: {
				...prev.formValue,
				id: "",
				name: "",
				order: 1,
				description: "",
				status: BaseStatus.ENABLE,
			},
		}));
	};

	const onEdit = (formValue: Organization) => {
		setOrganizationModalProps((prev) => ({
			...prev,
			show: true,
			title: "Edit",
			formValue,
		}));
	};

	return (
		<Space direction="vertical" size="large" className="w-full">
			<Card>
				<Form form={searchForm}>
					<Row gutter={[16, 16]}>
						<Col span={24} lg={6}>
							<Form.Item<SearchFormFieldType> label="Name" name="name" className="!mb-0">
								<Input />
							</Form.Item>
						</Col>
						<Col span={24} lg={6}>
							<Form.Item<SearchFormFieldType> label="Status" name="status" className="!mb-0">
								<Select>
									<Select.Option value={BaseStatus.ENABLE}>
										<Tag color="success">Enable</Tag>
									</Select.Option>
									<Select.Option value={BaseStatus.DISABLE}>
										<Tag color="error">Disable</Tag>
									</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={24} lg={12}>
							<div className="flex justify-end">
								<Button onClick={onSearchFormReset} disabled={isLoading}>
									Reset
								</Button>
								<Button type="primary" className="ml-4" disabled={isLoading}>
									Search
								</Button>
							</div>
						</Col>
					</Row>
				</Form>
			</Card>

			<Card
				title="Organization List"
				extra={
					<Button type="primary" onClick={onCreate} disabled={isLoading}>
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
						dataSource={organizations}
						rowSelection={{ ...rowSelection }}
					/>
				)}
			</Card>

			<Card title="Organization Chart">
				{isLoading ? <CircleLoading /> : <OrganizationChart organizations={organizations} />}
			</Card>

			<Modal
				title={organizationModalPros.title}
				open={organizationModalPros.show}
				onOk={organizationModalPros.onOk}
				onCancel={organizationModalPros.onCancel}
			>
				<Form
					initialValues={organizationModalPros.formValue}
					form={modalForm}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 18 }}
					layout="horizontal"
				>
					<Form.Item<Organization> label="Name" name="name" required>
						<Input />
					</Form.Item>
					<Form.Item<Organization> label="Order" name="orderValue" required>
						<InputNumber style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item<Organization> label="Status" name="status" required>
						<Radio.Group optionType="button" buttonStyle="solid">
							<Radio value={BaseStatus.ENABLE}> Enable </Radio>
							<Radio value={BaseStatus.DISABLE}> Disable </Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item<Organization> label="Description" name="description">
						<Input.TextArea />
					</Form.Item>
				</Form>
			</Modal>
		</Space>
	);
}
