import request from 'umi-request';
// 值班列表
export async function getDutyList(params?: Record<string, unknown>) {
  return request('/api/duty/getPageData', {
    method: 'POST',
    data: params,
  });
}
//值班详情
export async function getDutyInfo(params?: Record<string, unknown>) {
  return request('/api/duty/getDetailData', {
    method: 'POST',
    data: params,
  });
}
// 删除值班
export async function deleteDuty(params?: string[]) {
  return request('/api/duty/batchDelete', {
    method: 'POST',
    data: params,
  });
}
// 新增（编辑）值班
export async function saveDuty(params?: Record<string, unknown>) {
  return request('/api/duty/replace', {
    method: 'POST',
    data: params,
  });
}
// 移动
export async function moveDuty(params?: Record<string, unknown>) {
  return request('/api/duty/swapIndex', {
    method: 'POST',
    data: params,
  });
}
// 所属活动列表
export async function ActList(params?: Record<string, unknown>) {
  return request('/api/activity/getPageData', {
    method: 'POST',
    data: params,
  });
}
