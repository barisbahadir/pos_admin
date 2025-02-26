export interface Result<T = any> {
	status: number;
	message: string;
	detailedMessage?: string;
	errorSource?: string;
	data?: T;
	isSuccess?: boolean;
}
