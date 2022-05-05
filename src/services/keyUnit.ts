import request from 'umi-request';
// 重点单位列表
export async function getkeyUnitList(params?: Record<string, unknown>) {
  return request('/api/arCompany/page', {
    method: 'POST',
    data: params,
  });
}
// 移动重点单位
export async function movekeyUnit(params?: Record<string, unknown>) {
  return request('/api/arCompany/swapIndex', {
    method: 'POST',
    data: params,
  });
}
//单位详情
export async function getUnitInfo(params?: Record<string, unknown>) {
  return request('/api/arCompany/detail', {
    method: 'POST',
    data: params,
  });
}
// 删除单位
export async function deleteUnit(params?: string[]) {
  return request('/api/arCompany/batchDelete', {
    method: 'POST',
    data: params,
  });
}
// 新增（编辑）重点单位
export async function saveUnit(params?: Record<string, unknown>) {
  return request('/api/arCompany/updateData', {
    method: 'POST',
    data: params,
  });
}
// 获取字典公司状态
export async function getState(params?: Record<string, unknown>) {
  return request('/api/dictionary/page', {
    method: 'POST',
    data: params,
  });
}
// 获取组织机构
export async function org(params?: Record<string, unknown>) {
  return request('/api/org/queryOrgTree', {
    method: 'POST',
    data: params,
  });
}
