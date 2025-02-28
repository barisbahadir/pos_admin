import { Suspense, lazy } from "react";
import { Navigate, Outlet } from "react-router";

import { Iconify } from "@/components/icon";
import { CircleLoading } from "@/components/loading";

import type { AppRouteObject } from "#/router";

// Home and Sale
const HomePage = lazy(() => import("@/pages/home/index"));
const SalePage = lazy(() => import("@/pages/sale/index"));

// Products
const ProductAddPage = lazy(() => import("@/pages/products/add/index"));
const ProductOrderPage = lazy(() => import("@/pages/products/order/index"));
const ProductListPage = lazy(() => import("@/pages/products/list/index"));

// Categories
const CategoryAddPage = lazy(() => import("@/pages/categories/add/index"));
const CategoryOrderPage = lazy(() => import("@/pages/categories/order/index"));
const CategoryListPage = lazy(() => import("@/pages/categories/list/index"));

// User management
const ProfilePage = lazy(() => import("@/pages/management/user/profile/index"));
const AccountPage = lazy(() => import("@/pages/management/user/account/index"));

// System management
const OrganizationPage = lazy(() => import("@/pages/management/system/organization/index"));
const PermissionPage = lazy(() => import("@/pages/management/system/permission/index"));
const RolePage = lazy(() => import("@/pages/management/system/role/index"));
const UserPage = lazy(() => import("@/pages/management/system/user/index"));
const UserDetailPage = lazy(() => import("@/pages/management/system/user/detail"));

// System pages
const SessionPage = lazy(() => import("@/pages/system/session/index"));
const LogPage = lazy(() => import("@/pages/system/log/index"));

// Calendar
const CalendarPage = lazy(() => import("@/pages/system/others/calendar/index"));

function OutletWrapper() {
	return (
		<Suspense fallback={<CircleLoading />}>
			<Outlet />
		</Suspense>
	);
}

function Wrapper({ children }: any) {
	return <Suspense fallback={<CircleLoading />}>{children}</Suspense>;
}

const routes: AppRouteObject[] = [
	{
		order: 1,
		path: "home",
		element: <HomePage />,
		meta: {
			label: "sys.menu.home",
			icon: <Iconify icon="solar:home-outline" size={24} />,
			key: "/home",
			roles: [],
		},
	},
	{
		order: 2,
		path: "sale",
		element: <SalePage />,
		meta: {
			label: "sys.menu.sale",
			icon: <Iconify icon="solar:cart-large-2-outline" size="24" />,
			key: "/sale",
			roles: [],
		},
	},
	{
		order: 3,
		path: "product",
		element: <OutletWrapper />,
		meta: {
			label: "sys.menu.products.index",
			icon: <Iconify icon="solar:document-add-linear" size="24" />,
			key: "/product",
			roles: [],
		},
		children: [
			{
				index: true,
				element: <Navigate to="list" replace />,
			},
			{
				path: "add",
				element: <ProductAddPage />,
				meta: {
					label: "sys.menu.products.add",
					key: "/product/add",
					roles: [],
				},
			},
			{
				path: "edit/:id",
				element: <ProductAddPage />,
				meta: {
					label: "sys.menu.products.edit",
					key: "/product/edit",
					roles: [],
					hideMenu: true,
					// hidden: true,
				},
			},
			{
				path: "order",
				element: <ProductOrderPage />,
				meta: {
					label: "sys.menu.products.order",
					key: "/product/order",
					roles: [],
				},
			},
			{
				path: "list",
				element: <ProductListPage />,
				meta: {
					label: "sys.menu.products.list",
					key: "/product/list",
					roles: [],
				},
			},
		],
	},
	{
		order: 4,
		path: "category",
		element: <OutletWrapper />,
		meta: {
			label: "sys.menu.categories.index",
			icon: <Iconify icon="solar:bookmark-circle-outline" size="24" />,
			key: "/category",
			roles: [],
		},
		children: [
			{
				index: true,
				element: <Navigate to="list" replace />,
			},
			{
				path: "add",
				element: <CategoryAddPage />,
				meta: {
					label: "sys.menu.categories.add",
					key: "/category/add",
					roles: [],
				},
			},
			{
				path: "edit/:id",
				element: <CategoryAddPage />,
				meta: {
					label: "sys.menu.categories.edit",
					key: "/category/edit",
					roles: [],
					hideMenu: true,
					hideTab: true,
					// hidden: true,
				},
			},
			{
				path: "order",
				element: <CategoryOrderPage />,
				meta: {
					label: "sys.menu.categories.order",
					key: "/category/order",
					roles: [],
				},
			},
			{
				path: "list",
				element: <CategoryListPage />,
				meta: {
					label: "sys.menu.categories.list",
					key: "/category/list",
					roles: [],
				},
			},
		],
	},
	{
		order: 5,
		path: "user",
		element: <OutletWrapper />,
		meta: {
			label: "sys.menu.user.index",
			icon: <Iconify icon="solar:user-circle-linear" size="24" />,
			key: "/user",
			roles: [],
		},
		children: [
			{
				index: true,
				element: <Navigate to="profile" replace />,
			},
			{
				path: "profile",
				element: <ProfilePage />,
				meta: {
					label: "sys.menu.user.profile",
					key: "/user/profile",
					roles: [],
				},
			},
			{
				path: "account",
				element: <AccountPage />,
				meta: {
					label: "sys.menu.user.account",
					key: "/user/account",
					roles: [],
				},
			},
		],
	},
	{
		order: 6,
		path: "management",
		element: <OutletWrapper />,
		meta: {
			label: "sys.menu.management.index",
			icon: <Iconify icon="solar:widget-5-bold-duotone" size="24" />,
			key: "/management",
			roles: [],
		},
		children: [
			{
				index: true,
				element: <Navigate to="organization" replace />,
			},
			{
				path: "organization",
				element: <OrganizationPage />,
				meta: {
					label: "sys.menu.management.organization",
					key: "/management/organization",
					roles: [],
				},
			},
			{
				path: "permission",
				element: <PermissionPage />,
				meta: {
					label: "sys.menu.management.permission",
					key: "/management/permission",
					roles: [],
				},
			},
			{
				path: "role",
				element: <RolePage />,
				meta: {
					label: "sys.menu.management.role",
					key: "/management/role",
					roles: [],
				},
			},
			{
				path: "user",
				element: <UserPage />,
				meta: {
					label: "sys.menu.management.user",
					key: "/management/user",
					roles: [],
				},
			},
			{
				path: "user/:id",
				element: <UserDetailPage />,
				meta: {
					label: "sys.menu.management.user_detail",
					key: "/management/user/detail",
					roles: [],
					// hidden: true,
				},
			},
		],
	},
	{
		order: 7,
		path: "system",
		element: <OutletWrapper />,
		meta: {
			label: "sys.menu.system.index",
			icon: <Iconify icon="solar:shield-user-outline" size="24" />,
			key: "/system",
			roles: [],
		},
		children: [
			{
				index: true,
				element: <Navigate to="session" replace />,
			},
			{
				path: "session",
				element: <SessionPage />,
				meta: {
					label: "sys.menu.system.session",
					key: "/system/session",
					roles: [],
				},
			},
			{
				path: "log",
				element: <LogPage />,
				meta: {
					label: "sys.menu.system.log",
					key: "/system/log",
					roles: [],
				},
			},
		],
	},
	{
		order: 8,
		path: "calendar",
		element: (
			<Wrapper>
				<CalendarPage />
			</Wrapper>
		),
		meta: {
			label: "sys.menu.calendar",
			icon: <Iconify icon="solar:calendar-bold-duotone" size="24" />,
			key: "/calendar",
			roles: [],
		},
	},
];

export default routes;
