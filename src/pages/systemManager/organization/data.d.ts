export interface TableListItem {
  id?: string;
  isDeleted?: boolean;
  sortIndex?: string | number;
  code: string | number;
  name: string;
  remark: string;
  secrecyLevel?: string | number;
  lat?: string | number;
  lon?: string | number;
  parentId: string;
}
