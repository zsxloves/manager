import request from 'umi-request';

/** 查询用户 */
export async function getUserList(params?: Record<string, unknown>) {
  return request('/api/user/page', {
    method: 'POST',
    data: params,
  });
}
// 根据id查询单个用户信息
export async function getUserInfo(params?: Record<string, unknown>) {
  return request('/api/user/detail', {
    method: 'POST',
    data: params,
  });
}
/** 新增用户 */
export async function saveUserInfo(params: Record<string, unknown>) {
  return request('/api/user/add', {
    method: 'POST',
    data: params,
  });
}
/** 编辑用户 */
export async function editUserInfo(params: Record<string, unknown>) {
  return request('/api/user/update/ck', {
    method: 'POST',
    data: params,
  });
}
/** 删除用户 */
export async function deletePerson(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/user/delete', {
    method: 'POST',
    data: params,
  });
}
/** 批量删除用户 */
export async function batchDeletePerson(params: string[]) {
  return request<Record<string, any>>('/api/user/batchDelete', {
    method: 'POST',
    data: params,
  });
}
/** 用户列表上下移动 */
export async function moveUser(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/user/swapIndex', {
    method: 'POST',
    data: params,
  });
}

/** 查询角色 */
export async function getRolerList(params?: Record<string, unknown>) {
  return request('/api/role/page', {
    method: 'POST',
    data: params,
  });
}
/** 角色详情 */
export async function getRolerInfo(params?: Record<string, unknown>) {
  return request('/api/role/detail', {
    method: 'POST',
    data: params,
  });
}
/** 新增角色 */
export async function saveRolerInfo(params: Record<string, unknown>) {
  return request('/api/role/add', {
    method: 'POST',
    data: params,
  });
}
/** 编辑角色 */
export async function editRolerInfo(params: Record<string, unknown>) {
  return request('/api/role/update/ck', {
    method: 'POST',
    data: params,
  });
}
/** 删除角色 */
export async function deleteRoler(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/role/delete', {
    method: 'POST',
    data: params,
  });
}
/** 批量删除角色 */
export async function batchDeleteRoler(params: string[]) {
  return request<Record<string, any>>('/api/role/batchDelete', {
    method: 'POST',
    data: params,
  });
}
/** 角色列表上下移动 */
export async function moveRoler(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/role/swapIndex', {
    method: 'POST',
    data: params,
  });
}
/** 查询角色关联权限 */
export async function getRolePower(params?: Record<string, unknown>) {
  return request('/api/role/power/page', {
    method: 'POST',
    data: params,
  });
}

/** 查询字典 */
export async function getDictList(params?: Record<string, unknown>) {
  return request('/api/dictionary/page', {
    method: 'POST',
    data: params,
  });
}
/** 查询父级字典所有子项 */
export async function getDictfindAll(params?: Record<string, unknown>) {
  return request('/api/dictionary/findAll', {
    method: 'POST',
    data: params,
  });
}
/** 新增字典 */
export async function saveDictData(params: Record<string, unknown>) {
  return request('/api/dictionary/add', {
    method: 'POST',
    data: params,
  });
}
/** 编辑字典 */
export async function editDictData(params: Record<string, unknown>) {
  return request('/api/dictionary/update/ck', {
    method: 'POST',
    data: params,
  });
}
/** 父字典列表上下移动 */
export async function moveDict(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/dictionary/swapIndex', {
    method: 'POST',
    data: params,
  });
}
/** 删除字典 */
export async function deleteDict(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/dictionary/delete', {
    method: 'POST',
    data: params,
  });
}
/** 批量删除字典 */
export async function batchDeleteDict(params: string[]) {
  return request<Record<string, any>>('/api/dictionary/batchDelete', {
    method: 'POST',
    data: params,
  });
}

/** 查询所有组织树 */
export async function getOrganizationrTree(params?: Record<string, unknown>) {
  return request('/api/org/queryOrgTree', {
    method: 'POST',
    data: params,
  });
}
/** 查询单个组织 */
export async function getSingleOrganizationr(params?: Record<string, unknown>) {
  return request('/api/org/page', {
    method: 'POST',
    data: params,
  });
}

/** 查询权限树 */
export async function getPowerTree(params?: Record<string, unknown>) {
  return request('/api/power/tree', {
    method: 'POST',
    data: params,
  });
}

/** 查询分类结构树 */
export async function getClassificationTree(params?: Record<string, unknown>) {
  return request('/api/classification/queryClassificationTree', {
    method: 'POST',
    data: params,
  });
}
/** 查询所有分类结构树--不经过数据域 */
export async function getAllClassificationTree(params?: Record<string, unknown>) {
  return request('/api/classification/queryAllClassificationTree', {
    method: 'POST',
    data: params,
  });
}
/** 查询talbe分类信息 -- 不过数据域 */
export async function getAllClassificationData(params?: Record<string, unknown>) {
  return request('/api/classification/queryAllByClassification', {
    method: 'POST',
    data: params,
  });
}
/** 查询talbe分类信息 */
export async function getClassificationData(params?: Record<string, unknown>) {
  return request('/api/classification/queryByClassification', {
    method: 'POST',
    data: params,
  });
}
/** 编辑分类信息 */
export async function editClassificationData(params: Record<string, unknown>) {
  return request('/api/classification/updateClassification', {
    method: 'POST',
    data: params,
  });
}
/** 新增分类信息 */
export async function saveClassificationData(params: Record<string, unknown>) {
  return request('/api/classification/addClassification', {
    method: 'POST',
    data: params,
  });
}
/** 删除分类信息 */
export async function deleteClassificationData(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/classification/deleteByClassification', {
    method: 'POST',
    data: params,
  });
}

/** 查询区域结构树 */
export async function getAreaTree(params?: Record<string, unknown>) {
  return request('/api/sysArea/getAreaTree2', {
    method: 'POST',
    data: params,
  });
}
/** 查询区域信息---无数据域 */
export async function getAreaNoList(params?: Record<string, unknown>) {
  return request('/api/sysArea/getAllAreaListByParentId', {
    method: 'POST',
    data: params,
  });
}
/** 查询区域信息 */
export async function getAreaList(params?: Record<string, unknown>) {
  return request('/api/sysArea/getAreaListByParentId', {
    method: 'POST',
    data: params,
  });
}
/** 编辑区域信息 */
export async function editAreaData(params: Record<string, unknown>) {
  return request('/api/sysArea/editArea', {
    method: 'POST',
    data: params,
  });
}
/** 新增区域信息 */
export async function saveRegionData(params: Record<string, unknown>) {
  return request('/api/sysArea/addArea', {
    method: 'POST',
    data: params,
  });
}
/** 删除区域信息 */
export async function deleteRegionData(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/sysArea/deleteArea', {
    method: 'POST',
    data: params,
  });
}

/** 查询日志 */
export async function getLogData(params?: Record<string, unknown>) {
  return request('/api/log/page', {
    method: 'POST',
    data: params,
  });
}

/** 查询附件左侧树 */
export async function getAttachmentTree(params?: Record<string, unknown>) {
  return request('/api/systemAttachment/queryTree', {
    method: 'POST',
    data: params,
  });
}
/** 附件树新增 */
export async function getAttachmentTreeAdd(params?: Record<string, unknown>) {
  return request('/api/systemAttachment/add', {
    method: 'POST',
    data: params,
  });
}
/** 附件树编辑 */
export async function getAttachmentTreeEdit(params?: Record<string, unknown>) {
  return request('/api/systemAttachment/update', {
    method: 'POST',
    data: params,
  });
}
/** 附件树删除 */
export async function getAttachmentTreeDelete(params?: any) {
  return request('/api/systemAttachment/deleteTree', {
    method: 'POST',
    data: [params],
  });
}
/** 附件删除 */
export async function getAttachmentDelete(params?: any) {
  return request('/api/systemAttachment/delete', {
    method: 'POST',
    data: params,
  });
}
/** 附件列表上下移动 */
export async function moveAttach(params: Record<string, unknown>) {
  return request<Record<string, any>>('/api/systemAttachment/swapIndex', {
    method: 'POST',
    data: params,
  });
}

/** 查询附件---根据id查询节点下附件 */
export async function getAttachmentList(params?: Record<string, unknown>) {
  return request('/api/systemAttachment/query', {
    method: 'POST',
    data: params,
  });
}
// 附件上传
export async function uploadFile(params: any) {
  return fetch('/api/systemAttachment/uploadFile', {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('loginId') || '',
    },
    body: params,
  });
}
export async function uploadFiles(params: any) {
  return fetch('/api/systemAttachment/batchUploadFile', {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('loginId') || '',
    },
    body: params,
  });
}
//附件下载
export async function getAttachLoad(params?: Record<string, unknown>) {
  return request('/api/systemAttachment/downloadFile', {
    method: 'POST',
    data: params,
  });
}
