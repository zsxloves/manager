import {request} from "@@/plugin-request/request";
import {xcpage} from "@/services/xc/request";

const prefix = '/api/manager/ar/essentials/person/info/'

/** 获取人员信息列表 */
export async function personInfo(params: Essential.Person.PageParams) {
  const {pageSize: size, current: page = 1, keyword, ...query} = params
  return xcpage<Essential.Person.Schema>(prefix + 'page', {
    method: 'POST',
    data: {
      queryObject: {
        size,
        // 后端页码从0开始
        page: page - 1,
        keyword,
        ...query
      }
    },
  })
    // 转换antd pro格式
    .then((result): Pro.Table.DataList<Essential.Person.Schema> => ({
      success: !!result,
      data: result.content,
      total: result.totalElements
    }));
}

/** 新建/更新人员 */
export async function updatePerson(record: Essential.Person.Schema) {
  return request<API.RuleListItem>(prefix + 'update', {
    method: 'POST',
    data: {
      data: record
    }
  });
}

/** 删除人员 */
export async function deletePerson(id: string) {
  return request<Record<string, any>>(prefix + 'delete', {
    method: 'POST',
    data: {
      id
    }
  });
}
