export interface TableListItem {
  user: string;
}

export interface FormValueType {
  actName?: string;
  insertTime?: string;
  inserterName?: string;
  inserterId?: string;
  updateTime?: string;
  updaterName?: string;
  updaterId?: string;
  code?: string;
  name?: string;
  standardAddress?: string;
  lon?: string;
  lat?: string;
  status?: string;
  orgName?: string;
  corporation?: string;
  remark?: string;
  organizationId?: string;
  contactNo?: string;
  phone?: string;
  endTime?: string;
  startTime?: string;
  act?: string;
  dept?: string;
  job?: string;
  user?: string;
  num?: number;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  modalVisible: boolean;
  title: string;
  userInfo: any;
}
