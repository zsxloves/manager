import request from 'umi-request';

/** 查询装备 */
export async function getDeviceList(params?: Record<string, unknown>) {
  return request('/api/tArGpsDevice/query', {
    method: 'POST',
    data: params,
  });
}
/** 新增 装备 */
export async function addDeviceInfo(params: Record<string, unknown>) {
  return request('/api/tArGpsDevice/add', {
    method: 'POST',
    data: params,
  });
}
/** 编辑 装备 */
export async function editDeviceInfo(params: Record<string, unknown>) {
  return request('/api/tArGpsDevice/update', {
    method: 'POST',
    data: params,
  });
}
/** 删除装备 */
export async function deleteDevice(params: any) {
  console.log(params);
  return request<Record<string, any>>('/api/tArGpsDevice/delete', {
    method: 'POST',
    data: params,
  });
}
/** 装备列表上下移动 */
export async function moveDevice(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/tArGpsDevice/swapIndex', {
    method: 'POST',
    data: params,
  });
}

/** 查询人员 */
export async function getPersonList(params?: Record<string, unknown>) {
  return request('/api/person/info/page', {
    method: 'POST',
    data: params,
  });
}
/** 新增人员 */
export async function addPersonInfo(params: Record<string, unknown>) {
  return request('/api/person/info/addPerson', {
    method: 'POST',
    data: params,
  });
}
/** 编辑人员 */
export async function editPersonInfo(params: Record<string, unknown>) {
  return request('/api/person/info/updatePerson', {
    method: 'POST',
    data: params,
  });
}
/** 删除人员 */
export async function deletePerson(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/person/info/delete', {
    method: 'POST',
    data: params,
  });
}
/** 批量删除人员 */
export async function batchDeletePerson(params: string[]) {
  return request<Record<string, any>>('/api/person/info/batchDelete', {
    method: 'POST',
    data: params,
  });
}
/** 人员详情查询 */
export async function personDetail(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/person/info/getDetail', {
    method: 'POST',
    data: params,
  });
}
/** 人员列表上下移动 */
export async function movePerson(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/person/info/swapIndex', {
    method: 'POST',
    data: params,
  });
}
/** 导入 */
// export async function importExcelMoule(data: any) {
//   console.log('data', data);
//   return request(data.url, {
//     method: 'POST',
//     headers: {
//       'Content-Type':'multipart/form-data'
//     } ,
//     data: data.param,
//   });
// }

/** 查询预警设备 */
export async function getEarlyList(params?: Record<string, unknown>) {
  return request('/api/ar/device/page', {
    method: 'POST',
    data: params,
  });
}
/** 新增-编辑预警设备 */
export async function updateEarly(params?: Record<string, unknown>) {
  return request('/api/ar/device/update', {
    method: 'POST',
    data: params,
  });
}
/** 预警设备详情 */
export async function earlyIdetail(params?: Record<string, unknown>) {
  return request('/api/ar/device/detail', {
    method: 'POST',
    data: params,
  });
}
/** 删除预警设备 */
export async function deleteEarly(params?: Record<string, unknown>) {
  return request('/api/ar/device/delete', {
    method: 'POST',
    data: params,
  });
}
/** 批量删除预警设备 */
export async function batchDeleteEarly(params?: string[]) {
  return request('/api/ar/device/batchDelete', {
    method: 'POST',
    data: params,
  });
}
/** 导出预警设备 */
export async function exportEarly(params?: any) {
  return fetch('/api/ar/device/excel/export', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('loginId') || '',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: JSON.stringify(params),
  }).then((response) => response.blob());
}

/** 装备列表上下移动 */
export async function moveEarly(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/ar/device/swapIndex', {
    method: 'POST',
    data: params,
  });
}
/** 预警设备模板下载 */
export async function MbDownLoad(params?: Record<string, unknown>) {
  return fetch('/api/ar/device/excel/template', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('loginId') || '',
    },
    method: 'POST',
    body: JSON.stringify(params),
  }).then((response) => response.blob());
}

/** 设置预警设备白名单 */
export async function earlyWhile(params?: Record<string, unknown>) {
  return request('/api/ar/device/set/whiteList', {
    method: 'POST',
    data: params,
  });
}

/** 查询房屋 */
export async function getHouse(params?: Record<string, unknown>) {
  return request('/api/arHouse/query', {
    method: 'POST',
    data: params,
  });
}
/** 新增-房屋 */
export async function addHouse(params?: Record<string, unknown>) {
  return request('/api/arHouse/add', {
    method: 'POST',
    data: params,
  });
}
/** 编辑-房屋 */
export async function editHouse(params?: Record<string, unknown>) {
  return request('/api/arHouse/update', {
    method: 'POST',
    data: params,
  });
}
/** 房屋详情 */
export async function houseDetail(params?: Record<string, unknown>) {
  return request('/api/arHouse/queryDetail', {
    method: 'POST',
    data: params,
  });
}
/** 批量删除房屋 */
export async function batchDeleteHouse(params?: string[]) {
  return request('/api/arHouse/delete', {
    method: 'POST',
    data: params,
  });
}
/** 房屋上下移动 */
export async function moveHouse(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/arHouse/swapIndex', {
    method: 'POST',
    data: params,
  });
}
