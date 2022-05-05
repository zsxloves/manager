export interface Data {
  rows: [];
  totalCount: number;
}
export interface Result {
  code: number;
  message: string;
  data: Data;
  success: boolean;
}
