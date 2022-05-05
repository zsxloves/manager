import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Tag } from 'antd';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getPersonList } from '@/services/securityResources';
import styles from './index.less';

export interface Tables {
  data: string[];
  info: TableListItem[];
  isModalVisible: boolean;
  handleCancel: () => void;
  getValue: (info: TableListItem[], dataId: string[]) => void;
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
    title: '姓名',
    dataIndex: 'name',
    ellipsis: true,
    formItemProps: {
      getValueFromEvent: (e) => e.target.value.trim(),
    },
  },
  {
    title: '标签',
    dataIndex: 'posTypeName',
    search: false,
    width: 90,
    valueEnum: {
      民警: {
        text: <Tag color="#87d068">普通人员</Tag>,
      },
      辅警: {
        text: <Tag color="#87d068">普通人员</Tag>,
      },
      保安: {
        text: <Tag color="#87d068">普通人员</Tag>,
      },
      交警: {
        text: <Tag color="#87d068">普通人员</Tag>,
      },
      普通人员: {
        text: <Tag color="#87d068">普通人员</Tag>,
      },
      重点人员: {
        text: <Tag color="#f50">重点人员</Tag>,
      },
    },
  },
  {
    title: '性别',
    dataIndex: 'genderName',
    width: 100,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: '人员类别',
    dataIndex: 'personTypeName',
    width: 100,
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '职业类别',
    dataIndex: 'posTypeName',
    width: 100,
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '身份证号',
    dataIndex: 'idCardCode',
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '关联组织机构',
    dataIndex: 'orgName',
    hideInSearch: true,
    ellipsis: true,
  },
];

const TableList: React.FC<Tables> = ({ data, info, isModalVisible, handleCancel, getValue }) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]); //多选id
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]); //多选人员全部信息
  const [pageSize, setPageSize] = useState<number>();

  const onOk = () => {
    getValue(selectedRowsState, selectedRowKeys);
  };

  useEffect(() => {
    if (data) {
      setSelectedRowKeys(data);
      setSelectedRows(info);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            setSelectedRowKeys([]);
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
        title="选择人员"
        visible={isModalVisible}
        // onOk={onOk}
        onCancel={handleCancel}
        maskClosable={false}
        className={styles.md}
        footer={renderFooter()}
      >
        <ProTable<TableListItem>
          columns={columns}
          actionRef={actionRef}
          scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
          className={styles.tableStyle}
          options={false}
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
            const res = await getPersonList({
              queryObject: {
                name: paramss.name,
                page: (paramss.current as number) - 1,
                size: paramss.pageSize,
                ascending: false,
                propertyName: 'sortIndex',
                sortOrder: 'desc',
              },
            });
            res.result.page?.content.map((item: any) => {
              if (selectedRowKeys.includes(item.id)) {
                item.check = true;
              }
              return item;
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
