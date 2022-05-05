import request from 'umi-request';
// 卡口列表
export async function getmatchList(params?: Record<string, unknown>) {
  return request('/api/arVias/query', {
    method: 'POST',
    data: params,
  });
}
// 移动卡口
export async function move(params?: Record<string, unknown>) {
  return request('/api/arVias/swapIndex', {
    method: 'POST',
    data: params,
  });
}
// 删除卡口
export async function deleteSlef(params?: string[]) {
  return request('/api/arVias/delete', {
    method: 'POST',
    data: params,
  });
}
// 新增卡口
export async function save(params?: Record<string, unknown>) {
  return request('/api/arVias/add', {
    method: 'POST',
    data: params,
  });
}
// 修改卡口
export async function editkakou(params?: Record<string, unknown>) {
  return request('/api/arVias/update', {
    method: 'POST',
    data: params,
  });
}
