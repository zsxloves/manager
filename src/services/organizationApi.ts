import request from 'umi-request';
// import type { TableListParams } from './data.d';
// 组织查询
export async function queryOrgTree(params?: Record<string, unknown>) {
  return request('/api/org/queryOrgTree', {
    method: 'POST',
    data: params,
  });
}
// 列表查询
export async function orgPage(params?: Record<string, unknown>) {
  return request('/api/org/page', {
    method: 'POST',
    data: params,
  });
}
// 新增或修改
export async function updateData(params?: Record<string, unknown>) {
  return request('/api/org/updateData', {
    method: 'POST',
    data: params,
  });
}
// 删除
export async function deleteOrg(params?: Record<string, unknown>) {
  return request('/api/org/deleteOrg', {
    method: 'POST',
    data: params,
  });
}
// 获取详情
export async function detail(params?: Record<string, unknown>) {
  return request('/api/org/detail', {
    method: 'POST',
    data: params,
  });
}

export async function uploadFile(params?: Record<string, unknown>) {
  return request('/api/org/detail', {
    method: 'POST',
    data: params,
  });
}
