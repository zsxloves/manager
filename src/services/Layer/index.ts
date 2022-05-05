import request from 'umi-request';

export async function getInfoById(id: string | number) {
  return request('/api/tArLayermanager/getDetailData', {
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
        code: 'layerType',
      },
    },
  });
}
// 父级图层列表
export async function getParentList(data = defaultData) {
  return request('/api/tArLayermanager/page', {
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

// 图层 更新 新增
export async function addLayer(data: any) {
  return request('/api/tArLayermanager/replace', {
    method: 'POST',
    data,
  });
}

interface IQueryObject {
  name?: string;
  page: number;
  size: number;
}
// 获取table数据
export async function getTableData(queryObject: IQueryObject, otherKey?: any) {
  return request('/api/tArLayermanager/getPageData', {
    method: 'POST',
    data: {
      queryObject: {
        ...queryObject,
        ...otherKey,
      },
    },
  });
}

// 移动列
export async function move(
  page: number | undefined,
  size: number,
  id: string | number,
  isUp: boolean,
) {
  return request('/api/tArLayermanager/swapIndex', {
    method: 'POST',
    data: {
      reqModel: {
        queryObject: {
          page,
          size,
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
export async function deleteLayer(id: string | number) {
  return request('/api/tArLayermanager/delete', {
    method: 'POST',
    data: {
      id,
    },
  });
}
/** 批量删除图层 */
export async function batchDeleteLayer(params: string[]) {
  return request<Record<string, any>>('/api/tArLayermanager/batchDelete', {
    method: 'POST',
    data: params,
  });
}
/**
 * 图层树
 */
export async function getLayerTree(id?: string | number) {
  return request('/api/tArLayermanager/queryLayerTree', {
    method: 'POST',
    data: {
      id,
    },
  });
}
