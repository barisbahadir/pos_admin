import type { BaseStatus, PaymentTypes, PermissionType, UserRoleTypes } from "./enum";

export interface SignInRequest {
	email: string;
	password: string;
}

export interface SignUpRequest {
	email: string;
	username: string;
	password: string;
}

export interface UserToken {
	accessToken?: string;
}

export interface LoginInfo {
	id: number;
	email: string;
	username: string;
	token: string;
	avatar?: string | null;
	role?: UserRoleTypes;
	status?: BaseStatus;
	permissions?: Permission[];
}

export interface Organization {
	id: string;
	name: string;
	status: BaseStatus;
	description?: string;
	orderValue?: number;
	children?: Organization[];
}

export interface Permission {
	id: number;
	parentId: string | null;
	name: string;
	description?: string | null;
	status: BaseStatus;
	createdDate?: string;
	lastUpdatedDate?: string;
	label: string;
	icon?: string | null;
	type: PermissionType;
	route: string;
	orderValue?: number;
	component?: string | null;
	frameSrc?: string | null;
	hide?: boolean;
	hideTab?: boolean;
	newFeature?: boolean;
	children?: Permission[];
}

export interface Role {
	id: number;
	name?: string;
	label?: string;
	status: BaseStatus;
	createdDate?: string;
	lastUpdatedDate?: string;
	orderValue?: number;
	description?: string | null;
	permissions?: Permission[];
}

export interface Category {
	id: number;
	name: string;
	description: string | null;
	status: BaseStatus;
	createdDate: string;
	lastUpdatedDate: string;
	orderValue: number;
	products: Product[]; // Products array, link to the Product interface
}

export interface Product {
	id: number;
	name: string;
	description: string | null;
	status: BaseStatus;
	createdDate: string;
	lastUpdatedDate: string;
	barcode: string;
	brand: string | null;
	sku: string | null;
	price: number;
	discountPrice: number | null;
	stockQuantity: number;
	orderValue: number;
	image: string;
	shortDescription: string | null;
	weight: number | null;
	width: number | null;
	height: number | null;
	depth: number | null;
	isFeatured: boolean | null;
	viewCount: number;
	soldCount: number;
	tags: string[];
}

export interface CartItem extends Product {
	quantity: number;
	discount: number;
}

export interface Transaction {
	id?: number;
	name: string | null;
	description?: string | null;
	status?: BaseStatus;
	createdDate?: string;
	lastUpdatedDate?: string;
	transactionDate?: string;
	totalAmount: number;
	paymentType: PaymentTypes;
	transactionItems: TransactionItem[];
}

export interface TransactionItem {
	id?: number | null;
	productId?: number | null;
	productName: string | null;
	barcode: string | null;
	price: number;
	quantity: number;
	discount: number;
}
