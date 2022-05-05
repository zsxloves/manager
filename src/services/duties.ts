import request from 'umi-request';

// 查询任务
export async function dutiesQuery(params?: Record<string, unknown>) {
  return request('/api/ArMission/query', {
    method: 'POST',
    data: params,
  });
}
// 新增任务
export async function dutiesAdd(params?: Record<string, unknown>) {
  return request('/api/ArMission/add', {
    method: 'POST',
    data: params,
  });
}
// 编辑任务
export async function dutiesEdit(params?: Record<string, unknown>) {
  return request('/api/ArMission/update', {
    method: 'POST',
    data: params,
  });
}
// 删除任务
export async function dutiesDelete(params?: string[]) {
  return request('/api/ArMission/delete', {
    method: 'POST',
    data: params,
  });
}
// 移动
export async function moveDuties(params?: Record<string, unknown>) {
  return request('/api/ArMission/swapIndex', {
    method: 'POST',
    data: params,
  });
}
// 根据活动id查询场馆
export async function queryGymId(params?: Record<string, unknown>) {
  return request('/api/cg/selectGymByActId', {
    method: 'POST',
    data: params,
  });
}
