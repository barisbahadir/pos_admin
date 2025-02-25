import { Spin } from "antd";

export function CircleLoading() {
	return (
		<div className="flex h-full items-center justify-center min-h-[50vh]">
			<Spin size="large" />
		</div>
	);
}
