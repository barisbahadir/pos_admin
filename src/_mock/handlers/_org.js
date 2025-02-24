import { http, HttpResponse } from "msw";

import { ORG_LIST } from "@/_mock/assets";
import { SystemUrls } from "@/api/services/systemService";

const orgList = http.get(`/api${SystemUrls.OrganizationList}`, () => {
	return HttpResponse.json({
		status: 0,
		message: "",
		data: ORG_LIST,
	});
});

export default [orgList];
