declare namespace Table {
  type Layer = {
    page?: number;
    size?: number;
    keyword?: string;
  };

  type Info = {
    //高度
    height?: number;
    // id
    id?: string;
    // 时间
    insertTime?: string;
    isDeleted?: boolean;
    lat?: number;
    lon?: number;
    name?: string;
    sortIndex?: string;
    parentName?: string;
  };
}
