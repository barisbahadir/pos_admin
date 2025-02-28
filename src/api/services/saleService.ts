import apiClient from "../apiClient";

import type { Category, Product, Transaction } from "#/entity";
import { useCustomQuery } from "@/router/hooks/use-custom-query";
import { useCustomMutation } from "@/router/hooks/use-custom-mutation";

// Api Urls
export enum ApiUrls {
	ProductList = "/product/list",
	ProductById = "/product/list/",
	ProductAdd = "/product/add",
	ProductUpdate = "/product/update/",
	ProductDelete = "/product/delete/",
	CategoryList = "/category/list",
	CategoryById = "/category/list/",
	CategoryAdd = "/category/add",
	CategoryUpdate = "/category/update/",
	CategoryDelete = "/category/delete/",
	TransactionSave = "/transaction/add",
}

// ----------------------- Api Requests --------------------------------

// Product Requests
const productList = () => apiClient.get<Product[]>({ url: ApiUrls.ProductList });
const productById = (id: string) => apiClient.get<Product>({ url: ApiUrls.ProductById + id });
const productAdd = (data: Product) => apiClient.post<Product>({ url: ApiUrls.ProductAdd, data });
const productEdit = (data: Product) => apiClient.post<Product>({ url: ApiUrls.ProductUpdate + data.id, data });
const productDelete = (id: string) => apiClient.post<boolean>({ url: ApiUrls.ProductDelete + id });

// Category Requests
const categoryList = () => apiClient.get<Category[]>({ url: ApiUrls.CategoryList });
const categoryById = (id: string) => apiClient.get<Category>({ url: ApiUrls.CategoryById + id });
const categoryAdd = (data: Category) => apiClient.post<Category>({ url: ApiUrls.CategoryAdd, data });
const categoryEdit = (data: Category) => apiClient.post<Category>({ url: ApiUrls.CategoryUpdate + data.id, data });
const categoryDelete = (id: string) => apiClient.post<boolean>({ url: ApiUrls.CategoryDelete + id });

// Transaction Requests
const transactionSave = (transactionData: Transaction) =>
	apiClient.post<Transaction>({ url: ApiUrls.TransactionSave, data: transactionData });

// ----------------------- Api React Query Calls --------------------------------

export const categoryListQuery = () => useCustomQuery(["getCategoriesCall"], categoryList);

// ----------------------- Api Mutation Calls --------------------------------

export const productListMutation = () => useCustomMutation(productList);
export const productByIdMutation = () => useCustomMutation(productById);
export const productAddMutation = () => useCustomMutation(productAdd);
export const productEditMutation = () => useCustomMutation(productEdit);
export const productDeleteMutation = () => useCustomMutation(productDelete);

export const categoryListMutation = () => useCustomMutation(categoryList);
export const categoryByIdMutation = () => useCustomMutation(categoryById);
export const categoryAddMutation = () => useCustomMutation(categoryAdd);
export const categoryEditMutation = () => useCustomMutation(categoryEdit);
export const categoryDeleteMutation = () => useCustomMutation(categoryDelete);

export const transactionSaveMutation = () => useCustomMutation(transactionSave);
