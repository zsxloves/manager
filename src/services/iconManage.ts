import request from 'umi-request';

const keyWord = 'arIcon';

export async function getInfoById(id: string | number) {
  return request(`/api/${keyWord}/detail`, {
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
export async function getTypeList(code?: string) {
  return request('/api/dictionary/page', {
    method: 'POST',
    data: {
      ...defaultData,
      code,
    },
  });
}
export async function getTypeListAll(code?: string) {
  return request('/api/dictionary/findAll', {
    method: 'POST',
    data: {
      parentId: code,
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
// 关联图层可选值
export async function getTList(data = defaultData) {
  return request('/api/tArLayermanager/page', {
    method: 'POST',
    data,
  });
}
// 编辑 /arIcon/update
export async function updateIcon(data: any) {
  return request(`/api/${keyWord}/update`, {
    method: 'POST',
    data,
  });
}
//新增
export async function addIcon(data: any) {
  return request(`/api/${keyWord}/add`, {
    method: 'POST',
    data,
  });
  // const formData = new FormData();
  // delete data.data.file;
  // const keys = Object.keys(data.data);
  // for (const item of keys) {
  //   formData.append(item, data.data[item]);
  // }
  // formData.append('file', file.originFileObj);
  // formData.append('fileName', file.name);
  // return fetch(`/api/${keyWord}/uploadIcon`, {
  //   method: 'post',
  //   headers: {
  //     Authorization: localStorage.getItem('loginId') || '',
  //   },
  //   body: formData,
  // });
}

// 获取table数据
export async function getTableData(queryObject: any, otherKey = {}) {
  return request(`/api/${keyWord}/query`, {
    method: 'POST',
    data: { ...queryObject, ...otherKey },
  });
}

// 移动列
export async function move(
  page: number | undefined,
  pageSize: number,
  id: string | number,
  isUp: boolean,
) {
  return request(`/api/${keyWord}/swapIndex`, {
    method: 'POST',
    data: {
      queryObject: {
        pageNumber: page,
        pageSize,
        sortColumn: 'sortIndex',
        sortOrder: 'desc',
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
export async function deleteIcon(id: string[]) {
  return request(`/api/${keyWord}/delete`, {
    method: 'POST',
    data: id,
  });
}
