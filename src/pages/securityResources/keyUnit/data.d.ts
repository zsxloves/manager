// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableListItem {}

export interface FormValueType {
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
  height?: string;
  statusName?: string;
  orgName?: string;
  corporation?: string;
  remark?: string;
  organizationId?: string;
  contactNo?: string;
  pcsmc?: string;
  abbreviation?: string;
  contacts?: string;
  uscc?: string;
  securityContacts?: string;
  securityContactno?: string;
  distence?: string;
  distenceType?: string;
  getTypeName?: string;
  dangerName?: string;
  type?: string;
  num?: string;
  measures?: string;
  area?: string;
  road?: string;
  checkNum?: string;
  roadNum?: string;
  unit?: string;
  isLight?: string;
  isLimit?: string;
  isCarLimit?: string;
  isLine?: string;
  storeAddress?: string;
  line?: string;
  length?: string;
  width?: string;
  unitTypeName?: string;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  modalVisible: boolean;
  title: string;
  userInfo: any;
}
