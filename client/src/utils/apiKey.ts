export const maskApiKey = (apiKey: string | undefined) =>
	apiKey
		? "*".repeat(apiKey.length - 4) + apiKey.slice(-4)
		: "API ключ отсутствует";
