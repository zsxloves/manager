export interface TableListItem {
  id: string;
  isDeleted?: boolean;
  code: string | number;
  name: string;
  remark: string;
  parentId: string;
  key?: string;
}
