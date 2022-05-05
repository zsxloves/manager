import request from 'umi-request';

export async function getInfoById(id: string | number) {
  return request('/api/cg/getDetailData', {
    method: 'POST',
    data: { id },
  });
}
/** 批量删除场馆 */
export async function batchDeleteVenue(params: string[]) {
  return request<Record<string, any>>('/api/cg/batchDelete', {
    method: 'POST',
    data: params,
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

// 活动 更新 新增
export async function addVenue(data: any) {
  return request('/api/cg/replace', {
    method: 'POST',
    data,
  });
}
// 场馆 详情
export async function detailVenue(data: any) {
  return request('/api/cg/getDetailData', {
    method: 'POST',
    data,
  });
}

// 查询附件
export async function CXIcons(data: any) {
  return request('/api/systemAttachment/query', {
    method: 'POST',
    data,
  });
}

interface IQueryObject {
  page: number;
  size: number;
  name?: string;
}
// 获取table数据
export async function getTableData(queryObject: IQueryObject, otherKey = {}) {
  return request('/api/cg/getPageData', {
    method: 'POST',
    data: {
      queryObject: {
        ...queryObject,
        ...otherKey,
      },
    },
  });
}
// 查询图层  分页
export async function getLayerInfo(params?: Record<string, unknown>) {
  return request('/api/tArLayermanager/getPageData', {
    method: 'POST',
    data: params,
  });
}

// 移动列
export async function move(
  page: number | undefined,
  pageSize: number,
  id: string | number,
  isUp: boolean,
) {
  return request('/api/cg/swapIndex', {
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
  return request('/api/cg/delete', {
    method: 'POST',
    data: {
      id,
    },
  });
}
