import type { BasicStatus, PermissionType, UserRoleTypes } from "./enum";

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
	status?: BasicStatus;
	permissions?: Permission[];
}

export interface Organization {
	id: string;
	name: string;
	status: "enable" | "disable";
	description?: string;
	order?: number;
	children?: Organization[];
}

export interface Permission {
	id: number;
	parentId: string | null;
	name: string;
	description?: string | null;
	status: BasicStatus;
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
	name: string;
	label: string;
	status: BasicStatus;
	createdDate?: string;
	lastUpdatedDate?: string;
	orderValue?: number;
	description?: string | null;
	permissions?: Permission[];
}

export interface Category {
	id: number;
	name: string;
	products: Product[];
}

export interface Product {
	id: number;
	name: string;
	barcode: string;
	image?: string;
	price: number;
}

export interface SaleItem extends Product {
	quantity: number;
}
