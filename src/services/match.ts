import request from 'umi-request';
// 赛事列表
export async function getmatchList(params?: Record<string, unknown>) {
  return request('/api/arCompetions/query', {
    method: 'POST',
    data: params,
  });
}
// 移动重点单位
export async function move(params?: Record<string, unknown>) {
  return request('/api/arCompetions/swapIndex', {
    method: 'POST',
    data: params,
  });
}
// 删除赛事
export async function deleteSlef(params?: string[]) {
  return request('/api/arCompetions/delete', {
    method: 'POST',
    data: params,
  });
}
// 新增（编辑）赛事
export async function save(params?: Record<string, unknown>) {
  return request('/api/arCompetions/add', {
    method: 'POST',
    data: params,
  });
}
//编辑赛事
export async function editmatch(params?: Record<string, unknown>) {
  return request('/api/arCompetions/update', {
    method: 'POST',
    data: params,
  });
}
// 获取字典赛事类型
export async function getState(params?: Record<string, unknown>) {
  return request('/api/dictionary/page', {
    method: 'POST',
    data: params,
  });
}
// 获取场馆
export async function getchangguan(params?: Record<string, unknown>) {
  return request('/api/activity/getPageData', {
    method: 'POST',
    data: params,
  });
}
