import { Button, Card, Popconfirm, Tag } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useRouter } from "@/router/hooks";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { CircleLoading } from "@/components/loading";
import type { Category } from "#/entity";
import { categoryListMutation } from "@/api/services/saleService";
import { IconButton, Iconify } from "@/components/icon";

export default function ProductListPage() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const [isLoading, setLoading] = useState<boolean>(false);
	const [categories, setCategories] = useState<Category[]>([]);

	const categoryListCall = categoryListMutation();

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const data = await categoryListCall.mutateAsync();
				setCategories(data);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [categoryListCall.mutateAsync]);

	const columns: ColumnsType<Category> = [
		{
			title: t("sys.menu.categories.name"),
			dataIndex: "name",
			key: "name",
			sorter: (a, b) => {
				if (a.id === undefined || b.id === undefined) {
					return 0; // undefined değerleri karşılaştırıldığında sıralama yapılmaz
				}
				return a.id - b.id; // normal sıralama
			},
			render: (text) => <span className="font-semibold">{text}</span>,
		},
		{
			title: t("sys.menu.categories.description"),
			dataIndex: "description",
			key: "description",
			responsive: ["lg"],
			render: (text) => <span className="text-gray-500 text-sm">{text || "-"}</span>,
		},
		{
			title: t("sys.menu.categories.product_count"),
			dataIndex: "products",
			key: "products",
			align: "center",
			sorter: (a, b) => {
				if (a.products === undefined || b.products === undefined) {
					return 0; // undefined değerleri karşılaştırıldığında sıralama yapılmaz
				}
				return a.products.length - b.products.length; // normal sıralama
			},
			render: (products) => <Tag color={products.length > 0 ? "blue" : "red"}>{products.length}</Tag>,
		},
		{
			title: t("common.action"),
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray-500">
					<IconButton onClick={() => push(`/category/edit/${record.id}`)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm
						title={t("common.delete_question")}
						okText={t("common.delText")}
						cancelText={t("common.cancelText")}
						placement="left"
					>
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
			title={t("sys.menu.categories.list")}
			extra={
				<Button type="primary" icon={<PlusOutlined />} disabled={isLoading} onClick={() => push("/category/add")}>
					{t("common.add_new")}
				</Button>
			}
		>
			{isLoading ? (
				<CircleLoading />
			) : (
				<Table
					rowKey="id"
					// pagination={{ pageSize: 10 }}
					columns={columns}
					dataSource={categories}
					// scroll={{ x: "max-content" }}
				/>
			)}
		</Card>
	);
}
