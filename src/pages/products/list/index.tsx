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
			title: t("product.name"),
			dataIndex: "name",
			key: "name",
			render: (text) => <span className="font-semibold">{text}</span>,
		},
		{
			title: t("product.description"),
			dataIndex: "description",
			key: "description",
			responsive: ["lg"],
			render: (text) => <span className="text-gray-500 text-sm">{text || "-"}</span>,
		},
		{
			title: t("product.stock"),
			dataIndex: "stockQuantity",
			key: "stockQuantity",
			align: "center",
			responsive: ["md"],
			render: (stock) => <Tag color={stock > 0 ? "blue" : "red"}>{stock > 0 ? stock : t("product.out_of_stock")}</Tag>,
		},
		{
			title: t("product.price"),
			dataIndex: "price",
			key: "price",
			align: "right",
			render: (price) => <span className="text-primary font-bold">{price.toFixed(2)} TL</span>,
		},
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray-500">
					<IconButton onClick={() => push(`/products/edit/${record.id}`)}>
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
			title={t("sys.menu.products.list")}
			extra={
				<Button type="primary" icon={<PlusOutlined />} disabled={isLoading} onClick={() => push("/products/add")}>
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
