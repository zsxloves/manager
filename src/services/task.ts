import request from 'umi-request';
// 任务列表
export async function getList(params?: Record<string, unknown>) {
  return request('/api/arTask/query', {
    method: 'POST',
    data: params,
  });
}
// 移动任务
export async function move(params?: Record<string, unknown>) {
  return request('/api/arTask/swapIndex', {
    method: 'POST',
    data: params,
  });
}
// 编辑图标
export async function editIcon(params?: Record<string, unknown>) {
  return request('/api/arSolution/update', {
    method: 'POST',
    data: params,
  });
}
// 预案点位详情
export async function solutionDetail(params: any) {
  return request('/api/arSolution/detail', {
    method: 'POST',
    data: params,
  });
}
// 删除任务
export async function deleteSlef(params?: string[]) {
  return request('/api/arTask/delete', {
    method: 'POST',
    data: params,
  });
}
// 修改任务
export async function editTask(params?: Record<string, unknown>) {
  return request('/api/arTask/update', {
    method: 'POST',
    data: params,
  });
}
// 添加装备
export async function addByTask(params?: Record<string, unknown>) {
  return request('/api/personGpsdevice/batchAddByTask', {
    method: 'POST',
    data: params,
  });
}
// 派发时间
export async function giveTime(params?: Record<string, unknown>) {
  return request('/api/personGpsdevice/queryByGroup', {
    method: 'POST',
    data: params,
  });
}
