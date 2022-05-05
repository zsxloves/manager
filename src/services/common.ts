import request from 'umi-request';
// import type { TableListParams } from './data.d';
// 查询字典
export async function dictConnSelect(params?: Record<string, unknown>) {
  return request('/api/common/dictConnSelect', {
    method: 'POST',
    data: params,
  });
}
// 字典查询-（根据名称、code查询字典相关信息）
export async function dictSelectByDictItemName(params?: Record<string, unknown>) {
  return request('/api/common/dictSelectByDictItemName', {
    method: 'POST',
    data: params,
  });
}
// 导入
export async function importExcelMoule(data: any) {
  return request(data.url, {
    method: 'POST',
    headers: data.header || { 'Content-Type': 'application/json' },
    data: data.param,
  });
}
// 生成多种工单号
export async function createCodeByPrefix(params?: Record<string, unknown>) {
  return request('/api/common/createCodeByPrefix', {
    method: 'POST',
    data: params,
  });
}
// 上传
export async function uploadFile(params: any) {
  return fetch('/api/systemAttachment/uploadFile', {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('loginId') || '',
    },
    body: params,
  });
}

// 附件查询
export async function queryBySysAppendix(params: any) {
  return request('/api/common/queryBySysAppendix', {
    method: 'POST',
    data: params,
  });
}
