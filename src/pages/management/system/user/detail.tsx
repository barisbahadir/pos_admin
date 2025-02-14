// import { USER_LIST } from "@/_mock/assets";
import Card from "@/components/card";
import { useParams } from "@/router/hooks";

import type { LoginInfo } from "#/entity";

const USERS: LoginInfo[] = [];

export default function UserDetail() {
	const { id } = useParams();
	const user = USERS.find((user) => user.id.toString() === id);
	return (
		<Card>
			<p>这是用户{user?.username}的详情页面</p>
		</Card>
	);
}
