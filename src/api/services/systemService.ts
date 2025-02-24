import apiClient from "../apiClient";

import type { Organization } from "#/entity";

export enum OrgApi {
	OrgList = "/organization/list",
}

const getOrgList = () => apiClient.get<Organization[]>({ url: OrgApi.OrgList });

export default {
	getOrgList,
};
