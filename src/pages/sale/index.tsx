import { useEffect, useState } from "react";
import { Card, Row, Col, Button, InputNumber, Collapse, Typography, Tooltip, Modal } from "antd";
import {
	CreditCardOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlusOutlined,
	ShoppingCartOutlined,
} from "@ant-design/icons";
import { PaymentTypes, ThemeMode } from "#/enum";
import { useSettings } from "@/store/settingStore";
import { useTranslation } from "react-i18next";
import "./sale.css";
import type { CartItem, Category, Product, Transaction, TransactionItem } from "#/entity";
import { CircleLoading } from "@/components/loading";
import { Iconify } from "@/components/icon";
import { categoryListMutation, transactionSaveMutation } from "@/api/services/saleService";
import { useNavigate } from "react-router";

export default function SalePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { themeMode } = useSettings();
	const backgroundColor = themeMode === ThemeMode.Light ? "rgb(244, 246, 248)" : "rgba(145, 158, 171, 0.12)";

	const [isLoading, setLoading] = useState<boolean>(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [activeCategoryId, setActiveCategoryId] = useState<number>();
	const [products, setProducts] = useState<Product[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [cart, setCart] = useState<CartItem[]>([]);
	const [isSaveLoading, setSaveLoading] = useState<boolean>(false);

	const getProductTotalAmount = (product: CartItem) => {
		const discountRate = product.discount > 0 ? (100 - product.discount) / 100 : 1;
		return product.quantity * product.price * discountRate;
	};

	const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const totalAmount = cart.reduce((sum, item) => sum + getProductTotalAmount(item), 0);
	const discountsTotal = subTotal - totalAmount;

	const categoriesCall = categoryListMutation();
	const saveTransactionCall = transactionSaveMutation();

	useEffect(() => {
		if (categories.length === 0) {
			const fetchCategories = async () => {
				setLoading(true);
				try {
					const data = await categoriesCall.mutateAsync();
					setCategories(data);

					if (data[0]) {
						setActiveCategoryId(data[0].id);
					}
				} finally {
					setLoading(false);
				}
			};

			fetchCategories();
		}
	}, [categories, categoriesCall.mutateAsync]);

	useEffect(() => {
		if (activeCategoryId && categories?.length > 0) {
			// find ile ilk eşleşen kategoriyi buluyoruz
			const selectedCategory = categories.find((category) => category.id === activeCategoryId);

			if (selectedCategory && Array.isArray(selectedCategory.products)) {
				// Eğer mevcut products ile farklıysa, sadece o zaman setProducts çağır
				if (JSON.stringify(selectedCategory.products) !== JSON.stringify(products)) {
					setProducts(selectedCategory.products);
				}
			}
		}
	}, [activeCategoryId, categories, products]);

	const handleSaveTransaction = async (paymentType: PaymentTypes) => {
		setSaveLoading(true);
		try {
			const cartData: Transaction = {
				paymentType: paymentType,
				// transactionDate: getFormattedDateTimeNow(),
				transactionItems: cart.map((c) => {
					const item: TransactionItem = {
						productId: c.id,
						productName: c.name,
						price: c.price,
						quantity: c.quantity,
						discount: c.discount,
						barcode: c.barcode,
					};
					return item;
				}),
				totalAmount: totalAmount,
				name: t("sys.sale.fast_sale"),
			};

			const data = await saveTransactionCall.mutateAsync(cartData);

			if (data) {
				// toast.success(`${total.toFixed(2)} TL tutarındaki alışveriş sisteme kaydedildi.`);
				setCart([]);
			}
		} finally {
			setSaveLoading(false);
		}
	};

	const addToCart = (product: Product) => {
		const existingItem = cart.find((item) => item.id === product.id);
		if (existingItem) {
			setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
		} else {
			setCart([{ ...product, quantity: 1, discount: 0 }, ...cart]);
		}
	};

	const updateItem = (id: number | undefined, field: "quantity" | "discount" | "price", value: number) => {
		if (id) setCart(cart.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
	};

	const removeItem = (id: number | undefined) => {
		if (id) setCart(cart.filter((item) => item.id !== id));
	};

	return (
		<Row gutter={24} className="pr-1 pl-1">
			<Col xs={24} sm={12} md={14} lg={16} xl={18}>
				{isLoading ? (
					<CircleLoading />
				) : (
					<>
						<div className="category-buttons">
							{categories.map((category) => (
								<Button
									key={category.id}
									type={activeCategoryId === category.id ? "primary" : "default"}
									onClick={() => setActiveCategoryId(category.id)}
								>
									{category.name}
								</Button>
							))}
							<Button
								key={"new-category"}
								type={"dashed"}
								icon={<PlusOutlined />}
								onClick={() => navigate("/category/add")}
							>
								{t("sys.sale.add_new_category")}
							</Button>
						</div>
						<div className="product-grid">
							{products.map((product) => (
								<div key={product.id} className="product-card">
									<div className="product-image-container" style={{ background: backgroundColor }}>
										{product.image ? (
											<img
												src={
													product.image.startsWith("data:image")
														? product.image
														: `data:image/png;base64,${product.image}`
												}
												alt={product.name}
												className="product-image"
											/>
										) : (
											<div
												className="product-placeholder text-text-gray flex flex-col items-center justify-center"
												style={{ background: backgroundColor }}
											>
												<ShoppingCartOutlined className="text-3xl mb-4" />
												<p className="m-2">{product.name}</p>
											</div>
										)}
									</div>
									<div className="product-info">
										<p className="product-name text-base font-semibold text-text-secondary">
											{!product.image && product.description ? product.description : product.name}
										</p>
										<p className="product-price text-primary">{`${product.price.toFixed(2)} TL`}</p>
									</div>
									<div className="product-hover-overlay">
										<Button
											type="default"
											icon={<EyeOutlined />}
											onClick={() => setModalOpen(true)}
											className="add-to-cart-button"
										>
											{t("sys.sale.product_detail")}
										</Button>
										<Button
											type="primary"
											icon={<ShoppingCartOutlined />}
											onClick={() => addToCart(product)}
											className="add-to-cart-button"
										>
											{t("sys.sale.add_to_cart")}
										</Button>
									</div>

									{/* Urun Detayi Modal */}
									<Modal
										open={modalOpen}
										footer={null}
										closable={true}
										onCancel={() => setModalOpen(false)}
										mask={true}
										centered
										className="custom-modal"
									>
										<div className="text-center">
											<h2 className="text-xl font-bold">{product.name}</h2>
											<p className="text-gray-600 mt-2">{product.description}</p>
											{product.image && product.image !== "" ? (
												<img
													src={product.image}
													alt={product.name}
													className="w-32 h-32 object-cover mx-auto mt-4 rounded-md"
												/>
											) : (
												<div className="w-32 h-32 mx-auto mt-4 rounded-md border-2 border-gray-400 flex items-center justify-center">
													<p className="text-gray-500 text-sm font-semibold text-center px-2">
														{t("sys.sale.modal_no_image")}
													</p>
												</div>
											)}
											<p className="text-xl font-bold text-primary mt-4">{`${product.price.toFixed(2)} TL`}</p>
											<Row gutter={24} justify="center" style={{ gap: "20px", marginTop: "15px" }}>
												<Col>
													<Button
														type="default"
														icon={<EditOutlined />}
														onClick={() => navigate(`/product/edit/${product.id}`)}
													>
														{t("sys.menu.products.edit")}
													</Button>
												</Col>
												<Col>
													<Button
														type="primary"
														icon={<ShoppingCartOutlined />}
														onClick={() => {
															addToCart(product);
															setModalOpen(false);
														}}
													>
														{t("sys.sale.add_to_cart")}
													</Button>
												</Col>
											</Row>
										</div>
									</Modal>
								</div>
							))}
							{/* {(!products || products.length === 0) && ( */}
							<div className="product-card new-product text-text-secondary" onClick={() => navigate("/product/add")}>
								<PlusOutlined style={{ fontSize: 35 }} />
								<p className="add-new-product-text">{t("sys.sale.add_new_product")}</p>
							</div>
							{/* )} */}
						</div>
					</>
				)}
			</Col>
			<Col xs={24} sm={12} md={10} lg={8} xl={6}>
				<Card
					className="cart-container text-center"
					styles={{
						header: {
							padding: "0px 16px",
						},
					}}
					title={
						<div
							style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}
							className="cart-header"
						>
							<Tooltip placement="topLeft" title={t("sys.sale.new_shopping")}>
								<Button
									type="default"
									style={{ marginLeft: 0 }}
									icon={<PlusOutlined />}
									onClick={() => setCart([])}
									disabled={isSaveLoading || isLoading}
								/>
							</Tooltip>
							<span style={{ fontWeight: "bold" }} className="text-primary">
								{t("sys.sale.your_cart")}
							</span>
							<Tooltip placement="topRight" title={t("sys.sale.empty_cart")}>
								<Button
									disabled={isSaveLoading || isLoading}
									type="default"
									style={{ marginRight: 0 }}
									icon={<DeleteOutlined />}
									onClick={() => setCart([])}
								/>
							</Tooltip>
						</div>
					}
				>
					<div className="cart-list">
						{isSaveLoading ? (
							<CircleLoading />
						) : (
							<>
								{cart && cart.length > 0 ? (
									<>
										{cart.map((item) => {
											return (
												<div key={item.id} className="cart-item">
													<Collapse
														key={item.id}
														className="cart-item-collapse"
														items={[
															{
																key: item.id,
																label: (
																	<div className="cart-item-header">
																		<div className="cart-item-left">
																			<p className="cart-item-quantity">{item.quantity}x</p>
																			<p className="cart-item-name">{item.name}</p>
																		</div>
																		<p className="cart-item-price text-primary">
																			{`${getProductTotalAmount(item).toFixed(2)} ₺`}
																		</p>
																		<Tooltip placement="left" title={t("sys.sale.remove_item")}>
																			<Button
																				type="text"
																				icon={<DeleteOutlined />}
																				onClick={() => removeItem(item.id)}
																				disabled={isSaveLoading}
																			/>
																		</Tooltip>
																	</div>
																),
																children: (
																	<div className="cart-item-details">
																		<Row gutter={24}>
																			<Col xs={24} sm={24} md={24}>
																				<div className="mb-3">
																					<Typography.Text className="full-title">
																						{`${t("sys.sale.price_update")}:`}
																					</Typography.Text>
																					<InputNumber
																						disabled={isSaveLoading}
																						addonBefore={t("sys.sale.new_price")}
																						addonAfter={"TL"}
																						min={1}
																						value={item.price || 1}
																						style={{ width: "100%" }}
																						onChange={(val) => {
																							if (val != null) {
																								updateItem(item.id, "price", val);
																							}
																						}}
																						formatter={(value) => {
																							if (!value) return "";
																							return value.toString().replace(",", ".");
																						}}
																					/>
																				</div>
																			</Col>
																			<Col xs={12} sm={12} md={12}>
																				<div>
																					<Typography.Text className="full-title">
																						{`${t("sys.sale.quantity")}:`}
																					</Typography.Text>
																					<InputNumber
																						disabled={isSaveLoading}
																						addonBefore={t("sys.sale.count")}
																						min={1}
																						value={item.quantity || 1}
																						style={{ width: "100%" }}
																						onChange={(val) => {
																							if (val != null) {
																								updateItem(item.id, "quantity", val);
																							}
																						}}
																					/>
																				</div>
																			</Col>
																			<Col xs={12} sm={12} md={12}>
																				<div>
																					<Typography.Text className="full-title">
																						{`${t("sys.sale.discount")}:`}
																					</Typography.Text>
																					<InputNumber
																						disabled={isSaveLoading}
																						addonBefore="%"
																						min={0}
																						max={100}
																						value={item.discount || 0}
																						style={{ width: "100%" }}
																						onChange={(val) => {
																							if (val != null) {
																								updateItem(item.id, "discount", val);
																							}
																						}}
																					/>
																				</div>
																			</Col>
																		</Row>
																	</div>
																),
															},
														]}
													/>
												</div>
											);
										})}
									</>
								) : (
									<>
										<div
											className="empty-cart text-text-secondary"
											style={{
												display: "flex",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
												flexDirection: "column",
												textAlign: "center",
											}}
										>
											<ShoppingCartOutlined style={{ fontSize: 45 }} />
											<p className="text-lg font-semibold text-text-secondary mt-2">{t("sys.sale.your_cart_empty")}</p>
										</div>
									</>
								)}
							</>
						)}
					</div>
					<div className="cart-summary">
						<div className="summary-row">
							<span>{t("sys.sale.subtotal")}</span>
							<span>{`${subTotal.toFixed(2)} TL`}</span>
						</div>
						<div className="summary-row">
							<span>{t("sys.sale.discounts")}</span>
							<span>{`- ${discountsTotal.toFixed(2)} TL`}</span>
						</div>
						<div className="summary-row total">
							<span>{t("sys.sale.total")}</span>
							<span>{`${totalAmount.toFixed(2)} TL`}</span>
						</div>
					</div>
					<div className="cart-actions">
						<Button
							type="primary"
							block
							className="pay-cash"
							icon={<Iconify icon="solar:wallet-money-linear" />}
							disabled={isLoading || cart.length === 0}
							loading={isSaveLoading}
							onClick={() => handleSaveTransaction(PaymentTypes.CASH)}
						>
							{t("sys.sale.pay_cash")}
						</Button>
						<Button
							type="default"
							block
							className="pay-card"
							icon={<CreditCardOutlined />}
							disabled={isLoading || cart.length === 0}
							loading={isSaveLoading}
							onClick={() => handleSaveTransaction(PaymentTypes.CARD)}
						>
							{t("sys.sale.pay_card")}
						</Button>
					</div>
				</Card>
			</Col>
		</Row>
	);
}
