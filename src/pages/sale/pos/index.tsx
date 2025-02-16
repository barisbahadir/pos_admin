import { Button, Card } from "antd";
import Table from "antd/es/table";

export default function SalePage() {
	return (
		<Card
			title="Sale"
			extra={
				<Button type="primary" onClick={() => console.log("new Sale")}>
					New
				</Button>
			}
		>
			<Table
				rowKey="id"
				size="small"
				scroll={{ x: "max-content" }}
				pagination={false}
				// columns={columns}
				// dataSource={ROLES}
			/>
		</Card>
	);
}
