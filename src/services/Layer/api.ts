import { xcpage } from '@/services/xc/request';
import { request } from '@@/plugin-request/request';

const prefix = '/api/layer/';

/** 获取图层信息列表 */
export async function layerInfo(params: Table.Layer) {
  const { size: size, page: page = 1, keyword } = params;
  return xcpage<Table.Info>(prefix + 'page', {
    method: 'POST',
    data: {
      queryObject: {
        size,
        page: page - 1,
        keyword,
      },
    },
  });
}

/** 删除图层 */
export async function deleteLayer(id: string) {
  return request<Record<string, any>>(prefix + 'delete', {
    method: 'POST',
    data: {
      id,
    },
  });
}

/** 新增图层*/
export async function addLayer(params: Table.Info) {
  return request(prefix + 'add', {
    method: 'POST',
    data: { ...params },
  });
}
