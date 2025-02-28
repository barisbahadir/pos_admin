import { isEmpty } from "ramda";
import { Suspense, lazy, useMemo } from "react";
import { Navigate, Outlet } from "react-router";

import { Iconify } from "@/components/icon";
import { CircleLoading } from "@/components/loading";
import { useUserPermission, useUserToken } from "@/store/userStore";
import { flattenTrees } from "@/utils/tree";

import { Tag } from "antd";
import type { Permission } from "#/entity";
import { BaseStatus, PermissionType } from "#/enum";
import type { AppRouteObject } from "#/router";
import staticPermissions from "@/router/routes/permissions";
import jwt_decode from "jwt-decode";

const ENTRY_PATH = "/src/pages";
const PAGES = import.meta.glob("/src/pages/**/*.tsx");
const loadComponentFromPath = (path: string) => PAGES[`${ENTRY_PATH}${path}`];

/**
 * Build complete route path by traversing from current permission to root
 * @param {Permission} permission - current permission
 * @param {Permission[]} flattenedPermissions - flattened permission array
 * @param {string[]} segments - route segments accumulator
 * @returns {string} normalized complete route path
 */
function buildCompleteRoute(
	permission: Permission,
	flattenedPermissions: Permission[],
	segments: string[] = [],
): string {
	// Add current route segment
	segments.unshift(permission.route);

	// Base case: reached root permission
	if (!permission.parentId) {
		return `/${segments.join("/")}`;
	}

	// Find parent and continue recursion
	const parent = flattenedPermissions.find((p) => p.id.toString() === permission.parentId);
	if (!parent) {
		console.warn(`Parent permission not found for ID: ${permission.parentId}`);
		return `/${segments.join("/")}`;
	}

	return buildCompleteRoute(parent, flattenedPermissions, segments);
}

// Components
function NewFeatureTag() {
	return (
		<Tag color="cyan" className="!ml-2">
			<div className="flex items-center gap-1">
				<Iconify icon="solar:bell-bing-bold-duotone" size={12} />
				<span className="ms-1">NEW</span>
			</div>
		</Tag>
	);
}

// Route Transformers
const createBaseRoute = (permission: Permission, completeRoute: string): AppRouteObject => {
	const { route, label, icon, orderValue, hide, hideTab, status, frameSrc, newFeature } = permission;

	const baseRoute: AppRouteObject = {
		path: route,
		meta: {
			label,
			key: completeRoute,
			hideMenu: !!hide,
			hideTab,
			disabled: status === BaseStatus.DISABLE,
		},
	};

	if (orderValue) baseRoute.order = orderValue;
	if (baseRoute.meta) {
		if (icon) baseRoute.meta.icon = icon;
		if (frameSrc) baseRoute.meta.frameSrc = new URL(frameSrc);
		if (newFeature) baseRoute.meta.suffix = <NewFeatureTag />;
	}

	return baseRoute;
};

const createGroupRoute = (
	permission: Permission,
	flattenedPermissions: Permission[],
	userRoles: string[],
): AppRouteObject => {
	const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));

	if (baseRoute.meta) {
		baseRoute.meta.hideTab = true;
	}

	const { parentId, children = [] } = permission;
	if (!parentId) {
		baseRoute.element = (
			<Suspense fallback={<CircleLoading />}>
				<Outlet />
			</Suspense>
		);
	}

	baseRoute.children = transformPermissionsToRoutes(children, flattenedPermissions, userRoles);

	if (!isEmpty(children)) {
		baseRoute.children.unshift({
			index: true,
			element: <Navigate to={children[0].route} replace />,
		});
	}

	return baseRoute;
};

const createMenuRoute = (permission: Permission, flattenedPermissions: Permission[]): AppRouteObject => {
	const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));

	if (permission.component) {
		const Element = lazy(loadComponentFromPath(permission.component) as any);

		if (permission.frameSrc) {
			baseRoute.element = <Element src={permission.frameSrc} />;
		} else {
			baseRoute.element = (
				<Suspense fallback={<CircleLoading />}>
					<Element />
				</Suspense>
			);
		}
	}

	return baseRoute;
};
interface JwtPayload {
	roles?: string[];
}

const getRolesFromToken = (accessToken: string): string[] => {
	try {
		const decodedToken: JwtPayload = jwt_decode(accessToken); // Token'ı çözümle
		return decodedToken?.roles || []; // roles varsa döndür, yoksa boş dizi
	} catch (error) {
		console.error("Token decoding failed:", error);
		return [];
	}
};

function hasPermission(permission: Permission, userRoles: string[]): boolean {
	// Eğer permission.roles boşsa, herkese izin ver
	if (!permission.roles || permission.roles.length === 0) {
		return true;
	}
	// Kullanıcının rollerinden en az biri permission.roles içinde varsa izin ver
	return permission.roles.some((role) => userRoles.includes(role));
}

function transformPermissionsToRoutes(
	permissions: Permission[],
	flattenedPermissions: Permission[],
	userRoles: string[],
): AppRouteObject[] {
	return permissions
		.filter((permission) => hasPermission(permission, userRoles)) // Yetki filtresi
		.map((permission) => {
			if (permission.type === PermissionType.GROUP) {
				return createGroupRoute(permission, flattenedPermissions, userRoles);
			}
			return createMenuRoute(permission, flattenedPermissions);
		});
}

const ROUTE_MODE = import.meta.env.VITE_APP_ROUTER_MODE;
export function usePermissionRoutes() {
	// if (ROUTE_MODE === "module") {
	// 	return getRoutesFromModules();
	// }

	const permissions = ROUTE_MODE === "static" ? staticPermissions : useUserPermission();

	// Token'dan rolleri çıkartıyoruz
	const { accessToken } = useUserToken();
	const userRoles = accessToken ? getRolesFromToken(accessToken) : [];

	return useMemo(() => {
		if (!permissions) return [];
		const flattenedPermissions = flattenTrees(permissions);
		return transformPermissionsToRoutes(permissions, flattenedPermissions, userRoles);
	}, [permissions, userRoles]);
}
