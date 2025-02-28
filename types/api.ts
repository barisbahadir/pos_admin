import type { UserRoleTypes } from "./enum";

export interface Result<T = any> {
	status: number;
	message: string;
	detailedMessage?: string;
	errorSource?: string;
	data?: T;
	isSuccess?: boolean;
}

export interface UserSession {
	id: string;
	token: string;
	username: string;
	email: string;
	ipAddress: string;
	userAgent: string;
	userRole: UserRoleTypes;
	loginType: string;
	loginDate: string;
	lastAccessDate: string;
	tokenExpireDate: string;
	logoutDate: string | null;
}

export interface SystemLog {
	id: string;
	token: string;
	email: string;
	isSuccess?: boolean;
	httpMethod: string;
	endpoint: string;
	statusCode: number;
	clientIp: string;
	responseStatus: string;
	errorType: string;
	errorMessage: string;
	errorDetailedMessage: string;
	logDate: string;
}
