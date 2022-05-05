import request from 'umi-request';

/** 场景分页 */
export async function getSceneList(params?: Record<string, unknown>) {
  return request('/api/scene/manager/page', {
    method: 'POST',
    data: params,
  });
}
/** 场景更新--新增 编辑 */
export async function updateScene(params?: Record<string, unknown>) {
  return request('/api/scene/manager/update', {
    method: 'POST',
    data: params,
  });
}
/** 场景删除 */
export async function deleteScene(params?: Record<string, unknown>) {
  return request('/api/scene/manager/delete', {
    method: 'POST',
    data: params,
  });
}
/** 场景批量删除 */
export async function batchDeleteScene(params?: string[]) {
  return request('/api/scene/manager/batchDelete', {
    method: 'POST',
    data: params,
  });
}
/** 场景详情 */
export async function sceneDetail(params?: Record<string, unknown>) {
  return request('/api/scene/manager/detail', {
    method: 'POST',
    data: params,
  });
}
/** 场景位移 */
export async function sceneSwapIndex(params?: Record<string, unknown>) {
  return request('/api/scene/manager/swapIndex', {
    method: 'POST',
    data: params,
  });
}
