import request from 'umi-request';

export async function getInfoById(id: string | number) {
  return request('/api/activity/getDetailData', {
    method: 'POST',
    data: { id },
  });
}

const defaultData = {
  queryObject: {
    page: 0,
    size: 2 ** 10,
  },
};
export async function getTypeList(data = defaultData) {
  return request('/api/dictionary/page', {
    method: 'POST',
    data: {
      queryObject: {
        ...data,
        code: 'actType',
      },
    },
  });
}
// 组织
export async function getDepartList(data = defaultData) {
  return request('/api/org/page', {
    method: 'POST',
    data,
  });
}
export async function getOrg() {
  return request('/api/org/queryOrgTree', {
    method: 'POST',
    data: {},
  });
}

// 场馆
export async function getContractorList(data = defaultData) {
  return request('/api/cg/page', {
    method: 'POST',
    data,
  });
}

// 活动 更新 新增
export async function addActive(data: any) {
  return request('/api/activity/replace', {
    method: 'POST',
    data,
  });
}
interface IQueryObject {
  page: number;
  size: number;
}
// 获取table数据
export async function getTableData(queryObject: IQueryObject, otherKey = {}) {
  // otherKey = otherKey || {};
  return request('/api/activity/getPageData', {
    method: 'POST',
    data: {
      queryObject: {
        ...queryObject,
        ...otherKey,
      },
    },
  });
}

// 获取table数据
export async function getTableDatas(queryObject: any) {
  // otherKey = otherKey || {};
  return request('/api/activity/getPageData', {
    method: 'POST',
    data: queryObject,
  });
}

// 移动列
export async function move(
  page: number | undefined,
  pageSize: number,
  id: string | number,
  isUp: boolean,
) {
  return request('/api/activity/swapIndex', {
    method: 'POST',
    data: {
      reqModel: {
        queryObject: {
          page,
          pageSize,
        },
      },
      updateModel: {
        data: {
          id,
          isUp,
        },
      },
    },
  });
}
// 删除 /activity/delete
export async function deleteActive(id: string | number) {
  return request('/api/activity/delete', {
    method: 'POST',
    data: {
      id,
    },
  });
}
/** 批量删除 */
export async function batchDeleteActivity(params: string[]) {
  return request<Record<string, any>>('/api/activity/batchDelete', {
    method: 'POST',
    data: params,
  });
}
