import request from 'umi-request';
import type { Result } from './services';
// 场景列表
export async function getActList(params?: Record<string, unknown>) {
  return request('/api/scene/manager/page', {
    method: 'POST',
    data: params,
  });
}
// 图层图元树
export async function queryPlanTree(params?: Record<string, unknown>) {
  return request('/api/arLayericonlist/queryTree', {
    method: 'POST',
    data: params,
  });
}
// 新增图层图元树
export async function addPlanTree(params?: Record<string, unknown>) {
  return request('/api/arLayericonlist/add', {
    method: 'POST',
    data: params,
  });
}
// 编辑图层图元树
export async function editPlanTree(params?: Record<string, unknown>) {
  return request('/api/arLayericonlist/update', {
    method: 'POST',
    data: params,
  });
}
// 删除图层图元树
export async function delPlanTree(params?: any) {
  return request('/api/arLayericonlist/delete', {
    method: 'POST',
    data: params,
  });
}
// 获取图标
export async function getIcons(params?: any) {
  return request('/api/arIcon/query', {
    method: 'POST',
    data: params,
  });
}
//修改图层图元
export async function editPrepar(params?: any) {
  return request('/api/arLayericonlist/update', {
    method: 'POST',
    data: params,
  });
}
// 获取图标列表
export async function getIconlist(params?: Record<string, unknown>) {
  return request('/api/dictionary/page', {
    method: 'POST',
    data: params,
  });
}
// 获取字典类型
export async function getType(params?: Record<string, unknown>) {
  return request('/api/dictionary/page', {
    method: 'POST',
    data: params,
  });
}
// 新增图标
export async function addIcon(params?: Record<string, unknown>) {
  return request('/api/arIconLayer/add', {
    method: 'POST',
    data: params,
  });
}
// 编辑图标
export async function editIcon(params?: Record<string, unknown>) {
  return request('/api/arIconLayer/update', {
    method: 'POST',
    data: params,
  });
}
// 获取图标列表
export async function getIcon(params?: Record<string, unknown>) {
  return request('/api/arIconLayer/query', {
    method: 'POST',
    data: params,
  });
}
// 图标删除
export async function deleteIcon(params?: Record<string, unknown>) {
  return request('/api/arIconLayer/delete', {
    method: 'POST',
    data: params,
  });
}
// 场馆图层查询
export async function getModelLayer(params: any) {
  return request('/api/tArLayermanager/queryLayerTree', {
    method: 'POST',
    data: params,
  });
}
// 预案查询
export async function getarPlanDetail(params: any) {
  return request('/api/arPlan/query', {
    method: 'POST',
    data: params,
  });
}
// 获取重点人员
export async function getkeyPerson(params: any) {
  return request('/api/person/info/page', {
    method: 'POST',
    data: params,
  });
}
// 获取设备列表
export async function getdevice(params: any) {
  return request('/api/ar/device/page', {
    method: 'POST',
    data: params,
  });
}
// 获取监控列表
export async function getmonitor(params: any) {
  return request('/api/arVideo/query', {
    method: 'POST',
    data: params,
  });
}
// 图层图元点位详情
export async function solutionDetail(params: any): Promise<Result> {
  return request('/api/arSolution/detail', {
    method: 'POST',
    data: params,
  });
}
// 图层图元点位删除
export async function solutionDelete(params: any) {
  return request('/api/arIconLayer/delete', {
    method: 'POST',
    data: params,
  });
}
// 复制场景下的图层图元
export async function copyarplan(params: any) {
  return request('/api/arIconLayer/copyScenePlan', {
    method: 'POST',
    data: params,
  });
}
// 图层图元点位复制
export async function copySolution(params: any) {
  return request('/api/arIconLayer/copy', {
    method: 'POST',
    data: params,
  });
}
// 查询场景详情
export async function slectPlace(params: any) {
  return request('/api/scene/manager/detail', {
    method: 'POST',
    data: params,
  });
}
// 根据场景查默认底图
export async function slectBaseMap(params: any) {
  return request('/api/cg/selectLayerBySceneId', {
    method: 'POST',
    data: params,
  });
}
// 获取海康视频流
export async function preview(params?: Record<string, unknown>) {
  return request('/message/manager/isc/camera/info/preview', {
    method: 'POST',
    data: params,
  });
}
