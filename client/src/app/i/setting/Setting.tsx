"use client";
import { useProfile } from "@/hook/useProfile";
import { ApiForm } from "./components/ApiForm";
import { MainForm } from "./components/MainForm";
import { PasswordSettingForm } from "./components/PasswordForm";
import { Title } from "./components/Title";
export const Setting = () => {
	const { data, isLoading } = useProfile();

	return (
		<div>
			<div>
				<Title data={data} />
				<MainForm data={data} />
				<ApiForm data={data} />
				<PasswordSettingForm data={data} />
			</div>
		</div>
	);
};
