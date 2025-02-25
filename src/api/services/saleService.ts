import apiClient from "../apiClient";

import type { Category, Product, Transaction } from "#/entity";
import { useCustomQuery } from "@/router/hooks/use-custom-query";
import { useCustomMutation } from "@/router/hooks/use-custom-mutation";

// Api Urls
export enum ApiUrls {
	CategoryList = "/category/list",
	ProductList = "/product/list",
	ProductById = "/product/list/",
	ProductAdd = "/product/add",
	ProductUpdate = "/product/update/",
	TransactionSave = "/transaction/add",
}

// ----------------------- Api Requests --------------------------------

// Category Requests
const categoryList = () => apiClient.get<Category[]>({ url: ApiUrls.CategoryList });

// Product Requests
const productList = () => apiClient.get<Product[]>({ url: ApiUrls.ProductList });
const productById = (id: string) => apiClient.get<Product>({ url: ApiUrls.ProductById + id });
const productAdd = (data: Product) => apiClient.post<Product>({ url: ApiUrls.ProductAdd, data });
const productEdit = (data: Product) => apiClient.post<Product>({ url: ApiUrls.ProductUpdate + data.id, data });

// Transaction Requests
const transactionSave = (transactionData: Transaction) =>
	apiClient.post<Transaction>({ url: ApiUrls.TransactionSave, data: transactionData });

// ----------------------- Api React Query Calls --------------------------------
export const categoryListQuery = () => useCustomQuery(["getCategoriesCall"], categoryList);

// ----------------------- Api Mutation Calls --------------------------------
export const categoryListMutation = () => useCustomMutation(categoryList, { showToast: true });

export const productListMutation = () => useCustomMutation(productList, { showToast: true });
export const productByIdMutation = () => useCustomMutation(productById);
export const productAddMutation = () => useCustomMutation(productAdd);
export const productEditMutation = () => useCustomMutation(productEdit);

export const transactionSaveMutation = () => useCustomMutation(transactionSave);
