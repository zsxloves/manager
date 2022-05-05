import { message, Modal } from 'antd';
import { getkeyPerson, getdevice, getmonitor } from '@/services/prepar';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React, { useState, useRef, useEffect } from 'react';
import styles from './style.less';
export interface SelectModelProps {
  info?: any;
  selectedData?: any[];
  selectedList?: any[];
  typeflag?: string;
  modelShow: boolean;
  save: (e: any[] | undefined) => void;
  cancel: () => void;
}
export interface TableListItem {
  id: string;
  markList: [];
}
const SelectModel: React.FC<SelectModelProps> = (props) => {
  const modelform = useRef<ActionType>();
  const { modelShow, typeflag, save, cancel, selectedData, selectedList, info } = props;
  const [list, setList] = useState<any[]>(selectedList || []); //多选key
  const [selectList, setSelectList] = useState<any[]>(); //多选的数据
  useEffect(() => {
    setSelectList(
      selectedData?.map((item) => {
        return {
          id: item.personId || item.deviceId || item.vedioID || item.id,
          phoneNumber: item.phoneNumber,
          deviceCode: item.deviceCode,
          videoTypeName: item.videoTypeName,
          name: item.personName || item.videoName || item.deviceName || item.name,
        };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [columns, setColumns] = useState<ProColumns<TableListItem>[]>(); //弹框列
  useEffect(() => {
    if (selectList?.length === 0 || selectList === undefined) return;
    setList(selectList!.map((item) => item.id));
  }, [selectList]);
  return (
    <Modal
      maskClosable={false}
      width={1050}
      title={typeflag}
      visible={modelShow}
      onOk={() => {
        save(selectList);
        cancel();
      }}
      onCancel={() => {
        setList([]);
        cancel();
      }}
    >
      <ProTable<TableListItem>
        className={styles.page}
        tableAlertRender={false}
        actionRef={modelform}
        columns={columns}
        rowSelection={{
          selectedRowKeys: list,
          onSelect: (record: any, selected) => {
            const keyArr: any[] = [record];
            if (selected) {
              let listnew: any = selectList;
              if (listnew[0]?.id === undefined) {
                listnew = keyArr;
              } else {
                listnew = selectList?.concat(keyArr);
              }
              setSelectList([...new Set(listnew)]);
            } else {
              const keys: any = selectList?.filter((val: { id: string }) => {
                return val.id !== String(record.id);
              });
              if (keys.length === 0) {
                setSelectList([keys]);
              } else {
                setSelectList(keys);
              }
            }
          },
          onSelectAll: (selected, rows, changeRows) => {
            if (selected) {
              setSelectList([...new Set(selectList?.concat(changeRows))]);
            } else {
              const keys: any[] = changeRows.filter((val: { id: string }) => {
                return !selectList?.map((item: { id: string }) => item.id === val.id);
              });
              setSelectList([keys]);
            }
          },
        }}
        onRow={(record: any) => {
          return {
            onClick: () => {
              const keyArr: any[] = [record];
              if (!list?.includes(record.id)) {
                let listnew: any = selectList;
                if (listnew[0]?.id === undefined) {
                  listnew = keyArr;
                } else {
                  listnew = selectList?.concat(keyArr);
                }
                setSelectList([...new Set(listnew)]);
              } else {
                const keys: any = selectList?.filter((val: { id: string }) => {
                  return val.id !== record.id;
                });
                if (keys.length === 0) {
                  setSelectList([keys]);
                } else {
                  setSelectList(keys);
                }
              }
            },
          };
        }}
        options={false}
        search={{
          labelWidth: 100,
          span: 10,
          collapsed: false,
          collapseRender: () => false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        rowKey="id"
        pagination={{
          responsive: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        request={async (params: any) => {
          if (typeflag === '选择人员') {
            const columnsPerson: ProColumns<TableListItem>[] = [
              {
                title: '姓名',
                dataIndex: 'name',
                render: (name: any) => {
                  return name;
                },
              },
              {
                title: '手机号',
                dataIndex: 'phoneNumber',
                render: (phoneNumber: any) => {
                  return phoneNumber;
                },
                search: false,
              },
              {
                title: '类型',
                dataIndex: 'posTypeName',
                render: (type: any) => {
                  return type;
                },
                search: false,
              },
            ];
            setColumns(columnsPerson);
            let queryObject;
            if (info === '图层图元') {
              queryObject = {
                ...params,
                page: params.current - 1,
                size: params.pageSize,
                ascending: false,
                pageSize: 10,
                propertyName: 'sortIndex',
                sortOrder: 'desc',
                type: true,
              };
            } else {
              queryObject = {
                ...params,
                page: params.current - 1,
                size: params.pageSize,
                notEqPosType: '86270cf6-bac3-45fb-9d0f-f6440d6b1ea6',
                ascending: false,
                posTypeList: [
                  'd6697b08-8afe-47d3-8b1b-99fa39ac3555',
                  'e7961c17-f52b-4893-9cd2-30fc63042b56',
                  '3c1dad35-8c26-4d6a-b530-db5178a253a9',
                  '3f1a1562-7d53-415e-a585-9c45f2c42400',
                ],
                pageSize: 10,
                propertyName: 'sortIndex',
                sortOrder: 'desc',
                type: true,
              };
            }
            const res = await getkeyPerson({ queryObject });
            if (res.code !== 200) {
              message.error(res.message);
            }

            return {
              data: res.result?.page?.content || [],
              total: res.result?.page?.totalElements,
            };
          }
          if (typeflag === '选择视频') {
            const columnsMonitor: ProColumns<TableListItem>[] = [
              {
                title: '视频名称',
                dataIndex: 'videoName',
                render: (videoName: any) => {
                  return videoName;
                },
              },
              {
                title: '视频类型',
                dataIndex: 'videoTypeName',
                render: (code: any) => {
                  return code;
                },
                search: false,
              },
            ];
            setColumns(columnsMonitor);
            const res = await getmonitor({
              ...params,
              pageNumber: params.current || 1,
              pageSize: params.pageSize,
              sortColumn: 'sortIndex',
              sortOrder: 'desc',
            });
            if (res.code !== 200) {
              message.error(res.message);
            }
            return {
              data: res.data?.rows || [],
              total: res.data?.totalCount,
            };
          }
          if (typeflag === '选择设备') {
            const columnsDevice: ProColumns<TableListItem>[] = [
              {
                title: '设备名称',
                dataIndex: 'name',
                render: (name: any) => {
                  return name;
                },
              },
              {
                title: '设备编码',
                dataIndex: 'code',
                render: (code: any) => {
                  return code;
                },
                search: false,
              },
            ];
            setColumns(columnsDevice);
            const res = await getdevice({
              queryObject: {
                ...params,
                page: params.current - 1,
                size: params.pageSize,
                ascending: false,
                pageSize: 10,
                propertyName: 'sortIndex',
                sortOrder: 'desc',
                type: true,
              },
            });
            if (res.code !== 200) {
              message.error(res.message);
            }

            return {
              data: res.result?.page?.content || [],
              total: res.result?.page?.totalElements,
            };
          }
          return [];
        }}
      />
    </Modal>
  );
};

export default SelectModel;
