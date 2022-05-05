import { request } from 'umi';

export async function fakeSubmitForm(params: any) {
  return request('/api/basicForm', {
    method: 'POST',
    data: params,
  });
}
export async function getVedio() {
  return request('//data.mars3d.cn/file/apidemo/mudi-all.json', {
    method: 'get',
  });
}
// 图层查询
export async function getModelLayer(params: any) {
  return request('/api/tArLayermanager/queryLayerTree', {
    method: 'POST',
    data: params,
  });
}
// 摄像机查询
export async function videoQuery(params: any) {
  return request('/api/arVideo/query', {
    method: 'POST',
    data: params,
  });
}
// 摄像机查询详情
export async function videoDetailQuery(params: any) {
  return request('/api/arLayerVedio/query', {
    method: 'POST',
    data: params,
  });
}
// 摄像机详情新增
export async function addLayerCamera(params: any) {
  return request('/api/arLayerVedio/add', {
    method: 'POST',
    data: params,
  });
}
// 摄像机详情修改
// export async function updateLayerCamera(params: any) {
//   return request('/api/arLayerVedio/update', {
//     method: 'POST',
//     data: params,
//   });
// }
// 删除摄像机点位
export async function removeCameraDW(params: any) {
  return request('/api/arLayerVedio/delete', {
    method: 'POST',
    data: params,
  });
}

// 图层查询
export async function layerQuery(params: any) {
  return request('/api/tArLayermanager/page', {
    method: 'POST',
    data: params,
  });
}
