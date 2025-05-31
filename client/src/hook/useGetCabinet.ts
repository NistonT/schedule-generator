import { cabinetsAtom } from "@/jotai/schedule";
import { cabinetService } from "@/services/cabinets.service";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const useGetCabinet = (schedule_id: string, apiKey: string) => {
	const [cabinets, setCabinets] = useAtom(cabinetsAtom);

	const {
		data: cabinetsGet,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["get_cabinets", schedule_id], // Добавил schedule_id в ключ запроса
		queryFn: () => cabinetService.getCabinets(apiKey, schedule_id),
		select: data => data.data,
	});

	// Эффект для обновления состояния при получении данных
	useEffect(() => {
		if (cabinetsGet?.cabinets) {
			setCabinets(cabinetsGet.cabinets);
		}
	}, [cabinetsGet, setCabinets]);

	return {
		cabinetsGet: cabinetsGet, // Возвращаем данные из запроса или из состояния
		isLoading,
		isError,
	};
};
