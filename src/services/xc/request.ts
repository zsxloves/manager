import {request} from 'umi';

export const xcrequest = <T extends XC.Response.Result>(url: any, options: any) => {
  // @ts-ignore
  return request<XC.Response.Body<T>>(url, options).then((resp): T => resp?.result);
}

export const xcpage = <T>(url: any, options: any) => {
  return xcrequest<XC.Response.PageResult<T>>(url, options)
    .then((resp): XC.Response.Page<T> => resp?.page);
}
