import { request } from 'umi';
// 预案添加
export async function addYa(params: any) {
  return request('/api/arPlandeducing/add', {
    method: 'POST',
    data: params,
  });
}
// 预案修改
export async function updateYa(params: any) {
  return request('/api/arPlandeducing/update', {
    method: 'POST',
    data: params,
  });
}
// 预案删除
export async function removeYa(params: any) {
  return request('/api/arPlandeducing/delete', {
    method: 'POST',
    data: params,
  });
}
// 预案推演查询
export async function queryYaty(params: any) {
  return request('/api/arPlandeducing/query', {
    method: 'POST',
    data: params,
  });
}
// 活动查询
export async function getPageData(params: any) {
  return request('/api/activity/getPageData', {
    method: 'POST',
    data: params,
  });
}

// 查询字典
export async function getDictfindAll(params?: Record<string, unknown>) {
  return request('/api/dictionary/findAll', {
    method: 'POST',
    data: params,
  });
}
