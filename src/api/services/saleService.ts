import apiClient from "../apiClient";

import type { Category } from "#/entity";
import { useCustomQuery } from "@/router/hooks/use-custom-query";
import { useCustomMutation } from "@/router/hooks/use-custom-mutation";

// Api Urls
export enum ApiUrls {
	CategoryList = "/category/list",
}

// Api Calls
const getCategoriesCall = () => apiClient.get<Category[]>({ url: ApiUrls.CategoryList });

// Queries
export const useCategoryListQuery = () => useCustomQuery(["getCategoriesCall"], getCategoriesCall);

// Mutations
export const useCategoryListMutation = () => useCustomMutation(getCategoriesCall);
