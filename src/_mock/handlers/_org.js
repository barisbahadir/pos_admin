import { http, HttpResponse } from "msw";

import { ORG_LIST } from "@/_mock/assets";
import { OrgApi } from "@/api/services/systemService";

const orgList = http.get(`/api${OrgApi.OrgList}`, () => {
	return HttpResponse.json({
		status: 0,
		message: "",
		data: ORG_LIST,
	});
});

export default [orgList];
