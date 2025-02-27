import apiClient from "../apiClient";

import type { LoginInfo, Organization, Permission, Role, SignInRequest, SignUpRequest } from "#/entity";
import { useCustomMutation } from "@/router/hooks/use-custom-mutation";

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
}

// System Calls
const loginCall = (data: SignInRequest) => apiClient.post<LoginInfo>({ url: SystemUrls.Login, data });
const registerCall = (data: SignUpRequest) => apiClient.post<LoginInfo>({ url: SystemUrls.Register, data });
const logoutCall = () => apiClient.post<boolean>({ url: SystemUrls.Logout });

const organizationListCall = () => apiClient.get<Organization[]>({ url: SystemUrls.OrganizationList });
const permissionListCall = () => apiClient.get<Permission[]>({ url: SystemUrls.PermissionList });
const roleListCall = () => apiClient.get<Role[]>({ url: SystemUrls.RoleList });
const userListCall = () => apiClient.get<LoginInfo[]>({ url: SystemUrls.UserList });

// Mutations
export const loginMutation = () => useCustomMutation(loginCall);
export const registerMutation = () => useCustomMutation(registerCall);
export const logoutMutation = () => useCustomMutation(logoutCall);
export const organizationListMutation = () => useCustomMutation(organizationListCall, { showToast: true });
export const permissionListMutation = () => useCustomMutation(permissionListCall, { showToast: true });
export const roleListMutation = () => useCustomMutation(roleListCall, { showToast: true });
export const userListMutation = () => useCustomMutation(userListCall, { showToast: true });
