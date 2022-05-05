import request from 'umi-request';
// 票务管理查询
export async function getTicketList(params?: Record<string, unknown>) {
  return request('/api/ticketNew/getPageData', {
    method: 'POST',
    data: params,
  });
}
// 票务管理新增编辑
export async function getTicketUpdate(params?: Record<string, unknown>) {
  return request('/api/ticketNew/replace', {
    method: 'POST',
    data: params,
  });
}
// 票务管理删除
export async function getTicketDelect(params?: string[]) {
  return request('/api/ticketNew/batchDelete', {
    method: 'POST',
    data: params,
  });
}
// 票务管理位移
export async function getTicketSwapIndex(params?: Record<string, unknown>) {
  return request('/api/ticketNew/swapIndex', {
    method: 'POST',
    data: params,
  });
}
