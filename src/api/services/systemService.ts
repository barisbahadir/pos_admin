import apiClient from "../apiClient";

import type { LoginInfo, Organization, Permission, Role, SignInRequest, SignUpRequest } from "#/entity";
import { useCustomMutation } from "@/router/hooks/use-custom-mutation";
import type { SystemLog, UserSession } from "#/api";

// Api Urls
export enum SystemUrls {
	Login = "/auth/login",
	Register = "/auth/register",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	OrganizationList = "/organization/list",
	PermissionList = "/permission/list",
	RoleList = "/role/list",
	UserList = "/auth/list",
	ApiLogList = "/log/list",
	SessionList = "/session/list",
	ActiveSessionList = "/session/list/active",
	DeactiveSessionList = "/session/list/deactive",
}

// System Calls
const loginCall = (data: SignInRequest) => apiClient.post<LoginInfo>({ url: SystemUrls.Login, data });
const registerCall = (data: SignUpRequest) => apiClient.post<LoginInfo>({ url: SystemUrls.Register, data });
const logoutCall = () => apiClient.post<boolean>({ url: SystemUrls.Logout });

const organizationListCall = () => apiClient.get<Organization[]>({ url: SystemUrls.OrganizationList });
const permissionListCall = () => apiClient.get<Permission[]>({ url: SystemUrls.PermissionList });
const roleListCall = () => apiClient.get<Role[]>({ url: SystemUrls.RoleList });
const userListCall = () => apiClient.get<LoginInfo[]>({ url: SystemUrls.UserList });

const systemLogListCall = () => apiClient.get<SystemLog[]>({ url: SystemUrls.ApiLogList });
const sessionListCall = () => apiClient.get<UserSession[]>({ url: SystemUrls.SessionList });
const activeSessionListCall = () => apiClient.get<UserSession[]>({ url: SystemUrls.ActiveSessionList });
const deactiveSessionListCall = () => apiClient.get<UserSession[]>({ url: SystemUrls.DeactiveSessionList });

// Mutations
export const loginMutation = () => useCustomMutation(loginCall);
export const registerMutation = () => useCustomMutation(registerCall);
export const logoutMutation = () => useCustomMutation(logoutCall);
export const organizationListMutation = () => useCustomMutation(organizationListCall, { showToast: true });
export const permissionListMutation = () => useCustomMutation(permissionListCall, { showToast: true });
export const roleListMutation = () => useCustomMutation(roleListCall, { showToast: true });
export const userListMutation = () => useCustomMutation(userListCall, { showToast: true });
export const systemLogListMutation = () => useCustomMutation(systemLogListCall, { showToast: true });
export const sessionListMutation = () => useCustomMutation(sessionListCall, { showToast: true });
export const activeSessionListMutation = () => useCustomMutation(activeSessionListCall, { showToast: true });
export const deactiveSessionListMutation = () => useCustomMutation(deactiveSessionListCall, { showToast: true });
