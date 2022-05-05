import request from 'umi-request';

export async function getInfoById(id: string | number) {
  return request('/api/park/getDetailData', {
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
    data,
  });
}
// 组织
export async function getDepartList(data = defaultData) {
  return request('/api/org/page', {
    method: 'POST',
    data,
  });
}
// 关联图层可选值
export async function getTList(data = defaultData) {
  return request('/api/tArLayermanager/page', {
    method: 'POST',
    data,
  });
}

//  更新 新增
export async function addParking(data: any) {
  return request('/api/park/replace', {
    method: 'POST',
    data,
  });
}

// 获取table数据
export async function getTableData(queryObject: any) {
  return request('/api/park/getPageData', {
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
  return request('/api/park/swapIndex', {
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
// 删除
export async function deleteActive(id: string | number) {
  return request('/api/park/delete', {
    method: 'POST',
    data: {
      id,
    },
  });
}
/** 批量删除停车场 */
export async function batchDeletepark(params: string[]) {
  return request<Record<string, any>>('/api/park/batchDelete', {
    method: 'POST',
    data: params,
  });
}
