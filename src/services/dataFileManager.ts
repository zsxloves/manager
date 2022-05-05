import request from 'umi-request';

// 列表查询
export async function delRegion(params?: Record<string, unknown>) {
  return request('/api/region/delRegion', {
    method: 'POST',
    data: params,
  });
}

export async function editRegion(params?: Record<string, unknown>) {
  return request('/api/region/editRegion', {
    method: 'POST',
    data: params,
  });
}

export async function editRegionAll(params?: Record<string, unknown>) {
  return request('/api/region/editRegionAll', {
    method: 'POST',
    data: params,
  });
}

export async function getRegionList(params?: Record<string, unknown>) {
  return request('/api/region/getRegionList', {
    method: 'POST',
    data: params,
  });
}

// export async function getUserByRegionId(params?: Record<string, unknown>) {
//   return request('/api/region/getUserByRegionId', {
//     method: 'POST',
//     data: params,
//   });
// }

export async function insertRegionUser(params?: Record<string, unknown>) {
  return request('/api/region/insertRegionUser', {
    method: 'POST',
    data: params,
  });
}

export async function queryAllChildrenByregionId(params?: Record<string, unknown>) {
  return request('/api/region/queryAllChildrenByregionId', {
    method: 'POST',
    data: params,
  });
}

export async function queryAllRegion(params?: Record<string, unknown>) {
  return request('/api/region/queryAllRegion', {
    method: 'POST',
    data: params,
  });
}

export async function queryByParentId(params?: Record<string, unknown>) {
  return request('/api/region/queryByParentId', {
    method: 'POST',
    data: params,
  });
}
export async function delUserByRegionId(params?: Record<string, unknown>) {
  return request('/api/region/delUserByRegionId', {
    method: 'POST',
    data: params,
  });
}

export async function queryDeptByRegionId(params?: Record<string, unknown>) {
  return request('/api/region/queryDeptByRegionId', {
    method: 'POST',
    data: params,
  });
}
export async function saveRegionAll(params?: Record<string, unknown>) {
  return request('/api/region/saveRegionAll', {
    method: 'POST',
    data: params,
  });
}
export async function regionIsRepeat(params?: Record<string, unknown>) {
  return request('/api/region/regionIsRepeat', {
    method: 'POST',
    data: params,
  });
}

export async function getAreaByRegionId(params?: Record<string, unknown>) {
  return request('/api/sysArea/getAreaByRegionId', {
    method: 'POST',
    data: params,
  });
}
export async function getOrgByRegionId(params?: Record<string, unknown>) {
  return request('/api/org/getOrgByRegionId', {
    method: 'POST',
    data: params,
  });
}
export async function queryAllClassificationByRegionId(params?: Record<string, unknown>) {
  return request('/api/classification/queryClassificationByRegionId', {
    method: 'POST',
    data: params,
  });
}
export async function getUserByRegionId(params?: Record<string, unknown>) {
  return request('/api/user/getUserByRegionId', {
    method: 'POST',
    data: params,
  });
}
export async function getSceneByRegionId(params?: Record<string, unknown>) {
  return request('/api/scene/manager/getSceneByRegionId', {
    method: 'POST',
    data: params,
  });
}

// 查询场景
export async function getScenePage(params?: Record<string, unknown>) {
  return request('/api/scene/manager/page', {
    method: 'POST',
    data: params,
  });
}
