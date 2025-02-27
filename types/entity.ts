import type {
	BaseStatus,
	ApiNotificationType,
	PaymentTypes,
	PermissionType,
	UserRoleTypes,
	AuthenticationType,
} from "./enum";

export interface ApiNotification {
	id: string;
	message: string;
	detailedMessage?: string;
	type: ApiNotificationType;
	timestamp: number;
	isViewed: boolean;
}

export interface SignInRequest {
	email: string;
	password: string;
	authValue?: string;
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
	sessionId: string;
	name: string;
	email: string;
	username: string;
	avatar?: string | null;
	role?: UserRoleTypes;
	status?: BaseStatus;
	permissions?: Permission[];
	authType: AuthenticationType;
	isAuthenticated: boolean;
	token: string;
	twoFactorQrCode?: string;
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
	id?: number;
	name: string;
	description?: string | null;
	status?: BaseStatus;
	createdDate?: string;
	lastUpdatedDate?: string;
	orderValue?: number;
	products?: Product[]; // Products array, link to the Product interface
}

export interface Product {
	id?: number;
	name: string;
	description?: string | null;
	status: BaseStatus;
	createdDate?: string;
	lastUpdatedDate?: string;
	barcode: string;
	purchasePrice: number;
	profitMargin: number;
	taxRate: number;
	price: number;
	stockQuantity: number;
	orderValue?: number;
	image: string;
	category?: Category;
	cId?: number | null;
	cName?: string | null;
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
