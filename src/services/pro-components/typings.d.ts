declare namespace Pro.Table {
  interface PageParams {
    current?: number;
    pageSize?: number;
    keyword?: string;
  }

  interface DataList<T> {
    data?: T[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }
}
