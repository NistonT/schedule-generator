import { useState } from "react";

export enum EnumTheme {
	WHITE = "white",
	BLACK = "gray-950",
}

export const useTheme = () => {
	const [theme, setTheme] = useState<string>("");
};
