import apiClient from "../apiClient";

import type { Category, Product, Transaction } from "#/entity";
import { useCustomQuery } from "@/router/hooks/use-custom-query";
import { useCustomMutation } from "@/router/hooks/use-custom-mutation";

// Api Urls
export enum ApiUrls {
	CategoryList = "/category/list",
	ProductList = "/product/list",
	TransactionSave = "/transaction/add",
}

// Api Calls
const categoryListCall = () => apiClient.get<Category[]>({ url: ApiUrls.CategoryList });
const productListCall = () => apiClient.get<Product[]>({ url: ApiUrls.ProductList });
const transactionSaveCall = (transactionData: Transaction) =>
	apiClient.post<Transaction>({ url: ApiUrls.TransactionSave, data: transactionData });

// Queries
export const categoryListQuery = () => useCustomQuery(["getCategoriesCall"], categoryListCall);

// Mutations
export const categoryListMutation = () => useCustomMutation(categoryListCall, { showToast: true });
export const productListMutation = () => useCustomMutation(productListCall, { showToast: true });
export const transactionSaveMutation = () => useCustomMutation(transactionSaveCall);
