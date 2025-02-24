import apiClient from "../apiClient";

import type { Category, Transaction } from "#/entity";
import { useCustomQuery } from "@/router/hooks/use-custom-query";
import { useCustomMutation } from "@/router/hooks/use-custom-mutation";

// Api Urls
export enum ApiUrls {
	CategoryList = "/category/list",
	TransactionSave = "/transaction/add",
}

// Api Calls
const categoryListCall = () => apiClient.get<Category[]>({ url: ApiUrls.CategoryList });
const transactionSaveCall = (transactionData: Transaction) =>
	apiClient.post<Transaction>({ url: ApiUrls.TransactionSave, data: transactionData });

// Queries
export const categoryListQuery = () => useCustomQuery(["getCategoriesCall"], categoryListCall);

// Mutations
export const categoryListMutation = () => useCustomMutation(categoryListCall);
export const transactionSaveMutation = () => useCustomMutation(transactionSaveCall);
