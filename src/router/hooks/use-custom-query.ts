import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";

// Genel bir query hook'u
export const useCustomQuery = <TData = unknown, TError = unknown>(
	queryKey: QueryKey, // Cache için benzersiz anahtar
	fetchFn: () => Promise<TData>, // API çağrısını gerçekleştirecek fonksiyon
	options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">, // Ekstra ayarlar
) => {
	return useQuery<TData, TError>({
		queryKey,
		queryFn: fetchFn,
		staleTime: 1000 * 60 * 5, // Varsayılan cache süresi 5 dakika
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		...options, // Kullanıcıdan gelen özel ayarları da al
	});
};
