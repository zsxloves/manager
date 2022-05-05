import request from 'umi-request';
import type { Result } from './services';
// 活动列表
export async function getActList(params?: Record<string, unknown>) {
  return request('/api/activity/getPageData', {
    method: 'POST',
    data: params,
  });
}
// 预案树
export async function queryPlanTree(params?: Record<string, unknown>) {
  return request('/api/arPlan/queryPlanTree', {
    method: 'POST',
    data: params,
  });
}
// 新增预案树
export async function addPlanTree(params?: Record<string, unknown>) {
  return request('/api/arPlan/add', {
    method: 'POST',
    data: params,
  });
}
// 编辑预案树
export async function editPlanTree(params?: Record<string, unknown>) {
  return request('/api/arPlan/update', {
    method: 'POST',
    data: params,
  });
}
// 删除预案树
export async function delPlanTree(params?: any) {
  return request('/api/arPlan/delete', {
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
//修改预案
export async function editPrepar(params?: any) {
  return request('/api/arPlan/update', {
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
// 新增图标
export async function addIcon(params?: Record<string, unknown>) {
  return request('/api/arSolution/add', {
    method: 'POST',
    data: params,
  });
}
// 编辑图标
export async function editIcon(params?: Record<string, unknown>) {
  return request('/api/arSolution/update', {
    method: 'POST',
    data: params,
  });
}
// 获取图标列表
export async function getIcon(params?: Record<string, unknown>) {
  return request('/api/arSolution/query', {
    method: 'POST',
    data: params,
  });
}
// 图标删除
export async function deleteIcon(params?: Record<string, unknown>) {
  return request('/api/arSolution/delete', {
    method: 'POST',
    data: params,
  });
}
// 图层查询
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
// 预案点位详情
export async function solutionDetail(params: any): Promise<Result> {
  return request('/api/arSolution/detail', {
    method: 'POST',
    data: params,
  });
}
// 预案点位删除
export async function solutionDelete(params: any) {
  return request('/api/arSolution/delete', {
    method: 'POST',
    data: params,
  });
}
// 复制活动下的所有预案
export async function copyarplan(params: any) {
  return request('/api/arPlan/copyActivityPlan', {
    method: 'POST',
    data: params,
  });
}
// 预案点位复制
export async function copySolution(params: any) {
  return request('/api/arPlan/copy', {
    method: 'POST',
    data: params,
  });
}
// 根据活动查场景
export async function slectPlace(params: any) {
  return request('/api/activity/selectSceneByActivityId', {
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
// 获取组织机构
export async function org(params?: Record<string, unknown>) {
  return request('/api/org/queryOrgTree', {
    method: 'POST',
    data: params,
  });
}
// 新增任务
export async function taskadd(params?: Record<string, unknown>) {
  return request('/api/arTask/batchAdd', {
    method: 'POST',
    data: params,
  });
}
// 根据组织查装备
export async function equitbyorg(params?: Record<string, unknown>) {
  return request('/api/tArGpsDevice/query', {
    method: 'POST',
    data: params,
  });
}

// 图层监控点位查询
export async function queryVideo(params: any) {
  return request('/api/arLayerVedio/queryVideo', {
    method: 'POST',
    data: params,
  });
}
