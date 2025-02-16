import Logo from "@/components/logo";

import SettingButton from "./setting-button";
import AccountDropdown from "./account-dropdown";

export default function HeaderSimple() {
	return (
		<header className="flex h-16 w-full items-center px-6">
			<div className="flex">
				{" "}
				{/* Sola yaslanacak öğeler */}
				<Logo size={30} />
			</div>
			<div className="flex ml-auto">
				{" "}
				{/* Sağa yaslanacak öğeler */}
				<SettingButton />
				<AccountDropdown />
			</div>
		</header>
	);
}
