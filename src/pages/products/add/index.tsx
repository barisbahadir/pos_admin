import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Upload, message } from "antd";
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
import type { UploadProps } from "antd/lib";
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
		price: 10.0,
		categoryId: undefined,
		barcode: "",
		stockQuantity: 100,
		description: "",
		image: "",
	} as Product;

	const [isLoading, setLoading] = useState(false);
	const [categories, setCategories] = useState<{ label: string; value: number }[]>([]);
	const [imageBase64, setImageBase64] = useState<string | null>(null);

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
					toast.error(err?.message || "Urun bilgileri getirilirken bir hata olustu!");
				} finally {
					setLoading(false);
				}
			};
			fetchData();
		}
	}, [id, productByIdCall.mutateAsync, form.setFieldsValue]);

	useEffect(() => {
		if (categories.length === 0) {
			setLoading(true);
			const fetchCategories = async () => {
				setLoading(true);
				try {
					const data = await categoriesCall.mutateAsync();
					if (data && data.length > 0) {
						const categories = data
							.filter((c) => c.id !== undefined)
							.map((c) => {
								return { label: c.name, value: c.id as number };
							});

						setCategories(categories);

						if (categories.length > 0 && form.getFieldValue("categoryId") === undefined) {
							form.setFieldsValue({ categoryId: categories[0].value });
						}
					}
				} catch (err) {
					setCategories([
						{
							label: "Default Category",
							value: 1,
						},
					]);
				} finally {
					setLoading(false);
				}
			};
			fetchCategories();
		}
	}, [categories, form, categoriesCall.mutateAsync]);

	const handleGenerateBarcode = () => {
		const newBarcode = generateBarcode();
		form.setFieldsValue({ barcode: newBarcode }); // Formun değerini güncelle
	};

	const onFinish = async (values: Partial<Product>) => {
		setLoading(true);

		const categoryIdValue = values.categoryId;
		values.categoryId = undefined;
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
			} else {
				await productAddCall.mutateAsync(formValues);
			}
			toast.success(id ? "Ürün başarıyla güncellendi!" : "Yeni ürün başarıyla eklendi!");
		} catch (error) {
			message.error("Bir hata oluştu, lütfen tekrar deneyin.");
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
				message.error("Resim yüklenirken bir hata oluştu.");
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
						<Form.Item label="Ürün Adı" name="name" rules={[{ required: true, message: t("common.required_message") }]}>
							<Input placeholder="Ürün adını girin" style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					<Col md={12} sm={24} xs={24}>
						<Form.Item
							label="Kategori"
							name="categoryId"
							rules={[{ required: true, message: t("common.required_message") }]}
						>
							<Select
								placeholder="Kategori seçiniz"
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
							label="Alis Fiyati"
							name="purchasePrice"
							rules={[{ required: false, message: t("common.required_message") }]}
						>
							<InputNumber
								min={0}
								precision={2}
								placeholder="Alis fiyati giriniz"
								style={{ width: "100%" }}
								addonAfter="TL"
							/>
						</Form.Item>
					</Col>
					<Col md={6} sm={12} xs={12}>
						<Form.Item
							label="Kar Orani"
							name="profitMargin"
							rules={[{ required: false, message: t("common.required_message") }]}
						>
							<InputNumber min={0} placeholder="Vergi orani giriniz" style={{ width: "100%" }} addonAfter="%" />
						</Form.Item>
					</Col>
					<Col md={6} sm={12} xs={12}>
						<Form.Item
							label="Vergi Orani"
							name="taxRate"
							rules={[{ required: true, message: t("common.required_message") }]}
						>
							<InputNumber
								min={0}
								max={100}
								placeholder="Vergi orani giriniz"
								style={{ width: "100%" }}
								addonAfter="%"
							/>
						</Form.Item>
					</Col>
					<Col md={6} sm={12} xs={12}>
						<Form.Item
							label={<b>Satis Fiyati</b>}
							name="price"
							rules={[{ required: true, message: t("common.required_message") }]}
						>
							<InputNumber
								min={0}
								precision={2}
								placeholder="Satis fiyati giriniz"
								style={{ width: "100%" }}
								addonAfter={<b>TL</b>}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col md={12} sm={24} xs={24}>
						<Form.Item
							label="Stok Miktarı"
							name="stockQuantity"
							rules={[{ required: true, message: t("common.required_message") }]}
						>
							<InputNumber min={1} placeholder="Stok miktarı giriniz" style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					<Col md={12} sm={24} xs={24}>
						<Form.Item
							label="Barkod"
							name="barcode"
							rules={[{ required: true, message: t("common.required_message") }]}
						>
							<Input
								addonBefore={<BarcodeOutlined />}
								addonAfter={
									<p className="cursor-pointer" onClick={handleGenerateBarcode}>
										{" Barkod Uret"}
									</p>
								}
								placeholder="Barkod giriniz"
								style={{ width: "100%" }}
							/>
							{/* <Button
								type="primary"
								icon={<BarcodeOutlined />}
								onClick={() => setGenerateValue(prev => !prev)}
							>
								Barkod Üret
							</Button> */}
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col md={12} sm={24} xs={24}>
						<Form.Item label="Açıklama" name="description">
							<Input.TextArea rows={4} placeholder="Ürün açıklamasını giriniz" style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					<Col md={12} sm={24} xs={24}>
						<Form.Item
							label="Ürün Resmi"
							name="description"
							rules={[{ required: false, message: "Ürün resmi yükleyebilirsiniz" }]}
						>
							<ImgCrop rotationSlider>
								<Upload
									multiple={false}
									listType="picture-card"
									beforeUpload={() => false} // Yükleme işlemini durduruyoruz, çünkü biz sadece base64 işlemi yapacağız
									onChange={handleChange}
								>
									{imageBase64 ? (
										<img
											src={imageBase64}
											alt="Resim"
											style={{
												width: "100%",
												height: "100px", // Sabit yükseklik belirliyoruz
												objectFit: "contain", // Resmi kutuya sığdır
												backgroundColor: "#f5f5f5", // Boşlukları belirginleştirmek için
											}}
										/>
									) : (
										<div>
											<PlusOutlined />
											<div style={{ marginTop: 8 }}>Urun Gorseli Yükle</div>
										</div>
									)}
								</Upload>
							</ImgCrop>
						</Form.Item>
					</Col>
				</Row>

				<Row justify="center">
					<Button
						type="primary"
						htmlType="submit"
						loading={isLoading}
						// disabled={isLoading}
						icon={<PlusOutlined />}
						style={{ marginTop: "15px", minWidth: "150px" }}
					>
						{id ? "Güncelle" : "Kaydet"}
					</Button>
				</Row>
			</Form>
		</Card>
	);
}
