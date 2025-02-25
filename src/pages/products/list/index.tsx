import { Button, Card, Popconfirm, Tag } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useRouter } from "@/router/hooks";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { CircleLoading } from "@/components/loading";
import type { Product } from "#/entity";
import { productListMutation } from "@/api/services/saleService";
import { IconButton, Iconify } from "@/components/icon";

export default function ProductListPage() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const [isLoading, setLoading] = useState<boolean>(false);
	const [products, setProducts] = useState<Product[]>([]);

	const productListCall = productListMutation();

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const data = await productListCall.mutateAsync();
				setProducts(data);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [productListCall.mutateAsync]);

	const columns: ColumnsType<Product> = [
		{
			title: t("sys.menu.products.name"),
			dataIndex: "name",
			key: "name",
			render: (text) => <span className="font-semibold">{text}</span>,
		},
		{
			title: t("sys.menu.products.category"),
			dataIndex: "cName",
			key: "cName",
			responsive: ["md"],
			render: (text) => <span>{text}</span>,
		},
		{
			title: t("sys.menu.products.description"),
			dataIndex: "description",
			key: "description",
			responsive: ["lg"],
			render: (text) => <span className="text-gray-500 text-sm">{text || "-"}</span>,
		},
		{
			title: t("sys.menu.products.stock_quantity"),
			dataIndex: "stockQuantity",
			key: "stockQuantity",
			align: "center",
			responsive: ["md"],
			render: (stock) => (
				<Tag color={stock > 0 ? "blue" : "red"}>{stock > 0 ? stock : t("sys.menu.products.out_of_stock")}</Tag>
			),
		},
		{
			title: t("sys.menu.products.sale_price"),
			dataIndex: "price",
			key: "price",
			align: "right",
			render: (price) => <span className="text-primary font-bold">{price.toFixed(2)} TL</span>,
		},
		{
			title: t("common.action"),
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray-500">
					<IconButton onClick={() => push(`/product/edit/${record.id}`)}>
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
			title={t("sys.menu.products.list")}
			extra={
				<Button type="primary" icon={<PlusOutlined />} disabled={isLoading} onClick={() => push("/product/add")}>
					{t("common.add_new")}
				</Button>
			}
		>
			{isLoading ? (
				<CircleLoading />
			) : (
				<Table
					rowKey="id"
					pagination={{ pageSize: 10 }}
					columns={columns}
					dataSource={products}
					scroll={{ x: "max-content" }}
				/>
			)}
		</Card>
	);
}
