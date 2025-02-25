import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Upload } from "antd";
import type { Product } from "#/entity";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { BarcodeOutlined, PlusOutlined } from "@ant-design/icons";
import {
	categoryListMutation,
	productAddMutation,
	productByIdMutation,
	productEditMutation,
} from "@/api/services/saleService";
import type { UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductAddPage() {
	const { t } = useTranslation();
	const { id } = useParams<{ id?: string }>();
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const defaultFormValues = {
		name: "",
		cId: null,
		purchasePrice: 50.0,
		taxRate: 10,
		price: 55.0,
		barcode: "",
		stockQuantity: 100,
		description: "",
		image: "",
	} as Product;

	const [dataLoading, setLoading] = useState(false);
	const [categoriesLoading, setCategoriesLoading] = useState(true);
	const [categories, setCategories] = useState<{ label: string; value: number }[]>([]);
	const [imageBase64, setImageBase64] = useState<string | null>(null);

	const isLoading = dataLoading || categoriesLoading;

	const categoriesCall = categoryListMutation();
	const productByIdCall = productByIdMutation();
	const productAddCall = productAddMutation();
	const productEditCall = productEditMutation();

	useEffect(() => {
		if (id) {
			setLoading(true);
			const fetchData = async () => {
				setLoading(true);
				try {
					const data = await productByIdCall.mutateAsync(id);
					if (data) {
						form.setFieldsValue(data);

						if (data.image) setImageBase64(data.image);
					}
				} catch (err) {
					toast.error(err?.message || "System Error");
				} finally {
					setLoading(false);
				}
			};
			fetchData();
		}
	}, [id, productByIdCall.mutateAsync, form.setFieldsValue]);

	useEffect(() => {
		if (categories.length === 0) {
			setCategoriesLoading(true);
			const fetchCategories = async () => {
				try {
					const data = await categoriesCall.mutateAsync();
					if (data && data.length > 0) {
						const categories = data
							.filter((c) => c.id !== undefined)
							.map((c) => {
								return { label: c.name, value: c.id as number };
							});

						setCategories(categories);
					}
				} catch (err) {
					setCategories([
						{
							label: "Category",
							value: 1,
						},
					]);
				} finally {
					setCategoriesLoading(false);
				}
			};
			fetchCategories();
		}
	}, [categories, categoriesCall.mutateAsync]);

	const handleGenerateBarcode = () => {
		const newBarcode = generateBarcode();
		form.setFieldsValue({ barcode: newBarcode });
	};

	const onFinish = async (values: Partial<Product>) => {
		setLoading(true);

		const categoryIdValue = values.cId;
		values.cId = undefined;
		const formValues = {
			...values,
			image: imageBase64,
			category: {
				id: categoryIdValue,
			},
		} as Product;

		try {
			if (id) {
				await productEditCall.mutateAsync({ id: Number(id), ...formValues });
				toast.success(t("sys.menu.products.success_update"));
			} else {
				await productAddCall.mutateAsync(formValues);
				toast.success(t("sys.menu.products.success_add"));
			}
		} catch (error) {
			toast.error(t("sys.menu.products.error_general"));
		} finally {
			form.resetFields();
			setLoading(false);
			navigate("/product/list");
		}
	};

	// Dosyayı base64 formatına dönüştüren fonksiyon
	const getBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string); // Başarılı olduğunda base64 döndür
			reader.onerror = (error) => reject(error); // Hata durumunda hata mesajı döndür
		});
	};

	// Yükleme değiştiğinde çağrılan fonksiyon
	const handleChange: UploadProps["onChange"] = async ({ fileList }) => {
		const file = fileList[0];
		if (file?.originFileObj) {
			try {
				const base64 = await getBase64(file.originFileObj as File); // Base64 dönüşümü
				setImageBase64(base64); // Base64'i state'e kaydet
				form.setFieldsValue({ image: base64 }); // Base64'i form'a set et
			} catch (error) {
				toast.error("sys.menu.products.image_upload_error");
			}
		}
	};

	const generateBarcode = () => {
		return Math.random().toString(36).substring(2, 12).toUpperCase();
	};

	// Satış fiyatını hesaplayan fonksiyon
	const calculatePrice = (purchasePrice: number, profitMargin: number, taxRate: number) => {
		const calculatedPrice = purchasePrice + (purchasePrice * profitMargin) / 100 + (purchasePrice * taxRate) / 100;
		return calculatedPrice;
	};

	const onValuesChange = (changedValues: any, allValues: Partial<Product>) => {
		const { purchasePrice, profitMargin, taxRate } = allValues;
		console.log("changedValues", changedValues);

		// Eğer değerlerden herhangi biri değişirse satış fiyatını hesapla
		if (purchasePrice !== undefined && profitMargin !== undefined && taxRate !== undefined) {
			const price = calculatePrice(purchasePrice, profitMargin, taxRate);
			form.setFieldsValue({ price });
		}
	};

	return (
		<Card title={id ? t("sys.menu.products.edit") : t("sys.menu.products.add")}>
			<Form
				form={form}
				disabled={isLoading}
				onValuesChange={onValuesChange}
				layout="vertical"
				onFinish={onFinish}
				initialValues={defaultFormValues}
			>
				<Row gutter={24}>
					<Col md={12} sm={24} xs={24}>
						<Form.Item
							label={t("sys.menu.products.name")}
							name="name"
							rules={[{ required: true, message: t("common.required_message") }]}
						>
							<Input placeholder={t("sys.menu.products.name_placeholder")} style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					<Col md={12} sm={24} xs={24}>
						<Form.Item
							label={t("sys.menu.products.category")}
							name="cId"
							rules={[{ required: true, message: t("common.required_message") }]}
						>
							<Select
								placeholder={t("sys.menu.products.category_placeholder")}
								options={categories}
								loading={isLoading}
								disabled={isLoading}
								allowClear
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col md={6} sm={12} xs={12}>
						<Form.Item
							label={t("sys.menu.products.purchase_price")}
							name="purchasePrice"
							rules={[{ required: false, message: t("common.required_message") }]}
						>
							<InputNumber
								min={0}
								precision={2}
								placeholder={t("sys.menu.products.purchase_price_placeholder")}
								style={{ width: "100%" }}
								addonAfter="TL"
							/>
						</Form.Item>
					</Col>
					<Col md={6} sm={12} xs={12}>
						<Form.Item
							label={t("sys.menu.products.profit_margin")}
							name="profitMargin"
							rules={[{ required: false, message: t("common.required_message") }]}
						>
							<InputNumber
								min={0}
								placeholder={t("sys.menu.products.profit_margin_placeholder")}
								style={{ width: "100%" }}
								addonAfter="%"
							/>
						</Form.Item>
					</Col>
					<Col md={6} sm={12} xs={12}>
						<Form.Item
							label={t("sys.menu.products.tax_rate")}
							name="taxRate"
							rules={[{ required: true, message: t("common.required_message") }]}
						>
							<InputNumber
								min={0}
								max={100}
								placeholder={t("sys.menu.products.tax_rate_placeholder")}
								style={{ width: "100%" }}
								addonAfter="%"
							/>
						</Form.Item>
					</Col>
					<Col md={6} sm={12} xs={12}>
						<Form.Item
							label={<b>{t("sys.menu.products.sale_price")}</b>}
							name="price"
							rules={[{ required: true, message: t("common.required_message") }]}
						>
							<InputNumber
								min={0}
								precision={2}
								placeholder={t("sys.menu.products.sale_price_placeholder")}
								style={{ width: "100%" }}
								addonAfter={<b>TL</b>}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col md={12} sm={24} xs={24}>
						<Form.Item
							label={t("sys.menu.products.stock_quantity")}
							name="stockQuantity"
							rules={[{ required: true, message: t("common.required_message") }]}
						>
							<InputNumber
								min={1}
								placeholder={t("sys.menu.products.stock_quantity_placeholder")}
								style={{ width: "100%" }}
							/>
						</Form.Item>
					</Col>
					<Col md={12} sm={24} xs={24}>
						<Form.Item
							label={t("sys.menu.products.barcode")}
							name="barcode"
							rules={[{ required: true, message: t("common.required_message") }]}
						>
							<Input
								addonBefore={<BarcodeOutlined />}
								addonAfter={
									<p className="cursor-pointer" onClick={handleGenerateBarcode}>
										{t("sys.menu.products.generate_barcode")}
									</p>
								}
								placeholder={t("sys.menu.products.barcode_placeholder")}
								style={{ width: "100%" }}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col md={12} sm={24} xs={24}>
						<Form.Item label={t("sys.menu.products.description")} name="description">
							<Input.TextArea
								rows={4}
								placeholder={t("sys.menu.products.description_placeholder")}
								style={{ width: "100%" }}
							/>
						</Form.Item>
					</Col>
					<Col md={12} sm={24} xs={24}>
						<Form.Item
							label={t("sys.menu.products.image")}
							name="description"
							rules={[{ required: false, message: t("sys.menu.products.upload_image") }]}
						>
							<ImgCrop rotationSlider>
								<div style={{ display: "flex", alignItems: "center" }}>
									<Upload
										multiple={false}
										maxCount={1}
										listType="picture-card"
										onChange={handleChange}
										showUploadList={false} // Upload list görünmesin
										beforeUpload={() => false}
									>
										{imageBase64 ? (
											<img
												src={imageBase64}
												alt="Resim"
												style={{
													borderRadius: "8px",
													width: "100%",
													height: "100px",
													objectFit: "contain",
												}}
											/>
										) : (
											<div>
												<PlusOutlined />
												<div style={{ marginTop: 8 }}>{t("sys.menu.products.upload_image")}</div>
											</div>
										)}
									</Upload>
									{imageBase64 && (
										<Button
											type="dashed"
											onClick={() => {
												setImageBase64(null);
												form.setFieldsValue({ image: "" }); // Base64'i form'a set et
											}} // handleDelete fonksiyonunu oluşturmalısınız
											className="ml-4"
										>
											{t("common.delText")}
										</Button>
									)}
								</div>
							</ImgCrop>
						</Form.Item>
					</Col>
				</Row>

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
