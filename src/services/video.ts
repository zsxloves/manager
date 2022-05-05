import { request } from 'umi';

// 获取海康视频流
export async function preview(params?: Record<string, unknown>) {
  return request('/message/manager/isc/camera/info/preview', {
    method: 'POST',
    data: params,
  });
}
