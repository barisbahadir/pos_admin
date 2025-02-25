import { Card } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleLoading } from "@/components/loading";

export default function OrderProductsPage() {
	const { t } = useTranslation();

	const [isLoading] = useState<boolean>(false);

	return <Card title={t("sys.menu.categories.order")}>{isLoading ? <CircleLoading /> : <>Table</>}</Card>;
}
