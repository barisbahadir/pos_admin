export enum AuthenticationType {
	NONE = "NONE", // 2FA devre dışı
	OTP = "OTP", // Google Authenticator (OTP)
	EMAIL = "EMAIL", // E-posta ile doğrulama kodu
}

export enum ApiNotificationType {
	Success = "Success",
	Error = "Error",
	Warning = "Warning",
	Info = "info",
}

export enum UserRoleTypes {
	TEST = "TEST",
	USER = "USER",
	MANAGER = "MANAGER",
	ADMIN = "ADMIN",
}

export enum BaseStatus {
	ENABLE = "ENABLE",
	DISABLE = "DISABLE",
}

export enum StorageEnum {
	UserInfo = "userInfo",
	UserToken = "userToken",
	Settings = "settings",
	I18N = "i18nextLng",
	IsLoading = "loading",
}

export enum ThemeMode {
	Light = "light",
	Dark = "dark",
}

export enum ThemeLayout {
	Vertical = "vertical",
	Horizontal = "horizontal",
	Mini = "mini",
}

export enum ThemeColorPresets {
	Default = "default",
	Cyan = "cyan",
	Purple = "purple",
	Blue = "blue",
	Orange = "orange",
	Red = "red",
}

export enum LocalEnum {
	tr_TR = "tr_TR",
	en_US = "en_US",
	de_DE = "de_DE",
}

export enum MultiTabOperation {
	FULLSCREEN = "fullscreen",
	REFRESH = "refresh",
	CLOSE = "close",
	CLOSEOTHERS = "closeOthers",
	CLOSEALL = "closeAll",
	CLOSELEFT = "closeLeft",
	CLOSERIGHT = "closeRight",
}

export enum PermissionType {
	GROUP = "GROUP",
	MENU = "MENU",
	BUTTON = "BUTTON",
}

export enum PaymentTypes {
	CASH = "CASH",
	CARD = "CARD",
}
