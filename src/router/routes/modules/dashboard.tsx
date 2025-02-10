import { Suspense, lazy } from "react";
import { Navigate, Outlet } from "react-router";

import { SvgIcon } from "@/components/icon";
import { CircleLoading } from "@/components/loading";

import type { AppRouteObject } from "#/router";

const Welcome = lazy(() => import("@/pages/dashboard/welcome"));
const Workbench = lazy(() => import("@/pages/dashboard/workbench"));
const Analysis = lazy(() => import("@/pages/dashboard/analysis"));

const dashboard: AppRouteObject = {
	order: 1,
	path: "dashboard",
	element: (
		<Suspense fallback={<CircleLoading />}>
			<Outlet />
		</Suspense>
	),
	meta: {
		label: "sys.menu.dashboard",
		icon: <SvgIcon icon="ic-analysis" className="ant-menu-item-icon" size="24" />,
		key: "/dashboard",
	},
	children: [
		{
			index: true,
			element: <Navigate to="welcome" replace />,
		},
		{
			path: "welcome",
			element: <Welcome />,
			meta: { label: "sys.menu.welcome", key: "/dashboard/welcome" },
		},
		{
			path: "analysis",
			element: <Analysis />,
			meta: { label: "sys.menu.analysis", key: "/dashboard/analysis" },
		},
		{
			path: "workbench",
			element: <Workbench />,
			meta: { label: "sys.menu.workbench", key: "/dashboard/workbench" },
		},
	],
};

export default dashboard;
