import { useState } from "react";
import { Card, Row, Col, Button, List, InputNumber } from "antd";
import { CreditCardOutlined, ShoppingCartOutlined, TagOutlined } from "@ant-design/icons";
import { ThemeMode } from "#/enum";
import { useSettings } from "@/store/settingStore";
import "./sale.css";

const names = [
	"All Items",
	"Breakfast",
	"Lunch Lunch",
	"Dinner",
	"Drinks Drinks Drinks Drinks Drinks Drinks Drinks Drinks Drinks",
	"All Items Items",
	"Breakfast AllAllAllAllAllAllAllAll",
	"Lunch Drinks",
	"Dinner All",
	"Items Drinks",
	"Items All",
	"Breakfast Drinks",
];

function generateProducts(count: number) {
	const products = [];

	for (let i = 1; i <= count; i++) {
		const product = {
			id: i,
			name: names[i % names.length] + (i % 2 === 0 ? " - Spicy" : ""), // Randomize product names
			price: Number.parseFloat((Math.random() * 30 + 10).toFixed(2)), // Random price between 10 and 40
			barcode: `${i}`,
			image: "",
		};
		products.push(product);
	}

	return products;
}

const products = generateProducts(10);

export default function SalePage() {
	const { themeMode } = useSettings();

	const [cart, setCart] = useState<
		Array<{
			id: number;
			name: string;
			price: number;
			quantity: number;
			discount: number;
		}>
	>([]);
	const [activeCategory, setActiveCategory] = useState("All Items");

	const addToCart = (product: { id: number; name: string; price: number }) => {
		const existingItem = cart.find((item) => item.id === product.id);
		if (existingItem) {
			setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
		} else {
			setCart([...cart, { ...product, quantity: 1, discount: 0 }]);
		}
	};

	const updateCartItem = (id: number, field: "quantity" | "discount", value: number) => {
		setCart(cart.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
	};

	const removeCartItem = (id: number) => {
		setCart(cart.filter((item) => item.id !== id));
	};

	const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity - item.discount, 0);
	const tax = subtotal * 0.18;
	const total = subtotal + tax;

	return (
		<Row gutter={24}>
			<Col xs={24} sm={12} md={14} lg={15} xl={16}>
				<div className="category-buttons">
					{names.map((category) => (
						<Button
							key={category}
							type={activeCategory === category ? "primary" : "default"}
							onClick={() => setActiveCategory(category)}
						>
							{category}
						</Button>
					))}
				</div>
				<div className="product-grid">
					{products.map((product) => (
						<div key={product.id} className="product-card">
							<div className="product-image-container">
								{product.image ? (
									<img
										src={
											product.image.startsWith("data:image") ? product.image : `data:image/png;base64,${product.image}`
										}
										alt={product.name}
										className="product-image"
									/>
								) : (
									<div
										className="product-placeholder text-text-primary"
										style={{
											background: themeMode === ThemeMode.Light ? "rgb(244, 246, 248)" : "rgba(145, 158, 171, 0.12)",
										}}
									>
										{product.name}
									</div>
								)}
							</div>
							<div className="product-info">
								<p className="product-name text-base font-semibold text-text-secondary" title={product.name}>
									{product.name}
								</p>
								<p className="product-price text-primary">{`${product.price.toFixed(2)} TL`}</p>
							</div>
							<div className="product-hover-overlay">
								<Button
									type="primary"
									icon={<ShoppingCartOutlined />}
									onClick={() => addToCart(product)}
									className="add-to-cart-button"
								>
									Sepete Ekle
								</Button>
							</div>
						</div>
					))}
				</div>
			</Col>
			<Col xs={24} sm={12} md={10} lg={9} xl={8}>
				<Card title="Sepetiniz" className="text-center">
					<List
						className="cart-list"
						dataSource={cart}
						renderItem={(item) => (
							<List.Item key={item.id} className="cart-item">
								<div className="cart-item-content">
									<div className="cart-item-name">{item.name}</div>
									<div className="cart-item-price">${(item.price * item.quantity - item.discount).toFixed(2)}</div>
								</div>
								<div className="cart-item-actions">
									<InputNumber
										min={1}
										value={item.quantity}
										onChange={(value) => updateCartItem(item.id, "quantity", value as number)}
									/>
									<Button onClick={() => removeCartItem(item.id)}>Remove</Button>
								</div>
							</List.Item>
						)}
					/>
					<div className="cart-summary">
						<div className="summary-row">
							<span>Subtotal</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
						<div className="summary-row">
							<span>Tax (18%)</span>
							<span>${tax.toFixed(2)}</span>
						</div>
						<div className="summary-row total">
							<span>Total</span>
							<span>${total.toFixed(2)}</span>
						</div>
					</div>
					<div className="cart-actions">
						<Button type="primary" block className="pay-cash" icon={<TagOutlined />}>
							Pay with Cash
						</Button>
						<Button type="primary" block className="pay-card" icon={<CreditCardOutlined />}>
							Pay with Card
						</Button>
					</div>
				</Card>
			</Col>
		</Row>
	);
}
