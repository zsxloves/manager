import request from 'umi-request';
// 班车列表
export async function getList(params?: Record<string, unknown>) {
  return request('/api/arBusinfo/query', {
    method: 'POST',
    data: params,
  });
}
// 移动班车
export async function move(params?: Record<string, unknown>) {
  return request('/api/arBusinfo/swapIndex', {
    method: 'POST',
    data: params,
  });
}
// 删除班车
export async function deleteSlef(params?: string[]) {
  return request('/api/arBusinfo/delete', {
    method: 'POST',
    data: params,
  });
}
// 新增班车
export async function save(params?: Record<string, unknown>) {
  return request('/api/arBusinfo/add', {
    method: 'POST',
    data: params,
  });
}
// 编辑班车
export async function editcar(params?: Record<string, unknown>) {
  return request('/api/arBusinfo/update', {
    method: 'POST',
    data: params,
  });
}
// 活动列表
export async function getactList(params?: Record<string, unknown>) {
  return request('/api/activity/getPageData', {
    method: 'POST',
    data: params,
  });
}
