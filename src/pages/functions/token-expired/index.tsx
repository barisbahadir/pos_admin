import { Button, Card, Col, Row, Typography } from "antd";

export default function TokenExpired() {
	return (
		<Card>
			<Row gutter={[16, 16]}>
				<Col span={24} md={12}>
					<Typography.Text>Clicking a button to simulate a token expiration scenario.</Typography.Text>
				</Col>
				<Col span={24} md={12}>
					<Button type="primary" onClick={() => console.log("expired")}>
						Simulate Token Expired
					</Button>
				</Col>
			</Row>
		</Card>
	);
}
