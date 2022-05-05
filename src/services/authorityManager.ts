import request from 'umi-request';
// import type { TableListParams } from './data.d';
// 分页查询
export async function powerPage(params?: Record<string, unknown>) {
  return request('/api/power/page', {
    method: 'POST',
    data: params,
  });
}
// 新增
export async function powerAdd(params?: Record<string, unknown>) {
  return request('/api/power/add', {
    method: 'POST',
    data: params,
  });
}
// 修改
export async function powerUpdate(params?: Record<string, unknown>) {
  return request('/api/power/update/ck', {
    method: 'POST',
    data: params,
  });
}
// 删除
export async function powerDelete(params?: Record<string, unknown>) {
  return request('/api/power/delete', {
    method: 'POST',
    data: params,
  });
}
// 批量删除
export async function powerBatchDelete(params?: any[]) {
  return request('/api/power/batchDelete', {
    method: 'POST',
    data: params,
  });
}
// 详情
export async function powerDetail(params?: Record<string, unknown>) {
  return request('/api/power/detail', {
    method: 'POST',
    data: params,
  });
}
// 根据角色查询权限列表
export async function findAll(params?: Record<string, unknown>) {
  return request('/api/power/find/all', {
    method: 'POST',
    data: params,
  });
}
// 查询树
export async function powerTree(params?: Record<string, unknown>) {
  return request('/api/power/tree', {
    method: 'POST',
    data: params,
  });
}
// 上移、下移
export async function swapIndex(params?: Record<string, unknown>) {
  return request('/api/power/swapIndex', {
    method: 'POST',
    data: params,
  });
}
