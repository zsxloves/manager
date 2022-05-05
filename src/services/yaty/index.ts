import { request } from 'umi';

// 预案推演详情
export async function queryYaDetail(params: any) {
  return request('/api/arPlandeducingDetail/query', {
    method: 'POST',
    data: params,
  });
}

// 预案推演新增
export async function addYa(params: any) {
  return request('/api/arPlan/add', {
    method: 'POST',
    data: params,
  });
}

// 删除预案推演
export async function deleteYa(params: any) {
  return request('/api/arPlan/delete', {
    method: 'POST',
    data: params,
  });
}

// 预案推演详情新增
export async function addDetail(params: any) {
  return request('/api/arPlandeducingDetail/add', {
    method: 'POST',
    data: params,
  });
}

// 预案推演详情修改
export async function changeDetail(params: any) {
  return request('/api/arPlandeducingDetail/update', {
    method: 'POST',
    data: params,
  });
}

// 预案查询
export async function queryYa(params: any) {
  return request('/api/arPlan/query', {
    method: 'POST',
    data: params,
  });
}

// 预案复制
export async function yaCopy(params: any) {
  return request('/api/arPlandeducing/copy', {
    method: 'POST',
    data: params,
  });
}

// 预案推演日程查询
export async function queryRc(params: any) {
  return request('/api/arPlandeducing/queryDetail', {
    method: 'POST',
    data: params,
  });
}
