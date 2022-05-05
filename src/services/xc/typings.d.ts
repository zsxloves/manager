/* 基础请求结构 */
declare namespace XC.Request {
  interface Body {
    msgId?: string;
    transChannel?: string;
  }

  interface Data<T> extends Body {
    data: T
  }

}

/* 基础返回结构 */
declare namespace XC.Response {

  /* 基础返回结果体结构 */
  interface Result {
    msgId?: string;
    transChannel?: string;
    respDate?: string;
    respTime?: string;
  }

  interface Body<T extends Result> {
    code: number;
    message: string;
    result: T;
  }

  interface SingleResult<T> extends Result {
    result?: T
  }

  interface Page<T> {
    content: T[];
    numberOfElements: number;
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  }

  interface PageResult<T> extends Result {
    page?: page<T>
  }
}


declare namespace XC.Data {
  interface IdentifiableData {
    id: string;
  }

  interface BaseData extends IdentifiableData {
    isDeleted?: boolean;
    insertTime?: string;
    inserterName?: string;
    inserterId?: string;
    updateTime?: string;
    updaterName?: string;
    updaterId?: string;
    sortIndex?: string;
  }

  interface NamedData extends BaseData {
    name?: string;
    code?: string;
    remark?: string;
  }
}
