import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'antd';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getContractorList } from '@/services/guestManager/index';
import styles from './index.less';

export interface Tables {
  data: string[];
  info: any;
  isModalVisible: boolean;
  handleCancel: () => void;
  getValue: (datas: Record<string, unknown>, dataId: string[]) => void;
}

type TableListItem = {
  id: string | number;
  size: number;
  [key: string]: any;
  lat: number | string;
  lon: number | string;
};

const columns: ProColumns<TableListItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    hideInSearch: true,
    width: 50,
    render: (_, record, index) => index + 1,
  },
  {
    title: '场馆名称',
    dataIndex: 'name',
    // search: false,
    ellipsis: true,
  },
  {
    title: '场馆地址',
    dataIndex: 'address',
    // search: false,
    ellipsis: true,
  },
  {
    title: '经纬度',
    key: 'lonLat',
    search: false,
    ellipsis: true,
    render: (text, record) => {
      return `${record.lon || ''}${record.lon ? ',' : ''}${record.lat || ''}`;
    },
  },
  {
    title: '场馆负责人',
    dataIndex: 'gymPerson',
    hideInSearch: true,
    ellipsis: true,
    search: false,
  },
  {
    title: '联系方式',
    ellipsis: true,
    search: false,
    dataIndex: 'phoneNumber',
  },
];

const TableList: React.FC<Tables> = ({ data, info, isModalVisible, handleCancel, getValue }) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [selectedRowsState, setSelectedRows] = useState<any>([]); //多选存放选择人员
  const [pageSize, setPageSize] = useState<number>();

  const onOk = () => {
    getValue(selectedRowsState, selectedRowKeys);
    handleCancel(); //取消
  };

  useEffect(() => {
    if (data) {
      setSelectedRowKeys(data);
      setSelectedRows(info);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            handleCancel();
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => onOk()}>
          保存
        </Button>
      </>
    );
  };

  return (
    <>
      <Modal
        width={1000}
        title="选择场馆"
        visible={isModalVisible}
        onCancel={handleCancel}
        maskClosable={false}
        footer={renderFooter()}
      >
        <ProTable<TableListItem>
          columns={columns}
          options={false}
          className={styles.tableStyle}
          scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
          actionRef={actionRef}
          tableAlertRender={false}
          onReset={() => {
            actionRef.current?.reset!();
          }}
          search={{
            labelWidth: 100,
            span: 5,
            searchText: '查询',
            optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
          }}
          request={async (paramss) => {
            const res = await getContractorList({
              queryObject: {
                ...paramss,
                page: (paramss.current as number) - 1,
                size: paramss.pageSize as number,
              },
            });
            setPageSize(paramss.pageSize);
            return {
              data: res.result.page.content,
              success: res.code === 200 ? true : false,
              total: res.result.page.totalElements,
            };
          }}
          rowKey="id"
          pagination={{
            responsive: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultPageSize: 10,
          }}
          rowSelection={{
            selectedRowKeys,
            onSelect: (record, selected) => {
              const keyArr: any[] = [record.id];
              if (selected) {
                setSelectedRowKeys([...new Set(selectedRowKeys.concat(keyArr))]);
                setSelectedRows([...new Set(selectedRowsState.concat(record))]);
              } else {
                const keys: string[] = selectedRowKeys.filter((val: string) => {
                  return val !== String(record.id);
                });
                const Rows: TableListItem[] = selectedRowsState.filter((val: any) => {
                  return val.id !== String(record.id);
                });
                setSelectedRowKeys(keys);
                setSelectedRows(Rows);
              }
            },
            onSelectAll: (selected, rows, changeRows) => {
              if (selected) {
                const pageAllKeys: string[] = rows.map((a: any) => {
                  return a?.id;
                });
                const pageAllRows: TableListItem[] = rows.filter((a: any) => {
                  if (a !== undefined) {
                    return a;
                  }
                });
                setSelectedRowKeys([...new Set(selectedRowKeys.concat(pageAllKeys))]);
                setSelectedRows([...new Set(selectedRowsState.concat(pageAllRows))]);
              } else {
                const pageAllKeys: string[] = changeRows.map((a: any) => {
                  return a.id;
                });
                const keys: string[] = selectedRowKeys.filter((val: string) => {
                  return !pageAllKeys.includes(val);
                });
                const Rows: TableListItem[] = selectedRowsState.filter((vals: any) => {
                  return !pageAllKeys.includes(vals.id);
                });
                setSelectedRowKeys(keys);
                setSelectedRows(Rows);
              }
            },
          }}
          onRow={(record: any) => {
            return {
              onClick: () => {
                const keyArr: any[] = [record.id];
                if (selectedRowKeys.includes(record.id)) {
                  const keys: string[] = selectedRowKeys.filter((val: string) => {
                    return val !== record.id;
                  });
                  const Rows: TableListItem[] = selectedRowsState.filter((val: any) => {
                    return val.id !== String(record.id);
                  });
                  setSelectedRowKeys(keys);
                  setSelectedRows(Rows);
                } else {
                  setSelectedRowKeys([...new Set(selectedRowKeys.concat(keyArr))]);
                  setSelectedRows([...new Set(selectedRowsState.concat(record))]);
                }
              },
            };
          }}
          onSubmit={() => {
            // setSelectedRowKeys([]);
          }}
          dateFormatter="string"
        />
      </Modal>
    </>
  );
};

export default TableList;
