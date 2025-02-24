import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Upload, message } from "antd";
import { useEffect, useState } from "react";
import type { Product } from "#/entity";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { categoryListMutation } from "@/api/services/saleService";
import type { UploadProps } from "antd/lib";
import ImgCrop from "antd-img-crop";

export default function ProductAddPage() {
	const { t } = useTranslation();
	const { id } = useParams<{ id?: string }>();
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [isLoading, setLoading] = useState(false);
	const [categories, setCategories] = useState<{ label: string; value: number }[]>([]);
	const [imageBase64, setImageBase64] = useState<string | null>(null);

	const categoriesCall = categoryListMutation();

	useEffect(() => {
		if (id) {
			setLoading(true);
			// productService.getProductById(id).then((data: Product) => {
			// 	form.setFieldsValue(data);
			// 	setLoading(false);
			// });
		}
	}, [id]);

	useEffect(() => {
		if (categories.length === 0) {
			setLoading(true);
			const fetchCategories = async () => {
				setLoading(true);
				try {
					const data = await categoriesCall.mutateAsync();
					if (data && data.length > 0) {
						const categories = data.map((c) => {
							return { label: c.name, value: c.id };
						});
						setCategories(categories);
						if (categories.length > 0) {
							form.setFieldsValue({ category: categories[0].value });
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
	}, [categories, form, categoriesCall.mutateAsync]); // 'form' bağımlılığı gereksiz

	const onFinish = async (values: Partial<Product>) => {
		setLoading(true);
		console.log("values", values);
		try {
			if (id) {
				// await productService.updateProduct(id, { ...values, image: imageBase64 });
				message.success("Ürün başarıyla güncellendi!");
			} else {
				// await productService.createProduct({ ...values, image: imageBase64 });
				message.success("Yeni ürün başarıyla eklendi!");
			}
			navigate("/products");
		} catch (error) {
			message.error("Bir hata oluştu, lütfen tekrar deneyin.");
		} finally {
			setLoading(false);
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

	return (
		<Card title={id ? t("sys.menu.products.edit") : t("sys.menu.products.add")}>
			<Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ price: 10, stockQuantity: 100 }}>
				<Row gutter={24}>
					<Col md={12} sm={24}>
						<Form.Item label="Ürün Adı" name="name" rules={[{ required: true, message: "Ürün adı gereklidir!" }]}>
							<Input placeholder="Ürün adını girin" style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					<Col md={12} sm={24}>
						<Form.Item label="Fiyat" name="price" rules={[{ required: true, message: "Fiyat gereklidir!" }]}>
							<InputNumber min={0} precision={2} placeholder="Fiyat girin" style={{ width: "100%" }} addonAfter="TL" />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col md={12} sm={24}>
						<Form.Item label="Kategori" name="category" rules={[{ required: true, message: "Kategori seçiniz!" }]}>
							<Select placeholder="Kategori seçiniz" options={categories} loading={isLoading} />
						</Form.Item>
					</Col>
					<Col md={12} sm={24}>
						<Form.Item label="Barkod" name="barcode" rules={[{ required: true, message: "Barkod gereklidir!" }]}>
							<Input placeholder="Barkod girin" style={{ width: "100%" }} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col md={12} sm={24}>
						<Form.Item
							label="Stok Miktarı"
							name="stockQuantity"
							rules={[{ required: true, message: "Stok miktarı gereklidir!" }]}
						>
							<InputNumber min={1} placeholder="Stok miktarı girin" style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					<Col md={12} sm={24}>
						Diger input
					</Col>
				</Row>

				<Row gutter={24}>
					<Col md={12} sm={24}>
						<Form.Item label="Açıklama" name="description">
							<Input.TextArea rows={4} placeholder="Ürün açıklamasını girin" style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					<Col md={12} sm={24}>
						<Form.Item
							label="Urun Resmi"
							name="description"
							rules={[{ required: false, message: "Urun resmi yukleyebilirsiniz" }]}
						>
							<div>
								<ImgCrop rotationSlider>
									<Upload
										multiple={false}
										listType="picture-card"
										beforeUpload={() => false} // Yükleme işlemini durduruyoruz, çünkü biz sadece base64 işlemi yapacağız
										onChange={handleChange}
									>
										{imageBase64 ? (
											<img src={imageBase64} alt="Resim" style={{ width: "100%" }} />
										) : (
											<div>
												<PlusOutlined />
												<div style={{ marginTop: 8 }}>Urun Gorseli Yükle</div>
											</div>
										)}
									</Upload>
								</ImgCrop>
							</div>
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
						{id ? "Güncelle" : "Kaydet"}
					</Button>
				</Row>
			</Form>
		</Card>
	);
}
