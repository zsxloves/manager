import request from 'umi-request';

export async function getInfoById(id: string | number) {
  return request('/api/guest/getDetailData', {
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
// 场馆
export async function getContractorList(data = defaultData) {
  return request('/api/cg/page', {
    method: 'POST',
    data,
  });
}

// 活动 更新 新增
export async function addGuest(data: any) {
  return request('/api/guest/replace', {
    method: 'POST',
    data,
  });
}

// 获取table数据
export async function getTableData(queryObject: any) {
  // otherKey = otherKey || {};
  return request('/api/guest/getPageData', {
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
  return request('/api/guest/swapIndex', {
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
export async function deleteGuest(id: string | number) {
  return request('/api/guest/delete', {
    method: 'POST',
    data: {
      id,
    },
  });
}
/** 批量删除角色 */
export async function batchDeleteguest(params: string[]) {
  return request<Record<string, any>>('/api/guest/batchDelete', {
    method: 'POST',
    data: params,
  });
}
