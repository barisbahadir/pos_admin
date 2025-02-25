import { Button, Card, Form, Input, Row } from "antd";
import type { Category } from "#/entity";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { categoryAddMutation, categoryByIdMutation, categoryEditMutation } from "@/api/services/saleService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CategoryAddPage() {
	const { t } = useTranslation();
	const { id } = useParams<{ id?: string }>();
	const navigate = useNavigate();
	const [form] = Form.useForm();

	const defaultFormValues = {
		name: "",
		description: "",
	} as Category;

	const [isLoading, setLoading] = useState(false);

	const categoryByIdCall = categoryByIdMutation();
	const categoryAddCall = categoryAddMutation();
	const categoryEditCall = categoryEditMutation();

	useEffect(() => {
		if (id) {
			setLoading(true);
			const fetchData = async () => {
				setLoading(true);
				try {
					const data = await categoryByIdCall.mutateAsync(id);
					if (data) {
						form.setFieldsValue(data);
					}
				} catch (err) {
					toast.error(err?.message || "System Error");
				} finally {
					setLoading(false);
				}
			};
			fetchData();
		}
	}, [id, categoryByIdCall.mutateAsync, form.setFieldsValue]);

	const onFinish = async (values: Partial<Category>) => {
		setLoading(true);
		const formValues = {
			...values,
			products: [],
		} as Category;

		try {
			if (id) {
				await categoryEditCall.mutateAsync({ id: Number(id), ...formValues });
				toast.success(t("sys.menu.categories.success_update"));
			} else {
				await categoryAddCall.mutateAsync(formValues);
				toast.success(t("sys.menu.categories.success_add"));
			}
		} catch (error) {
			toast.error(t("sys.menu.categories.error_general"));
		} finally {
			form.resetFields();
			setLoading(false);
			navigate("/category/list");
		}
	};

	return (
		<Card title={id ? t("sys.menu.categories.edit") : t("sys.menu.categories.add")}>
			<Form form={form} disabled={isLoading} layout="vertical" onFinish={onFinish} initialValues={defaultFormValues}>
				<Form.Item
					label={t("sys.menu.categories.name")}
					name="name"
					rules={[{ required: true, message: t("common.required_message") }]}
				>
					<Input placeholder={t("sys.menu.categories.name_placeholder")} style={{ width: "100%" }} />
				</Form.Item>

				<Form.Item label={t("sys.menu.categories.description")} name="description">
					<Input.TextArea
						rows={4}
						placeholder={t("sys.menu.categories.description_placeholder")}
						style={{ width: "100%" }}
					/>
				</Form.Item>

				<Row justify="center">
					<Button
						type="primary"
						htmlType="submit"
						loading={isLoading}
						icon={<PlusOutlined />}
						style={{ marginTop: "15px", minWidth: "150px" }}
					>
						{id ? t("common.updateText") : t("common.saveText")}
					</Button>
				</Row>
			</Form>
		</Card>
	);
}
